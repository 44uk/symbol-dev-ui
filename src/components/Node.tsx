import { h } from "hyperapp";
import {
  Listener,
  NetworkHttp,
  UInt64,
} from "nem2-sdk";
import {
  Subscription, timer,
} from "rxjs";
import {
  ajax,
} from "rxjs/ajax";
import {
  switchMap,
} from "rxjs/operators";
import Output from "./Output";

interface IState {
  log?: string;
  loading: boolean;
  monitoring: boolean;
  listener?: Listener;
  sendTimestamp?: number;
  receiveTimestamp?: number;
  polling: boolean;
  handler?: Subscription;
}

const initialState: IState = {
  loading: false,
  monitoring: false,
  polling: false,
};

interface IActions {
  startMonitoring: ActionType<IState, IActions>;
  stopMonitoring: ActionType<IState, IActions>;
  setListener: ActionType<IState, IActions>;
  unsetListener: ActionType<IState, IActions>;
  setMonitoring: ActionType<IState, IActions>;
  setUnmonitoring: ActionType<IState, IActions>;
  appendLog: ActionType<IState, IActions>;
  clearLog: ActionType<IState, IActions>;
  startPolling: ActionType<IState, IActions>;
  stopPolling: ActionType<IState, IActions>;
  setNodeTime: ActionType<IState, IActions>;
}

interface CommunicationTimestamps {
  sendTimestamp: number[];
  receiveTimestamp: number[];
}

const actions: IActions = {
  startMonitoring: (ev: Event) => (s: IState, a: IActions) => {
    const url = ev.target ? ev.target.dataset.url : "";
    const wsUrl = url.replace(/^http/, "ws");
    const listener = new Listener(wsUrl, WebSocket);
    a.setListener(listener);
    listener.open().then(() => {
      a.setMonitoring();
      listener.newBlock().subscribe((block) => {
        console.log(block);
        a.appendLog(JSON.stringify(block));
      });
    });
  },
  stopMonitoring: (ev: Event) => (s: IState, a: IActions) => {
    if (s.listener == null) { return; }
    s.listener.close();
    a.unsetListener();
    a.setUnmonitoring();
    console.log("connection closed.");
  },
  setListener: (listener: Listener) => ({ listener }),
  unsetListener: () => ({ listener: undefined }),
  setMonitoring: () => ({ monitoring: true }),
  setUnmonitoring: () => ({ monitoring: false }),
  appendLog: (line: string) => (s: IState, a: IActions) => ({
    ...s,
    log: s.log ? `${s.log}\n${line}` : line,
  }),
  clearLog: () => ({ log: "" }),
  startPolling: (ev: Event) => (s: IState, a: IActions) => {
    const url = ev.target ? ev.target.dataset.url : "";
    const handler = timer(0, 1000).pipe(
      switchMap((_) => loadFromNode(url)),
    ).subscribe(
      (data: any) => a.setNodeTime(data.communicationTimestamps),
    );
    console.log("Start polling.");
    return { ...s, handler, polling: true };
  },
  stopPolling: (ev: Event) => (s: IState, a: IActions) => {
    if (s.handler == null) { return; }
    s.handler.unsubscribe();
    console.log("Stop polling.");
    return { ...s, handler: undefined, polling: false };
  },
  setNodeTime: ({sendTimestamp, receiveTimestamp}: CommunicationTimestamps) => {
    return {
      sendTimestamp: (new UInt64(sendTimestamp)).compact(),
      receiveTimestamp: (new UInt64(receiveTimestamp)).compact(),
    };
  },
};

const loadFromNode = (url: string) => ajax.getJSON(`${url}/node/time`);

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: State, a: any) => {
  return (
  <div
    ondestroy={() => {
      a.node.stopMonitoring();
      a.node.stopPolling();
    }}
  >
    <fieldset>
      <legend>Node Info</legend>
      <Output type="text" label="Send Timestamp" value={s.node.sendTimestamp} />
      <Output type="text" label="Receive Timestamp" value={s.node.receiveTimestamp} />
      <p class="note"><small>This only works later *Bison*.</small></p>
      <div class="input-group vertical">
      </div>
    </fieldset>

    <fieldset>
      <legend>Node Time</legend>
      <Output type="text" label="Send Timestamp" value={s.node.sendTimestamp} />
      <Output type="text" label="Receive Timestamp" value={s.node.receiveTimestamp} />
      <p class="note"><small>This only works later *Bison*.</small></p>
      {
        s.node.polling
        ? <button onclick={a.node.stopPolling}
          >Stop Polling</button>
        : <button onclick={a.node.startPolling} data-url={url}
          >Start Polling</button>
      }
    </fieldset>

    <fieldset>
      <legend>Connect to</legend>
      <Output type="text" label="Node URL" value={url} />
      {
        s.node.monitoring
        ? <button onclick={a.node.stopMonitoring}
          >Stop Monitoring</button>
        : <button onclick={a.node.startMonitoring} data-url={url}
          >Start Monitoring</button>
      }
      <button onclick={a.node.clearLog}
      >Clear log</button>
    </fieldset>

    <fieldset>
      <legend>Monitor Log</legend>
      <div class="input-group vertical">
        <textarea readonly
          rows="16"
        >{s.node.log}</textarea>
      </div>
    </fieldset>
  </div >
  );
};

export default {initialState, actions, view};
