import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state'
import {
  MosaicHttp
} from "nem2-sdk";

const useCurrentGatewayState = createPersistedState('current-gateway')



export const Mosaic: React.FC = () => {
  const [gw] = useCurrentGatewayState('')
  const [inputValue, setInputValue] = useState('')

  const http = new MosaicHttp(gw)

  function submitInput() {
    console.log(inputValue)
  }

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Mosaic</label>
      <input type="text" name=""
        autoFocus
        value={inputValue}
        onChange={(_) => setInputValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submitInput()}
        placeholder="ex) nem.xem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
  </fieldset>
</div>
  );
}

export default Mosaic;
