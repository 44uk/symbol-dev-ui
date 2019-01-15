import { h } from "hyperapp";

const view = () => (
  <div>
    <div class="card fluid">
      <div class="section">
        <h4>Official Links</h4>
      </div>
      <div class="section">
        <li><a target="_blank" href="https://nemtech.github.io/">Home — NEM Developer Center</a></li>
        <li><a target="_blank" href="https://nemtech.github.io/api/endpoints.html">Endpoints — NEM Developer Center</a></li>
        <li><a target="_blank" href="https://github.com/nemtech/catapult-server">nemtech/catapult-server: Catapult server</a></li>
        <li><a target="_blank" href="https://github.com/nemtech/catapult-rest">nemtech/catapult-rest: Catapult rest server</a></li>
        <li><a target="_blank" href="https://github.com/nemtech/nem2-camel">nemtech/nem2-camel: A component to turn the asynchronous transaction announcement into synchronous.</a></li>
        <li><a target="_blank" href="https://github.com/nemtech/nem2-sdk-typescript-javascript">nemtech/nem2-sdk-typescript-javascript: nem2-sdk official for typescript &amp; javascript</a></li>
        <li><a target="_blank" href="https://github.com/nemtech/nem2-prototyping-tool">nemtech/nem2-prototyping-tool: A collection of Node-RED nodes for prototyping NEM blockchain applications.</a></li>
      </div>
    </div>
    <div class="card fluid">
      <div class="section">
        <h4>Community Links</h4>
      </div>
      <div class="section">
        <li><a target="_blank" href="https://hackmd.io/s/Skbg6u5ZE">Catapult Model - HackMD</a></li>
        <li><a target="_blank" href="https://github.com/RossyWhite/nem2-cli-zsh-completion">RossyWhite/nem2-cli-zsh-completion: Completion function for https://github.com/nemtech/nem2-cli</a></li>
        <li><a target="_blank" href="https://github.com/44uk/nem2-cli-bash-completion">44uk/nem2-cli-bash-completion: Bash Completion function for https://github.com/nemtech/nem2-cli</a></li>
      </div>
    </div>
  </div>
);

export default {view};
