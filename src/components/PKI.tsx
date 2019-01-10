import { ActionType, h } from "hyperapp";
import {
  address as libAddress,
  convert as libConvert,
} from "nem2-library";
import {
  Account,
  NetworkType,
} from "nem2-sdk";
import Act from "../shims/Act";
import { decodeAddress } from "../util/convert";
import Output from "./Output";

interface IState {
  privateKey?: string;
  networkType: number;
  pretty: boolean;
  publicKey?: string;
  address?: string;
  hexAddress?: string;
  errorMessage?: string;
  output?: string;
}

const initialState: IState = {
  networkType: NetworkType.MIJIN_TEST,
  pretty: true,
};

interface IActions {
  onInputPrivateKey: ActionType<IState, IActions>;
  onSubmitPrivateKey: ActionType<IState, IActions>;
  onChangeNetworkType: ActionType<IState, IActions>;
  prettify: Act<IState, IActions>;
  plainify: Act<IState, IActions>;
  generateAccount: Act<IState, IActions>;
  setPrivateKey: ActitonType<IState, IActions>;
  setNetworkType: ActionType<IState, IActions>;
  toJson: ActionType<IState, IActions>;
  toText: ActionType<IState, IActions>;
}

const actions: IActions = {
  onInputPrivateKey: (ev: Event) => (s: IState, a: IActions) => {
    const value = ev.target ? ev.target.value : "";
    a.setPrivateKey(value);
  },
  onSubmitPrivateKey: (ev: Event) => (s: IState, a: IActions) => {
    if (ev.key && ev.key !== "Enter") { return false; }
    const value = ev.target ? ev.target.value : "";
    return derive(value, s);
  },
  onChangeNetworkType: (ev: Event) => (s: IState, a: IActions) => {
    const value = parseInt(ev.target.value) || NetworkType.MIJIN_TEST;
    a.setNetworkType(value);
  },
  prettify: () => (s: IState) => {
    const newState = { ...s, pretty: true };
    const privateKey = newState.privateKey || "";
    return derive(privateKey, newState);
  },
  plainify: () => (s: IState) => {
    const newState = { ...s, pretty: false };
    const privateKey = newState.privateKey || "";
    return derive(privateKey, newState);
  },
  generateAccount: () => (s: IState) => {
    const newAccount = Account.generateNewAccount(s.networkType);
    return derive(newAccount.privateKey, s);
  },
  setPrivateKey: (privateKey: string) => ({ privateKey }),
  setNetworkType: (type: number) => (s: IState) => {
    const newState = { ...s, networkType: type};
    const privateKey = newState.privateKey || "";
    return derive(privateKey, newState);
  },
  toJson: () => (s: IState) => {
    const output = {
      privateKey: s.privateKey,
      publicKey: s.publicKey,
      address: s.address,
    };
    return { output: JSON.stringify(output, null, 4) };
  },
  toText: () => (s: IState) => {
    const output = `privateKey: ${s.privateKey}
publicKey: ${s.publicKey}
address: ${s.address}`;
    return { ...s, output };
  },
//  handleChangeFormValue: (t: EventTarget) => ({[t.name]: t.value}),
};

const derive = (privateKey: string, state: IState): IState => {
  try {
    const account = Account.createFromPrivateKey(privateKey, state.networkType);
    const publicKey = account.publicKey.toString();
    const address = account.address[state.pretty ? "pretty" : "plain"]();
    const hexAddress = decodeAddress(account.address.plain());
    return {...state,
      address,
      errorMessage: "",
      hexAddress,
      privateKey,
      publicKey,
    };
  } catch (err) {
    return { ...state, errorMessage: err.message };
  }
};

const view = () => (s: any, a: any) => (
  <div>
    { s.pki.errorMessage &&
      <span class="toast">{s.pki.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label for="privateKey">PrivateKey</label>
        <input type="text" id="privateKey"
          autofocus
          pattern="[a-fA-F\d]+"
          value={s.pki.privateKey}
          oninput={a.pki.onInputPrivateKey}
          onkeypress={(a.pki.onSubmitPrivateKey)}
          placeholder=""
          maxlength="64"
        />
        <p class="note"><small>Input PrivateKey or click Generate button.</small></p>
        <button
          class="primary"
          onclick={a.pki.generateAccount}
        >Generate</button>
      </div>

      <div>
        <input type="radio" id="mijin_test"
          name="networkType" value={NetworkType.MIJIN_TEST}
          onchange={a.pki.onChangeNetworkType}
          checked={s.pki.networkType === NetworkType.MIJIN_TEST}
        /><label for="mijin_test">MIJIN_TEST</label>
        <input type="radio" id="mijin"
          name="networkType" value={NetworkType.MIJIN}
          onchange={a.pki.onChangeNetworkType}
          checked={s.pki.networkType === NetworkType.MIJIN}
        /><label for="mijin">MIJIN</label>
        <input type="radio" id="main_net"
          name="networkType" value={NetworkType.MAIN_NET}
          onchange={a.pki.onChangeNetworkType}
          checked={s.pki.networkType === NetworkType.MAIN_NET}
        /><label for="main_net">MAIN_NET</label>
        <input type="radio" id="test_net"
          name="networkType" value={NetworkType.TEST_NET}
          onchange={a.pki.onChangeNetworkType}
          checked={s.pki.networkType === NetworkType.TEST_NET}
        /><label for="test_net">TEST_NET</label>
      </div>

      <div>
        <input type="radio" id="pretty" value={true}
          onchange={a.pki.prettify}
          checked={s.pki.pretty === true}
        /><label for="pretty">Pretty</label>
        <input type="radio" id="plain" value={false}
          onchange={a.pki.plainify}
          checked={s.pki.pretty === false}
        /><label for="plain">Plain</label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Output</legend>
      <div>
        <Output label="PublicKey" value={s.pki.publicKey} />
        <Output label="Address" value={s.pki.address} />
        <Output label="HexAddress" value={s.pki.hexAddress} />
        <Output label="NetworkType(UInt)" value={s.pki.networkType} />
        <Output label="NetworkType(Name)" value={NetworkType[s.pki.networkType]} />
      </div>

      <div>
        <div class="input-group vertical">
          <div>
            <button class="tertiary" onclick={a.pki.toJson}>toJson</button>
            <button class="tertiary" onclick={a.pki.toText}>toText</button>
          </div>
          <textarea rows="6">{s.pki.output}</textarea>
        </div>
      </div>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
