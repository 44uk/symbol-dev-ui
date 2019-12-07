import React, { useState } from "react"

interface IProps {
  url: string
  onSubmit: React.Dispatch<React.SetStateAction<string | null>>
  onChange: (value: string) => void
  identifier: string | null
  handler: () => void
}

export const Input: React.FC<IProps> = ({
  url,
  onSubmit,
  onChange,
  identifier,
  handler,
}) => {
  const [value, setValue] = useState(identifier || "")

  function submit() {
    identifier === value ?
      handler() :
      onSubmit(value)
  }

  return (
<fieldset>
  <legend>Input</legend>
  <div className="input-group vertical">
    <label>Address or PublicKey</label>
    <input type="text" name="addressOrPublicKey"
      autoFocus
      pattern="[a-fA-F\d-]+"
      value={value}
      onChange={_ => {
        setValue(_.currentTarget.value)
        onChange(_.currentTarget.value)
      }}
      onKeyPress={_ => _.key === "Enter" && submit()}
      placeholder="ex) Address or PublicKey"
      maxLength={64}
    />
    <p className="note"><small>Hit ENTER key to load from Node.</small></p>
  </div>
  <p>
  { value
    ? <a href={`${url}/account/${value.replace(/-/g, "")}`}
        target="_blank" rel="noopener noreferrer"
      >{`${url}/account/${value.replace(/-/g, "")}`}</a>
    : <span>{`${url}/account/`}</span>
  }
  </p>
</fieldset>
  )
}

export default Input
