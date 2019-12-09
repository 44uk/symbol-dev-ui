import React, { useContext, useState, useEffect, useCallback, ChangeEvent } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { useTransactionData } from "hooks"
import { TextOutput } from "components"

interface IProps {
  query: {
    hash?: string
  }
}

export const Transaction: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { transactionHttp } = httpContext.httpInstance
  const { transactionData, identifier, setIdentifier, handler, loading, error } = useTransactionData({
    transactionHttp
  }, query.hash || "")

  const [output, setOutput] = useState("")

  const submit = useCallback(() => {
    handler()
  }, [handler])

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIdentifier(event.currentTarget.value)
  }, [setIdentifier])

  useEffect(() => {
    if(transactionData) setOutput(YAML.stringify(transactionData))
  }, [transactionData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <input type="text"
        autoFocus
        value={identifier}
        onChange={onChangeInput}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) TransactionHash"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { identifier
      ? <a href={`${gwContext.url}/transaction/${identifier}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/transaction/${identifier}`}</a>
      : <span>{`${gwContext.url}/transaction/`}</span>
    }
    </p>
  </fieldset>

  <TextOutput
    label="Transaction Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Transaction
