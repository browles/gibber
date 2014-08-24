(function() {
  var Markov;

  Markov = (function() {
    function Markov() {
      this.ngrams = {};
    }

    Markov.prototype.ngramify = function(text, n, delim) {
      var i, key, ngrams, wordArray;
      if (delim == null) {
        delim = '';
      }
      wordArray = text.split(delim);
      if (n >= wordArray.length) {
        return wordArray;
      }
      this.ngrams[n] = this.ngrams[n] || {
        '_beginnings': []
      };
      ngrams = this.ngrams[n];
      i = 0;
      while (i + n <= wordArray.length) {
        key = JSON.stringify(wordArray.slice(i, i + n));
        if (i === 0) {
          ngrams._beginnings.push(key);
        }
        ngrams[key] = ngrams[key] || [];
        if (i + n !== wordArray.length) {
          ngrams[key].push(wordArray[i + n]);
        } else {
          ngrams[key].push(null);
        }
        i++;
      }
      return ngrams;
    };

    Markov.prototype.generate = function(n, delim) {
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
      return result.join(delim);
    };

    return Markov;

  })();

  module.exports = Markov;

}).call(this);
