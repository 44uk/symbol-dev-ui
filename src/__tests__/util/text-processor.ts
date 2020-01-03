import { prettifyGatewayList } from "util/text-processor"

test("isValidAddress", () => {
  const input = `
http://api-20.us-west-1.nemtech.network:3000/block/1
http://api-harvest-20.ap-northeast-1.nemtech.network:3000/node/peers
http://api-harvest-20.ap-southeast-1.nemtech.network:3000/
http://api-harvest-20.eu-west-1.nemtech.network:3000?foo=1
http://api-harvest-20.us-west-1.nemtech.network:3000#foo/1
http://178.128.184.107:3000
http://127.0.0.1:3000
http://localhost:3000
https://secure-gateway.example.net:3001
Label: https://secure-gateway.example.net:3001
Label: http://gateway.example.net:3000
this is not URL line.
1234567890
ftp://127.0.0.1:3000
`
  const output = `http://api-20.us-west-1.nemtech.network:3000
http://api-harvest-20.ap-northeast-1.nemtech.network:3000
http://api-harvest-20.ap-southeast-1.nemtech.network:3000
http://api-harvest-20.eu-west-1.nemtech.network:3000
http://api-harvest-20.us-west-1.nemtech.network:3000
http://178.128.184.107:3000
http://127.0.0.1:3000
http://localhost:3000
https://secure-gateway.example.net:3001
http://gateway.example.net:3000`

  expect(prettifyGatewayList(input)).toEqual(output)
})
