import paths from "paths"

const PREFIX = "/nem2-dev-ui"

export const persistedPaths = {
  app: PREFIX,
  gatewayList:    "/gateway-list",
  currentGateway: "/current-gateway",
  pki:         paths.pki         + "/input",
  account:     paths.account     + "/input",
  block:       paths.block       + "/input",
  mlms:        paths.mlms        + "/input",
  namespace:   paths.namespace   + "/input",
  mosaic:      paths.mosaic      + "/input",
  transaction: paths.transaction + "/input",
  payload:     paths.payload     + "/input",
  misc:        paths.misc        + "/input",
  listener:    "/listener/input",
}

