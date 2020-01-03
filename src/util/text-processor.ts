export const prettifyGatewayList = (input: string) => {
  const _tmp = input.split("\n")
    .map(line => line.trim())
    .map(line => (/(https?:\/\/.+)/.exec(line) || [])[1] || "")
    .filter(line => /^https?:\/\/.+/.test(line))
    .map(line => new URL(line).origin)
  return Array.from(new Set(_tmp)).join("\n")
}
