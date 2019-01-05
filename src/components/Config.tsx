import { ActionType, h } from "hyperapp";

interface IState {
  errorMessage?: string;
}

const initialState: IState = {
};

interface IActions {
  clearLocalstorage: ActionType<IState, IActions>;
}

const actions: IActions = {
  clearLocalstorage: () => {
    window.localStorage.clear();
  },
};

const view = () => (s: any, a: any) => (
  <div>
    { s.config.errorMessage &&
      <span class="toast">{s.config.errorMessage}</span> }

    <fieldset>
      <legend>Localstorage</legend>
      <div class="input-group vertical">
        <label for="privateKey">Clear</label>
        <button
          class="primary"
          onclick={a.config.clearLocalstorage}
        >Clear</button>
        <p class="note"><small>Clear stored data.</small></p>
      </div>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
