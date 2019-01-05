/**
 * Quoted from:
 * https://qiita.com/tetradice/items/2a92219264c73a50ee99#%E5%BA%83%E3%81%8F%E7%9F%A5%E3%82%89%E3%82%8C%E3%81%9F%E6%96%B9%E6%B3%95
 */
import { ActionResult } from "hyperapp";

type Act<State, Actions, Params = void> = (
  params?: Params,
) =>
  | ((state: State, actions: Actions) => ActionResult<State>)
  | ActionResult<State>;

export default Act;
