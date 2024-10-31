// src/apollo-client/client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const HASURA_ADMIN_SECRET =
  'I8wO1z13VIm7mTfTU5cwgjbhipveo4Dn4l320oVx7zzgFdanauc4g2bYn5qRw8nF'

const httpLink = new HttpLink({
  // uri: import.meta.url.includes('localhost')
  //   ? 'http://localhost:8080/v1/graphql'
  //   : 'https://neutral-rooster-35.hasura.app/v1/graphql'
  uri: 'https://neutral-rooster-35.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET
  }
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          keyArgs: false, // Không phân biệt các args, merge tất cả
          merge(existing = [], incoming) {
            return [...existing, ...incoming]
          }
        }
      }
    }
  }
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export default client
