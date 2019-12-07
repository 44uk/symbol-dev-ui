import React from "react"
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import qs from "query-string"

import {
  PKI,
  Account,
  MLMS,
  Namespace,
  Mosaic,
  Block,
  Transaction,
  Payload,
  Node,
  Fee,
  Distribute,
  Config,
  Misc,
  Reference,
  Help,
} from "pages"

import paths from "paths"

export const Content: React.FC = () => (
<Switch>
  <Route path={paths.pki}><PKI /></Route>
  <Route path={paths.account}
    render={props => <Account query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.mlms}
    render={props => <MLMS query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.namespace}
    render={props => <Namespace query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.mosaic}
    render={props => <Mosaic query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.block}
    render={props => <Block query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.transaction}
    render={props => <Transaction query={qs.parse(props.location.search)}/>}></Route>
  <Route path={paths.payload}><Payload /></Route>
  <Route path={paths.node}><Node /></Route>
  <Route path={paths.fee}><Fee /></Route>
  <Route path={paths.distribute}><Distribute /></Route>
  <Route path={paths.misc}><Misc /></Route>
  <Route path={paths.config}><Config /></Route>
  <Route path={paths.reference}><Reference /></Route>
  <Route path={paths.help}><Help /></Route>
  <Redirect to={paths.pki} />
</Switch>
)

export default Content
