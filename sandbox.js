/* eslint-disable no-console, no-process-exit */
const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const connectionstring="mongodb+srv://RubenAmr:Kesako65@denzelcluster-mfliu.mongodb.net/test?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;
const uri = connectionstring;
const ObjectId = require("mongodb").ObjectID;
const BodyParser = require("body-parser");
const Express = require("express");


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
DATABASE_NAME="Denzel";
var database, collection;


//Connection to the Database
app.listen(3000, () => {
    MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


const client = new MongoClient(uri, { useNewUrlParser: true });


async function sandbox (actor) {

    const movies = await imdb(actor);

    const assert=require('assert');

    const awesome = movies.filter(movie => movie.metascore >= 77);


    console.log(`📽️  fetching filmography of ${actor}...`);


    client.connect(function(err, client){
    assert.equal(null,err);


    const db=client.db("Denzel");

    db.collection("Movies").insert(movies, function(err, res) {
      if (err) throw err;})
      console.log("1 document inserted");

    })
    

    console.log(`🍿 ${movies.length} movies found.`);
    console.log(JSON.stringify(movies, null, 2));
    console.log(`🥇 ${awesome.length} awesome movies found.`);
    console.log(JSON.stringify(awesome, null, 2));
    
}

//sandbox(DENZEL_IMDB_ID);