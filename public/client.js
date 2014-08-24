(function() {
  var NGRAM_DELIM, NGRAM_LENGTH, generate, populateTweets;

  NGRAM_DELIM = ' ';

  NGRAM_LENGTH = NGRAM_DELIM === '' ? 4 : 1;

  generate = function(n, delim) {
    var nextWord, ngrams, randomNext, result, start;
    if (delim == null) {
      delim = '';
    }
    ngrams = this.ngrams[n];
    randomNext = function(ngram) {
      return ngrams[ngram][Math.floor(ngrams[ngram].length * Math.random())];
    };
    start = ngrams._beginnings[Math.floor(ngrams._beginnings.length * Math.random())];
    result = JSON.parse(start);
    nextWord = randomNext(start);
    while (nextWord) {
      result.push(nextWord);
      nextWord = randomNext(JSON.stringify(result.slice(-n)));
    }
    return result.join(delim).slice(0, 140);
  };

  populateTweets = function($scope) {
    var i, result, _i;
    result = [];
    for (i = _i = 1; _i <= 6; i = ++_i) {
      result.push({
        posted: false,
        complete: false,
        text: $scope.dictionary.generate(NGRAM_LENGTH, NGRAM_DELIM)
      });
    }
    return result;
  };

  angular.module('gibber', ['ngRoute']).controller('AppController', [
    '$scope', '$http', function($scope, $http) {
      var counter;
      counter = 0;
      $scope.loading = false;
      $scope.tweets = [];
      $scope.search = {
        'query': ''
      };
      $scope.last = '';
      $scope.dictionary = {};
      $scope.getMarkov = function(data) {
        if (data.query.length === 0) {
          return;
        }
        if (data.query + ':' === $scope.last && counter < 10) {
          console.log('repeat');
          counter++;
          $scope.tweets = populateTweets($scope);
          return;
        }
        $scope.loading = true;
        $http({
          'method': 'POST',
          'url': '/search',
          'data': data
        }).then(function(res) {
          counter = 0;
          $scope.dictionary = res.data.markov;
          $scope.dictionary.generate = generate;
          $scope.tweets = populateTweets($scope);
          return $scope.loading = false;
        });
        return $scope.last = data.query + ':';
      };
      $scope.parseTweet = function(tweet) {
        tweet = tweet.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
        return tweet;
      };
      return $scope.postTweet = function(tweet) {
        tweet.posted = true;
        return $http({
          'method': 'POST',
          'url': '/post',
          'data': {
            text: tweet.text
          }
        }).then(function(res) {
          return tweet.complete = true;
        });
      };
    }
  ]);

}).call(this);
