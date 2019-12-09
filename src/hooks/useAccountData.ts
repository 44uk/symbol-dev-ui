import { useState, useCallback } from "react"
import { NetworkType, Address, AccountHttp, AccountInfo, MetadataHttp, MosaicService, MosaicHttp, MosaicAmountView, Metadata, MultisigHttp, NamespaceHttp, AccountNames } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"
import useDebouncedEffect  from "use-debounced-effect"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

function createAddressFromIdentifier(value: string, networkType = NetworkType.MIJIN_TEST) {
  try {
    return /^[SMTN][0-9A-Z-]{39,45}$/.test(value)
      ? Address.createFromRawAddress(value)
      : Address.createFromPublicKey(value, networkType)

  } catch(error) {
    return null
  }
}

export interface IAccountData {
  accountInfo: AccountInfo
  accountNames: AccountNames[]
  mosaicAmountViews: MosaicAmountView[]
  metadata: Metadata[]
  // multisigAccountInfo: MultisigAccountInfo | null
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
  const mosaicService = new MosaicService(accountHttp, mosaicHttp)

  const handler = useCallback(() => {
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier)
    if(! address) return

    setLoading(true)
    forkJoin([
      accountHttp.getAccountInfo(address),
      mosaicService.mosaicsAmountViewFromAddress(address),
      namespaceHttp.getAccountsNames([address]),
      metadataHttp.getAccountMetadata(address),
      // multisigHttp.getMultisigAccountInfo(address).pipe(catchError(_ => of(null)))
    ])
      .pipe(
        map(resp => ({
          accountInfo: resp[0],
          mosaicAmountViews: resp[1],
          accountNames: resp[2],
          metadata: resp[3],
          // multisigAccountInfo: resp[3],
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
  }, [identifier])

  useDebouncedEffect(handler, 500, [identifier, accountHttp, mosaicHttp, metadataHttp])

  return { accountData, identifier, setIdentifier, handler, loading, error }
}
