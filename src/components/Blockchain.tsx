import { h } from "hyperapp";
import {
  BlockchainHttp,
  BlockInfo,
  QueryParams,
  Transaction,
} from "nem2-sdk";
import {
  forkJoin,
} from "rxjs";
import {
  map,
  tap,
} from "rxjs/operators";
import Output from "./Output";

interface IState {
  value?: string;
  loading: boolean;
  errorMessage?: string;
  block?: BlockInfo;
  transactions?: Transaction[];
}

const initialState: IState = {
  loading: false,
  transactions: [],
};

interface IActions {
  onInputValue: ActionType<IState, IActions>;
  onSubmitValue: ActionType<IState, IActions>;
  setValue: ActionType<IState, IActions>;
  loadFromNode: ActionType<IState, IActions>;
  setData: ActionType<IState, IActions>;
  setLoading: ActionType<IState, IActions>;
  setLoaded: ActionType<IState, IActions>;
  setErrorMessage: ActionType<IState, IActions>;
  unsetErrorMessage: ActionType<IState, IActions>;
}

interface BlockInfoWithTransactions {
  block: BlockInfo;
  transactions: Transaction[];
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
  setValue: (value: number) => ({ value }),
  setErrorMessage: (errorMessage: string) => ({ errorMessage }),
  unsetErrorMessage: () => ({ errorMessage: undefined }),
  loadFromNode: (url: string) => (s: IState, a: IActions) => {
    const value = s.value || "";
    a.setLoading();
    loadFromNode(value, url).subscribe(
      (blockWithTransactions: BlockInfoWithTransactions) => {
        a.unsetErrorMessage();
        a.setData(blockWithTransactions);
      },
      (err) => {
        console.error(err);
        a.setErrorMessage(err.message);
      },
      () => a.setLoaded(),
    );
  },
  setData: (data: BlockInfoWithTransactions) => reshapeData(data),
  setLoading: () => ({ loading: true }),
  setLoaded: () => ({ loading: false }),
};

const loadFromNode = (value: string, url: string) => {
  const blockchainHttp = new BlockchainHttp(url);
  const blockHeight = parseInt(value);
  // https://nemtech.github.io/api/endpoints.html#tag/Blockchain-routes
  // TODO: pagiable
  const qp = new QueryParams(100);
  return forkJoin([
    blockchainHttp.getBlockByHeight(blockHeight),
    blockchainHttp.getBlockTransactions(blockHeight, qp),
  ]).pipe(
    map((data) => ({ block: data[0], transactions: data[1] })),
    tap((data) => console.log(data)),
  );
};

const reshapeData = (data: BlockInfoWithTransactions) => {
  return data;
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: any, a: any) => (
  <div>
    { s.block.errorMessage &&
      <span class="toast">{s.block.errorMessage}</span> }

    <fieldset>
      <legend>Input</legend>
      <div class="input-group vertical">
        <label>Block Height</label>
        <input type="text" name="blockHeight"
          autofocus
          value={s.block.value}
          oninput={a.block.onInputValue}
          onkeypress={(a.block.onSubmitValue)}
          placeholder="ex) number of block height"
          data-url={url}
        />
        <p class="note"><small>Hit ENTER key to load from Node.</small></p>
      </div>
    </fieldset>

    <fieldset>
      <legend>BlockInfo</legend>
      <pre>{ JSON.stringify(s.block.block, null, 2) }</pre>
    </fieldset>

    <fieldset>
      <legend>Transactions</legend>
      <Output value={s.block.transactions && s.block.transactions.length} label="Number of Transactions" />
      <pre>{ JSON.stringify(s.block.transactions, null, 2) }</pre>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
