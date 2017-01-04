"use strict";



const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql')
const config = require('./config');
const testFunction = require('./app/controllers/test.js');

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
  console.log('I am Ready!');
});

bot.on('message', message => {

  console.log(message.content);

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
      message.reply("Ok");
    });
  };

  // Then when a user types in a message that matches the results from the fact column.
  // As currently written, the entire table is queried on each message recieved. Probably not scalable.
  let queryString = "SELECT * FROM facts WHERE fact LIKE " + "'%" + message.content + "%'";

  connection.query(queryString, function(err, rows, fields){
    if (err) throw err;
    // This is a check to make sure the query actually has results.
    if (rows.length > 0){
    message.reply(rows[0].tidbit);
    } else{
    console.log("No facts");
  }
});

});


bot.login(token);
