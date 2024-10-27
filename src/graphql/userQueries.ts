import gql from 'graphql-tag'

const GET_USERS = gql`
  query GetUsers {
    users {
      email
      id
      last_seen
    }
  }
`

const ADD_USER_MUTATION = gql`
  mutation InsertUsers($id: String!, $email: String!) {
    insert_users(objects: { id: $id, email: $email }) {
      affected_rows
      returning {
        id
        email
      }
    }
  }
`

export { GET_USERS, ADD_USER_MUTATION }
