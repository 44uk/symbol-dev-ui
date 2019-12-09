import React from "react"

interface IProps {
  url: string
  identifier: string
  setIdentifer: (v: string) => void
  onSubmit: () => void
}

export const Input: React.FC<IProps> = ({
  url,
  identifier,
  setIdentifer,
  onSubmit,
}) => {
  return (
<fieldset>
  <legend>Input</legend>
  <div className="input-group vertical">
    <label>Address or PublicKey</label>
    <input type="text" name="addressOrPublicKey"
      autoFocus
      value={identifier}
      onChange={_ => setIdentifer(_.currentTarget.value)}
      onKeyPress={_ => _.key === "Enter" && onSubmit()}
      placeholder="ex) Address or PublicKey"
      maxLength={64}
    />
    <p className="note"><small>Hit ENTER key to load from Node.</small></p>
  </div>
  <p>
  { identifier
    ? <a href={`${url}/account/${identifier.replace(/-/g, "")}`}
        target="_blank" rel="noopener noreferrer"
      >{`${url}/account/${identifier.replace(/-/g, "")}`}</a>
    : <span>{`${url}/account/`}</span>
  }
  </p>
</fieldset>
  )
}

export default Input
