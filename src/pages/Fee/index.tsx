import React, { useState, useEffect } from "react"
import asTable from 'as-table'
import {
  TransactionType
} from "nem2-sdk"

// import {
//   GatewayContext,
//   HttpContext
// } from "contexts"

import * as Byte from "util/byte"
import { TextOutput } from "components"
import { EffectiveFee } from "./effective-fee"

const TRANSACTION_TYPE = {
  "Transfer": TransactionType.TRANSFER
} as const

export const Fee: React.FC = () => {
  // TODO: fetch minFeeMultiplier
  // const gwContext = useContext(GatewayContext)
  // const httpContext = useContext(HttpContext)

  const [type, setType] = useState("Transfer")
  const [feeMultiplier, setFeeMultiplier] = useState("100")
  const [output, setOutput] = useState("")

  useEffect(() => {
    const rows =[
      ...Byte.Transaction,
      // @ts-ignore
      ...Byte[type]({})
    ]
    const sumRow = [
      { byte: "----", name: "----------------" },
      { byte: Byte.sumByte(rows), name: "[TOTAL]" }]
    const asciiTable = asTable.configure({
      delimiter: "|",
      right: true
    })([...rows, ...sumRow])
    setOutput(asciiTable)
  }, [type, feeMultiplier])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Fee Calculator</label>
      <select autoFocus
        value={type}
        onChange={(ev) => { setType(ev.target.value) } }
      >
        { Object.keys(TRANSACTION_TYPE).map((key: string) => (
          // @ts-ignore
          <option key={key} value={TRANSACTION_TYPE[key]}>{key}</option>
        ))}
      </select>
      <input type="number"
        value={feeMultiplier}
        onChange={(_) => setFeeMultiplier(_.currentTarget.value)}
        placeholder="100"
        maxLength={64}
      />
    </div>
  </fieldset>

  <EffectiveFee
    label="Effective Fee"
    // @ts-ignore
    segmentsGroup={[Byte.Transaction, Byte[type]]}
    feeMultiplier={parseInt(feeMultiplier) || 0}
  />

  <TextOutput
    label="Mosaic Data"
    value={output}
  ></TextOutput>
</div>
  )
}

export default EffectiveFee
