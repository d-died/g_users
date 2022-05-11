const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

// ALL SCHEMA TYPES REQUIRE NAME AND FIELDS PROPERTIES
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        // we added the below to connect users with companies
        // this is DIFFERENT than the companyId key that is in the db.json file Users array
        // THUS a resolve function is required to populate this property
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                // console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res => res.data)
          
                    // .then(res => res.data)
            }
        }
    }
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            // if you give GraphQL a user ID, it will return all the properties of a given user (aka UserType)
            // essentially, this "args" is THE argument you're giving GraphQL to find
            args: { id: { type: GraphQLString } },
            // the below resolve() function is where we actually go into the data and find data we're looking for
            // parentValue is not really used ever. 
            // args argument is an object that gets passed into the original query aka args from above
            resolve(parentValue, args) {
                // return _.find(users, { id: args.id });
                // return Array.prototype.find(users, { id: args.id });
                // return users.find(user => user.id === args.id);
                // just some different ways we can make the same query -- the very first example we did
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data)
                    // this is needed when pairing axios and GraphQL. 
                    // Axios sends a response object named "data", but GraphQL doesn't know what to do with that.
                    // so we just dot into that object and can manipulate the response object from there
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})