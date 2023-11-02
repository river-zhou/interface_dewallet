import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { GRAPH_URL } from 'utils/config'

const httpLink = createHttpLink({
  uri: GRAPH_URL,
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default client
