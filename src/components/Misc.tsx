import { ActionType, h } from "hyperapp";
import { convert, uint64 } from "nem2-library";
import Output from "../components/Output";

interface IState {
  numFromHex?: string;
  uint64FromHex?: string;
  hexFromNum?: string;
  uint64FromNum?: string;
  hexFromUint64?: string;
  numFromUint64?: string;
  hexMessage?: string;
  rawMessage?: string;
}

const initialState: IState = {
};

interface IAction {
  onInputHex: ActionType<IAction, IState>;
  onInputNum: ActionType<IAction, IState>;
  onInputUint64: ActionType<IAction, IState>;
  onInputHexMessage: ActionType<IAction, IState>;
  onInputRawMessage: ActionType<IAction, IState>;
  setNumFromHex: ActionType<IAction, IState>;
  setUint64FromHex: ActionType<IAction, IState>;
  setHexFromNum: ActionType<IAction, IState>;
  setUint64FromNum: ActionType<IAction, IState>;
  setHexFromUint64: ActionType<IAction, IState>;
  setNumFromUint64: ActionType<IAction, IState>;
  setHexMessage: ActionType<IAction, IState>;
  setRawMessage: ActionType<IAction, IState>;
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
    a.setHexMessage(encodeRawToHex(value));
  },
  onInputHexMessage: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    a.setRawMessage(decodeHexToRaw(value));
  },

  setRawMessage: (rawMessage: string) => ({ rawMessage }),
  setHexMessage: (hexMessage: string) => ({ hexMessage }),
};

const convertHexToNum = (hex: string) => parseInt(hex, 16);
const convertHexToUint64 = (value: string) => {
  try {
    const uint64str = uint64.fromHex(value.trim()).toString();
    return `[ ${uint64str} ]`;
  } catch (err) {
    console.error(err);
    return;
  }
};

const convertNumToHex = (num: string) => parseInt(num, 10).toString(16);
const convertNumToUint64 = (value: string) => {
  try {
    const preped = parseInt(value);
    const parsed = uint64.fromUint(preped).toString();
    return `[ ${parsed} ]`;
  } catch (err) {
    return err.message;
  }
};

const convertUint64ToHex = (value: string) => {
  const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
  const parsed = JSON.parse(preped);
  return uint64.toHex(parsed);
};
const convertUint64ToNum = (value: string) => {
  try {
    const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
    const parsed = JSON.parse(preped);
    // TODO:
    return uint64.compact(parsed).toString();
  } catch (err) {
    return err.message;
  }
};

const decodeHexToRaw = (value: string) => {
  const buf = Buffer.from(value, "hex");
  return buf.toString("utf8");
};
const encodeRawToHex = (value: string) => {
  return convert.utf8ToHex(value);
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
  </div>
);

export default {initialState, actions, view};
