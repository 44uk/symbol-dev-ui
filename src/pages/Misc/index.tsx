import React from 'react';

import IOField from 'components/IOField'

import {
  decodeHexToRaw,
  encodeRawToHex,
  decodeAddress,
  encodeAddress
} from 'util/convert'


export const Misc: React.FC = () => {
  return (
    <div>
      <p>Misc Page.</p>
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
    </div>
  );
}

export default Misc;
