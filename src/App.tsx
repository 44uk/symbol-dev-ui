import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



import Example from './pages/Example';

const App: React.FC = () => {
  return (<Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
          <li><Link to="/example">Example</Link></li>
        </ul>
      </header>
      <main>
        <Switch>
          <Route path="/example">
            <Example />
          </Route>
        </Switch>
      </main>
    </div>
  </Router>);
}

export default App;
