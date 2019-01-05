import { ActionType, h } from "hyperapp";
import {
  Namespace,
  NamespaceHttp,
  NamespaceId,
  NamespaceService,
} from "nem2-sdk";
import Output from "../components/Output";

interface IState {
  value?: string;
  name?: string;
  hex?: string;
  uint?: string;
  root?: boolean;
  type?: string;
  owner?: string;
  startHeight?: number | string;
  endHeight?: number | string;
  loading: boolean;
  errorMessage?: string;
}

const initialState: IState = {
  loading: false,
};

// hexadecimal:    84b3552d375ffa4b
// uint:           [ 929036875, 2226345261 ]
// type:           Root namespace
// owner:          SCC44I-W4FCVP-3HUUXK-I6JU26-ICFCGK-EOBJAP-3RIC
// startHeight:    1
// endHeight:      4294967295,4294967295

interface IActions {
  onInputValue: ActionType<IState, IActions>;
  onSubmitValue: ActionType<IState, IActions>;
  setValue: ActionType<IState, IActions>;
  loadFromNode: ActionType<IState, IActions>;
  setNamespace: ActionType<IState, IActions>;
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
  setValue: (value: string) => ({ value }),
  setLoading: () => ({ loading: true }),
  setLoaded: () => ({ loading: false }),
  setNamespace: (namespace: Namespace) => reshapeData(namespace),
  setErrorMessage: (errorMessage: string) => ({ errorMessage }),
  unsetErrorMessage: () => ({ errorMessage: undefined }),
  loadFromNode: (url: string) => (s: IState, a: IActions) => {
    const value = s.value || "";
    a.setLoading();
    loadFromNode(value, url).subscribe(
      (namespace) => {
        a.unsetErrorMessage();
        a.setNamespace(namespace);
      },
      (err) => {
        console.error(err);
        a.setErrorMessage(err.message);
      },
      () => a.setLoaded(),
    );
  },
};

const reshapeData = (ns: Namespace) => {
  const data = {
    name: ns.name,
    hex: ns.id.toHex(),
    uint: `[ ${ns.id.id.lower}, ${ns.id.id.higher} ]`,
    root: ns.isRoot(),
    type: ns.isRoot() ? "Root" : "Sub",
    owner: ns.owner.address.pretty(),
    startHeight: ns.startHeight.compact(),
    endHeight: ns.endHeight.compact(),
  };
  return data;
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: any, a: any) => (
  <div>
    { s.namespace.errorMessage &&
      <span class="toast">{s.namespace.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label>Namespace</label>
        <input type="text"
          autofocus
          value={s.namespace.value}
          oninput={a.namespace.onInputValue}
          onkeypress={(a.namespace.onSubmitValue)}
          placeholder="ex) nem, [uint64 format], [hex format]"
          data-url={url}
        />
        <p class="note"><small>Hit ENTER key to load from Node.</small></p>
      </div>
    </fieldset>
    <fieldset>
      <legend>Output</legend>
      <div>
        <Output type="text" disabled={s.namespace.loading} label="Name" value={s.namespace.name} />
        <Output type="text" disabled={s.namespace.loading} label="HEX" value={s.namespace.hex} />
        <Output type="text" disabled={s.namespace.loading} label="Uint" value={s.namespace.uint} />
        <Output type="text" disabled={s.namespace.loading} label="Type" value={s.namespace.type} />
        <Output type="text" disabled={s.namespace.loading} label="Owner" value={s.namespace.owner} />
        <Output type="text" disabled={s.namespace.loading} label="Start" value={s.namespace.startHeight} />
        <Output type="text" disabled={s.namespace.loading} label="End" value={s.namespace.endHeight} />
      </div>
    </fieldset>
  </div>
);

const loadFromNode = (value: string, url: string) => {
  const _value = (/^[a-z0-9‘_\-.]+$/.test(value))
    ? value
    : JSON.parse(value)
  ;
  const namespaceId = new NamespaceId(_value);
  const namespaceHttp = new NamespaceHttp(url);
  const namespaceService = new NamespaceService(namespaceHttp);
  return namespaceService.namespace(namespaceId);
      // let text = "";
      // text += chalk.green("Namespace: ") + chalk.bold(namespace.name) + "\n";
      // text += "-".repeat("Namespace: ".length + namespace.name.length) + "\n\n";
      // text += "hexadecimal:\t" + namespace.id.toHex() + "\n";
      // text += "uint:\t\t[ " + namespace.id.id.lower + ", " + namespace.id.id.higher + " ]\n";

      // if (namespace.isRoot()) {
      //    text += "type:\t\tRoot namespace \n";
      // } else {
      //    text += "type:\t\tSub namespace \n";
      // }

      // text += "owner:\t\t" + namespace.owner.address.pretty() + "\n";
      // text += "startHeight:\t" + namespace.startHeight.compact() + "\n";
      // text += "endHeight:\t" + namespace.endHeight.compact() + "\n\n";

      // if (namespace.isSubnamespace()) {
      //    text += chalk.green("Parent Id: ") + chalk.bold(namespace.name) + "\n";
      //    text += "-".repeat("Parent Id: ".length + namespace.name.length) + "\n\n";
      //    text += "hexadecimal:\t" + namespace.parentNamespaceId().toHex() + "\n";
      //    text += "uint:\t\t[ " + namespace.parentNamespaceId().id.lower + ", " +
      //        "" + namespace.parentNamespaceId().id.higher + " ]\n\n";
      // }

      // console.log(text);
};

export default {initialState, actions, view};
