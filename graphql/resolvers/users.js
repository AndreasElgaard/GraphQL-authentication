const userColl = require('../../schema/user');
const error = require('../../errors/errorMessages');
const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server-express');

module.exports = {
  Query: {
    listUsers: async (parent, args, context) => {
      try {
        if (!context.userLoggedIn) {
          throw new Error(error.userAuthentication.failed)
        }

        const users = await userColl.find({});

        return (
          users
        )
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    userLogin: async (parent, args, context) => {
      try {
        if (!context.userLoggedIn) {

        }
        const user = await userColl.findOne({ username: args.username });

        if (!user) {
          throw new Error(error.user.noUserFound);
        }

        if (!user.checkValidPassword(args.password)) {
          throw new Error(error.user.passwordNoMatch);
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          token: user.generateJwt()
        }

      } catch (error) {
        throw new Error(error);
      }
    },

    userRegister: async (parent, args, context) => {
      try {
        if (!context.userLoggedIn) {

        }

        let userInDb = await userColl.findOne({ username: args.username });

        if (userInDb != undefined) {
          throw new Error(error.user.usernameExists);
        }

        const newUser = new userColl(args);

        newUser.password = await newUser.hashPassword(newUser.password);

        const user = await userColl.create(newUser);

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          token: user.generateJwt()
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}