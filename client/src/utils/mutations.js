import { gql } from "@apollo/client";




export const ADD_USER = gql`

mutation addUser ($username: String, $email: String, $password: String) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
  
`

export const LOGIN_USER = gql`
mutation login ($email: String, $password: String) {
  login(email: $email, password: $password) {
    token
    user {
      email
      username
      _id
    }
  }
}



`

export const SAVE_BOOK = gql`
mutation saveBook ($bookData: saveBookInput) {
  saveBook(bookData: $bookData) {
    _id
    username
    email
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}

`

export const REMOVE_BOOK = gql`
mutation removeBook {
  removeBook {
    _id
    username
    email
    savedBooks {
      bookId
      authors
      description
      image
      link
      title
    }
  }
}



`