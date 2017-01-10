"use strict";



const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql')
const config = require('./config');

const token = config.token;

const bot = new Discord.Client();
const connection = mysql.createConnection({

  host     :  config.mysql.host,
  user     :  config.mysql.user,
  password :  config.mysql.password,
  database :  config.mysql.database
});


//Waits for ready response from Bot
bot.on('ready', () => {
  connection.connect(function(err){
  if(err){
    console.log('Database connection error');
  }else{
    console.log('Database connection successful');
  }

  });
  getTotalFacts();
  console.log('I am Ready!');
});

bot.on('message', message => {

  console.log(message.content);
  if (message.author.username !== bot.user.username){
  // fun example functions
    if (message.content === 'what is my avatar?'){
      message.reply(message.author.avatarURL);
    };

    if (message.content === 'how old am I?'){
      message.reply(message.author.createdAt);
    };

    // Here begins the main logic of the applicaiton,
    // we take in messages as they come in split them into an x and y then store to the DB
    if (message.content.split("<reply>").length == 2){
      let splitMessage = message.content.split("<reply>");
      let factoid = {
        fact: splitMessage[0],
        tidbit: splitMessage[1]
      }

      connection.query('INSERT INTO facts SET ?', factoid, function(err,res){
        if(err) throw err;
        console.log('Last record insert id:', res.insertId);
        // Tells the user the message was recorded
        message.channel.sendMessage("Ok");
      });
    };

    // Then when a user types in a message that matches the results from the fact column.
    // As currently written, the entire table is queried on each message recieved. Probably not scalable.

    connection.query("SELECT * FROM facts WHERE fact LIKE " + connection.escape('%' + message.content + '%'),
     function(err, rows, fields){
      if (err) throw err;
      // This is a check to make sure the query actually has results.
      console.log(rows)
      if (rows.length > 0){
        if (rows.length == 1){
          message.channel.sendMessage(rows[0].tidbit);
        }
        else{
          message.channel.sendMessage(rows[getRandomNumber(0,rows.length)].tidbit);
        };
      }
      else {
        console.log("No facts");
    };

});


// here begins the random response module
    if ( 4 > getRandomNumber(1, getTotalFacts() )){

      connection.query('SELECT * FROM facts WHERE id like ' + getRandomNumber(1,14), function(err, rows, fields){
        if (err) throw err;
        else { message.channel.sendMessage(rows[0].tidbit); }
      });
    };

}
});


function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

function getTotalFacts(){
  connection.query('SELECT COUNT(*) AS total FROM facts', function(err, rows, fields){
    if (err) throw err;
    else {
      console.log(rows);
      const totalFacts = rows[0].total;
      console.log(totalFacts);
      return totalFacts;
    }
  });
}



bot.login(token);
