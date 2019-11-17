import {
  RIPEMD160,
} from "crypto-js";
import {
  keccak256,
  sha3_256,
} from "js-sha3";
import {
  Address,
  RawAddress,
  NamespaceId,
  UInt64,
  Convert
} from "nem2-sdk";

export const encodeNamespace = (value: string) => {
  try {
    return new NamespaceId(value).toHex()
  } catch(error) {
    return ""
  }
}

export const convertHexToNum = (value: string) => parseInt(value, 16);
export const convertHexToUInt64 = (value: string) => {
  try {
    const uint64 = UInt64.fromHex(value.trim());
    return `[${uint64.lower},${uint64.higher}]`;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const convertNumToHex = (value: string) => parseInt(value, 10).toString(16).toUpperCase();
export const convertNumToUInt64 = (value: string) => {
  try {
    const uint64= UInt64.fromNumericString(value)
    return `[${uint64.lower},${uint64.higher}]`;
  } catch (error) {
    console.error(error);
    return ""
  }
};

export const convertUInt64ToHex = (value: string) => {
  const prepared = `[${value.replace(/[\[\]\s]/g, "")}]`;
  try {
    const loHi = JSON.parse(prepared);
    return (new UInt64(loHi)).toHex()
  } catch (error) {
    console.error(error);
    return ""
  }
};

export const convertUInt64ToNum = (value: string) => {
  const prepared = `[${value.replace(/[\[\]\s]/g, "")}]`;
  try {
    const loHi = JSON.parse(prepared);
    return parseInt((new UInt64(loHi)).toString(), 10)
  } catch (error) {
    console.error(error);
    return ""
  }
};

export const encodeRawToHex = (value: string) => {
  return Convert.utf8ToHex(value);
};

export const decodeHexToRaw = (value: string) => {
  return Buffer.from(value, "hex").toString("utf8");
};

export const encodeAddress = (value: string) => {
  try {
    console.log(Convert.hexToUint8(value))
    return RawAddress.addressToString(Convert.hexToUint8(value));
  } catch(error) {
    return ""
  }
};

export const decodeAddress = (value: string) => {
  try {
    const plain = Address.createFromRawAddress(value).plain();
    return Convert.uint8ToHex(RawAddress.stringToAddress(plain));
  } catch(error) {
    return ""
  }
};

export const hashBySha3 = (input: string) => {
  return sha3_256(input);
};

export const hashByKeccak = (input: string) => {
  return keccak256(input);
};

export const hashByHash160 = (input: string) => {
  return RIPEMD160(sha3_256(input));
};

export const hashByHash256 = (input: string) => {
  return sha3_256(sha3_256(input));
};

export const datetimeStringToNemTimestamp = (input: string) => {
	// 1459468800000 is the number of milliseconds from 1970-01-01 till epoch time (2016-04-01)
  const nemtimestamp = new Date().getTime() - 1459468800000;
  // TODO: inputをタイムスタンプにして、1459468800000を引いて返す
  return input;
};

export const nemTimestampToDatetimeString = (input: number) => {
  // TODO: inputに1459468800000を足して、日付文字列としてパース
  return input.toString();
};
