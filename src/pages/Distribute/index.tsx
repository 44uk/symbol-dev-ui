import React, { useState, useEffect } from 'react';

import {
  Account, NetworkType
} from "nem2-sdk"

function filterValidIdentifier(lines: string) {
  const filtered = lines
    .split("\n")
    .map(_ => _.trim())
    .filter(_ => _.length >= 40)
  console.debug(filtered)
  return filtered
}

export const Distribute: React.FC = () => {
  const [distributerKey, setDistributerKey] = useState("")
  const [distributer, setDistributer] = useState<Account | null>(null)
  const [amount, setAmount] = useState("")
  const [recipients, setRecipients] = useState("")
  const [aggregation, setAggregation] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      // TODO:
      const account = Account.createFromPrivateKey(distributerKey, NetworkType.MIJIN_TEST)
      setDistributer(account)
    } catch(error) {
      setDistributer(null)
      return
    }
  }, [distributerKey])

  useEffect(() => {
    setIsReady(false)
    if (distributer === null) return
    if (! /^\d{1,9}\.?\d{0,6}$/.test(amount)) return
    if (recipients.length === 0) return
    setIsReady(true)
  }, [distributer, amount, recipients])

  return (
<div>
  <fieldset>
    <legend>Distribute NetworkCurrency</legend>
    <div className="input-group vertical">
      <label>Distributer PrivateKey</label>
      <input autoFocus
        pattern="[a-fA-F\d]{64}"
        value={distributerKey}
        onChange={_ => setDistributerKey(_.target.value)}
        placeholder="Input Raw PrivateKey"
        maxLength={64}
      />
      <input readOnly value={distributer ? distributer.address.pretty() : ""} />
      <input readOnly value={distributer ? distributer.publicKey : ""} />
    </div>

    <div className="input-group vertical">
      <label>Amount (Relative)</label>
      <input type="number" name="amount"
        value={amount}
        onChange={_ => setAmount(_.target.value)}
        placeholder="ex) 1 (1 NetworkCurrency, relative value)"
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
      <button
        onClick={() => {}}
        disabled={! isReady}
      >Distribute!</button>
    </div>
  </fieldset>
</div>
  );
}

export default Distribute;
