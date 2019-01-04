import { h } from "hyperapp";
import {
  Address,
  NetworkType,
} from "nem2-sdk";
import {
  ajax,
} from "rxjs/ajax";
import graph2text from "../util/graph2text";

interface IState {
  value?: string;
  graph?: string;
  truncated: boolean;
  loading: boolean;
  errorMessage?: string;
}

const initialState: IState = {
  loading: false,
  truncated: true,
};

interface IActions {
  onInputValue: ActionType<IState, IActions>;
  onSubmitValue: ActionType<IState, IActions>;
  onToggleTruncated: ActionType<IState, IActions>;
  setValue: ActionType<IState, IActions>;
  loadFromNode: ActionType<IState, IActions>;
  setGraph: ActionType<IState, IActions>;
  setTruncated: ActionType<IState, IActions>;
  setLoading: ActionType<IState, IActions>;
  setLoaded: ActionType<IState, IActions>;
  setErrorMessage: ActionType<IState, IActions>;
  unsetErrorMessage: ActionType<IState, IActions>;
}

const actions: IActions = {
  onInputValue: (ev: Event) => (s: IState, a: IActions) => {
    const value = ev.target ? ev.target.value : "";
    a.setValue(value);
  },
  onSubmitValue: (ev: Event) => (s: IState, a: IActions) => {
    if (ev.key && ev.key !== "Enter") { return false; }
    const url = ev.target ? ev.target.dataset.url : "";
    a.loadFromNode(url);
  },
  onToggleTruncated: (ev: Event) => {
    const checked = ev.target ? ev.target.checked : true;
    return actions.setTruncated(checked);
  },
  setValue: (value: string) => ({ value }),
  setTruncated: (truncated: boolean) => ({ truncated }),
  setErrorMessage: (errorMessage: string) => ({ errorMessage }),
  unsetErrorMessage: () => ({ errorMessage: undefined }),
  loadFromNode: (url: string) => (s: IState, a: IActions) => {
    const value = s.value || "";
    a.setLoading();
    loadFromNode(value, url).subscribe(
      (res) => {
        a.unsetErrorMessage();
        a.setGraph(res);
      },
      (err) => {
        console.error(err);
        a.setErrorMessage(err.message);
      },
      () => a.setLoaded(),
    );
  },
  setGraph: (graph: string) => (s: IState, a: IActions) => reshapeData(graph, s.truncated),
  setLoading: () => ({ loading: true }),
  setLoaded: () => ({ loading: false }),
};

const reshapeData = (graph: any, truncated: boolean) => ({graph: graph2text(graph, { truncated })});

const loadFromNode = (value: string, url: string) => {
  const address = /^[SMTN][0-9A-Z\-]{39,45}$/.test(value)
    ? Address.createFromRawAddress(value)
    : Address.createFromPublicKey(value, NetworkType.MIJIN_TEST)
  ;
  return ajax.getJSON(`${url}/account/${address.plain()}/multisig/graph`);
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: State, a: any) => (
  <div>
    { s.mlms.errorMessage &&
      <span class="toast">{s.mlms.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label>Address/PublicKey</label>
        <input type="text" name="addressOrPublicKey"
          autofocus
          value={s.mlms.value}
          oninput={a.mlms.onInputValue}
          onkeypress={(a.mlms.onSubmitValue)}
          placeholder="ex) Address or PublicKey"
          maxlength="64"
          data-url={url}
        />
        <p class="note"><small>Hit ENTER key to load from Node.</small></p>
        <div class="input-group">
          <input type="checkbox" id="truncated"
            onchange={a.mlms.onToggleTruncated}
            checked={s.mlms.truncated}
          />
          <label for="truncated">Truncated&nbsp;<small>PublicKey is showed truncated.</small></label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Output</legend>
      <div class="input-group vertical">
        <textarea readonly
          rows="12"
        >{s.mlms.graph}</textarea>
        <p class="note"><small>Symbols mean... "#" Root, "└" CoSigner, "&lt;&lt;" Referer, "(n, m)" (minCosign, cosigners)</small></p>
      </div>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
