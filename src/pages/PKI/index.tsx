import React, { useState } from 'react';

import {
  Account,
} from 'nem2-sdk'

import Input from './Input'
import Output from './Output'

export const PKI: React.FC = () => {
  const [account, setAccount] = useState<Account | undefined>(undefined)
  const [pretty, setPretty] = useState(false)

  return (
  <div>
    <span className="toast">Error Message</span>
    <Input
      onSetAccount={setAccount}
      onSetPretty={setPretty}
    />
    <Output
      account={account}
      pretty={pretty}
    />
  </div>
  );
}

export default PKI;
