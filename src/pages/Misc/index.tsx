import React from "react"

import IOField from "components/IOField"

import {
  decodeHexToRaw,
  encodeRawToHex,
  decodeAddress,
  encodeAddress,
  encodeNamespace,
  convertHexToUInt64,
  convertHexToNum,
  convertUInt64ToHex,
  convertUInt64ToNum,
  datetimeStringToNemTimestamp,
  nemTimestampToDatetimeString
} from "util/convert"


export const Misc: React.FC = () => {
  return (
    <div>
      <p>Misc Page.</p>

      <IOField func={nemTimestampToDatetimeString}
        label="NEM Timestamp => DateTime(ISO8601)"
        placeholder="ex) 110097499"
      ></IOField>
      <IOField func={datetimeStringToNemTimestamp}
        label="DateTime(ISO8601) => NEM Timestamp"
        placeholder="ex) 2016-04-01T00:00:00.000Z"
      ></IOField>

      <IOField func={convertHexToUInt64}
        label="Hex => [Lower,Higher]"
        placeholder="ex) 85BBEA6CC462B244"
      ></IOField>
      <IOField func={convertHexToNum}
        label="Hex => Number"
        placeholder="ex) 85BBEA6CC462B244"
      ></IOField>

      <IOField func={convertUInt64ToHex}
        label="[Lower,Higher] => Hex"
        placeholder="ex) [3294802500,2243684972]"
      ></IOField>
      <IOField func={convertUInt64ToNum}
        label="[Lower,Higher] => Number"
        placeholder="ex) [3294802500,2243684972]"
      ></IOField>

      <IOField func={decodeHexToRaw}
        label="Decode message"
        placeholder="ex) 474F4F44204C55434B21"
      ></IOField>

      <IOField func={encodeRawToHex}
        label="Encode message"
        placeholder="ex) GOOD LUCK!"
      ></IOField>

      <IOField func={decodeAddress}
        label="Decode address"
        placeholder="ex) SBXE4P-QDLEFN-CTXVN2-SPP3JZ-QDA4MJ-ELPFWH-QRKW"
      ></IOField>

      <IOField func={encodeAddress}
        label="Encode address"
        placeholder="ex) 906E4E3E03590AD14EF56EA4F7ED3980C1C6248B796C784556"
      ></IOField>

      <IOField func={encodeNamespace}
        label="Decode Namespace"
        placeholder="ex) cat.currency"
      ></IOField>

    </div>
  )
}

export default Misc
