import { useState, useCallback, useMemo } from "react"
import { AccountHttp, AccountInfo, MetadataHttp, MosaicService, MosaicHttp, MosaicAmountView, Metadata, MultisigHttp, NamespaceHttp, AccountNames, MultisigAccountInfo } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import useDebouncedEffect  from "use-debounced-effect"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

import {
  createAddressFromIdentifier
} from "util/convert"

const [usePersistedState] = createPersistedState(persistedPaths.app)

export interface IAccountData {
  accountInfo: AccountInfo
  accountNames: AccountNames[]
  mosaicAmountViews: MosaicAmountView[]
  metadata: Metadata[]
  multisigAccountInfo: MultisigAccountInfo | null
}

interface IHttpInstance {
  accountHttp: AccountHttp
  mosaicHttp: MosaicHttp
  namespaceHttp: NamespaceHttp,
  metadataHttp: MetadataHttp
  multisigHttp: MultisigHttp
}

export const useAccountData = (httpInstance: IHttpInstance, initialValue: string = "") => {
  const [accountData, setAccountData] = useState<IAccountData | null>(null)
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.account, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { accountHttp, mosaicHttp, namespaceHttp, metadataHttp, multisigHttp } = httpInstance
  const mosaicService = useMemo(() => new MosaicService(accountHttp, mosaicHttp), [accountHttp, mosaicHttp])

  const handler = useCallback(() => {
    if(! identifier) return
    // @ts-ignore
    const address = createAddressFromIdentifier(identifier, accountHttp.networkType)
    if(! address) return

    setLoading(true)
    const s$ = forkJoin([
      accountHttp.getAccountInfo(address),
      mosaicService.mosaicsAmountViewFromAddress(address),
      namespaceHttp.getAccountsNames([address]),
      metadataHttp.getAccountMetadata(address),
      multisigHttp.getMultisigAccountInfo(address).pipe(catchError(_ => of(null)))
    ])
      .pipe(
        map(resp => ({
          accountInfo: resp[0],
          mosaicAmountViews: resp[1],
          accountNames: resp[2],
          metadata: resp[3],
          multisigAccountInfo: resp[4],
        }))
      )
      .subscribe(
        setAccountData,
        (error) => {
          setLoading(false)
          setError(error)
          setAccountData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )

    return () => {
      s$.unsubscribe()
    }
  }, [identifier, accountHttp, namespaceHttp, mosaicService, metadataHttp, multisigHttp])

  useDebouncedEffect(handler, 500, [identifier, accountHttp, namespaceHttp, mosaicService, metadataHttp, multisigHttp])

  return { accountData, identifier, setIdentifier, handler, loading, error }
}
