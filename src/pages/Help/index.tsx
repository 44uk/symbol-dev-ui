import React from "react"

import ImageArmyKnife from "./army_knife.png"

export const Help: React.FC = () => {
  console.info("Do you know of KONAMI Command?")
  return (
<div className="card fluid">
  <div className="section">
    <h2 className="double-padded">
      nem2(catapult) development Utility Interface
      <small>This is an Army Knife for nem2.</small>
    </h2>
    <p><a href="https://github.com/44uk/nem2-dev-ui" target="_blank" rel="noopener noreferrer">GitHub: 44uk/nem2-dev-ui</a></p>

    <figure>
      <img src={ImageArmyKnife} alt="ArmyKnife" width="120" />
      <figcaption><a target="_blank" rel="noopener noreferrer" href="https://www.irasutoya.com/2017/05/blog-post_395.html">十徳ナイフのイラスト | かわいいフリー素材集 いらすとや</a></figcaption>
    </figure>
  </div>
</div>
  )
}

export default Help
