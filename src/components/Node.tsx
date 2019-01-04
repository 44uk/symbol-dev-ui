import { h } from "hyperapp";
import {
  Listener,
  NetworkHttp,
} from "nem2-sdk";
import Output from "./Output";

interface IState {
  log?: string;
  loading: boolean;
  monitoring: boolean;
  listener?: Listener;
}

const initialState: IState = {
  loading: false,
  monitoring: false,
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
  unsetListener: (listener: Listener) => ({ listener: undefined }),
  setMonitoring: () => ({ monitoring: true }),
  setUnmonitoring: () => ({ monitoring: false }),
  appendLog: (line: string) => (s: IState, a: IActions) => ({
    ...s,
    log: s.log ? `${s.log}\n${line}` : line,
  }),
  clearLog: () => ({ log: "" }),
};

const loadFromNode = (value: string, url: string) => {
  const networkHttp = new NetworkHttp(url);
  networkHttp.getNetworkType();
  // networkHttp.getNetworkType().subscribe((res) => {
  //     if (res !== networkType) {
  //         console.log('Network provided and node network don\'t match');
  //     } else {
  //         const profile = this.profileService.createNewProfile(account,
  //             url as string,
  //             profileName);
  //         console.log(chalk.green('\nProfile stored correctly\n') + profile.toString());
  //     }
  // }, (err) => {
  //     let error = '';
  //     error += chalk.red('Error');
  //     error += ' Provide a valid NEM2 Node URL. Example: http://localhost:3000';
  //     console.log(error);
  // });
};

interface Props {
  url: string;
}

const view = ({url}: Props) => (s: State, a: any) => {
  return (
  <div
    ondestroy={() => a.stopMonitoring()}
  >
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
  </div>
); };

export default {initialState, actions, view};
