import { createContext } from "react"
import {
  Listener
} from "nem2-sdk"

interface IWebSockInstance {
  listener: Listener
}

export function createWebSockInstance(url: string): IWebSockInstance {
  if(! /^https?:\/\//.test(url)) {
    throw new Error(`Invalid URL Format: ${url}`)
  }
  const listener = new Listener(url.replace(/^http/, "ws"), WebSocket)

  return {
    listener
  }
}

export const DEFAULT_URL = "http://localhost:3000"

export const Context = createContext({
  url: DEFAULT_URL,
  webSockInstance: createWebSockInstance(DEFAULT_URL)
})
