import React, { useState, useContext, useEffect } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { TextOutput } from "components"

export const Fee: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const [value, setValue] = useState("")
  const [output, setOutput] = useState("")

  return (
<div>
  Under construction!
</div>
  )
}

export default Fee
