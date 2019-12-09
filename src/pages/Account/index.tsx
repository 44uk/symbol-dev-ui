import React, { useState, useEffect, useContext, useCallback } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext,
} from "contexts"

import {
  IAccountData,
  useAccountData,
} from "hooks"

import { TextOutput } from "components"
import Input from "./Input"

function stringifyAccountData(data: IAccountData) {
  return YAML.stringify(data)
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const Account: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { accountHttp, mosaicHttp, namespaceHttp, metadataHttp, multisigHttp } = httpContext.httpInstance
  const { accountData, identifier, setIdentifier, handler, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    namespaceHttp,
    metadataHttp,
    multisigHttp
  }, query.identifier || "")

  const [output, setOutput] = useState("")

  const submit = useCallback(() => {
    handler()
  }, [handler])

  useEffect(() => {
    if(accountData) setOutput(stringifyAccountData(accountData))
  }, [accountData])

  return (
<div>
  <Input
    url={gwContext.url}
    identifier={identifier}
    setIdentifer={setIdentifier}
    onSubmit={submit}
  ></Input>

  <TextOutput
    label="Account Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Account
