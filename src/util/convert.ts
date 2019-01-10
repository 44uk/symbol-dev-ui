import {
  address as libAddress,
  convert as libConvert,
  uint64,
} from "nem2-library";
import { Address } from "nem2-sdk";

export const convertHexToNum = (hex: string) => parseInt(hex, 16);
export const convertHexToUint64 = (value: string) => {
  try {
    const uint64str = uint64.fromHex(value.trim()).toString();
    return `[ ${uint64str} ]`;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const convertNumToHex = (num: string) => parseInt(num, 10).toString(16);
export const convertNumToUint64 = (value: string) => {
  try {
    const preped = parseInt(value);
    const parsed = uint64.fromUint(preped).toString();
    return `[ ${parsed} ]`;
  } catch (err) {
    return err.message;
  }
};

export const convertUint64ToHex = (value: string) => {
  const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
  const parsed = JSON.parse(preped);
  return uint64.toHex(parsed);
};
export const convertUint64ToNum = (value: string) => {
  try {
    const preped = `[${value.replace(/[\[\]\s]/g, "")}]`;
    const parsed = JSON.parse(preped);
    return uint64.compact(parsed).toString();
  } catch (err) {
    return err.message;
  }
};

export const encodeRawToHex = (value: string) => {
  return libConvert.utf8ToHex(value);
};
export const decodeHexToRaw = (value: string) => {
  return Buffer.from(value, "hex").toString("utf8");
};

export const encodeAddress = (value: string) => {
  return libAddress.addressToString(libConvert.hexToUint8(value));
};
export const decodeAddress = (value: string) => {
  const plain = Address.createFromRawAddress(value).plain();
  return libConvert.uint8ToHex(libAddress.stringToAddress(plain));
};
