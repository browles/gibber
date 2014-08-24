class Markov
  constructor: () ->
    @ngrams = {}

  ngramify: (text, n, delim = '') ->
    wordArray = text.split(delim)
    return wordArray if n >= wordArray.length

    @ngrams[n] = @ngrams[n] || {'_beginnings':[]}
    ngrams = @ngrams[n]
    i = 0
    while i+n <= wordArray.length
      key = JSON.stringify wordArray.slice i, i+n
      ngrams._beginnings.push key if i == 0
      ngrams[key] = ngrams[key] || []
      if i+n != wordArray.length then ngrams[key].push wordArray[i+n] else ngrams[key].push null
      i++
    ngrams

  generate: (n, delim = '') ->
    ngrams = @ngrams[n]
    randomNext = (ngram) ->
      ngrams[ngram][ Math.floor ngrams[ngram].length * Math.random() ]

    start = ngrams._beginnings[ Math.floor ngrams._beginnings.length * Math.random() ]
    result = JSON.parse start
    nextWord = randomNext start
    while nextWord
      result.push nextWord
      nextWord = randomNext JSON.stringify result.slice -n
    result.join(delim)

module.exports = Markov
