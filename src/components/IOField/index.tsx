import React, { useState, useEffect } from 'react';

interface IProps {
  label?: string
  name?: string
  placeholder: string
  disabled?: boolean
  value?: string
  note?: string
  func?: (val: string) => string
}

export const IOField: React.FC<IProps> = ({
  label,
  name,
  placeholder,
  disabled = false,
  value = "",
  note,
  func
}) => {

  const [input, setInput] = useState(value)
  const [output, setOutput] = useState("")

  useEffect(() => {
    const result = func ? func(input) : input
    setOutput(result)
  }, [input, func])

  return (
<div className="input-group vertical">
  { label ? <label htmlFor={name}>{label}</label> : null }
  <input type="text"
    disabled={disabled}
    name={name}
    value={input}
    placeholder={placeholder}
    onChange={(_) => setInput(_.target.value)}
  />

  <input type="text"
    readOnly={true}
    value={output}
  />
  { note && <p className="note"><small>{note}</small></p> }
</div>
  );
};
export default IOField;
