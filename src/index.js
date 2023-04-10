import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
library.add(fab, fas, far);
const GlobalStyle = createGlobalStyle`

  html,body {

    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex: 1 1 auto !important;
    flex-direction: column !important;
    justify-content: stretch;
    align-items: stretch;
  }
`;
const theme = {
  colors: {
    primary: '#0070f3',
  },
};

config.autoAddCss = false;
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>
);
