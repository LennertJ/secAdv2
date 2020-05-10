const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()
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
app.get('/message/sender/:sender/receiver/:receiver', (req, response) => {
  console.log("retrieving messages from: " + req.params.sender + " to " + req.params.receiver);
  let responsebodyChunk1 = store.getMessages({
    sender: req.params.sender,
    receiver: req.params.receiver})
    .then(() => {
      let responsebodyChunk2 = store.getMessages({
        sender: req.params.sender,
        receiver: req.params.receiver})
      .then(() => {
        response.setHeader('Content-Type', 'application/json');
        let body = responsebodyChunk1 + ", " + responsebodyChunk2;
        let url = "http://localhost:7555/messaging?u=" + req.params.sender
        const responseBody = {url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
      })
    })
})


app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
