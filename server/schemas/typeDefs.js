const { gql } = require('apollo-server-express');

// Types are always capital 


const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
type Book{
    bookId: ID
    authors: [String]
    description:String
    title:String
    image:String
    link:String

}

input saveBookInput{
    bookId: ID
    authors: [String]
    description:String
    title:String
    image:String
    link:String
}

type Auth {
    token: ID
    user: User
}



  type Query {
   me: User
  }

  type Mutation {
    addUser(username:String, email:String, password:String): Auth
     saveBook (bookData: saveBookInput):User
     login(email:String,password:String):Auth
     removeBook( bookId: ID):User
  }
`;

module.exports = typeDefs;