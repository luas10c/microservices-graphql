import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "react-hot-toast";

import { client } from "../lib/apollo";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
      <Toaster />
    </ApolloProvider>
  );
};

export default App;
