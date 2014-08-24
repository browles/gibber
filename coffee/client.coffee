
NGRAM_DELIM = ' '
NGRAM_LENGTH = if NGRAM_DELIM is '' then 4 else 1

generate = (n, delim = '') ->
  ngrams = @ngrams[n]
  randomNext = (ngram) ->
    ngrams[ngram][ Math.floor ngrams[ngram].length * Math.random() ]

  start = ngrams._beginnings[ Math.floor ngrams._beginnings.length * Math.random() ]
  result = JSON.parse start
  nextWord = randomNext start
  while nextWord
    result.push nextWord
    nextWord = randomNext JSON.stringify result.slice -n
  result.join(delim).slice(0,140)

populateTweets = ($scope) ->
  result = []
  for i in [1..6]
    result.push {posted: false, complete: false, text: $scope.dictionary.generate(NGRAM_LENGTH, NGRAM_DELIM)}
  result

angular.module 'gibber', ['ngRoute']
.controller 'AppController', ['$scope','$http', ($scope, $http) ->
  counter = 0
  $scope.loading = false
  $scope.tweets = []
  $scope.search = {'query':''}
  $scope.last = ''
  $scope.dictionary = {}
  $scope.getMarkov = (data) ->
    if data.query.length is 0 then return
    if data.query+':' is $scope.last and counter < 10
      console.log 'repeat'
      counter++
      $scope.tweets = populateTweets $scope
      return

    $scope.loading = true
    $http {'method':'POST','url':'/search','data':data}
    .then (res) ->
      counter = 0
      $scope.dictionary = res.data.markov
      $scope.dictionary.generate = generate
      $scope.tweets = populateTweets $scope
      $scope.loading = false
    $scope.last = data.query + ':'
  $scope.parseTweet = (tweet) ->
    tweet = tweet.replace /&gt;/g, '>'
    .replace /&lt;/g, '<'
    .replace /&quot;/g, '"'
    .replace /&apos;/g, "'"
    .replace /&amp;/g, '&'
    return tweet
  $scope.postTweet = (tweet) ->
    tweet.posted = true;
    $http {'method':'POST','url':'/post','data':{text: tweet.text}}
    .then (res) ->
      tweet.complete = true;
  ]
