var express = require('express');
var router = express.Router();
var NodeRSA = require('node-rsa');
var randomstring = require("randomstring");

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
  qrData = {keys: keys, uid: uid}
  var encrypted = key.encrypt(JSON.stringify(userData), 'base64');
  res.render('create-success', {
    qrData: JSON.stringify(qrData),
    uid: uid
  });
})

module.exports = router;