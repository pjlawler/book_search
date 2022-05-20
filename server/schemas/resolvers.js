const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    
    Query: {
      me: async (parent, args, context) => {
        
        if (context.user) {
          const user = await User.findOne({ _id: context.user._id })
          .select(['-__v -password'])
          console.log(user);

          if (!user) throw new AuthenticationError(`No Data Returned: ${context.user._id}`)
          return user;
        }

        throw new AuthenticationError('Not logged in!')

      },

      users: async () => {
        const users = await User.find()
        .select(['-__v -password'])

        return users;
      }


    },

    Mutation: {
            
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
          return {token, user };
      },    
      
      login: async (parent, { username, password }) => {  
        const user = await User.findOne({ username });
  
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
        return {token, user} ;
      },

      saveBook: async (parent, { input }, context) => {
        if (context.user) {
          const user = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: input } },
            { new: true }
          );
  
          return user;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },

      removeBook: async (parent, bookId, context) => {
        if (context.user) {
          const user = await User.findByIdAndUpdate(
            { _id: context.user.id },
            { },
            { new: true}
          )
        }
      }


    }
  };
  
  module.exports = resolvers;