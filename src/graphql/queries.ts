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

const ADD_PRODUCT = gql`
  mutation InsertProducts(
    $category: String
    $description: String
    $name: String
    $stock: Float
    $price: Float
  ) {
    insert_products(
      objects: {
        category: $category
        description: $description
        name: $name
        stock: $stock
        price: $price
      }
    ) {
      affected_rows
      returning {
        price
        stock
        category
        description
        id
        name
      }
    }
  }
`

export { GET_PRODUCTS, ADD_PRODUCT }
