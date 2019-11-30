import React, { useContext, useState, useEffect } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { TextOutput } from "components"
import { useTransactionData } from "hooks"

export const Transaction: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { transactionHttp } = httpContext.httpInstance
  const { transactionData, identifier, setIdentifier, handler, loading, error } = useTransactionData({
    transactionHttp
  })

  const [value, setValue] = useState("")
  const [output, setOutput] = useState("")

  function submit() {
    identifier === value ?
      handler() :
      setIdentifier(value)
  }

  useEffect(() => {
    if(! transactionData) return
    setOutput(YAML.stringify(transactionData))
  }, [transactionData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <input type="text"
        autoFocus
        value={value}
        onChange={(_) => setValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submit()}
        placeholder="ex) TransactionHash"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/transaction/${value}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/transaction/${value}`}</a>
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
