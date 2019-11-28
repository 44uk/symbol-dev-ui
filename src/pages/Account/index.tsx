import React, { useState, useEffect, useContext } from 'react';

import TextOutput from 'components/TextOutput'
import Input from './Input'

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { IAccountData, useAccountData } from 'hooks/useAccountData'
import YAML from 'yaml'

function stringifyAccountData(data: IAccountData) {
  return YAML.stringify(data)
//   const {
//     accountInfo: ai,
//     metadata: md,
//     mosaicAmountViews: mav,
//     multisigAccountInfo: mai
//   } = data
//   return `Info:
//   Address: ${ai.address.plain()}
//   HexAddress: ${ai.address.encoded()}
//     Height at: ${ai.addressHeight}
//   PublicKey: ${ai.publicKey}
//     Height at: ${ai.publicKeyHeight}
//   Importance: ${ai.importance}
//     Height at: ${ai.importanceHeight}
// Metadata:
// ${md.map(d => "  - " + d.metadataEntry.value).join("\n")}
// Mosaics:
// ${mav.map(v => "  - " + `${v.fullName()}:${v.relativeAmount()}`).join("\n")}
// `
}

export const Account: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { accountHttp, mosaicHttp, metadataHttp, multisigHttp } = httpContext.httpInstance
  const { accountData, identifier, setIdentifier, handler, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    metadataHttp,
    multisigHttp
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
    identifier={identifier}
    handler={handler}
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
