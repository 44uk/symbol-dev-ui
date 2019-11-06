import React from 'react';

interface IProps {
  label?: string
  name?: string
  readonly?: boolean
  disabled?: boolean
  value: string
  note?: string
}

export const FieldWithLabel: React.FC<IProps> = ({
  label,
  name,
  readonly = false,
  disabled = false,
  value,
  note
}) => {

  return (
<div className="input-group vertical">
  { label ? <label htmlFor={name}>{label}</label> : null }
  <input type="text"
    readOnly={readonly}
    disabled={disabled}
    name={name}
    value={value}
  />
  { note && <p className="note"><small>{note}</small></p> }
</div>
  );
};
export default FieldWithLabel;
