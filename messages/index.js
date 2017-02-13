"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var sentiment = require("./sentimentDetector");
var useEmulator = (process.env.NODE_ENV == 'development');
var connector = useEmulator ? new builder.ChatConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword']
}) : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function(session) {
    var messageText = session.message.text;
    var goodAnswers = [
        "Very good", "nice work", "You're awesome"
    ];
    var badAnswers = [
        "Pufff... do something!", "Go to take a beer", "C'mon!!!! you can do it better"
    ];
    var pattern = /[0-9]+/g;
    var score = messageText.match(pattern);
    var answer = '';

    sentiment(messageText, function(err, data) {
        if (data >= 0.5) {
            answer = goodAnswers[getRandom(0, 2)];
        } else {
            answer = badAnswers[getRandom(0, 2)];
        }
        session.send(answer);

    });
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = {
        default: connector.listen()
    }
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
