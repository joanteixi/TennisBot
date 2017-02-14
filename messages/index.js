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


        session.beginDialog('rootMenu');



        /**
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
                **/
    },

    function(session, results) {
        session.endConversation("Goodbye until next time...");
    }

);

bot.dialog('rootMenu', [
    function(session) {
        builder.Prompts.choice(session, "Choose an option:", 'Flip A Coin|Roll Dice|Magic 8-Ball|Quit');
    },
    function(session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('flipCoinDialog');
                break;
            case 1:
                session.beginDialog('rollDiceDialog');
                break;
            case 2:
                session.beginDialog('magicBallDialog');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function(session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, {
    matches: /^(menu|back)/i
});

bot.dialog('flipCoinDialog', [
    function(session, args) {
        builder.Prompts.choice(session, "Choose heads or tails.", "heads|tails", {
            listStyle: builder.ListStyle.none
        })
    },
    function(session, results) {
        var flip = Math.random() > 0.5 ? 'heads' : 'tails';
        if (flip == results.response.entity) {
            session.endDialog("It's %s. YOU WIN!", flip);
        } else {
            session.endDialog("Sorry... It was %s. you lost :(", flip);
        }
    }
]);



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
