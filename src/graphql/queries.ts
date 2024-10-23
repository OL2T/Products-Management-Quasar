import gql from 'graphql-tag'

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      category
      stock
      price
    }
  }
`

export { GET_PRODUCTS }
