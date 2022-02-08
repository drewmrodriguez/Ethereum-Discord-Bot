const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const server = express()

server.all("/", (req, res) => {
  res.send("bot is running!")
})

function keepAlive() {
  server.listen(process.env.PORT || 8081, () => {
    console.log("server is ready!")
  })
}

module.exports = keepAlive;