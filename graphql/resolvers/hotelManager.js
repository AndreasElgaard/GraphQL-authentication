const error = require('../../errors/errorMessages');
const { INTERNAL_SERVER_ERROR } = require('apollo-server-express');
const mongoose = require('mongoose');
const hotelColl = require('../../schema/hotel');
const roomColl = require('../../schema/room');
const userColl = require('../../schema/user');

module.exports = {
  Query: {
    listHotels: async (parent, args, context) => {
      try {
        if (!context.userLoggedIn) {
          throw new Error(error.userAuthentication.failed)
        }

        const hotels = await hotelColl.find({})
          .catch(() => {
            throw new Error(error.hotel.fetchFailed);
          });

        return (
          hotels
        )
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    listFreeRooms: async (parent, args, context) => {
      try {
        if (!context.userLoggedIn) {
          throw new Error(error.userAuthentication.failed)
        }

        const hotel = await hotelColl.findOne({ hotelName: args.hotelName });

        if (!hotel) {
          throw new Error(error.hotel.notFound);
        }

        const freeRooms = hotel.rooms.filter(item => item.booked === false && item.beds === args.beds);

        return (
          freeRooms
        )
      } catch (error) {
        throw new Error(error);
      }
    },
    createHotel: async (parent, args, context) => {
      try {

        if (!context.userLoggedIn) {
          throw new Error(error.userAuthentication.failed)
        }

        var user = await userColl.findOne({ username: context.userLoggedIn })

        if (user.role != "HotelManager") {
          throw new Error(error.userAuthentication.notHotelManager);
        }

        let hotel = await hotelColl.create({
          hotelName: args.hotelName,
          rooms: [roomColl],
          manager: args.manager
        }).catch(() => {
          throw new Error(error.hotel.notCreated)
        });

        if (hotel) {
          return {
            id: hotel.id,
            hotelName: hotel.hotelName,
            manager: hotel.manager,
          }
        }
        else {
          throw new Error(INTERNAL_SERVER_ERROR);
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    createRoom: async (parent, args, context) => {
      if (!context.userLoggedIn) {
        throw new Error(error.userAuthentication.failed)
      }

      var user = await userColl.findOne({ username: context.userLoggedIn })

      if (user.role != "HotelManager") {
        throw new Error(error.userAuthentication.notHotelManager);
      }

      const hotel = await hotelColl.findOne({ hotelName: args.hotelName });

      if (hotel == null) {
        throw new Error(error.hotel.notFound)
      }

      if (hotel.manager != context.userLoggedIn) {
        throw new Error(error.userAuthentication.notCorrectHotelManager);
      }

      const hotelRooms = hotel.rooms;
      for (x = 1; x <= args.roomsToAdd; x++) {
        const newRoomNumber = hotelRooms.length + 1;
        let newRoom = new roomColl({ hotelName: hotel.hotelName, number: newRoomNumber, beds: args.beds })
        hotelRooms.push(newRoom);
      }

      try {
        const newRooms = hotelColl.findByIdAndUpdate(hotel._id, { rooms: hotelRooms }, { new: true });

        return (
          newRooms
        );
      } catch (errReason) {
        throw new Error(errReason);
      }
    },

    bookRoom: async (parent, args, context) => {
      if (!context.userLoggedIn) {
        throw new Error(error.userAuthentication.failed)
      }

      const hotelName = args.hotelName
      const roomNumber = args.roomNumber;

      const hotel = await hotelColl.findOne({ hotelName: hotelName });

      if (hotel == null) {
        throw new Error(error.hotel.notFound)
      }

      var room = hotel.rooms.filter(room => room.number == roomNumber)
      room = room.pop();

      if (room.booked != true) {
        // Find user making request
        var currentUser = await userColl.findOne({ username: context.userLoggedIn });

        // Update current users role to Guest
        if (currentUser.role == "User") {
          await userColl.findOneAndUpdate({ username: currentUser.username }, { role: "Guest" }, { new: true });
        }

        var newHotel = await hotelColl.findOneAndUpdate({ "hotelName": hotelName, "rooms.number": roomNumber }, { "$set": { "rooms.$.booked": true } }, { rawResult: true });
        console.log(newHotel)

        if (newHotel == null) {
          throw new Error(error.room.bookFailed);
        }
        return {
          hotelName: hotelName,
          number: roomNumber,
          booked: true,
          beds: room.beds
        }
      } else {
        throw new Error(error.room.alreadyBooked);
      }
    }
  }
}