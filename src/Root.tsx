import { withLogger } from "@hyperapp/logger";
import { app, h } from "hyperapp";
import { Link, location, Route, Switch } from "hyperapp-hash-router";
import Account from "./components/Account";
import Blockchain from "./components/Blockchain";
import Config from "./components/Config";
import Faucet from "./components/Faucet";
import Help from "./components/Help";
import Links from "./components/Links";
import Misc from "./components/Misc";
import MLMS from "./components/MLMS";
import Mosaic from "./components/Mosaic";
import Namespace from "./components/Namespace";
import Node from "./components/Node";
import PKI from "./components/PKI";
import Transaction from "./components/Transaction";

import "mini.css";
import "./styles/main.styl";

import PKG from "./../package.json";
import NODES from "./resources/nodes.json";

const STORAGE_KEY = `${PKG.name}/${PKG.version}`;

const resetState = () => (state: any) => {
  console.log("state reseted!");
  const location = state.location;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  const newState = {...initialState, location};
  return newState;
};

const saveState = () => (state: any) => {
  console.log("state saved!");
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => (state: any) => {
  console.log("state loaded!");
  const savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  const newState = {...state, ...savedState};
  delete newState.location;
  return newState;
};

// TODO: implement
interface IState {
  location: any;
  url: string;
  nodes: any[];
  pki: any;
  account: any;
  mlms: any;
  namespace: any;
  mosaic: any;
  block: any;
  transaction: any;
  node: any;
  faucet: any;
  misc: any;
  config: any;
}

const initialState: IState = {
  location: location.state,
  url: NODES[0].value,
  nodes: NODES,
  pki: PKI.initialState,
  account: Account.initialState,
  mlms: MLMS.initialState,
  namespace: Namespace.initialState,
  mosaic: Mosaic.initialState,
  block: Blockchain.initialState,
  transaction: Transaction.initialState,
  node: Node.initialState,
  faucet: Faucet.initialState,
  misc: Misc.initialState,
  config: Config.initialState,
};

// TODO: implement
interface IActions {
  init: ActionType<IState, IActions>;
  location: ActionType<IState, IActions>;
}

const actions: any = {
  init: () => (s: IState, a: any) => {
    location.subscribe(a.location);
    window.addEventListener("beforeunload", () => a.saveState(s));
    a.loadState(s);
    console.log("app init!");
  },
  location: location.actions,
  onChangeUrl: (ev: Event) => (s: any, a: any) => {
    const value = ev.target ? ev.target.value : "";
    return a.setUrl(value);
  },
  onSaveNodes: (ev: Event) => (s: any, a: any) => {
    const value = ev.target ? ev.target.value : "";
    console.log(value);
    // const nodes = [];
    // return a.setNodes(nodes);
  },
  setNodes: (nodes: any) => ({ nodes }),
  setUrl: (url: string) => ({ url }),
  pki: PKI.actions,
  account: Account.actions,
  mlms: MLMS.actions,
  namespace: Namespace.actions,
  mosaic: Mosaic.actions,
  block: Blockchain.actions,
  transaction: Transaction.actions,
  node: Node.actions,
  faucet: Faucet.actions,
  misc: Misc.actions,
  config: Config.actions,
  saveState,
  loadState,
  resetState,
};

const view = (s: IState, a: any) => (
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <select name="url" onchange={a.onChangeUrl}>
          {s.nodes.map((n) => <option value={n.value}>{n.value} ({n.name})</option>)}
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <header>
          <Link class="button" to="/pki">PKI</Link>
          <Link class="button" to="/account">Account</Link>
          <Link class="button" to="/mlms">MLMS</Link>
          <Link class="button" to="/namespace">Namespace</Link>
          <Link class="button" to="/mosaic">Mosaic</Link>
          <Link class="button" to="/block">Block</Link>
          <Link class="button" to="/transaction">Transaction</Link>
          <Link class="button" to="/node">Node</Link>
          <Link class="button" to="/faucet">Faucet</Link>
          <Link class="button" to="/misc">Misc</Link>
          <Link class="button" to="/links">Links</Link>
          <Link class="button" to="/config">Config</Link>
          <Link class="button" to="/help">Help</Link>
        </header>
      </div>
    </div>
    <main class="row">
      <div class="col-sm">
        <Switch>
          <Route path="/pki" render={PKI.view} />
          <Route path="/account" render={() => <Account.view url={s.url} />} />
          <Route path="/mlms" render={() => <MLMS.view url={s.url} />} />
          <Route path="/namespace" render={() => <Namespace.view url={s.url} />} />
          <Route path="/mosaic" render={() => <Mosaic.view url={s.url} />} />
          <Route path="/block" render={() => <Blockchain.view url={s.url} />} />
          <Route path="/transaction" render={() => <Transaction.view url={s.url} />} />
          <Route path="/node" render={() => <Node.view url={s.url} />} />
          <Route path="/faucet" render={() => <Faucet.view url={s.url} />} />
          <Route path="/misc" render={Misc.view} />
          <Route path="/links" render={Links.view} />
          <Route path="/config" render={Config.view} />
          <Route path="/help" render={Help.view} />
          <Route render={PKI.view} />
        </Switch>
      </div>
    </main>
  </div>
);

let main;
if (process.env.NODE_ENV === "production") {
  main = app(initialState, actions, view, document.body);
} else {
  main = withLogger(app)(initialState, actions, view, document.body);
}
main.init();
window.__app__nem2_dev_ui = main;
