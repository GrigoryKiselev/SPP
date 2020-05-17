var express = require('express'),
  app = express(),
  port = 3005,
  bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const cors  = require('cors');
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = require("./app/graphql/schema").Schema;
const resolvers = require("./app/graphql/resolvers").Resolvers;

const schema = makeExecutableSchema({
typeDefs,
resolvers,
logger: {
  log: e => console.log(e)
}
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  "/graphql",
  graphqlHTTP(request => ({
    schema: schema,
    graphiql: true
  }))
);

app.listen(port, () => {
  console.log('Server starts on ' + port);
});