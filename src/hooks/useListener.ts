import { Listener, Address } from "nem2-sdk"
import { useState, useEffect } from "react"
import { Subscription } from "rxjs"
import YAML from "yaml"

export const Channels = {
  aggregateBondedAdded:   "aggregateBondedAdded",
  aggregateBondedRemoved: "aggregateBondedRemoved",
  confirmed: "confirmed",
  cosignatureAdded:   "cosignatureAdded",
  unconfirmedAdded:   "unconfirmedAdded",
  unconfirmedRemoved: "unconfirmedRemoved",
  status: "status"
} as const

export type ChannelName = keyof typeof Channels

export const useListener = (
  listener: Listener,
  _address: Address | null = null,
  channels: ChannelName[] = [],
  _simple = false
) => {
  const [address, setAddress] = useState(_address)
  const [simple, setSimple] = useState(_simple)
  const [log, setLog] = useState("")
  const [following, setFollowing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handler = () => {
    if(! address) return
    if(following === false) {
      listener.isOpen() && listener.close()
      return
    }
    if(channels.length === 0) return

    let subscriptions: {[key: string]: Subscription} = {}
    listener.open().then(() => {
      setLog(log => `[connection opened]\n${log}`)
      setLog(log => `[start listening] ${channels.join(",")}\n${log}`)

      if(channels.includes(Channels.aggregateBondedAdded)) {
        subscriptions[Channels.aggregateBondedAdded] = listener.aggregateBondedAdded(address)
          .subscribe(
            _ => setLog(log => `[aggregateBondedAdded]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.aggregateBondedRemoved)) {
        subscriptions[Channels.aggregateBondedRemoved] = listener.aggregateBondedRemoved(address)
          .subscribe(
            _ => setLog(log => `[aggregateBondedRemoved]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.confirmed)) {
        subscriptions[Channels.confirmed] = listener.confirmed(address)
          .subscribe(
            _ => setLog(log => `[confirmed]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.cosignatureAdded)) {
        subscriptions[Channels.cosignatureAdded] = listener.cosignatureAdded(address)
          .subscribe(
            _ => setLog(log => `[cosignatureAdded]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.unconfirmedAdded)) {
        subscriptions[Channels.unconfirmedAdded] = listener.unconfirmedAdded(address)
          .subscribe(
            _ => setLog(log => `[unconfirmedAdd]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.unconfirmedRemoved)) {
        subscriptions[Channels.unconfirmedRemoved] = listener.unconfirmedRemoved(address)
          .subscribe(
            _ => setLog(log => `[unconfirmedRemoved]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.status)) {
        subscriptions[Channels.status] = listener.status(address)
          .subscribe(
            _ => setLog(log + `[status]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${log}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
    })

    return () => {
      Object.keys(subscriptions).forEach(key => {
        subscriptions[key].unsubscribe()
        console.debug(`${key} has been unsubscribed.`)
      })

      if(listener.isOpen()) {
        listener.close()
        setLog(log => `[connection closed]\n${log}`)
      }
    }
  }

  useEffect(handler, [
    following,
    simple,
    channels,
    listener
  ])

  return {
    log, error,
    address, setAddress,
    following, setFollowing,
    simple, setSimple,
  }
}
