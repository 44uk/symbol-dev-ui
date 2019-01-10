import { ActionType, h } from "hyperapp";
import Output from "../components/Output";
import {
  convertHexToNum,
  convertHexToUint64,
  convertNumToHex,
  convertNumToUint64,
  convertUint64ToHex,
  convertUint64ToNum,
  decodeAddress,
  decodeHexToRaw,
  encodeAddress,
  encodeRawToHex,
} from "../util/convert";

interface IState {
  numFromHex?: string;
  uint64FromHex?: string;
  hexFromNum?: string;
  uint64FromNum?: string;
  hexFromUint64?: string;
  numFromUint64?: string;
  hexMessage?: string;
  rawMessage?: string;
  hexAddress?: string;
  txtAddress?: string;
}

const initialState: IState = {
};

interface IAction {
}

const actions = {
  onInputHex: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return {
      numFromHex: convertHexToNum(value),
      uint64FromHex: convertHexToUint64(value),
    };
  },
  onInputNum: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return {
      hexFromNum: convertNumToHex(value),
      uint64FromNum: convertNumToUint64(value),
    };
  },
  onInputUint64: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return {
      hexFromUint64: convertUint64ToHex(value),
      numFromUint64: convertUint64ToNum(value),
    };
  },
  onInputRawMessage: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return { hexMessage: encodeRawToHex(value) };
  },
  onInputHexMessage: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return { rawMessage: decodeHexToRaw(value) };
  },
  onInputHexAddress: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return { txtAddress: encodeAddress(value) };
  },
  onInputTxtAddress: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return { hexAddress: decodeAddress(value) };
  },
};

const view = () => (s: any, a: any) => (
  <div>
    <fieldset>
      <legend>from Hex</legend>
      <div class="input-group vertical">
        <label for="hex">Hex</label>
        <input type="text" id="hex" name="hex"
          oninput={a.misc.onInputHex}
          placeholder="ex) ff"
        />
      </div>
      <Output type="text" label="Num" value={s.misc.numFromHex} />
      <Output type="text" label="Uint64" value={s.misc.uint64FromHex} />
    </fieldset>

    <fieldset>
      <legend>from Num</legend>
      <div class="input-group vertical">
        <label>Num</label>
        <input type="text" name="num"
          oninput={a.misc.onInputNum}
          placeholder="ex) 255"
        />
      </div>
      <Output type="text" label="Hex" value={s.misc.hexFromNum} />
      <Output type="text" label="Uint64" value={s.misc.uint64FromNum} />
    </fieldset>

    <fieldset>
      <legend>from Uint64</legend>
      <div class="input-group vertical">
        <label>Uint64</label>
        <input type="text" name="uint64"
          oninput={a.misc.onInputUint64}
          placeholder="ex) 255, 255 (lower number, higher number)"
        />
      </div>
      <Output type="text" label="Hex" value={s.misc.hexFromUint64} />
      <Output type="text" label="Num" value={s.misc.numFromUint64} />
    </fieldset>

    <fieldset>
      <legend>encode Message</legend>
      <div class="input-group vertical">
        <label>Raw</label>
        <input type="text" name="rawMessage"
          oninput={a.misc.onInputRawMessage}
          placeholder="ex) GOOD LUCK!"
        />
      </div>
      <Output type="text" label="encoded" value={s.misc.hexMessage} />
    </fieldset>

    <fieldset>
      <legend>decode Message</legend>
      <div class="input-group vertical">
        <label>Hex</label>
        <input type="text" name="hexMessage"
          oninput={a.misc.onInputHexMessage}
          placeholder="ex) 474f4f44204c55434b21"
        />
      </div>
      <Output type="text" label="decoded" value={s.misc.rawMessage} />
    </fieldset>

    <fieldset>
      <legend>encode Address</legend>
      <div class="input-group vertical">
        <label>Hex</label>
        <input type="text" name="hexAddress"
          oninput={a.misc.onInputHexAddress}
          placeholder="ex) 90F421A0..6234840E"
        />
      </div>
      <Output type="text" label="encoded" value={s.misc.txtAddress} />
    </fieldset>

    <fieldset>
      <legend>decode Address</legend>
      <div class="input-group vertical">
        <label>Txt</label>
        <input type="text" name="txtAddress"
          oninput={a.misc.onInputTxtAddress}
          placeholder="ex) SAXXXX-XXXXXX-..-XXXX"
        />
      </div>
      <Output type="text" label="decoded" value={s.misc.hexAddress} />
    </fieldset>

  </div>
);

export default {initialState, actions, view};
