import React from 'react';
import { Link } from "react-router-dom";

import paths from "paths"

export const Nav: React.FC = () => (
<header>
  <Link className="button" to={paths.pki}>PKI</Link>
  <Link className="button" to={paths.account}>Account</Link>
  <Link className="button" to={paths.mlms}>MLMS</Link>
  <Link className="button" to={paths.namespace}>Namespace</Link>
  <Link className="button" to={paths.mosaic}>Mosaic</Link>
  <Link className="button" to={paths.block}>Block</Link>
  <Link className="button" to={paths.transaction}>Transaction</Link>
  <Link className="button" to={paths.receipt}>Receipt</Link>
  <Link className="button" to={paths.meta}>Meta</Link>
  <Link className="button" to={paths.node}>Node</Link>
  <Link className="button" to={paths.distribute}>Distribute</Link>
  <Link className="button" to={paths.announce}>Announce</Link>
  <Link className="button" to={paths.misc}>Misc</Link>
  <Link className="button" to={paths.reference}>Reference</Link>
  <Link className="button" to={paths.config}>Config</Link>
  <Link className="button" to={paths.help}>Help</Link>
</header>
)

export default Nav;
