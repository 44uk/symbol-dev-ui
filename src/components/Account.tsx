import { h } from "hyperapp";
import {
  address as libAddress,
  convert as libConvert,
} from "nem2-library";
import {
  AccountHttp, AccountInfo, Address,
  Listener, MosaicHttp, MosaicService, NamespaceHttp,
  NetworkType,
} from "nem2-sdk";
import Output from "./Output";
import Underconstruction from "./Underconstruction";

const CHANNELS = [
  "block",
  "confirmedAdded", "unconfirmedAdded", "unconfirmedRemoved", "status",
  "partialAdded", "partialRemoved", "cosignature",
];

interface IState {
  value?: string;
  loading: boolean;
  errorMessage?: string;
}

const initialState: IState = {
  loading: false,
};

interface IActions {
  onInputValue: ActionType<IState, IActions>;
  onSubmitValue: ActionType<IState, IActions>;
  setValue: ActionType<IState, IActions>;
  loadFromNode: ActionType<IState, IActions>;
  setAccount: ActionType<IState, IActions>;
  setLoading: ActionType<IState, IActions>;
  setLoaded: ActionType<IState, IActions>;
  setErrorMessage: ActionType<IState, IActions>;
  unsetErrorMessage: ActionType<IState, IActions>;
}

const actions = {
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
  setErrorMessage: (errorMessage: string) => ({ errorMessage }),
  unsetErrorMessage: () => ({ errorMessage: undefined }),
  loadFromNode: (url: string) => (s: IState, a: IActions) => {
    const value = s.value || "";
    a.setLoading();
    loadFromNode(value, url).subscribe(
      (account: AccountInfo) => {
        a.unsetErrorMessage();
        a.setAccount(account);
      },
      (err) => {
        console.error(err);
        a.setErrorMessage(err.message);
      },
      () => a.setLoaded(),
    );
  },
  setAccount: (account: AccountInfo) => reshapeData(account),
  setLoading: () => ({ loading: true }),
  setLoaded: () => ({ loading: false }),
  toggleSubscription: (ev: Event) => (s: State, a: any) => {
    const name = ev.target.name;
    const checked = ev.target.checked;
    // TODO: subscribe
    // subscribeChannel(channels, s.url);
    const newState = ({[name]: checked});
    console.log(newState);
    return newState;
  },
  startListening: ({value, url}) => (s: State, a: any) => {
    const address = Address.createFromRawAddress(s.address);
    subscribeChannel(address, url);
  },
};

const subscribeChannel = (address: Address, url: string) => {
  const wsUrl = url.replace(/^http/, "ws");
  const listener = new Listener(wsUrl, WebSocket);
  listener.open().then(() => {
    listener.unconfirmedAdded(address).subscribe((transaction) => {
      console.log(transaction);
    });
    listener.status(address).subscribe((transactionStatusError) => {
      console.log(transactionStatusError);
    });
    listener.cosignatureAdded(address).subscribe((transaction) => {
      console.log(transaction);
    });
    listener.confirmed(address).subscribe((transaction) => {
      console.log(transaction);
    });
    listener.aggregateBondedAdded(address).subscribe((transaction) => {
      console.log(transaction);
    });
  });
};

const reshapeData = (account: AccountInfo) => {
  const hexAddress = libConvert.uint8ToHex(libAddress.stringToAddress(
    account.address.plain(),
  ));
  const data = {
    address: account.address.pretty(),
    hexAddress,
    addressHeight: account.addressHeight.compact(),
    publicKey: account.publicKey,
    publicKeyHeight: account.publicKeyHeight.compact(),
    importance: account.importance.compact(),
    importanceHeight: account.importanceHeight.compact(),
    // accountType: account.accountType,
    // linkedAccountKey: account.linkedAccountKey,
  };
  return data;
//  if (accountData.mosaics.length !== 0) { // TODO: remove when api bug fixed
//      text += 'Mosaics' + '\n';
//      accountData.mosaics.map((mosaic: MosaicAmountView) => {
//          text += mosaic.fullName() + ':\t' + mosaic.relativeAmount() + '\n';
//      });
//  } else  if (accountInfo.mosaics.length !== 0) {
//      text += 'Mosaics' + '\n';
//      accountInfo.mosaics.map((mosaic: Mosaic) => {
//          text += mosaic.id.toHex() + ':\t' + mosaic.amount.compact().toFixed(2) + '\n';
//      });
//  }
};

const loadFromNode = (value: string, url: string) => {
  const address = /^[SMTN][0-9A-Z\-]{39,45}$/.test(value)
    ? Address.createFromRawAddress(value)
    : Address.createFromPublicKey(value, NetworkType.MIJIN_TEST)
  ;
  const accountHttp = new AccountHttp(url);
  const mosaicService = new MosaicService(
      accountHttp,
      new MosaicHttp(url),
      new NamespaceHttp(url),
  );

  // return mosaicService.mosaicsAmountViewFromAddress(address)
  //  .pipe(
  //    mergeMap((_) => _),
  //    toArray(),
  //  )
  // ;

  return accountHttp.getAccountInfo(address)
    // .pipe(
    //  mergeMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address)),
    //  // concatMap((accountInfo: AccountInfo) => {
    //  //  return mosaicService.mosaicsAmountViewFromAddress(address);
    //  // },
    //  // map((accountInfo: AccountInfo) => ({accountInfo, extra: 100}),
    //  // mergeMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address)),
    //  // concatMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address).pipe(
    //  //  map((mosaics: MosaicAmountView[]) => ({mosaics, info: accountInfo})),
    //  // )),
    //  // mergeMap((_) => _),
    //  // map((mosaic) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName())),
    //  // toArray(),
    // )
  ;
  // .flatMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address)
  //   .map((mosaics: MosaicAmountView[]) => ({mosaics, info: accountInfo})),
  // )
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: State, a: any) => (
  <div>
    { s.account.errorMessage &&
      <span class="toast">{s.account.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label>Address/PublicKey</label>
        <input type="text" name="addressOrPublicKey"
          autofocus
          value={s.account.value}
          oninput={a.account.onInputValue}
          onkeypress={(a.account.onSubmitValue)}
          placeholder="ex) Address or PublicKey"
          maxlength="64"
          data-url={url}
        />
        <p class="note"><small>Hit ENTER key to load from Node.</small></p>
      </div>
    </fieldset>
    <fieldset>
      <legend>Output</legend>
      <Output type="text" disabled={s.account.loading} label="Address" value={s.account.address} />
      <Output type="text" disabled={s.account.loading} label="HexAddress" value={s.account.hexAddress} />
      <Output type="text" disabled={s.account.loading} label="Height at" value={s.account.addressHeight} />
      <Output type="text" disabled={s.account.loading} label="PublicKey" value={s.account.publicKey} />
      <Output type="text" disabled={s.account.loading} label="Height at" value={s.account.publicKeyHeight} />
      <Output type="text" disabled={s.account.loading} label="Importance" value={s.account.importance} />
      <Output type="text" disabled={s.account.loading} label="Height at" value={s.account.importanceHeight} />
      { false && <Output type="text" disabled={s.account.loading} label="AccountType" value={s.account.accountType} /> }
      { false && <Output type="text" disabled={s.account.loading} label="linkedAccountKey" value={s.account.linkedAccountKey} /> }
    </fieldset>
    <fieldset>
      <legend>Listening</legend>
      <Underconstruction />
      { CHANNELS.map((channel) => (
      <label>
        <input type="checkbox" name={channel} checked={s.account[channel]} onchange={a.account.toggleSubscription} />
        <small>{channel}</small>
      </label>
      )) }
      <div class="input-group vertical">
        <textarea readonly
          rows="8"
        >{s.account.subscriptionLog}</textarea>
      </div>
      <button
        onclick={""}
        data-url={url}
      >Start Listening</button>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
