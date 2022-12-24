import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  split,
  from,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "http://localhost:4005/graphql",
});

const wsLink =
  typeof window !== "undefined"
    ? new WebSocketLink({
        uri: "ws://localhost:4005/graphql",
        options: {
          reconnect: true,
        },
      })
    : null;

const splitLink =
  typeof window !== "undefined"
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const authLink = new ApolloLink((request, forward) => {
  return forward(request);
});

const errorLink = onError((args) => {
  const { graphQLErrors, operation, forward } = args;
  console.log(graphQLErrors, operation, forward);
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});
