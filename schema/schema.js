const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const users = [
    { id: '23', firstName: 'Bill', age: 20 },
    { id: '24', firstName: 'Sam', age: 45 }
]

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            // if you give GraphQL a user ID, is will return all the properties of a given user (aka UserType)
            args: { id: { type: GraphQLString } },
            // the below resolve() function is where we actually go into the data and find data we're looking for
            // parentValue is not really used ever. 
            // args argument is an object that gets passed into the original query aka args from above
            resolve(parentValue, args) {
                return _.find(users, { id: args.id });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})