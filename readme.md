# DBot
___
***What is this?***


This is a very simple minded chatbot for discord built in node, that is based of off the IRC bot in the #xkcd channel.


***Installation***

You will want to
```
git pull https://github.com/qkombur/dBot.git
npm install

```

You will also need to setup a MySQL DB

Follow these instructions:

https://dev.mysql.com/doc/mysql-getting-started/en/


```
CREATE TABLE IF NOT EXISTS `facts` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `fact` text NOT NULL,
  `tidbit` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

```
Finally you will need to setup a config.js

```

const config = {};

config.mysql = {};

config.token =  Discord App Token;

config.mysql.host = localhost;
config.mysql.user = Mysql Username;
config.mysql.password = MySQL Password;
config.mysql.database = MySQL DB


module.exports = config;

```

Server is kept running with forever.

https://github.com/foreversd/forever.
