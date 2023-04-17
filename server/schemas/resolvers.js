const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('need to be logged in')
        }
    },

    Mutation: {
        //create a new user
        addUser: async (parent, args) => {
            const user = User.create(args);
            const token = signToken(user)

            return { token, user }
        },

        //login method
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            // check if user is authenticated
            if (!context.user) {
                throw new Error('You need to be logged in to save a book!');
            }

            try {
                // create new book object

                // save book to database


                // add saved book to user's savedBooks array
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                ).populate('savedBooks');

                // update user's book count
                updatedUser.bookCount = updatedUser.savedBooks.length;
                await updatedUser;

                // return updated user object
                return updatedUser;
            } catch (error) {
                throw new Error(`Could not save book: ${error.message}`);
            }
        },

        removeBook: async (parent, { bookID }, context) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: bookID } },
                    { new: true }
                ).populate('savedBooks');

                // update user's book count
                updatedUser.bookCount = updatedUser.savedBooks.length;
                await updatedUser;

                // return updated user object
                return updatedUser;
            } catch (error) {
                throw new Error(`Could not delete book: ${error.message}`);
            }
        },

    }





};


module.exports = resolvers;