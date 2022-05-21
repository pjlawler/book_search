 import { gql } from '@apollo/client';

 export const QUERY_ME = gql `
    {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }`

export const QUERY_USERS = gql `
    {
        users {
            _id
            username
            email
        }
    }
`