"use strict";

const Discord = require('discord.js');

const bot = new Discord.Client();


const token='MjUzMjk4MTg2MDE2MzkxMTc4.Cx-ojA.OJTTEDCreQqTe6CDH6ymI6OOnRc';

bot.on('ready', () => {
  console.log(bot.user.id);

  console.log('I am Ready!');
});

bot.on('message', message => {

  console.log(message.createdAt + " " + message.content + " " + message.channel.name );

  // basic functions
  if (message.content === 'what is my avatar?'){
    message.reply(message.author.avatarURL);
  };

  if (message.content === 'how old am I?'){
    message.reply(message.author.createdAt);
  };

  // should save message if it has the following format "x is y" and is mentioned

  if (message.isMentioned(bot.user.id)){
    message.reply("I'll remember that");
  }


});

bot.login(token);
