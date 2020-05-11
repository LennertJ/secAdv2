const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200))
})
app.post('/login', (req, res) => {
  store
    .authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success }) => {
      if (success) res.sendStatus(200)
      else res.sendStatus(401)
    })
})
app.post('/message', (req, res) => {
  store.createMessage ({
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message,
    time: req.body.time})
    .then(() => res.sendStatus(200))
})
app.get('/message/sender/:sender/receiver/:receiver', async(req, response) => {
  console.log("retrieving messages from: " + req.params.sender + " to " + req.params.receiver);
  let responsebodyChunk1 = await store.getMessages({
    sender: req.params.sender,
    receiver: req.params.receiver})
  let responsebodyChunk2 = await store.getMessages({
    sender: req.params.receiver,
    receiver: req.params.sender})

  let responseArray = [];
  for(let i = 0; i < responsebodyChunk1.length;i++){
    responseArray.push( JSON.stringify(responsebodyChunk1[i], null, 4));
  }
  for(let i = 0; i<responsebodyChunk2.length;i++){
    responseArray.push(JSON.stringify(responsebodyChunk2[i], null, 4));
  }
      
  response.setHeader('Content-Type', 'application/json');
  let body = responseArray;
  let url = "http://localhost:7555/messaging?u=" + req.params.sender;
  const responseBody = {url, body };
  response.write(JSON.stringify(responseBody));
  response.end();
})


app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
