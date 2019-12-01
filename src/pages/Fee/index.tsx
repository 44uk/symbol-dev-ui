import React, { useState, useContext, useEffect } from "react"
import {
  TransactionType
} from "nem2-sdk"

import { Segments } from "./segments"
import { EffectiveFee } from "./effective-fee"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import * as Byte from "util/byte"

const TRANSACTION_TYPE = {
  "Transfer": TransactionType.TRANSFER
} as const

export const Fee: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const [type, setType] = useState("Transfer")
  const [feeMultiplier, setFeeMultiplier] = useState("100")
  const [output, setOutput] = useState("")

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

  <Segments
    label="Each Segments"
    segments={Byte.Transaction}
  />
</div>
  )
}

export default EffectiveFee
