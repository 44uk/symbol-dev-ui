import React, { useState, useEffect, useCallback, useContext } from "react"
import YAML from "yaml"

import { TextOutput } from "components"
import { usePayloadData } from "hooks"

import {
  GatewayContext,
  HttpContext
} from "contexts"

export const Payload: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const {
    transactionHttp
  } = httpContext.httpInstance
  const {
    transaction,
    payload, setPayload,
    announce,
    loading,
    error
  } = usePayloadData("", { transactionHttp }, gwContext.networkType, gwContext.genHash)

  const [output, setOutput] = useState("")

  const submit = useCallback((input: string) => {
    setPayload(input.trim())
  }, [setPayload])

  useEffect(() => {
    if(transaction) setOutput(YAML.stringify(transaction))
  }, [transaction])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <textarea
        autoFocus
        value={payload}
        onChange={_ => submit(_.currentTarget.value)}
        placeholder="ex) Transaction Payload"
        rows={4}
      ></textarea>
      <button className="primary"
        disabled={!!error || loading}
        onClick={announce}
      >Announce it!</button>
    </div>
  </fieldset>

  <TextOutput
    label="Transaction"
    value={output}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Payload
