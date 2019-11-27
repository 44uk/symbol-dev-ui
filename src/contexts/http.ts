import { createContext } from "react"
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  DiagnosticHttp,
  MetadataHttp,
  MosaicHttp,
  MultisigHttp,
  NamespaceHttp,
  NetworkHttp,
  NodeHttp,
  ReceiptHttp,
  RestrictionAccountHttp,
  RestrictionMosaicHttp,
  TransactionHttp
} from "nem2-sdk"

interface IHttpInstance {
  accountHttp: AccountHttp
  blockHttp: BlockHttp
  chainHttp: ChainHttp
  diagnosticHttp: DiagnosticHttp
  metadataHttp: MetadataHttp
  mosaicHttp: MosaicHttp
  multisigHttp: MultisigHttp
  namespaceHttp: NamespaceHttp
  networkHttp: NetworkHttp
  nodeHttp: NodeHttp
  receiptHttp: ReceiptHttp
  restrictionAccountHttp: RestrictionAccountHttp
  restrictionMosaicHttp: RestrictionMosaicHttp
  transactionHttp: TransactionHttp
}

export function createHttpInstance(url: string): IHttpInstance {
  if(! /^https?:\/\//.test(url)) {
    throw new Error(`Invalid URL Format: ${url}`)
  }
  const accountHttp = new AccountHttp(url)
  const blockHttp = new BlockHttp(url)
  const chainHttp = new ChainHttp(url)
  const diagnosticHttp = new DiagnosticHttp(url)
  const metadataHttp = new MetadataHttp(url)
  const mosaicHttp = new MosaicHttp(url)
  const multisigHttp = new MultisigHttp(url)
  const namespaceHttp = new NamespaceHttp(url)
  const networkHttp = new NetworkHttp(url)
  const nodeHttp = new NodeHttp(url)
  const receiptHttp = new ReceiptHttp(url)
  const restrictionAccountHttp = new RestrictionAccountHttp(url)
  const restrictionMosaicHttp = new RestrictionMosaicHttp(url)
  const transactionHttp = new TransactionHttp(url)

  return {
    accountHttp,
    blockHttp,
    chainHttp,
    diagnosticHttp,
    metadataHttp,
    mosaicHttp,
    multisigHttp,
    namespaceHttp,
    networkHttp,
    nodeHttp,
    receiptHttp,
    restrictionMosaicHttp,
    restrictionAccountHttp,
    transactionHttp
  }
}

export const DEFAULT_URL = "http://localhost:3000"

export const Context = createContext({
  url: DEFAULT_URL,
  httpInstance: createHttpInstance(DEFAULT_URL)
})
