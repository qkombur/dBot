"use strict";

const token='MjUzMjk4MTg2MDE2MzkxMTc4.Cx-ojA.OJTTEDCreQqTe6CDH6ymI6OOnRc';

const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql')

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(bot.user.id);

  console.log('I am Ready!');
});

bot.on('message', message => {

  console.log(message.createdAt + " " + message.content + " " + message.channel.name );

  // fun example functions
  if (message.content === 'what is my avatar?'){
    message.reply(message.author.avatarURL);
  };

  if (message.content === 'how old am I?'){
    message.reply(message.author.createdAt);
  };

  // recording toggle, no off switch, because user permissions
  if (message.content === "start recording"){
    bot.isRecording = true;
    message.reply("Ok this chat is being recorded.")
  };

  if (bot.isRecording){
    let logMessage = message.createdAt + " - " + message.author + ": " + message.content + '\n';
    fs.appendFile('log.txt', logMessage, 'utf8', (err) => {
      if (err) throw err;
    });
  }

});

bot.login(token);
