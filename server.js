const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema')

const app = express();

// this is telling express that when we make a query with /graphql URL, to run it through expressGraphQL
// any time we need to direct incoming requests to another application (aka middleware), we run .use() method. 
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening!')
});