"use strict";

const token='MjUzMjk4MTg2MDE2MzkxMTc4.Cx-ojA.OJTTEDCreQqTe6CDH6ymI6OOnRc';

const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql')

const bot = new Discord.Client();
const connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'myusr',
  password : '123456',
  database : 'mydb'
});



bot.on('ready', () => {
  console.log(bot.user.id);
  // this connects to database.
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

  // recording toggle, no off switch, because user permissions
  if (message.content.split("<reply>").length == 2){
    let splitMessage = message.content.split("<reply>");
    let factoid = {
      fact: splitMessage[0],
      tidbit: splitMessage[1]
    }
    message.reply("Ok");

    connection.query('INSERT INTO facts SET ?', factoid, function(err,res){
      if(err) throw err;
      console.log('Last record insert id:', res.insertId);
    });
  };

  let query = "SELECT * FROM facts WHERE fact LIKE " + "'%" + message.content + "%'";
  connection.query(query, function(err, rows, fields){

    if (err) throw err;

    if (rows.length > 0){
    message.reply(rows[0].fact + rows[0].tidbit);
  } else{
    console.log("No facts");
  }
  })
  // SELECT * FROM facts WHERE fact LIKE message.content

/*  if (message.content === 'print database'){
    connection.query('SELECT * FROM facts', function(err, rows, fields){
      if (err) throw err;
      message.reply(rows[3].fact + rows[3].tidbit);
    });
  }; */

});


bot.login(token);
