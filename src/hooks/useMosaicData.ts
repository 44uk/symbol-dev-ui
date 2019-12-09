import { useState, useCallback } from "react"
import { MosaicInfo, Metadata, MosaicHttp, MetadataHttp, RestrictionMosaicHttp, MosaicGlobalRestriction, NamespaceHttp, MosaicNames } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import useDebouncedEffect  from "use-debounced-effect"
import {
  convertIdentifierToMosaicId
} from "util/convert"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

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

export const useMosaicData = (httpInstance: IHttpInstance, initialValue: string = "") => {
  const [mosaicData, setMosaicData] = useState<IMosaicData | null>(null)
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.mosaic, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { mosaicHttp, namespaceHttp, metadataHttp, restrictionMosaicHttp } = httpInstance

  const handler = useCallback(() => {
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
  }, [identifier, mosaicHttp, namespaceHttp, metadataHttp, restrictionMosaicHttp])

  useDebouncedEffect(handler, 500, [identifier, mosaicHttp, namespaceHttp, metadataHttp, restrictionMosaicHttp])

  return { mosaicData, identifier, setIdentifier, handler, loading, error }
}
