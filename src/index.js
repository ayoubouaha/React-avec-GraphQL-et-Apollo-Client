// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// LE SEUL CHANGEMENT À FAIRE ICI :
const client = new ApolloClient({
  uri: 'http://localhost:8082/graphql',   // 8082, pas 8080 !
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
