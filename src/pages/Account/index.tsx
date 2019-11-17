import React, { useState, useEffect, useContext } from 'react';

import TextOutput from 'components/TextOutput'
import Input from './Input'

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { IAccountData, useAccountData } from 'hooks/useAccountData'

function stringifyAccountData(data: IAccountData) {
  const {
    accountInfo: ai,
    metadata: md,
    mosaicAmountViews: mav,
    multisigAccountInfo: mai
  } = data
  return `Info:
  Address: ${ai.address.plain()}
  HexAddress: ${ai.address.encoded()}
    Height at: ${ai.addressHeight}
  PublicKey: ${ai.publicKey}
    Height at: ${ai.publicKeyHeight}
  Importance: ${ai.importance}
    Height at: ${ai.importanceHeight}
Metadata:
${md.map(d => "  - " + d.metadataEntry.value).join("\n")}
Mosaics:
${mav.map(v => "  - " + `${v.fullName()}:${v.relativeAmount()}`).join("\n")}
`
}

export const Account: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { accountHttp, mosaicHttp, metadataHttp } = httpContext.httpInstance
  const { accountData, setIdentifier, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    metadataHttp
  })

  const [output, setOutput] = useState("")

  useEffect(() => {
    if(! accountData) return
    setOutput(stringifyAccountData(accountData))
  }, [accountData])

  return (
<div>
  <Input
    url={gwContext.url}
    onSubmit={setIdentifier}
  ></Input>

  <TextOutput
    label="Account Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Account;
