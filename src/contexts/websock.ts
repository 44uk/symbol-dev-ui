import { createContext } from "react"
import {
  Listener
} from "nem2-sdk"

interface IWebSockInstance {
  listener: Listener
}

export function createWebSockInstance(url: string): IWebSockInstance {
  const _url = url.replace(/^http/, "ws")
  if(! /^wss?:\/\//.test(_url)) {
    throw new Error(`Invalid HTTP URL Format: ${url}`)
  }
  const listener = new Listener(_url, WebSocket)
  return {
    listener
  }
}

export const WS_DEFAULT_URL = "ws://localhost:3000"

export const WebSockContext = createContext({
  url: WS_DEFAULT_URL,
  webSockInstance: createWebSockInstance(WS_DEFAULT_URL)
})
