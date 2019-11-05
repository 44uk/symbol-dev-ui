import React from 'react';
import { Link } from "react-router-dom";

export const Nav: React.FC = () => (
  <header>
    <Link className="button" to="/pki">PKI</Link>
    <Link className="button" to="/account">Account</Link>
    <Link className="button" to="/mlms">MLMS</Link>
    <Link className="button" to="/namespace">Namespace</Link>
    <Link className="button" to="/mosaic">Mosaic</Link>
    <Link className="button" to="/block">Block</Link>
    <Link className="button" to="/transaction">Transaction</Link>
    <Link className="button" to="/receipt">Receipt</Link>
    <Link className="button" to="/meta">Meta</Link>
    <Link className="button" to="/node">Node</Link>
    <Link className="button" to="/faucet">Faucet</Link>
    <Link className="button" to="/announce">Announce</Link>
    <Link className="button" to="/misc">Misc</Link>
    <Link className="button" to="/links">Links</Link>
    <Link className="button" to="/config">Config</Link>
    <Link className="button" to="/help">Help</Link>
  </header>
)

export default Nav;
