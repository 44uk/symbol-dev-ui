import React from "react"
import { NavLink } from "react-router-dom"

import paths from "paths"
import clsx from "clsx"

const clsActive = clsx(
  "inverse"
)

export const Navigation: React.FC = () => (
<header>
  <NavLink activeClassName={clsActive} role="button" to={paths.pki}>PKI</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.account}>Account</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.monitor}>Monitor</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.mlms}>MLMS</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.namespace}>Namespace</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.mosaic}>Mosaic</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.block}>Block</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.transaction}>Transaction</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.payload}>Payload</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.node}>Node</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.fee}>Fee</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.distribute}>Distribute</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.misc}>Misc</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.config}>Config</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.reference}>Reference</NavLink>
  <NavLink activeClassName={clsActive} role="button" to={paths.help}>Help</NavLink>
</header>
)

export default Navigation
