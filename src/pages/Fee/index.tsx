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

const TRANSACTION_TYPE = [
  "Transfer"
] as const

export const Fee: React.FC = () => {
  // TODO: fetch minFeeMultiplier
  // const gwContext = useContext(GatewayContext)
  // const httpContext = useContext(HttpContext)

  const [feeMultiplier, setFeeMultiplier] = useState("100")
  const [type, setType] = useState("Transfer")

  const [mosaicCount, setMosaicCount] = useState("1")
  const [payloadLength, setPayloadLength] = useState("0")

  const [output, setOutput] = useState("")

  useEffect(() => {
    const rows =[
      ...Byte.Transaction,
      // @ts-ignore
      ...Byte[type]({ mosaicCount, payloadLength })
    ]
    const sumRow = [
      { byte: "----", name: "----------------" },
      { byte: Byte.sumByte(rows), name: "[TOTAL]" }]
    const asciiTable = asTable.configure({
      delimiter: "|",
      right: true
    })([...rows, ...sumRow])
    setOutput(asciiTable)
  }, [type, feeMultiplier, mosaicCount, payloadLength])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Fee Multiplier</label>
      <input type="number"
        value={feeMultiplier}
        onChange={(_) => setFeeMultiplier(_.currentTarget.value)}
        placeholder=""
        maxLength={64}
      />

      <label>Fee Calculator</label>
      <select autoFocus
        value={type}
        onChange={ev => setType(ev.target.value) }
      >
        { TRANSACTION_TYPE.map((key: string) => (
          // @ts-ignore
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      { type === "Transfer" && <>
      <label>Mosaic Count</label>
      <input type="number"
        value={mosaicCount}
        onChange={(_) => setMosaicCount(_.currentTarget.value)}
        placeholder=""
        min={0}
        max={99}
        maxLength={2}
      />
      <label>Message Length</label>
      <input type="number"
        value={payloadLength}
        onChange={(_) => setPayloadLength(_.currentTarget.value)}
        placeholder=""
        min={0}
        max={1023}
        maxLength={4}
      />
      </> }
    </div>
  </fieldset>

  <EffectiveFee
    label="Effective Fee"
    // @ts-ignore
    segmentsGroup={[Byte.Transaction, Byte[type]({ mosaicCount, payloadLength })]}
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
