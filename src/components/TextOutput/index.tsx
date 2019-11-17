import React from 'react';

interface IProps {
  label?: string
  value: string
  rows?: number
  loading?: boolean
  error?: any
}

export const TextOutput: React.FC<IProps> = ({
  label, value, rows, loading = false, error
}) => {
  let _value = ""
  if(error) {
    _value = `Error:
  Name: ${error.name}
  Detail: ${error.message}
`
  } else {
    _value = loading ? "Loading..." : value
  }
  const _rows = rows || _value.split("\n").length

  return (
<fieldset>
  <legend>{ label }</legend>
  <textarea
    rows={_rows}
    readOnly={true}
    disabled={loading}
    style={{width: "100%"}}
    value={_value}
  ></textarea>
</fieldset>
  );
}

export default TextOutput;
