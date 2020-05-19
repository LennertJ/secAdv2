const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))

module.exports = {
  createMessage ({sender,receiver,message,time}){
    console.log(`message sent at( ${time})`)
    return knex('message').insert({
      message,
      sender,
      time,
      receiver
    })
  },
  createUser ({ username, password }) {
    console.log(`Add user ${username}`)
    const { salt, hash } = saltHashPassword({ password })
    return knex('user').insert({
      salt,
      encrypted_password: hash,
      username
    })
  },
  authenticate ({ username, password }) {
    console.log(`Authenticating user ${username}`)
    return knex('user').where({ username })
      .then(([user]) => {
        if (!user) return { success: false }
        const { hash } = saltHashPassword({
          password,
          salt: user.salt
        })
        return { success: hash === user.encrypted_password }
      })
  },
  getMessages({sender, receiver}){
    return knex('message')
    .select()
    .where({'sender': sender,'receiver': receiver})
  },
  getReceiver(){
    return knex('user')
    .select('username')
  }
  
}

function saltHashPassword ({
  password,
  salt = randomString()
}) {
  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)
  return {
    salt,
    hash: hash.digest('hex')
  }
}

function randomString () {
  return crypto.randomBytes(4).toString('hex')
}