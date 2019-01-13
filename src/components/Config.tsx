import { h } from "hyperapp";

interface IState {
  errorMessage?: string;
  elNodes?: HTMLElement;
  gActions?: any;
}

const initialState: IState = {
};

interface IActions {
  setElNodes: ActionType<IState, IActions>;
  setGlobalActions: ActionType<IState, IActions>;
  onSaveNodes: ActionType<IState, IActions>;
}

const actions: IActions = {
  setElNodes: (elNodes: HTMLElement) => {
    return ({elNodes});
  },
  setGlobalActions: (gActions: any) => ({ gActions }),
  onSaveNodes: (ev: Event) => (s: any, a: any) => {
    const nodes = reshapeNodes(s.elNodes.value);
    s.gActions.setNodes(nodes);
    console.log(nodes);
  },
};

const reshapeNodes = (text: string) => {
  const nodes = text.split("\n")
    .filter((line) => /https?:\/\/.+?,.+/.test(line))
    .map((line) => {
      const parts = line.split(",");
      return {value: parts[0], name: parts[1]};
    })
  ;
  return nodes;
};

const oncreate = (gState: any, gActions: any) => (el: HTMLElement) => {
  const elNodes = el.querySelector("textarea[name='nodes']");
  if (elNodes) { gActions.config.setElNodes(elNodes); }
  gActions.config.setGlobalActions(gActions);
};

const view = () => (s: any, a: any) => (
  <div
    oncreate={oncreate(s, a)}
  >
    { s.config.errorMessage &&
      <span class="toast">{s.config.errorMessage}</span> }

    <fieldset>
      <legend>Localstorage</legend>
      <div class="input-group vertical">
        <button
          class="primary"
          onclick={a.resetState}
        >Clear</button>
        <p class="note"><small>Clear stored data.</small></p>
      </div>
    </fieldset>

    <fieldset>
      <legend>Nodes</legend>
      <div class="input-group vertical">
        <textarea name="nodes" rows="8">{s.nodes.map((n: any) => `${n.value},${n.name}\n`)}</textarea>
        <button class="primary"
          onclick={a.config.onSaveNodes}
        >Save</button>
        <p class="note"><small>Put lines like "url,name". ex) http://localhost:3000,localhost</small></p>
      </div>
    </fieldset>

  </div>
);

export default {initialState, actions, view};
