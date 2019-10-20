"use strict";



const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql')
const config = require('./config');

const token = config.token;

const bot = new Discord.Client();
const pool = mysql.createPool({
  connectionLimit : 10,
  host     :  config.mysql.host,
  user     :  config.mysql.user,
  password :  config.mysql.password,
  database :  config.mysql.database
});


const totalStoredFacts = getTotalFacts()

let messageStorage = [];

//Waits for ready response from Bot
bot.on('ready', () => {
  pool.getConnection(function(err){
  if(err){
    console.log(`Database connection error:`);
    console.log(err);
  }else{
    console.log('Database connection successful');
  }

  });
  console.log('dBot is running.');
});

bot.on('message', message => {

  console.log(message.content);
  if (message.author.username !== bot.user.username){
  // fun example functions
    
    answerQuestions(message);
    findFacts(message);
    lastTwoMessages(message.content);
    if (remeberThat(message.content) && messageStorage.length === 2) {
      store(messageStorage, message);
    }
    
    randomResponse()

  }
});


function randomResponse() {
  if ( (totalStoredFacts / 3.1415) > getRandomNumber(1, totalStoredFacts )){

    pool.query('SELECT * FROM facts WHERE id like ' + getRandomNumber(1, getTotalFacts() ), function(err, rows, fields){
      if (err) throw err;
      else { message.channel.send(rows[0].tidbit); }
    });
  };
}



function lastTwoMessages(message) {
   
  if ((messageStorage.length >= 2) && message !== 'remember that') {
    messageStorage.pop();
  }

  if (message !== 'remember that') {
    messageStorage.unshift(message);
  }
  console.log('last two messages', messageStorage);

}

function store(lastTwoMessages, message) {

    let factoid = {
      fact: lastTwoMessages[0],
      tidbit: lastTwoMessages[1]
    }

    pool.query('INSERT INTO facts SET ?', factoid, function(err,res){
      if(err) throw err;
      console.log('Last record insert id:', res.insertId);
      // Tells the user the message was recorded
      message.channel.send("I'll remember that.");
    });
  
}

function findFacts(message) {

  pool.query("SELECT * FROM facts WHERE fact LIKE " + pool.escape('%' + message.content + '%'),
     function(err, rows, fields){
      if (err) throw err;
      // This is a check to make sure the query actually has results.
      console.log(rows)
      if (rows.length > 0){
        if (rows.length == 1){
          message.channel.send(rows[0].tidbit);
        }
        else{
          message.channel.send(rows[getRandomNumber(0,rows.length)].tidbit);
        };
      }
      else {
        console.log("No facts");
    };

  });
}

function remeberThat(message) {

  return message.toLowerCase() === 'remember that';

}

function answerQuestions(message){

  if (message.content === 'what is my avatar?'){
    message.reply(message.author.avatarURL);
  };

  if (message.content === 'how old am I?'){
    message.reply(message.author.createdAt);
  };
}

function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

function getTotalFacts(){
  pool.query('SELECT COUNT(*) AS total FROM facts', function(err, rows, fields){
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
