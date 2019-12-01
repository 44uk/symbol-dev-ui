export interface ISegment {
  byte: number,
  name: string
}

export const Transaction = [
  { byte:  4, name: "Size" },
  { byte:  4, name: "RESERVED" },
  { byte: 64, name: "Signature" },
  { byte: 32, name: "SignerPublicKey" },
  { byte:  4, name: "RESERVED" },
  { byte:  1, name: "Version" },
  { byte:  1, name: "NetworkType" },
  { byte:  2, name: "Type" },
  { byte:  8, name: "MaxFee" },
  { byte:  8, name: "Deadline" },
]

export const Transfer = ({ mosaicCount = 1, payloadLength = 0 }) => ([
  { byte: 25, name: "RecipientAddress" },
  { byte:  1, name: "MosaicsCount" },
  { byte:  2, name: "MessageSize" },
  { byte:  4, name: "RESERVED" },
  { byte:  1 * payloadLength + 1, name: "Payload" },
  { byte: 16 * mosaicCount, name: "Mosaics" },
])

export const sumByte = (segments: ISegment[]) => (
  Object.values(segments).reduce((a, v) => a += v.byte, 0)
)
