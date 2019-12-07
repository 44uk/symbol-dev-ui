import { useEffect, useState } from "react"
import { MosaicInfo, Metadata, MosaicHttp, MetadataHttp, RestrictionMosaicHttp, MosaicGlobalRestriction, NamespaceHttp, MosaicNames } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import {
  convertIdentifierToMosaicId
} from "util/convert"

export interface IMosaicData {
  mosaicInfo: MosaicInfo
  mosaicNames: MosaicNames[]
  metadata: Metadata[]
  globalRestriction: MosaicGlobalRestriction | null
}

interface IHttpInstance {
  mosaicHttp: MosaicHttp,
  namespaceHttp: NamespaceHttp,
  metadataHttp: MetadataHttp
  restrictionMosaicHttp: RestrictionMosaicHttp
}

export const useMosaicData = (httpInstance: IHttpInstance, initialValue: string | null = null) => {
  const [mosaicData, setMosaicData] = useState<IMosaicData | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { mosaicHttp, namespaceHttp, metadataHttp, restrictionMosaicHttp } = httpInstance

  const handler = () => {
    if(! identifier) return
    let mosaicId
    try {
      mosaicId = convertIdentifierToMosaicId(identifier)
    } catch {
      mosaicId = null
    }
    if(! mosaicId) return

    setLoading(true)
    forkJoin([
      mosaicHttp.getMosaic(mosaicId),
      namespaceHttp.getMosaicsNames([mosaicId]),
      metadataHttp.getMosaicMetadata(mosaicId),
      restrictionMosaicHttp.getMosaicGlobalRestriction(mosaicId).pipe(catchError(() => of(null)))
    ])
      .pipe(
        map(resp => ({
          mosaicInfo: resp[0],
          mosaicNames: resp[1],
          metadata: resp[2],
          globalRestriction: resp[3]
        }))
      )
      .subscribe(
        setMosaicData,
        (error) => {
          setLoading(false)
          setError(error)
          setMosaicData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }

  useEffect(handler, [identifier, mosaicHttp, metadataHttp])

  return { mosaicData, identifier, setIdentifier, handler, loading, error }
}
