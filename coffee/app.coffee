express = require 'express'
handle = require './handle.js'
bodyParser = require 'body-parser'

app = express()
port = process.env.PORT || 8000
app.set 'port', port
app.use bodyParser.json()
app.use bodyParser.urlencoded { extended: true }
app.use express.static(__dirname + '/public')


app.post '/search', (req,res) ->
  console.log 'POST /search'
  handle.processQuery req,res

app.post '/post', (req,res) ->
  console.log 'POST /post'
  handle.postTweet req,res

server = app.listen port, ()->
  console.log "Listening on port "+server.address().port
