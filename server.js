const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');
const {makeExecutableSchema} = require('graphql-tools');
const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const DATABASE_NAME = "movies";
const DENZEL_IMDB_ID = 'nm0000243';
const app = Express()


const homePath = '/graphiql'
const URL = 'http://localhost'
const port = 9292
const uri = 'mongodb+srv://RubenAmr:Kesako65@denzelcluster-mfliu.mongodb.net/test?retryWrites=true'

var database,collection;

  async function start(){
    try {

      MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
              if(error) throw error;
              database = client.db(DATABASE_NAME);
              collection = database.collection("denzel");
      });

      const typeDefs = [`
        type Query {
          movies: Int
          randomMovie: Movie
          movie(id: String): Movie
          search(limit: Int, metascore: Int): [Movie]
          postReview(id: String, date: String, review: String): String
        }
        type Movie {
          link: String
          metascore: Int
          synopsis: String
          title: String
          year: Int
        }
        schema {
          query: Query
        }
      `];

      const resolvers = {
        Query: {
          movies: async () => {
              var movies = await imdb(DENZEL_IMDB_ID);
              const res = await collection.insertMany(movies)
              console.log("Inserted documents : " + res.insertedCount)
              return res.insertedCount
          },
          randomMovie: async () => {
              const res = await collection.aggregate([{ $match: { "metascore": {$gt:70}}}, { $sample: { size: 1 }}]).toArray()
              return res[0]
          },
          movie: async (root, {id}) => {
              const res = await collection.findOne({ "id": id})
              return res
          },
          search: async (root, {limit, metascore}) => {
              if(limit == undefined) limit = 5;
              if(metascore == undefined) metascore = metascore=0;
              const res = await collection.aggregate([{$match:{"metascore": {$gte:Number(metascore)}}}, {$limit:Number(limit)}, {$sort:{"metascore":-1}}]).toArray()
              return res
          },
          postReview: async (root, {id, date, review}) => {
              const res = await collection.updateOne({"id": id}, {$set: {"date":date, "review":review}});
              if(res.result.nModified != 0) return "Update successfull.";
              else return "Update not successfull";
          },
        },
      }

      const schema = makeExecutableSchema({
        typeDefs,
        resolvers
      })

      app.use('/graphql', graphqlHTTP({
          schema: schema,
          graphiql: true,
      }));

      app.listen(port, () => {
          console.log("Connected !");
      });

  } catch (e) {
  console.log(e);
}

}



start();