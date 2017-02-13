var restify = require('restify');

module.exports = function(text, callback) {
    var body = {
        "documents": [{
            "language": "en",
            "id": "jfhre",
            "text": text
        }]
    };

    var headers = {
        'Ocp-Apim-Subscription-Key': '259ae3536cd64a73b931b45b9f1e6959',
        'Content-Type': 'application/json'
    };

    var jsonClient = restify.createJsonClient({
        url: 'https://westus.api.cognitive.microsoft.com',
        version: '*',
        headers: headers
    });


    jsonClient.post('/text/analytics/v2.0/sentiment',
        body,
        function(err, req, res, obj) {
            if (res.statusCode == 200) {
                callback(null, obj.documents[0].score);
            }
            //console.log('%d -> %j', res.statusCode, res.headers);
            //console.log('%j', obj);
        });

}
//nothing below...
