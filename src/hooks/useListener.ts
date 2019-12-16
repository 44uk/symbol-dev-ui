import { Listener } from "nem2-sdk"
import { useState, useEffect, useCallback } from "react"
import { Subscription } from "rxjs"
import YAML from "yaml"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

import {
  createAddressFromIdentifier
} from "util/convert"

const [usePersistedState] = createPersistedState(persistedPaths.app)

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
  initialValue: string = "",
  initialChannels: ChannelName[] = [],
  initialSimple = false
) => {
  const [log, setLog] = useState("")
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.listener, initialValue)
  const [channels, setChannels] = usePersistedState(persistedPaths.listener + "/channels", initialChannels)
  const [simple, setSimple] = useState(initialSimple)
  const [following, setFollowing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const toggleChannel = useCallback((name: ChannelName) => {
    const tmpSet = new Set(channels)
    if(channels.includes(name)) {
      tmpSet.delete(name)
    } else {
      tmpSet.add(name)
    }
    setChannels(Array.from(tmpSet))
  }, [channels, setChannels])

  const handler = useCallback(() => {
    if(channels.length === 0) return
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier)
    if(! address) return
    if(following === false) {
      listener.isOpen() && listener.close()
      return
    }

    let subscriptions: {[key: string]: Subscription} = {}
    listener.open().then(() => {
      setLog(prev => `[connection opened]\n${prev}`)
      setLog(prev => `[start listening] ${channels.join(",")}\n${prev}`)

      if(channels.includes(Channels.aggregateBondedAdded)) {
        subscriptions[Channels.aggregateBondedAdded] = listener.aggregateBondedAdded(address)
          .subscribe(
            _ => setLog(prev => `[aggregateBondedAdded]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.aggregateBondedRemoved)) {
        subscriptions[Channels.aggregateBondedRemoved] = listener.aggregateBondedRemoved(address)
          .subscribe(
            _ => setLog(prev => `[aggregateBondedRemoved]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.confirmed)) {
        subscriptions[Channels.confirmed] = listener.confirmed(address)
          .subscribe(
            _ => setLog(prev => `[confirmed]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.cosignatureAdded)) {
        subscriptions[Channels.cosignatureAdded] = listener.cosignatureAdded(address)
          .subscribe(
            _ => setLog(prev => `[cosignatureAdded]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.unconfirmedAdded)) {
        subscriptions[Channels.unconfirmedAdded] = listener.unconfirmedAdded(address)
          .subscribe(
            _ => setLog(prev => `[unconfirmedAdd]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.unconfirmedRemoved)) {
        subscriptions[Channels.unconfirmedRemoved] = listener.unconfirmedRemoved(address)
          .subscribe(
            _ => setLog(prev => `[unconfirmedRemoved]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
            (error) => setError(error),
            () => setError(null)
          )
      }
      if(channels.includes(Channels.status)) {
        subscriptions[Channels.status] = listener.status(address)
          .subscribe(
            _ => setLog(prev => `[status]` + (simple ? "" : `\n${"-".repeat(64)}\n` + YAML.stringify(_)) + `\n${prev}`),
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
        setLog(prev => `[connection closed]\n${prev}`)
      }
    }
  }, [listener, identifier, channels, following, simple])

  useEffect(handler, [
    identifier,
    channels,
    following,
    simple,
  ])

  return {
    log, error,
    identifier, setIdentifier,
    channels, setChannels, toggleChannel,
    following, setFollowing,
    simple, setSimple,
  }
}
