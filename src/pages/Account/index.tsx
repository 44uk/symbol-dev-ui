import React, { useState, useEffect, useContext } from 'react';
import { AccountInfo } from 'nem2-sdk';

import TextOutput from 'components/TextOutput'
import Input from './Input'

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { useAccountData } from 'hooks/useAccountData'

function stringifyAccountInfo(ai: AccountInfo) {
  return `Account:
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
  const httpContext = useContext(HttpContext)

  const { accountHttp, mosaicHttp, metadataHttp } = httpContext.httpInstance
  const { accountInfo, setIdentifier, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    metadataHttp
  })

  const [output, setOutput] = useState("")

  useEffect(() => {
    if(! accountInfo) return
    setOutput(stringifyAccountInfo(accountInfo))
  }, [accountInfo])

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
