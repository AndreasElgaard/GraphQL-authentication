const userResolvers = require('./users');
const hotelManagerResolvers = require('./hotelManager');
const administratorResolvers = require('./administrator');

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...hotelManagerResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...hotelManagerResolvers.Mutation,
    ...administratorResolvers.Mutation,
  }
}