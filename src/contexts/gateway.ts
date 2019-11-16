import { createContext } from "react"
import GATEWAY_LIST from 'resources/gateway.json'

export const gateways = GATEWAY_LIST

export const Context = createContext({
  url: GATEWAY_LIST[0],
  urlList: GATEWAY_LIST,
  changeUrl: (url: string) => {},
  setUrlList: (urls: string[]) => {},
})
