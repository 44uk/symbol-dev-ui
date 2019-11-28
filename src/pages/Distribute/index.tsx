import React, { useState, useEffect, useContext } from "react"

import {
  Account, NetworkType, Address, PublicAccount, TransferTransaction, Deadline, NetworkCurrencyMosaic, EmptyMessage, UInt64, AggregateTransaction, SignedTransaction
} from "nem2-sdk"

import { Context as GatewayContext } from "contexts/gateway"

function filterValidIdentifier(lines: string) {
  const filtered = lines
    .split("\n")
    .map(_ => _.trim())
    .filter(_ => _.length >= 40)
  console.debug(filtered)
  return filtered
}

function buildTransaction(signer: Account, recipients: string[], aggregated = false) {
  const addresses = recipients.map(recipient => {
    let address: Address
    if(/^[SMTN][0-9A-Z]{39}/.test(recipient.replace("-", ""))) {
      address = Address.createFromRawAddress(recipient)
    } else if(/[0-9A-F]{64}/.test(recipient.replace("-", ""))) {
      // TODO:
      const account = PublicAccount.createFromPublicKey(recipient, signer.networkType)
      address = account.address
    } else {
      throw new Error(`Unexpected Recipient Identifier: ${recipient}`)
    }
    return address
  })

  const amount = 1
  const message = EmptyMessage

  const txes = addresses.map(a => (
    TransferTransaction.create(
      Deadline.create(),
      a,
      [NetworkCurrencyMosaic.createRelative(amount)],
      message,
      signer.networkType,
      UInt64.fromUint(50000)
    )
  ))

  let txesToAnnounce: SignedTransaction[]
  if(aggregated) {
    const aggTx = AggregateTransaction.createComplete(
      Deadline.create(),
      txes.map(t => t.toAggregate(signer.publicAccount)),
      signer.networkType,
      [],
      UInt64.fromUint(50000)
    )
    const signedTx = signer.sign(aggTx, "")
    txesToAnnounce = [ signedTx ]
  } else {
    txesToAnnounce = txes.map(tx => signer.sign(tx, ""))
  }
  return txesToAnnounce
}

export const Distribute: React.FC = () => {
  const gwContext = useContext(GatewayContext)

  const [distributerKey, setDistributerKey] = useState("")
  const [distributer, setDistributer] = useState<Account | null>(null)
  const [amount, setAmount] = useState("")
  const [recipients, setRecipients] = useState("")
  const [aggregation, setAggregation] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const account = Account.createFromPrivateKey(distributerKey, gwContext.networkType)
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
      <label htmlFor="aggregation">Aggregate"em</label>
      <button
        onClick={() => {}}
        disabled={! isReady}
      >Distribute!</button>
    </div>
  </fieldset>
</div>
  )
}

export default Distribute
