/* eslint-disable no-console, no-process-exit */
const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNEXION_URL="mongodb+srv://RubenAmr:Kesako65@denzelcluster-mfliu.mongodb.net/test?retryWrites=true";
DATABASE_NAME="Denzel";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;


//Connection to the Database
app.listen(3000, () => {
    MongoClient.connect(CONNEXION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.get("/movies/search", (request, response) => {
    var metascore=request.query.metascore;
    var limit=request.query.limit;
    if(metascore==undefined){
        metascore=0;
    }
    if(limit==undefined){
        limit=5;
    }
    collection.aggregate([{$match: { metascore: { $gte: Number(metascore) } }},{ $sample: { size:  Number(limit) } } ]).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


app.get("/movies/:id", (request, response) => {
    collection.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post("/movies/:id",(request,response)=>{
    collection.updateOne({"id":request.params.id},{$set:{"date":request.query.date,"review":request.query.review}}, (error, result)=>{
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    console.log("Update done.");

});

