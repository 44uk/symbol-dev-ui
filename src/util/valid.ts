export const isValidAddress = (value: string) => (
  /^[SMTN][A-z2-7]{39}$/.test(value.replace(/-/g, ""))
)
