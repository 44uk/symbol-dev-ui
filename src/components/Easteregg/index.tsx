import { h } from "hyperapp";
// import picostyle from "picostyle";
// const ps = picostyle(h);

interface IProps {
  key: any;
  name: string;
  fileName: string;
}

import images from "./*.png";
console.log(images);

const Fig = ({key, name, fileName}: IProps) => (
  <figure key={key}>
    <img src={fileName} alt={name} width="100" />
    <figcaption>{name}</figcaption>
  </figure>
);

export default () => (
<div class="__ee">
  {Object.keys(images).map((key) => <Fig key={key} name={key} fileName={images[key]} />)}
</div>
);
