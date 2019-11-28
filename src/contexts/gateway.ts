import { createContext } from "react"
import GATEWAY_LIST from "resources/gateway.json"
import { NetworkType } from "nem2-sdk"

export const gateways = GATEWAY_LIST

export const Context = createContext({
  urlList: GATEWAY_LIST,
  setUrlList: (values: string[]) => {},
  url: GATEWAY_LIST[0],
  setUrl: (value: string) => {},
  genHash: "",
  setGenHash: (value: string) => {},
  networkType: NetworkType.MIJIN_TEST,
  setNetworkType: (value: number) => {},
})
