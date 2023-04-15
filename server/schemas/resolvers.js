const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
  me: async (parent, args, context)=>{
    if(context.user){
        return User.findOne({ _id: context.user._id })
    }
    throw new AuthenticationError('need to be logged in')
  }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = User.create(args);
      const token =  signToken(user)

      return { token, user}
    },


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

      saveBook: async (parent, { book }, context) => {
        // check if user is authenticated
        if (!context.user) {
          throw new Error('You need to be logged in to save a book!');
        }
  
        try {
          // create new book object
          const newBook = new Book({
            ...book,
            userId: context.user._id // add current user id to book object
          });
  
          // save book to database
          const savedBook = await newBook.save();
  
          // add saved book to user's savedBooks array
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $push: { savedBooks: savedBook } },
            { new: true }
          ).populate('savedBooks');
  
          // update user's book count
          updatedUser.bookCount = updatedUser.savedBooks.length;
          await updatedUser.save();
  
          // return updated user object
          return updatedUser;
        } catch (error) {
          throw new Error(`Could not save book: ${error.message}`);
        }
      }



      
    
  },
};

module.exports = resolvers;