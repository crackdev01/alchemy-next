import React from 'react';
import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import Draggable from 'react-draggable';
import BigNumber from 'bignumber.js';
import { ThemeProvider } from 'styled-components';
import {
  AppBar,
  Toolbar,
  Button,
  List,
  ListItem,
  Divider,
  Window,
  WindowHeader,
} from 'react95';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
// original Windows95 font (optionally)
import { useAccount, useConnect, useEnsName, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import ERC721 from '../abis/ERC721.json'
import { Wrapper, GlobalStyles } from '../styles';
import InfoWindow from '../windows/Info';
import IexploreWindow from '../windows/Iexplore';
import StakeWindow from '../windows/staking/Stake';
import { MyNFTsSelector } from '../windows/listingmgr/MyNFTsSelector';
import { useDispatch, useSelector } from 'react-redux';
import { open as openWindow } from '../reducers/openWindow';
import { CreatePool } from '../windows/listingmgr/CreatePool';
import { ImagePreview } from '../windows/utils/ImagePreview';
import { CreateOffer } from '../windows/offermgr/CreateOffer';
import { Swap } from '../windows/marketplace/Swap';
import { MyListings } from '../windows/listingmgr/MyPools';
import { XSushiStaking } from '../windows/staking/xSushiStaking';

export default function Home() {

  const [open, setOpen] = React.useState(false);
  const [welcomeWindow, setWelcomeWindow] = React.useState(true);
  const [iexploreWindow, setIexploreWindow] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  const [iframesrc, _setIframesrc] = React.useState("")


  const [isEligible, setIsEligible] = React.useState(false || process.env.NODE_ENV === 'development')
  const windowStack = useSelector((state) => state.openWindow)
  const dispatch = useDispatch()
  const setWindowStack = (a) => dispatch(openWindow(a))
  const windows = {
    n00d: <InfoWindow key={'n00d'} isEligible={isEligible} setIframesrc={setIframesrc} setWindowStack={setWindowStack}></InfoWindow>,
    iexplore: <IexploreWindow iframesrc={iframesrc}></IexploreWindow>,
    stake: <StakeWindow emission={[14, 7, 4.5, 3.5]} depositoryAddress={'0x91bF23d27170712e0E93BDa5478f86bbFF2C1915'}></StakeWindow>,
    nftselector: <MyNFTsSelector></MyNFTsSelector>,
    createpool: <CreatePool></CreatePool>,
    imageviewer: <ImagePreview></ImagePreview>,
    x: <XSushiStaking></XSushiStaking>,
    createoffer: <CreateOffer></CreateOffer>,
    sweep: <Swap></Swap>,
    mypools: <MyListings></MyListings>,
  }
  const spawnStraySheep = () => {
    const esheep = new window.eSheep()
    esheep.Start()
  }
  React.useEffect(() => {

    if (window.eSheep) {
      if (!initialized) {
        const esheep = new window.eSheep()
        esheep.Start()
        setWindowStack({ action: 'push', window: 'n00d' })
        setInitialized(true)
      }
    }
  })
  function setIframesrc(x) {
    if (windowStack.indexOf('iexplore') === -1) setWindowStack({ action: 'push', window: 'iexplore' })
    _setIframesrc(x)
  }
  const { chain } = useNetwork()
  if (chain?.id && chain?.id != 1 && chain?.id != 5) alert(`Network ${chain?.id} not supported`)
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const [windowPositions, setWindowPositions] = React.useReducer((res, action) => {
    res[action.window] = action.data
    return res
  }, {})
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="n00d"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <Script src="https://adrianotiger.github.io/web-esheep/dist/esheep.min.js"></Script>
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>n00dleSwap</title>
      </Head>
      <Wrapper>
        <GlobalStyles></GlobalStyles>
        <ThemeProvider theme={original} >
          {
            windowStack.map((window, i) => <Draggable
              onStop={(e, data) => {
                setWindowPositions({ window, data })
              }}
              defaultPosition={windowPositions[window]}
              onMouseDown={
                () => {
                  setWindowStack({ action: 'focus', window })
                  setIexploreWindow(!iexploreWindow)
                }} key={window + i} handle=".window-header" ><Window
                  style={{ position: 'absolute' }}
                  className='window'>
                <WindowHeader active={i === windowStack.length - 1} className='window-header'>
                  <span>{window}.exe</span>
                  <Button onClick={(event) => {
                    setWindowStack({ action: 'del', window })
                    setWelcomeWindow(!welcomeWindow)
                    event.stopPropagation()
                  }}>
                    <span className='close-icon' />
                  </Button>
                </WindowHeader>{windows[window]}
              </Window>
            </Draggable>)
          }

          <AppBar>
            <Toolbar style={{ justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Button
                  onClick={() => setOpen(!open)}
                  active={open}
                  style={{ fontWeight: 'bold' }}
                >
                  <Image src="/assets/noodlogo.png" alt="Vercel Logo" width={32} height={20} marginRight={4} />
                  Start
                </Button>
                {open && (
                  <List
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '100%',
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <ListItem disabled={address} onClick={connect}>
                      <span role='img' aria-label='🔗'>
                        🔗
                      </span>
                      {address ? 'Connected' : 'Connect Wallet'}
                    </ListItem>
                    <Divider></Divider>
                    <ListItem  onClick={() => setWindowStack({ action: 'push', window: 'x' })}>
                      <span role='img' aria-label='👨‍🍳' >
                        👨‍🍳
                      </span>
                      &nbsp;Prepare Meal (Earn fees)
                    </ListItem>
                    <ListItem  onClick={() => setWindowStack({ action: 'push', window: 'stake' })}>
                      <span role='img' aria-label='🍴' >
                        🍴
                      </span>
                      Dining Table (Staking)
                    </ListItem>
                    <Divider />
                    <ListItem  onClick={() => setWindowStack({ action: 'push', window: 'nftselector' })}>
                      <span role='img' aria-label='🤑' >
                        🤑
                      </span>
                      List your NFT
                    </ListItem>
                    <ListItem  onClick={() => setWindowStack({ action: 'push', window: 'createoffer' })}>
                      <span role='img' aria-label='💱' >
                        💱
                      </span>
                      Create offer for NFT
                    </ListItem>
                    <ListItem  onClick={() => setWindowStack({ action: 'push', window: 'mypools' })}>
                      <span role='img' aria-label='🏊' >
                        🏊
                      </span>
                      My Pools
                    </ListItem>
                    <Divider></Divider>
                    <ListItem onClick={() => setWindowStack({ action: 'push', window: 'sweep' })}>
                      <span role='img' aria-label='🔀'>
                        🔀
                      </span>
                      Sweep NFTs
                    </ListItem>
                    <Divider />

                    <ListItem onClick={() => {
                      setWindowStack({ action: 'push', window: 'n00d' })
                      setWelcomeWindow(true)
                    }}>
                      <span role='img' aria-label='👨‍💻'>
                        👨‍💻
                      </span>
                      Info
                    </ListItem>
                    <ListItem onClick={() => {
                      spawnStraySheep()
                    }}>
                      straysheep.exe
                    </ListItem>
                  </List>
                )}
              </div>
            </Toolbar>
          </AppBar>

        </ThemeProvider>

      </Wrapper>
    </>
  )
}