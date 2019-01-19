import { h } from "hyperapp";
import {
  Account,
  Address,
  AggregateTransaction,
  Deadline,
  EmptyMessage,
  Listener,
  NetworkType,
  PublicAccount,
  SignedTransaction,
  TransactionHttp,
  TransferTransaction,
  XEM,
} from "nem2-sdk";
import Output from "./Output";

interface IState {
  networkType: number;
  privateKey?: string;
  amount?: number;
  recipients?: string;
  aggregated: boolean;
  preparing: boolean;
  message?: string;
}

const initialState: IState = {
  networkType: NetworkType.MIJIN_TEST,
  aggregated: true,
  preparing: false,
};

interface IAction {
  onInputPrivateKey: ActionType<IState, IAction>;
  onToggleAggregated: ActionType<IState, IAction>;
  onInputAmount: ActionType<IState, IAction>;
  onInputRecipients: ActionType<IState, IAction>;
  onClickSend: ActionType<IState, IAction>;
  setNetworkType: ActionType<IState, IAction>;
  setPrivateKey: ActionType<IState, IAction>;
  setAmount: ActionType<IState, IAction>;
  setRecipients: ActionType<IState, IAction>;
  setAggregated: ActionType<IState, IAction>;
  sendToRecipients: ActionType<IState, IAction>;
  setMessage: ActionType<IState, IActions>;
  unsetMessage: ActionType<IState, IActions>;
}

const actions: IAction = {
  onInputPrivateKey: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return a.setPrivateKey(value);
  },
  onToggleAggregated: (ev: Event) => (s: IState, a: IAction) => {
    const checked = ev.target ? ev.target.checked : true;
    return a.setAggregated(checked);
  },
  onInputAmount: (ev: Event) => (s: IState, a: IAction) => {
    const value = parseInt(ev.target.value) || undefined;
    return a.setAmount(value);
  },
  onInputRecipients: (ev: Event) => (s: IState, a: IAction) => {
    const value = ev.target ? ev.target.value : "";
    return a.setRecipients(value);
  },
  onClickSend: (ev: Event) => (s: IState, a: IAction) => {
    const url = ev.target ? ev.target.dataset.url : "";
    a.sendToRecipients(url);
  },
  setNetworkType: (networkType: number) => ({ networkType }),
  setPrivateKey: (privateKey: string) => (s: IState) => ({
    privateKey,
    address: Account.createFromPrivateKey(privateKey, s.networkType).address.plain(),
  }),
  setAmount: (amount: number) => ({ amount }),
  setRecipients: (recipients: string) => ({ recipients }),
  setAggregated: (aggregated: boolean) => ({ aggregated }),
  // setNetworkType: (network: number) => ({ network }),
  sendToRecipients: (url: string) => (s: IState, a: IAction) => {
    const privateKey = s.privateKey || "";
    const account = Account.createFromPrivateKey(privateKey, s.networkType);
    const amount = XEM.createRelative(s.amount || 0);
    const recipients = reshapeRecipients(s.recipients || "");
    const txHttp = new TransactionHttp(url);
    let txes: any[]; // : TransferTransaction[] | AggregateTransaction[] = [];
    if (s.aggregated) {
      const preTxes = prepareTransferTransactions(amount, recipients, s.networkType);
      txes = [prepareAggregateTransaction(preTxes, account.publicAccount)];
    } else {
      txes = prepareTransferTransactions(amount, recipients, s.networkType);
    }
    const signedTxes = txes.map((tx) => account.sign(tx));
    signedTxes.forEach((signedTx: SignedTransaction) => {
      txHttp.announce(signedTx).subscribe(
        (data: any) => console.log(data),
      );
    });

    const wsUrl = url.replace(/^http/, "ws");
    const listener = new Listener(wsUrl, WebSocket);
    listener.open().then(() => {
      listener.confirmed(account.address).subscribe(
        (data) => {
          a.setMessage("The transaction become confirmed!");
          setTimeout(a.unsetMessage, 3000);
          console.log("confirmed", data);
          listener.close();
        },
      );
      listener.unconfirmedAdded(account.address).subscribe(
        (data) => {
          console.log("unconfirmedAdded", data);
          a.setMessage("The transaction become unconfirmed.");
        },
      );
    });
  },
  setMessage: (message: string) => ({ message }),
  unsetMessage: () => ({ message: undefined }),
};

const reshapeRecipients = (text: string) => {
  const recipients = text.split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[SMTN][0-9A-Z\-]{39,45}$/.test(line))
  ;
  return recipients;
};

const prepareTransferTransactions = (amount: XEM, recipients: string[], networkType: number) => {
  return recipients.map((r: string) => {
    const address = Address.createFromRawAddress(r);
    return TransferTransaction.create(
      Deadline.create(),
      address,
      [amount],
      EmptyMessage,
      networkType,
    );
  });
};

const prepareAggregateTransaction = (txes: TransferTransaction[], publicAccount: PublicAccount) => {
  return  AggregateTransaction.createComplete(
    Deadline.create(),
    txes.map((tx: TransferTransaction) => tx.toAggregate(publicAccount)),
    NetworkType.MIJIN_TEST,
    [],
  );
};

interface Props {
  url: string;
}

export const view = ({url}: Props) => (s: any, a: any) => (
  <div>
    { s.faucet.message &&
      <span class="toast">{s.faucet.message}</span> }

    <fieldset>
      <legend>Distribute nem:xem</legend>
      <div class="input-group vertical">
        <label>Distributer PrivateKey</label>
        <input type="text" name="privateKey"
          autofocus
          pattern="[a-fA-F\d]+"
          value={s.faucet.privateKey}
          oninput={a.faucet.onInputPrivateKey}
          placeholder=""
          maxlength="64"
        />
      </div>
      <Output type="text" label="Distributer Address" value={s.faucet.address} />

      <div class="input-group vertical">
        <label>Amount</label>
        <input type="number" name="amount"
          value={s.faucet.amount}
          onchange={a.faucet.onInputAmount}
          placeholder="ex) 1 (1 nem:xem, input relative value)"
        />
      </div>
      <div class="input-group vertical">
        <label>Recipients</label>
        <textarea
          rows="8"
          oninput={a.faucet.onInputRecipients}
        >{s.faucet.recipients}</textarea>
      </div>
      <div class="input-group">
        <input type="checkbox" id="aggregated"
          onchange={a.faucet.onToggleAggregated}
          checked={s.faucet.aggregated}
        />
        <label for="aggregated">Aggregated</label>
        <button
          onclick={a.faucet.onClickSend}
          disabled={s.faucet.preparing}
          data-url={url}
        >Send!</button>
      </div>
    </fieldset>
  </div>
);

export default {initialState, actions, view};
