var Markov = require('./markov.js');
var Twit = require('twit');
var config = require('./config.js');

var twitter = new Twit(config);
var dictionary = new Markov();

var num = 3

var terms = ['@NICKIMINAJ', '@nathanjurgenson']

var process = function() {
  var i = 0;
  var count = 0;
  var remaining = true;
  var max_id = undefined;
  var name = terms.pop();
  var numterms = terms.length
  console.log(name)
  while ((i < num) && remaining) {
    i++;
    console.log('OUT',terms, name, count)
    twitter.get('statuses/user_timeline', {'screen_name': name, 'lang':'en','count': 100,'max_id':max_id }, function(err,data,response) {
      console.log('IN',terms, name, count)
      remaining = data.length > 0;
      // console.log(data)
      for (var j = 0; j < data.length; j++) {
        dictionary.ngramify(data[j].text,4);
        max_id = data[j].id
        // console.log(j,data.statuses[j].text)
      }
      // console.log(data)

      count++;
      if ((numterms === 0) && (count === num || !remaining)) {
        console.log( dictionary.generate(4) )
        console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
        // console.log( dictionary.generate(4) )
      }
    });
  }
      if ((numterms > 0)) {
        process();
      }
}

process();
