import React from "react"
import { AccountInfo } from "nem2-sdk"

import FieldWithLabel from "components/FieldWithLabel"

interface IProps {
  accountInfo: AccountInfo | undefined
  loading?: boolean
}

export const Info: React.FC<IProps> = ({
  accountInfo,
  loading = false
}) => {
  let info = {
    address: "",
    hexAddress: "",
    addressHeight: "",
    publicKey: "",
    publicKeyHeight: "",
    importance: "",
    importanceHeight: "",
  }
  if(accountInfo) {
    const address = accountInfo.address
    info = {...info,
      address: address.pretty(),
      hexAddress: address.encoded(),
      addressHeight: accountInfo.addressHeight.toString(),
      publicKey: accountInfo.publicKey,
      publicKeyHeight: accountInfo.publicKeyHeight.toString(),
      importance: accountInfo.importance.toString(),
      importanceHeight: accountInfo.importanceHeight.toString(),
    }
  }

  return (
<fieldset>
  <legend>Account Data</legend>
  <FieldWithLabel readonly={true} disabled={loading} label="Address"    value={info.address} />
  <FieldWithLabel readonly={true} disabled={loading} label="HexAddress" value={info.hexAddress} />
  <FieldWithLabel readonly={true} disabled={loading} label="Height at"  value={info.addressHeight} />
  <FieldWithLabel readonly={true} disabled={loading} label="PublicKey"  value={info.publicKey} />
  <FieldWithLabel readonly={true} disabled={loading} label="Height at"  value={info.publicKeyHeight} />
  <FieldWithLabel readonly={true} disabled={loading} label="Importance" value={info.importance} />
  <FieldWithLabel readonly={true} disabled={loading} label="Height at"  value={info.importanceHeight} />
</fieldset>
  )
}

export default Info
