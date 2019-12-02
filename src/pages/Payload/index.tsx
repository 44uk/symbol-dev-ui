import React, { useState, useEffect } from "react"
import YAML from "yaml"

import { TextOutput } from "components"
import { usePayloadData } from "hooks"

import { persistedPaths } from "persisted-paths"
import createPersistedState from "use-persisted-state"
const useInputState = createPersistedState(persistedPaths.payload)

export const Payload: React.FC = () => {
  const [value, setValue] = useInputState("")
  const { transaction, setPayload, error } = usePayloadData("")
  const [output, setOutput] = useState("")

  useEffect(() => {
    if(! transaction) return
    setOutput(YAML.stringify(transaction))
  }, [transaction])

  useEffect(() => {
    setPayload(value)
  }, [value, setPayload])

  function submit(input: string) {
    setValue(input.trim())
  }

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <textarea
        autoFocus
        value={value}
        onChange={(_) => submit(_.currentTarget.value)}
        placeholder="ex) Transaction Payload"
        rows={4}
      ></textarea>
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
