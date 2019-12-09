import React, { useContext, useCallback } from "react"

import {
  WebSockContext
} from "contexts"

import {
  ChannelName,
  Channels,
  useListener
} from "hooks"
import { TextOutput } from "components"

export const Monitor: React.FC = () => {
  const webSockContext = useContext(WebSockContext)

  const { listener } = webSockContext.webSockInstance
  const {
    log,
    identifier, setIdentifier,
    channels, toggleChannel,
    simple, setSimple,
    following, setFollowing,
    error
  } = useListener(listener)

  const changeChannel = useCallback((name: ChannelName) => {
    toggleChannel(name)
  }, [toggleChannel])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Address or PublicKey</label>
      <input type="text" name="addressOrPublicKey"
        autoFocus
        disabled={following}
        value={identifier}
        onChange={_ => setIdentifier(_.currentTarget.value)}
        placeholder="ex) Address or PublicKey"
        maxLength={64}
      />
    </div>

    <div className="input-group">
      { Object.values(Channels).map(key => (
        <label key={key}><input type="checkbox" name={key}
          disabled={following}
          checked={channels.includes(key)}
          onChange={() => changeChannel(key)}
        /><small>{ key }</small></label>
      )) }
    </div>

    <div className="input-group">
      <label><input type="checkbox"
        disabled={following}
        checked={simple}
        onChange={_ => setSimple(!simple)}
      /><small>Simplify</small></label>
      <button className={following ? "secondary" : "primary"}
        disabled={channels.length === 0 || ! identifier}
        onClick={() => setFollowing(!following)}
      >{ following ? "Stop" : "Start" }</button>
    </div>
  </fieldset>

  <TextOutput
    label="Log"
    value={log}
    error={error}
  ></TextOutput>
</div>
)

  /*
  const [selectedChannels, setSelectedChannels] = usePersistedState(persistedPaths.account + "/channels", [] as ChannelName[])
  const { listener } = webSockContext.webSockInstance
  const {
    log,
    setAddress,
    following, setFollowing,
    simple, setSimple
  } = useListener(
    listener,
    Address
    selectedChannels,
  )

  const clsIsListening = useMemo(() => (clsx(
    following ? "secondary" : "primary"
  )), [following])



  return (
<div>

  <div className="input-group">
    <label><input type="checkbox"
      disabled={following}
      checked={simple}
      onChange={_ => setSimple(!simple)}
    /><small>Simplify</small></label>
    <button className={clsIsListening}
      disabled={selectedChannels.length === 0}
      onClick={() => setFollowing(!following)}
    >{ following ? "Stop" : "Start" }</button>
  </div>

  <TextOutput
    label="Monitor"
    value={log}
    rows={16}
  ></TextOutput>
</div>
  )
  */
}

export default Monitor
