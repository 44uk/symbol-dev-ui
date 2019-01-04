import { h } from "hyperapp";
import Underconstruction from "./Underconstruction";

interface IState {

}

const initialState: IState = {

};

interface IAction {

}

const actions: IAction = {

};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: any, a: any) => (
  <div>
    { s.transaction.errorMessage &&
      <span class="toast">{s.transaction.errorMessage}</span> }

    <Underconstruction />

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label for="privateKey">PrivateKey</label>
        <input type="text" id="privateKey"
          autofocus
          pattern="[a-fA-F\d]+"
          value={s.transaction.privateKey}
          oninput={a.transaction.onInputPrivateKey}
          onkeypress={(a.transaction.onSubmitPrivateKey)}
          placeholder=""
          maxlength="64"
        />
        <p class="note"><small>Input PrivateKey</small></p>
      </div>

      <div class="input-group">
        <button onClick={a.transaction.sign}>Sign</button>
        <button onClick={a.transaction.annouce}>Announce</button>
        <button onClick={a.transaction.signAndAnnounce}>Sign&amp;Announce</button>
      </div>
    </fieldset>

    <fieldset>
      <legend>Output</legend>

    </fieldset>
  </div>
);

export default {initialState, actions, view};
