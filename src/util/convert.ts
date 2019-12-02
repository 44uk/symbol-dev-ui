import {
  RIPEMD160,
} from "crypto-js"
import {
  keccak256,
  sha3_256,
} from "js-sha3"
import {
  Address,
  RawAddress,
  NamespaceId,
  UInt64,
  Convert,
  MosaicId,
  Deadline
} from "nem2-sdk"

export const encodeNamespace = (value: string) => {
  try {
    return new NamespaceId(value).toHex()
  } catch(error) {
    return ""
  }
}

export const convertHexToNum = (value: string) => {
  return (parseInt(value, 16) || "").toString()
}
export const convertHexToUInt64 = (value: string) => {
  try {
    const uint64 = UInt64.fromHex(value.trim())
    return `[${uint64.lower},${uint64.higher}]`
  } catch (error) {
    return ""
  }
}

export const convertNumToHex = (value: string) => {
  return parseInt(value, 10).toString(16).toUpperCase()
}
export const convertNumToUInt64 = (value: string) => {
  try {
    const uint64= UInt64.fromNumericString(value)
    return `[${uint64.lower},${uint64.higher}]`
  } catch (error) {
    return ""
  }
}

export const convertUInt64ToHex = (value: string) => {
  const prepared = `[${value.replace(/[\[\]\s]/g, "")}]`
  try {
    const loHi = JSON.parse(prepared)
    return (new UInt64(loHi)).toHex()
  } catch (error) {
    return ""
  }
}

export const convertUInt64ToNum = (value: string) => {
  const prepared = `[${value.replace(/[\[\]\s]/g, "")}]`
  try {
    const loHi = JSON.parse(prepared)
    return parseInt((new UInt64(loHi)).toString(), 10)
  } catch (error) {
    return ""
  }
}

export const convertIdentifierToNamespaceId = (value: string) => {
  if(/[0-9a-fA-F]{16}/.test(value)) {
    return NamespaceId.createFromEncoded(value)
  }
  try {
    const namespaceId = new NamespaceId(value)
    return namespaceId
  } catch (_) {
    // try next
  }
  const hex = convertUInt64ToHex(value)
  if(! /[0-9a-fA-F]{16}/.test(hex)) {
    throw new Error("Can't convert")
  }
  return NamespaceId.createFromEncoded(hex)
}

export const convertIdentifierToNamespaceHex = (value: string) => {
  try {
    const namespaceId = convertIdentifierToNamespaceId(value)
    if(namespaceId) {
      return namespaceId.toHex()
    } else {
      return /[0-9a-fA-F]{16}/.test(value) ? value : ""
    }
  } catch (_) {
    return ""
  }
}

export const convertIdentifierToMosaicId = (value: string) => {
  if(/[0-9a-fA-F]{16}/.test(value)) {
    return new MosaicId(value)
  }
  const hex = convertUInt64ToHex(value)
  if(! /[0-9a-fA-F]{16}/.test(hex)) {
    throw new Error("Can't convert")
  }
  return new MosaicId(hex)
}

export const convertIdentifierToMosaicHex = (value: string) => {
  try {
    return convertIdentifierToMosaicId(value).toHex()
  } catch (_) {
    return /[0-9a-fA-F]{16}/.test(value) ? value : ""
  }
}

export const encodeRawToHex = (value: string) => {
  return Convert.utf8ToHex(value)
}

export const decodeHexToRaw = (value: string) => {
  if(! /^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) return ""
  return Buffer.from(value, "hex").toString("utf8")
}

export const encodeAddress = (value: string) => {
  try {
    return RawAddress.addressToString(Convert.hexToUint8(value))
  } catch(error) {
    return ""
  }
}

export const decodeAddress = (value: string) => {
  try {
    const plain = Address.createFromRawAddress(value).plain()
    return Convert.uint8ToHex(RawAddress.stringToAddress(plain))
  } catch(error) {
    return ""
  }
}

export const hashBySha3 = (input: string) => {
  return sha3_256(input)
}

export const hashByKeccak = (input: string) => {
  return keccak256(input)
}

export const hashByHash160 = (input: string) => {
  return RIPEMD160(sha3_256(input))
}

export const hashByHash256 = (input: string) => {
  return sha3_256(sha3_256(input))
}

export const datetimeStringToNemTimestamp = (input: string) => {
  const msec = Date.parse(input)
  if(Number.isNaN(msec)) return ""
  try {
    const nemTimestamp = msec / 1000 - Deadline.timestampNemesisBlock
    return nemTimestamp.toString()
  } catch(_) {
    return ""
  }
}

export const nemTimestampToDatetimeString = (input: string) => {
  try {
    const sec = parseInt(input) + Deadline.timestampNemesisBlock
    return new Date(sec * 1000).toISOString()
  } catch(_) {
    return ""
  }
}
