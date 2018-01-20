var express = require('express');
var router = express.Router();
var NodeRSA = require('node-rsa');
var randomstring = require("randomstring");
var request = require('request');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function (req, res, next) {
  var key = new NodeRSA(req.params.priv_key)
  var output = key.decrypt(req.param.message)
  console.log(JSON.stringify(JSON.parse(output)))
  res.end("Decrypted")
})

router.get('/create', function (req, res, next) {
  res.render('create-new-user');
})

router.post('/create', function (req, res, next) {
  userData = {}
  userData.keys = []
  userData.keys.push("name")
  userData.keys.push("email")
  userData.keys.push("mobile")
  userData.keys.push("gender")
  for (i = 0; i < userData.keys.length; i++) {
    userData[userData.keys[i]] = req.body[userData.keys[i]]
  }
  var key = new NodeRSA({
    b: 512
  });

  var uid = randomstring.generate({
    length: 10,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  });

  var priKey = key.exportKey('pkcs1-private')
  var pubKey = key.exportKey('pkcs1-public')
  var keys = {
    "private": priKey,
    "public": pubKey
  }
  var encrypted = key.encrypt(JSON.stringify(userData), 'base64');
  var body = {
    uid: uid,
    encryptedData: encrypted
  }
  var reqOptions = {
    url: 'http://blockchain.goflo.in:3000/api/User',
    method: 'POST',
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(body)
  }

  request(reqOptions, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
  qrData = {
    keys: keys,
    uid: uid
  }

  res.render('create-success', {
    qrData: JSON.stringify(qrData),
    uid: uid
  });
})

module.exports = router;