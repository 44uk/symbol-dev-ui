import { useEffect, useState } from "react"
import { MosaicInfo, Metadata, MosaicHttp, MetadataHttp, MosaicId } from "nem2-sdk";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

function createMosaicIdFromIdentifier(value: string) {
  try {
    return new MosaicId(value)
  } catch(error) {
    // for continuing if value is not namespace name string
    return null
  }
}

export interface IMosaicData {
  mosaicInfo: MosaicInfo
  metadata: Metadata[]
}

interface IHttpInstance {
  mosaicHttp: MosaicHttp,
  metadataHttp: MetadataHttp
}

export const useMosaicData = (httpInstance: IHttpInstance) => {
  const [mosaicData, setMosaicData] = useState<IMosaicData | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { mosaicHttp, metadataHttp } = httpInstance

  useEffect(() => {
    if(! identifier) return
    const mosaicId = createMosaicIdFromIdentifier(identifier)
    if(! mosaicId) return

    setLoading(true)
    forkJoin([
      mosaicHttp.getMosaic(mosaicId),
      metadataHttp.getMosaicMetadata(mosaicId)
    ])
      .pipe(
        map(resp => ({
          mosaicInfo: resp[0],
          metadata: resp[1]
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
  }, [identifier, mosaicHttp, metadataHttp])

  return { mosaicData, setIdentifier, loading, error }
}
