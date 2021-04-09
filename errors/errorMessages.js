
const user = {
  //UserRegister
  usernameExists: 'Username already exists please select another',
  invalidUsername: 'Invalid username',

  //UserLogin
  noUserFound: 'User is not found in database, please try another',
  passwordNoMatch: 'Password does not match with username',

  //UserAdministrator
  invalidRole: 'Invalid role',
  failedRoleUpdate: 'Could not update user rights'
};

const server = {
  internalError: 'Internal server error'
}

const userAuthentication = {
  failed: 'Authentication failed',
  noAuthHeader: 'No authentication header provided. ',
  invalidToken: 'Invalid token. ',
  notHotelManager: 'You are not a Hotel Manager',
  notCorrectHotelManager: 'You are not the hotel manager of this hotel'
};

const hotel = {
  notCreated: 'Unable to create hotel',
  notFound: 'Unable to find hotel with that name',
  fetchFailed: 'Unable to fetch hotels from db',
  noRooms: 'No rooms in this hotel'
};

const room = {
  notCreated: 'Unable to create room',
  bookFailed: 'Failed to book',
  alreadyBooked: 'Room is already booked',
  failedListRoom: 'Failed to list free rooms'
};


module.exports = { userAuthentication, hotel, room, user };
