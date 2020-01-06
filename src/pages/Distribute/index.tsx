import React, { useContext, useCallback } from "react"

import {
  useDistribution
} from "hooks"

import {
  GatewayContext,
  HttpContext
} from "contexts"

export const Distribute: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const {
    transactionHttp
  } = httpContext.httpInstance
  const {
    privateKey, setPrivateKey,
    mosaicHex, setMosaicHex,
    amount, setAmount,
    recipients, setRecipients,
    aggregation, setAggregation,
    distributer, isReady, announce,
    loading
  } = useDistribution({ transactionHttp }, gwContext.networkType, gwContext.genHash)

  const distribute = useCallback(() => {
    announce()
  }, [announce])

  return (
<div>
  <fieldset>
    <legend>Distribute NetworkCurrency</legend>
    <div className="input-group vertical">
      <label>Distributer PrivateKey</label>
      <input autoFocus
        pattern="[a-fA-F\d]{64}"
        value={privateKey}
        onChange={_ => setPrivateKey(_.target.value)}
        placeholder="Input Raw PrivateKey"
        maxLength={64}
      />
      <input readOnly value={distributer ? distributer.address.pretty() : ""} />
      <input readOnly value={distributer ? distributer.publicKey : ""} />
    </div>

    <div className="input-group vertical">
      <label>Mosaic Hex</label>
      <input name="mosaicHex"
        value={mosaicHex}
        onChange={_ => setMosaicHex(_.target.value)}
        placeholder="ex) 46BE9BC0626F9B1A"
      />
    </div>
    <div className="input-group vertical">
      <label>Amount (Absolute)</label>
      <input type="number" name="amount"
        value={amount}
        onChange={_ => setAmount(_.target.value)}
        placeholder="ex) 1000000 (1 NetworkCurrency, absolute value)"
      />
    </div>
    <div className="input-group vertical">
      <label>Recipient Addresses or PublicKeys</label>
      <textarea
        value={recipients}
        rows={8}
        onChange={_ => setRecipients(_.target.value)}
      ></textarea>
    </div>
    <div className="input-group">
      <input type="checkbox" id="aggregation"
        onChange={() => setAggregation(!aggregation)}
        checked={aggregation}
      />
      <label htmlFor="aggregation">Aggregate'em</label>
      <button className="primary"
        onClick={distribute}
        disabled={! isReady || loading}
      >Distribute!</button>
    </div>
  </fieldset>
</div>
  )
}

export default Distribute
