import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Privacy from './Privacy.jsx'

function Router() {
  const path = window.location.pathname;
  if (path === '/privacy') return <Privacy />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
