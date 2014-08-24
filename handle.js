(function() {
  var Markov, NGRAM_DELIM, NGRAM_LENGTH, REQUESTS_PER_TERM, Twit, bodyParser, config, handle, twitter;

  Markov = require('./markov.js');

  Twit = require('twit');

  config = require('./config.js');

  bodyParser = require('body-parser');

  twitter = new Twit(config);

  REQUESTS_PER_TERM = 3;

  NGRAM_DELIM = ' ';

  NGRAM_LENGTH = NGRAM_DELIM === '' ? 4 : 1;

  handle = {
    processQuery: function(req, res) {
      var dictionary, processTerms, result, searchTwitter, string, terms;
      dictionary = new Markov();
      searchTwitter = function(path, query, max_id, type, callback) {
        var params;
        params = {
          'lang': 'en',
          'count': 200,
          'max_id': max_id
        };
        params[type] = query;
        return twitter.get(path, params, callback);
      };
      processTerms = function() {
        var max_id, path, requestCount, requestsProcessed, term, termsRemaining, tweetsRemaining, type;
        term = terms.pop();
        termsRemaining = terms.length;
        if (term != null) {
          path = term[0] === '@' ? 'statuses/user_timeline' : 'search/tweets';
          type = term[0] === '@' ? 'screen_name' : 'q';
          max_id = void 0;
          tweetsRemaining = true;
          requestCount = 0;
          requestsProcessed = 0;
          while (requestCount < REQUESTS_PER_TERM && tweetsRemaining) {
            requestCount++;
            searchTwitter(path, term, max_id, type, function(err, data, response) {
              var list, text, tweet, _i, _len;
              list = type === 'screen_name' ? data : data.statuses;
              tweetsRemaining = list.length > 0;
              for (_i = 0, _len = list.length; _i < _len; _i++) {
                tweet = list[_i];
                text = tweet.text.replace(/https?:\/\/\S+\s?/g, '').replace(/RT\s\S+\s/g, '');
                dictionary.ngramify(text, NGRAM_LENGTH, NGRAM_DELIM);
                max_id = tweet.id;
              }
              requestsProcessed++;
              if (termsRemaining === 0 && requestsProcessed === REQUESTS_PER_TERM || !tweetsRemaining) {
                result.markov = dictionary;
                return res.json(result);
              }
            });
          }
          if (termsRemaining > 0) {
            return processTerms();
          }
        }
      };
      string = req.body.query;
      terms = string.split(' ');
      console.log(string, terms);
      result = {};
      return processTerms();
    },
    postTweet: function(req, res) {
      var text;
      text = req.body.text;
      return twitter.post('statuses/update', {
        status: text
      }, function(err, data, response) {
        return res.json({
          lol: 'ok'
        });
      });
    }
  };

  module.exports = handle;

}).call(this);
