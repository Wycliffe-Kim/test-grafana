import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <iframe 
      // src="http://localhost:3555/d-solo/kHqSfKPnz/traffic-volumes?orgId=1&panelId=2" 
      src="http://localhost:3555/d-solo/NkWpYKPnk/traffic-volumes?orgId=1&refresh=5s&panelId=2"
      width="1000" 
      height="600" 
      frameBorder="0"
    />
  );
}

export default App;
