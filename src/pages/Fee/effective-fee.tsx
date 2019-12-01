import React, { FC } from "react"
import { sumByte } from "util/byte"
import {
  UInt64, NetworkCurrencyMosaic
} from "nem2-sdk"

export interface IProps {
  label?: string
  feeMultiplier: number
  segmentsGroup: { byte: number, name: string }[][]
}

export const EffectiveFee: FC<IProps> = ({ label, feeMultiplier = 0 , segmentsGroup }) => {
  const totalByte = segmentsGroup.reduce((a, g) => a += sumByte(g), 0)
  const fee = totalByte * feeMultiplier
  const currency = fee / 10 ** NetworkCurrencyMosaic.DIVISIBILITY
  return (
<fieldset>
  { label && <legend>{ label }</legend> }
  <input readOnly={true}
    value={`${currency} ${NetworkCurrencyMosaic.NAMESPACE_ID.fullName}`}
  />
</fieldset>
)}



