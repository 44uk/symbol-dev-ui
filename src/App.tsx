import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Nav from 'components/Nav';

import PKI from 'pages/PKI';
import Account from 'pages/Account/';
import MLMS from 'pages/MLMS/';
import Namespace from 'pages/Namespace/';
import Mosaic from 'pages/Mosaic/';
import Block from 'pages/Block/';
import Transaction from 'pages/Transaction/';
import Node from 'pages/Node/';
import Faucet from 'pages/Faucet/';
import Config from 'pages/Config/';
import Misc from 'pages/Misc/';
import Reference from 'pages/Reference/';
import Help from 'pages/Help/';

const App: React.FC = () => {
  return (<Router>
    <div className="container">
      <Nav></Nav>
      <main>
        <Switch>
          <Route path="/pki"><PKI /></Route>
          <Route path="/account"><Account /></Route>
          <Route path="/mlms"><MLMS /></Route>
          <Route path="/block"><Block /></Route>
          <Route path="/config"><Config /></Route>
          <Route path="/faucet"><Faucet /></Route>
          <Route path="/misc"><Misc /></Route>
          <Route path="/mosaic"><Mosaic /></Route>
          <Route path="/namespace"><Namespace /></Route>
          <Route path="/node"><Node /></Route>
          <Route path="/reference"><Reference /></Route>
          <Route path="/transaction"><Transaction /></Route>
          <Route path="/help"><Help /></Route>
        </Switch>
      </main>
    </div>
  </Router>);
}

export default App;
