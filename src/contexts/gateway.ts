import { createContext } from "react"
import gateways from "resources/gateway.json"
import { NetworkType } from "nem2-sdk"

export const GATEWAY_LIST = gateways

export const GatewayContext = createContext({
  urlList: GATEWAY_LIST,
  setUrlList: (values: string[]) => {},
  url: GATEWAY_LIST[0],
  setUrl: (value: string) => {},
  genHash: "",
  setGenHash: (value: string) => {},
  networkType: NetworkType.MIJIN_TEST,
  setNetworkType: (value: number) => {},
})
