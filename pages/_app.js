import React from 'react';
import '../Styles/index.css';
import { configureChains, chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import {jsonRpcProvider} from 'wagmi/providers/jsonRpc'
import store from '../store.js'
import { Provider } from 'react-redux'

import { WagmiConfig, createClient } from 'wagmi'
const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_TOKEN }),publicProvider()],
  // [jsonRpcProvider({
  //   rpc: (chain) => ({
  //     http: `https://rpc.tenderly.co/fork/2280f484-0104-4fb8-862b-8770805671ff`,
  //   }),
  // }),]
)
const client = createClient({
  autoConnect: true,
  provider,
})
function MyApp({ Component, pageProps }) {
  React.useEffect(() => {}, [])
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
    </Provider>
  )
}

export default MyApp
