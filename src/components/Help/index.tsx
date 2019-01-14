import { h } from "hyperapp";
import Easteregg from "../Easteregg";
import imageArmyKnife from "./army_knife.png";

const view = () => (s: any, a: any) => (
  <div class="card fluid">
    <div class="section">
      <h1 class="double-padded">
        nem2(catapult) development Utility Interface
        <small>This is a tools for nem2.</small>
      </h1>
      <p><a target="_blank" href="https://github.com/44uk/nem2-dev-ui">GitHub: 44uk/nem2-dev-ui</a></p>

      <figure>
        <img src={imageArmyKnife} alt="ArmyKnife" width="120" />
        <figcaption><a target="_blank" rel="nofollow" href="https://www.irasutoya.com/2017/05/blog-post_395.html">十徳ナイフのイラスト | かわいいフリー素材集 いらすとや</a></figcaption>
      </figure>

      { false && <Easteregg /> }
    </div>
  </div>
);

export default {view};