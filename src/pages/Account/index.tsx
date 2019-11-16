import React, { useState, useEffect, useContext } from 'react';
import {
  AccountHttp, AccountInfo,
} from 'nem2-sdk';

import TextOutput from 'components/TextOutput'
import Input from './Input'

import { Context as GatewayContext } from 'contexts/gateway'
import { useAccountInfo } from 'hooks/useAccountInfo'

function stringifyAccountInfo(ai: AccountInfo) {
  return `:
  Address: ${ai.address.plain()}
  HexAddress: ${ai.address.encoded()}
    Height at: ${ai.addressHeight}
  PublicKey: ${ai.publicKey}
    Height at: ${ai.publicKeyHeight}
  Importance: ${ai.importance}
    Height at: ${ai.importanceHeight}
`
}

export const Account: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const http = new AccountHttp(gwContext.url)
  const [output, setOutput] = useState("")
  const { accountInfo, setIdentifier, loading, error } = useAccountInfo(http)

  useEffect(() => {
    if(! accountInfo) return
    setOutput(stringifyAccountInfo(accountInfo))
  }, [accountInfo, http])

  return (
<div>
  <Input
    url={gwContext.url}
    onSubmit={setIdentifier}
  ></Input>

  <TextOutput
    label="Account Info"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Account;
