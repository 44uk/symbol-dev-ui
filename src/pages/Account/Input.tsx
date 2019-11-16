import React, { useState, useEffect } from 'react';

interface IProps {
  url: string
  onSubmit: React.Dispatch<React.SetStateAction<string | null>>
}

export const Input: React.FC<IProps> = ({
  url,
  onSubmit
}) => {
  const [value, setValue] = useState('')

  function submit() {
    onSubmit(value)
  }

  useEffect(() => {
    // publicKey is HEX and 64 length
    // 798D5CAEB7FCDEEF4BBCD12FA0AACA34429B091A93EFAFA7658F3C25C8FEFCED

    // address is
    // Start with [SMTN][ABCD]
    // length 40
    // SDC2PT-SP5JOA-HUOIO7-BKSGG3-A3MTGB-SDJXY2-HJ23
    // SDC2PTSP5JOAHUOIO7BKSGG3A3MTGBSDJXY2HJ23

    // encoded address is HEX length is 50
    // 90: MIJIN_TEST, 60: MIJIN, 68: TEST_NET, 90: MAIN_NET
    // 17: A,
    // 90C5A 7CE4F EA5C0 3D1C8 77C2A 918DB 06D93 30643 4DF1A 3A75B
  }, [value])

  const _value = value.replace(/-/g, "")

  return (
<fieldset>
  <legend>Input</legend>
  <div className="input-group vertical">
    <label>Address/PublicKey</label>
    <input type="text" name="addressOrPublicKey"
      autoFocus
      pattern="[a-fA-F\d-]+"
      value={value}
      onChange={(_) => setValue(_.currentTarget.value)}
      onKeyPress={(_) => _.key === "Enter" && submit()}
      placeholder="ex) Address or PublicKey"
      maxLength={64}
    />
    <p className="note"><small>Hit ENTER key to load from Node.</small></p>
  </div>
  <p>
  { value
    ? <a href={`${url}/account/${_value}`}
        target="_blank" rel="noopener noreferrer"
      >{`${url}/account/${_value}`}</a>
    : <span>{`${url}/account/`}</span>
  }
  </p>
</fieldset>
  );
}

export default Input;
