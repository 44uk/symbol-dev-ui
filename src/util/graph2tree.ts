export interface IMultisig {
  accountPublicKey: string
  accountAddress: string
  minApproval: number
  minRemoval: number
  cosignatoryPublicKeys: string[]
  multisigPublicKeys: string[]
}

export interface IEntry {
  multisig: IMultisig
}

export interface ILayer {
  level: number
  multisigEntries: IEntry[]
}

export interface IOpts {
  truncated?: boolean
  head?: number
  tail?: number
  root?: string
  child?: string
  referer?: string
}

type NodeTuple = [number, IEntry, any[]]

const defaultOpts: IOpts = {
  child: "└",
  head: 8,
  referer: "<<",
  root: "#",
  tail: 4,
  truncated: true,
}

export const graph2tree = (graph: ILayer[], opts: IOpts = {}) =>  {
  const layer = graph.find((l: ILayer) => l.level === 0)
  const referer = layer ? layer.multisigEntries[0].multisig.accountPublicKey : ""
  const tree = buildTree(graph)
  return buildOutput(tree, referer, {...defaultOpts, ...opts})
}

export const buildTree = (graph: ILayer[]) => {
  const tree: NodeTuple[] = []
  for (const layer of graph) {
    if (tree.length === 0) {
      const entry = layer.multisigEntries[0]
      tree.push([layer.level, entry, []])
    } else {
      layer.multisigEntries.forEach(entry => {
        const parentNode = findParentNode(tree, entry.multisig.accountPublicKey, layer.level)
        parentNode[2].push([layer.level, entry, []])
      })
    }
  }
  return tree
}

const findParentNode = (tree: any, account: string, level: number) => {
  const parentNode = tree.find((n: any) => n[1].multisig.cosignatoryPublicKeys.includes(account))
  return parentNode && (level - parentNode[0]) === 1
    ? parentNode
    : tree.map((n: any) => findParentNode(n[2], account, level)).filter((_: any) => _)[0]

}

const buildOutput = (tree: NodeTuple[], referer: string, opts: IOpts) => {
  const buf: string[] = []
  putIntoBuf(buf, tree[0], 0, true, referer, opts)
  return buf.join("\n")
}

const putIntoBuf = (buf: string[], node: NodeTuple, level: number, end: boolean, referer: string, opts: IOpts) => {
  renderLine(buf, node[1], level, end, referer, opts); level++
  for (let i = 0; i < node[2].length; i++) {
    putIntoBuf(buf, node[2][i], level, node[2].length - 1 === i, referer, opts)
  }
}

const renderLine = (buf: string[], entry: IEntry, level: number, end: boolean, referer: string, opts: IOpts) => {
  const pad = "  ".repeat(level * 2) + (level === 0 ? `${opts.root} ` : `${opts.child} `)
  const msig = entry.multisig
  const ref = msig.accountPublicKey === referer
    ? ` ${opts.referer}`
    : ""
  const nOfm = msig.cosignatoryPublicKeys.length === 0
    ? ""
    : ` (${msig.minApproval}, ${msig.cosignatoryPublicKeys.length})`
  const identifier = opts.truncated
    ? `${msig.accountPublicKey.slice(0, opts.head)}..${msig.accountPublicKey.slice((opts.tail || 0) * -1)}`
    : msig.accountPublicKey
  buf.push(`${pad}${identifier}${nOfm}${ref}`)
}

// Actually I want to write out like this...
// * A01CF3..43E2 (3,3) <
//   ├ 061934..0772 (1,2)
//   │ └ 465D40..2F68
//   │  └ 4FCBC9..D28D
//   ├ 92BE08..E910
//   └ 9835C3..92C2 (2,3)
//     ├ 4F7222..B27F
//     ├ 8BFDE2..93E0 (1,1)
//     │ └ A8443C..CC47
//     └ 92BE08..E910"

// TODO: improve this
// const renderLine = (buf: string[], entry: any, level: number, end: boolean) => {
//  const tmp = new Array(level).fill("|")
//  tmp[tmp.length - 1] = end ? "`" : "|"
//  const pad = tmp.join("  ") + (level > 0 ? "- " : "")
//  // const pad = " ".repeat(level * 2)
//  const msig = entry.multisig
//  const nOfm = msig.cosignatories.length === 0
//    ? ""
//    : ` (${msig.minApproval},${msig.cosignatories.length})`
//  buf.push(`${pad}${entry.multisig.account.slice(0, 6)}${nOfm}`)
// }

export default graph2tree
