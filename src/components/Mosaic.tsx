import { h } from "hyperapp";
import {
  AccountHttp,
  MosaicHttp,
  MosaicId,
  MosaicService,
  NamespaceHttp,
} from "nem2-sdk";
import Output from "./Output";

interface IState {
  value?: string;
  fullName?: string;
  hex?: string;
  uint?: string;
  divisibility?: number;
  transferable?: boolean;
  supplyMutable?: boolean;
  active?: boolean;
  blockHeight?: number;
  duration?: number;
  owner?: string;
  supply?: number;
  namespaceIdHex?: string;
  namespaceIdUint?: string;
  loading: boolean;
}

const initialState: IState = {
  loading: false,
};

interface IActions {
  onInputValue: ActionType<IState, IActions>;
  onSubmitValue: ActionType<IState, IActions>;
  setValue: ActionType<IState, IActions>;
  loadFromNode: ActionType<IState, IActions>;
  setMosaicView: ActionType<IState, IActions>;
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
  setMosaicView: (mosaicView: MosaicView) => reshapeData(mosaicView),
  setErrorMessage: (errorMessage: string) => ({ errorMessage }),
  unsetErrorMessage: () => ({ errorMessage: undefined }),
  loadFromNode: (url: string) => (s: IState, a: IActions) => {
    const value = s.value || "";
    a.setLoading();
    loadFromNode(value, url).subscribe(
      (mosaicView: MosaicView[]) => {
        if (mosaicView.length === 0) { return; }
        a.setMosaicView(mosaicView[0]);
      },
      (err) => {
        console.error(err);
        a.setErrorMessage(err.message);
      },
      () => a.setLoaded(),
    );
  },
};

const reshapeData = (mv: MosaicView) => {
  const mi = mv.mosaicInfo;
  const moId = mi.mosaicId;
  const nsId = mi.namespaceId;
  console.log(nsId);
  const data = {
    fullName: mv.fullName(),
    hex: moId.toHex(),
    uint: `[ ${moId.id.lower}, ${moId.id.higher} ]`,
    divisibility: mi.divisibility,
    transferable: mi.isTransferable(),
    supplyMutable: mi.isSupplyMutable(),
    active: mi.active,
    blockHeight: mi.height.compact(),
    duration: mi.duration.compact(),
    owner: mi.owner.address.pretty(),
    supply: mi.supply.compact(),
    namespaceIdHex: nsId.toHex(),
    namespaceIdUint: `[ ${nsId.id.lower}, ${nsId.id.higher} ]`,
  };
  return data;
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: any, a: any) => (
  <div>
    { s.mosaic.errorMessage &&
      <span class="toast">{s.mosaic.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label>Mosaic</label>
        <input type="text"
          autofocus
          value={s.mosaic.value}
          oninput={a.mosaic.onInputValue}
          onkeypress={(a.mosaic.onSubmitValue)}
          placeholder="ex) nem:xem, [uint64 format], [hex format]"
          data-url={url}
        />
        <p class="note"><small>Hit ENTER key to load from Node.</small></p>
      </div>
    </fieldset>

    <fieldset>
      <legend>Output</legend>
      <Output type="text" disabled={s.mosaic.loading} label="FullName" value={s.mosaic.fullName} />
      <Output type="text" disabled={s.mosaic.loading} label="HEX" value={s.mosaic.hex} />
      <Output type="text" disabled={s.mosaic.loading} label="Uint" value={s.mosaic.uint} />
      <Output type="text" disabled={s.mosaic.loading} label="Divisibility" value={s.mosaic.divisibility} />
      <Output type="text" disabled={s.mosaic.loading} label="Transferable" value={s.mosaic.transferable} />
      <Output type="text" disabled={s.mosaic.loading} label="SupplyMutable" value={s.mosaic.supplyMutable} />
      <Output type="text" disabled={s.mosaic.loading} label="Active" value={s.mosaic.active} />
      <Output type="text" disabled={s.mosaic.loading} label="BlockHeight" value={s.mosaic.blockHeight} />
      <Output type="text" disabled={s.mosaic.loading} label="Duration" value={s.mosaic.duration} />
      <Output type="text" disabled={s.mosaic.loading} label="Owner" value={s.mosaic.owner} />
      <Output type="text" disabled={s.mosaic.loading} label="Supply" value={s.mosaic.supply} />
      <Output type="text" disabled={s.mosaic.loading} label="NamespaceIdHex" value={s.mosaic.namespaceIdHex} />
      <Output type="text" disabled={s.mosaic.loading} label="NamespaceIdUint" value={s.mosaic.namespaceIdUint} />
    </fieldset>
  </div>
);

const loadFromNode = (value: string, url: string) => {
  // let _value;
  // if (/^[a-z0-9‘_\-.]+:[a-z0-9‘_\-.]+$/.test(value)) {
  //  _value = value;
  // } else {
  //  _value = JSON.parse(value);
  // }
  const _value = (/^[a-z0-9‘_\-.]+:[a-z0-9‘_\-.]+$/.test(value)) ? value : JSON.parse(value);
  const mosaicId = new MosaicId(_value);
  const mosaicHttp = new MosaicHttp(url);
  const accountHttp = new AccountHttp(url);
  const namespaceHttp = new NamespaceHttp(url);
  const mosaicService = new MosaicService(accountHttp, mosaicHttp, namespaceHttp);
  return mosaicService.mosaicsView([mosaicId]);
};

export default {initialState, actions, view};
