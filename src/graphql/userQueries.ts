import gql from 'graphql-tag'

const GET_USERS = gql`
  query GetUsers {
    users {
      email
      id
      last_seen
      first_name
      last_name
      username
    }
  }
`
const GET_USERS_BY_ID = gql`
  query GetUserById($id: String!) {
    users(where: { id: { _eq: $id } }) {
      email
      id
      last_seen
      first_name
      last_name
      username
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

const UPDATE_USER = gql`
  mutation UPDATE_USER(
    $id: String!
    $username: String
    $first_name: String
    $last_name: String
    $email: String
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        username: $username
        email: $email
        first_name: $first_name
        last_name: $last_name
      }
    ) {
      affected_rows
      returning {
        email
        id
        last_seen
        first_name
        last_name
        username
      }
    }
  }
`

export { GET_USERS, ADD_USER_MUTATION, GET_USERS_BY_ID, UPDATE_USER }
