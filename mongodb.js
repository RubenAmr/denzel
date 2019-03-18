

const connectionstring='mongodb+srv://RubenAmr:Kesako65@denzelcluster-mfliu.mongodb.net/test?retryWrites=true';

const MongoClient = require('mongodb').MongoClient;
const uri = connectionstring;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  //const collection = client.db("Denzel").collection("movies");
  const db=client.db("Denzel")

  var myobj = { name: "Company Inc", address: "Highway 37" };
  db.collection("Movies").insertOne(myobj, function(err, res) {
    if (err) throw err;})
    console.log("1 document inserted");
  
  
 // perform actions on the collection object
  client.close();
  
});
