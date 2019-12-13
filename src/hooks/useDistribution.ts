import { useState, useEffect, useCallback, useMemo } from "react"
import { Mosaic, TransactionHttp, Address, Account, PublicAccount, EmptyMessage, UInt64, TransferTransaction, Deadline, AggregateTransaction, MosaicId, NetworkType } from "nem2-sdk"
import { from } from "rxjs"
import { mergeMap } from "rxjs/operators"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

interface IHttpInstance {
  transactionHttp: TransactionHttp
}

function filterValidIdentifier(lines: string) {
  const filtered = lines
    .split("\n")
    .map(_ => _.trim())
    .filter(_ => _.length >= 40)
  return filtered
}

export const useDistribution = (httpInstance: IHttpInstance, networkType: NetworkType, genHash: string) => {
  const [privateKey, setPrivateKey] = usePersistedState(persistedPaths.distribute + "/privateKey", "")
  const [mosaicHex, setMosaicHex] = usePersistedState(persistedPaths.distribute + "/mosaicHex", "")
  const [amount, setAmount] = usePersistedState(persistedPaths.distribute + "/amount", "")
  const [recipients, setRecipients] = usePersistedState(persistedPaths.distribute + "/recipients", "")
  const [aggregation, setAggregation] = usePersistedState(persistedPaths.distribute + "/aggregation", false)

  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { transactionHttp } = httpInstance

  const distributer = useMemo(() => {
    if(! (privateKey && /[a-fA-F0-9]{64}/.test(privateKey))) return null
    try {
      return Account.createFromPrivateKey(privateKey, networkType)
    } catch(_) {
      return null
    }
  }, [privateKey, networkType])

  const mosaicId = useMemo(() => {
    if (! (mosaicHex && /[a-fA-F0-9]{16}/.test(mosaicHex))) return null
    return new MosaicId(mosaicHex)
  }, [mosaicHex])

  const recipientAddresses= useMemo(() => {
    const validRecipients = filterValidIdentifier(recipients)
    return validRecipients.map(recipient => {
      let address: Address
      if(/^[SMTN][2-7a-zA-Z]{39}$/.test(recipient.replace(/-/g, ""))) {
        address = Address.createFromRawAddress(recipient)
      } else if(/[0-9a-fA-F]{64}/.test(recipient)) {
        const account = PublicAccount.createFromPublicKey(recipient, networkType)
        address = account.address
      } else {
        throw new Error(`Unexpected Recipient Identifier: ${recipient}`)
      }
      return address
    })
  }, [recipients, networkType])

  const announce = useCallback(() => {
    if(! distributer) return
    if(! mosaicId) return
    if(! (amount && /^[1-9][0-9]*$/.test(amount))) return

    setLoading(true)
    const txes = recipientAddresses.map(addr => {
      const tx = TransferTransaction.create(
        Deadline.create(1),
        addr,
        [new Mosaic(mosaicId, UInt64.fromUint(parseInt(amount)))],
        EmptyMessage,
        networkType,
        UInt64.fromUint(5000000)
      )
      return tx // TODO: .setMaxFee(100)
      // return distributer.sign(tx, genHash)
    })

    let signedTxes = []
    if(aggregation) {
      const aggTx = AggregateTransaction.createComplete(
        Deadline.create(1),
        txes.map(t => t.toAggregate(distributer.publicAccount)),
        networkType,
        [],
        UInt64.fromUint(5000000)
      )
      signedTxes = [ distributer.sign(aggTx, genHash) ]
    } else {
      signedTxes = txes.map(tx => distributer.sign(tx, genHash))
    }

    console.debug(signedTxes)
    return from(signedTxes)
      .pipe(
        mergeMap(t => transactionHttp.announce(t))
      )
      .subscribe(
        (_) => {
          console.debug(_)
          setLoading(false)
        },
        error => console.error(error),
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [distributer, networkType, amount, mosaicId, recipientAddresses, aggregation, transactionHttp, genHash])

  useEffect(() => {
    setIsReady(false)
    if (! /^[a-fA-F0-9]{64}$/.test(privateKey)) return
    if (! /^[a-fA-F0-9]{16}$/.test(mosaicHex)) return
    if (! /^\d{1,9}\.?\d{0,6}$/.test(amount)) return
    if (filterValidIdentifier(recipients).length === 0) return
    setIsReady(true)
  }, [privateKey, mosaicHex, amount, recipients, setIsReady])

  return {
    privateKey, setPrivateKey,
    mosaicHex, setMosaicHex,
    amount, setAmount,
    recipients, setRecipients,
    aggregation, setAggregation,
    distributer, isReady, announce,
    loading, error
  }
}
