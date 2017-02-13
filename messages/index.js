"use strict";
var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({
  appId: '44d273b7-5a73-440c-8724-84cbdbdd02ea',
  appSecret: '9mOQ0E0btDgnnf2kBfUP0bR' });

bot.add('/', function (session) {
console.log(session.message);
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
if (score[0] > score[1]) {
  answer = goodAnswers[getRandom(0,2)];
} else {
  answer = badAnswers[getRandom(0,2)];
}

session.send(answer);

});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});



function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
function analyzeSentiment(text) {
  var body = {
    "documents": [
      {
        "language": "es",
    "id": "1234",
    "text": "My score is 10 against 20"
  }
]
};
  var options = {
  host: 'https://westus.api.cognitive.microsoft.com',
  path: 'text/analytics/v2.0/sentiment',
  method: 'POST',
  headers: {
    'Ocp-Apim-Subscription-Key': '259ae3536cd64a73b931b45b9f1e6959',
    'Content-Type': 'application/json'},
  body: body
};

var req = http.request(options, function(res){
  res.on('data', (chunk) => {
     console.log(`BODY: ${chunk}`);
   });
   res.on('end', () => {
     console.log('No more data in response.');
   });
  })


};



  server.get(sentimentUrl, function(req, res, next) {

  })




}
**/
