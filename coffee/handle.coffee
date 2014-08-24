Markov = require './markov.js'
Twit = require 'twit'
config = require './config.js'
bodyParser = require 'body-parser'
twitter = new Twit config

REQUESTS_PER_TERM = 3
NGRAM_DELIM = ' '
NGRAM_LENGTH = if NGRAM_DELIM is '' then 4 else 1

handle =
  processQuery: (req,res) ->
    dictionary = new Markov()

    searchTwitter = (path, query, max_id, type, callback) ->
      params =
        'lang':'en',
        'count':200,
        'max_id':max_id
      params[type] = query
      twitter.get path, params, callback

    processTerms = () ->
      term = terms.pop()
      termsRemaining = terms.length
      if term?
        path = if term[0] is '@' then 'statuses/user_timeline' else 'search/tweets'
        type = if term[0] is '@' then 'screen_name' else 'q'
        max_id = undefined
        tweetsRemaining = true
        requestCount = 0
        requestsProcessed = 0
        while requestCount < REQUESTS_PER_TERM and tweetsRemaining
          requestCount++
          searchTwitter path, term, max_id, type, (err,data,response) ->
            list = if type is 'screen_name' then data else data.statuses
            tweetsRemaining = list.length > 0
            for tweet in list
              text = tweet.text.replace(/https?:\/\/\S+\s?/g, '').replace(/RT\s\S+\s/g, '')
              dictionary.ngramify(text,NGRAM_LENGTH,NGRAM_DELIM)
              max_id = tweet.id
            requestsProcessed++
            if termsRemaining is 0 and requestsProcessed is REQUESTS_PER_TERM or !tweetsRemaining
              result.markov = dictionary
              res.json result
        if termsRemaining > 0
          processTerms()

    string = req.body.query
    terms = string.split ' '
    console.log string, terms

    result = {}
    processTerms()

  postTweet: (req,res) ->
    text = req.body.text
    twitter.post 'statuses/update', {status: text}, (err,data,response) ->
      res.json {lol:'ok'}


module.exports = handle
