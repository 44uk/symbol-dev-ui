import {
  RIPEMD160,
} from "crypto-js";
import {
  keccak256,
  sha3_256,
} from "js-sha3";

// import {
//   address as libAddress,
//   convert as libConvert,
//   UInt64,
// } from "nem2-library";
import {
  Address,
  UInt64
} from "nem2-sdk";

export const convertHexToNum = (hex: string) => parseInt(hex, 16);
export const convertHexToUInt64 = (value: string) => {
  try {
    const uint64str = UInt64.fromHex(value.trim()).toString();
    return `[ ${uint64str} ]`;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const convertNumToHex = (num: string) => parseInt(num, 10).toString(16);
export const convertNumToUInt64 = (value: string) => {
  try {
    const preped = parseInt(value);
    const parsed = UInt64.fromUint(preped).toString();
    return `[ ${parsed} ]`;
  } catch (err) {
    return err.message;
  }
};

export const convertUInt64ToHex = (value: string) => {
  const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
  const parsed = JSON.parse(preped);
  return 'WIP'
  // return UInt64.toHex(parsed);
};
export const convertUInt64ToNum = (value: string) => {
  try {
    const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
    const parsed = JSON.parse(preped);
    return 'WIP'
    // return UInt64.compact(parsed).toString();
  } catch (err) {
    return err.message;
  }
};

export const encodeRawToHex = (value: string) => {
  return 'WIP'
  // return libConvert.utf8ToHex(value);
};
export const decodeHexToRaw = (value: string) => {
  return Buffer.from(value, "hex").toString("utf8");
};

export const encodeAddress = (value: string) => {
  return 'WIP'
  // return libAddress.addressToString(libConvert.hexToUint8(value));
};
export const decodeAddress = (value: string) => {
  const plain = Address.createFromRawAddress(value).plain();
  return 'WIP'
  // return libConvert.uint8ToHex(libAddress.stringToAddress(plain));
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
