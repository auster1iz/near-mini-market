import React from 'react';
import { createRoot } from 'react-dom/client';
import { initContract } from './utils/near/utils';
import App from "./App";

const container = document.querySelector('#root')
const root = createRoot(container)

window.nearInitPromise = initContract()
  .then(() => {
    root.render(<App />)
  })
  .catch(console.error)
