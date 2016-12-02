"use strict";

const Discord = require('discord.js');

const bot = new Discord.Client();

const token='MjUzMjk4MTg2MDE2MzkxMTc4.Cx-ojA.OJTTEDCreQqTe6CDH6ymI6OOnRc';

bot.on('ready', () => {
  console.log('I am Ready!');
});

bot.on('message', message => {
  console.log(message.content);
  if (message.content === 'what is my avatar?'){
    message.reply(message.author.avatarURL);
  };
  if (message.content === 'how old am I?'){
    message.reply(message.author.createdAt);
  };

});

bot.login(token);
