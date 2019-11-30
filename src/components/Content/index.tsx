import React from "react"
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import {
  PKI,
  Account,
  MLMS,
  Namespace,
  Mosaic,
  Block,
  Transaction,
  Node,
  Fee,
  Distribute,
  Config,
  Misc,
  Reference,
  Help,
} from "../../pages"

import paths from "../../paths"

export const Content: React.FC = () => (
<Switch>
  <Route path={paths.pki}><PKI /></Route>
  <Route path={paths.account}><Account /></Route>
  <Route path={paths.mlms}><MLMS /></Route>
  <Route path={paths.block}><Block /></Route>
  <Route path={paths.config}><Config /></Route>
  <Route path={paths.distribute}><Distribute /></Route>
  <Route path={paths.misc}><Misc /></Route>
  <Route path={paths.mosaic}><Mosaic /></Route>
  <Route path={paths.namespace}><Namespace /></Route>
  <Route path={paths.node}><Node /></Route>
  <Route path={paths.fee}><Fee /></Route>
  <Route path={paths.reference}><Reference /></Route>
  <Route path={paths.transaction}><Transaction /></Route>
  <Route path={paths.help}><Help /></Route>
  <Redirect to={paths.pki} />
</Switch>
)

export default Content
