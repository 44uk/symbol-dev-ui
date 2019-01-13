import { h } from "hyperapp";
import images from "./*.png";

interface IProps {
  key: any;
  name: string;
  fileName: string;
}

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
