import { useEffect, useState } from "react"
import { NetworkType, Address, AccountHttp, AccountInfo, MetadataHttp, MosaicService, MosaicHttp, MultisigAccountInfo, MosaicAmountView, Metadata, MultisigHttp } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { catchError, map } from "rxjs/operators"

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
  mosaicAmountViews: MosaicAmountView[]
  metadata: Metadata[]
  multisigAccountInfo: MultisigAccountInfo | null
}

interface IHttpInstance {
  accountHttp: AccountHttp
  mosaicHttp: MosaicHttp
  metadataHttp: MetadataHttp
  multisigHttp: MultisigHttp
}

export const useAccountData = (httpInstance: IHttpInstance) => {
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accountData, setAccountData] = useState<IAccountData | null>(null)

  const { accountHttp, mosaicHttp, metadataHttp, multisigHttp } = httpInstance
  const mosaicService = new MosaicService(accountHttp, mosaicHttp)

  const handler = () => {
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier)
    if(! address) return

    setLoading(true)
    forkJoin([
      accountHttp.getAccountInfo(address),
      mosaicService.mosaicsAmountViewFromAddress(address),
      metadataHttp.getAccountMetadata(address),
      multisigHttp.getMultisigAccountInfo(address).pipe(catchError(_ => of(null)))
    ])
      .pipe(
        map(resp => ({
          accountInfo: resp[0],
          mosaicAmountViews: resp[1],
          metadata: resp[2],
          multisigAccountInfo: resp[3],
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
  }

  useEffect(handler, [identifier, accountHttp, mosaicHttp, metadataHttp])

  return { accountData, identifier, setIdentifier, handler, loading, error }
}
