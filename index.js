'use strict';

var _ = require('lodash');
var Botkit = require('Botkit');
var creds = require('./creds-local');
var five = require('johnny-five');
//var interactions = require('./interactions');

var userlist = null;

var led;

var board = new five.Board({
    repl: false,
});

board.on("ready", function() {
    led = new five.Led(10);
});

console.log("About to get the bot online");

var helper = {

    get_user: function(id) {
        return _.find(userlist, {id: id})
    },
};


var botcontroller = Botkit.slackbot({
	debug: false,
});

botcontroller.spawn({
	token: creds.slack.token
}).startRTM(function(err, bot, payload) {
	if (err) {
		throw new Error(err);
	}

    // let's cache some things for later.
    userlist = payload.users;
//	    console.log(bot.api.users.info({'user': 'U0MAYLWJC'}));
//    console.log(_.find(userlist, {id: 'U0MAYLWJC'}).name);
});

botcontroller.hears(['hello','hi', 'howdy', 'hola', 'sup'],
	['direct_message','direct_mention','mention'],
	function(bot,message) {

        let user = `<@${message.user}>`;

        bot.reply(message, `Hi there, ${user}. What can I do for you?`);
	}
);

botcontroller.hears(
    [
    'turn (.*) the lights',
    'switch (.*) the lights',
    'turn the lights (.*)',
    'switch the lights (.*)',

    ],
    ['direct_message', 'direct_mention', 'mention'],
    function(bot, message) {

        var onoff = message.match[1]; // [0] is the whole string
        if (onoff == "on") {
            led.on();
        } else if (onoff == "off" || onoff == "out") {
            led.off();
        }

        bot.reply(message, `<@${message.user}> - there you go`);
    }
);

