import { h } from "hyperapp";

interface Props {
  name?: string;
  label?: string;
  note?: string;
  type?: string;
  value: string | number;
  disabled?: boolean;
}

const copyToClipboard = (ev: Event) => {
  const value = ev.target ? ev.target.value : "";
  if (value === "") { return; }
  ev.target.select();
  navigator
    .clipboard
    .writeText(value)
    .then(() => console.log(`"${value}" copied to clipboard!`))
    .catch((err) => console.error("Your browser doesn't support copy to clipboard"))
  ;
};

export default (props: Props) => (
  <div class="input-group vertical">
    { props.label ? <label for={props.name}>{props.label}</label> : "" }
    <input {...props}
      readonly
      id={props.name}
      onfocus={copyToClipboard}
    />
    { props.note && <p class="note"><small>{props.note}</small></p> }
  </div>
);
