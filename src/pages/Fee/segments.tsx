import React, { FC } from "react"
import { sumByte } from "util/byte"

export interface IProps {
  label?: string
  sum?: boolean
  segments: { byte: number, name: string }[]
}

export const Segments: FC<IProps> = ({ label, sum = false, segments }) => (
<fieldset>
  { label && <legend>{ label }</legend> }
  <table className="segment-table">
    { sum &&
    <tr>
      <th>[Sum Byte]</th>
      <td>{sumByte(segments)}</td>
    </tr>
    }
    { segments.map(seg =>
      <tr>
        <th>{seg.name}</th>
        <td>{seg.byte}</td>
      </tr>
    )}
  </table>
</fieldset>
)


