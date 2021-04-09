const userColl = require('../../schema/user');
const error = require('../../errors/errorMessages');

module.exports = {
  Mutation: {
    updateUserRights: async (parent, args, context) => {
      try {
        // Authenticate
        if (!context.userLoggedIn) {
          throw new Error(error.userAuthentication.failed)
        }

        // Get currentUser and check role
        const currentUser = await userColl.findOne({ username: context.userLoggedIn });

        if (!currentUser) {
          throw new Error(error.user.noUserFound);
        }

        if (currentUser.role != "Administrator") {
          throw new Error(error.user.invalidRole);
        }

        // Get userToUpdate
        const user = await userColl.findOne({ username: args.username });

        if (!user) {
          throw new Error(error.user.noUserFound);
        }

        // Update role for wanted user
        try {
          const updatedUser = await userColl.findByIdAndUpdate(user._id, { role: 'HotelManager' }, { new: true });
          if (updatedUser.role != 'HotelManager') {
            throw new Error(error.user.failedRoleUpdate)
          }

          return {
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role,
          }
        } catch (error) {
          throw new Error(error.user.failedRoleUpdate)
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}