var rest = require("restler");
var async = require("async");
var MongoClient = require('mongodb').MongoClient;

function getEvents(i, callback) {
  var page = "?page=" + i;
  rest.get('https://api.github.com/orgs/CSCI-4830-002-2014/events' + page).on('complete', function(data) {
  if (data instanceof Error)  {
    console.log('Error: ', data.message);
    this.retry(1000);
  }
  else {
    callback(null, data);
  }
  });
};
 
function flatten_slow(input){ 
    return input.reduce(function(a, b) {
      return a.concat(b);
  }, []);
}
  
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
 
    console.log(">> Dropping collection");
    db.dropCollection('course_events', function(err, result) {
      console.log("dropped: ");
      console.dir(result);
    });
    
  async.map([1,2,3,4,5,6,7,8,9,10], getEvents, function(err, results){
    flattened = flatten_slow(results);    
      var collection = db.collection('course_events');
    collection.insert(flattened, function(err, results) {
      collection.find().toArray(function(err, fResults) {
        fResults.forEach(function(x) {
          console.log("type:" + x.type + ', user:' + x.actor.login + ', repo:' + x.repo.name);
        });
      db.close();
      });
    })
  });
  

  
})



	
