const { gql } = require('apollo-server-express');
module.exports = gql`
    type User {
        id: ID!
        username: String!
        role: String!
    }

    type Authentication {
      id: ID!
      username: String!
      role: String!
      token: String!
    }

    type Hotel {
        id: ID!
        hotelName: String!
        manager: String!
        rooms: [Room]
    }

    type Room {
        hotelName: String
        number: Int
        booked: Boolean
        beds: Int
    }

    type Query {
      listUsers: [User]
      listHotels: [Hotel]
    }

    type Mutation {
      userRegister (username: String!, password: String!, role: String!): Authentication!
      userLogin (username: String!, password: String!): Authentication!

      updateUserRights (username: String!): User!

      listFreeRooms(hotelName: String!, beds: Int!): [Room]
      createHotel (hotelName: String!, manager: String!): Hotel!
      createRoom (hotelName: String!, roomsToAdd: Int!, beds: Int!): Hotel!
      bookRoom (hotelName: String!, roomNumber: Int!): Room!
    }
`