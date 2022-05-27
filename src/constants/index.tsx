import React, { ReactNode } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  ChainId,
  JSBI,
  Percent,
  CurrencyAmount,
  WETH,
  DXD,
  WXDAI,
  Token,
  Currency,
  SWPR,
  UniswapV2RoutablePlatform,
  WMATIC,
} from '@swapr/sdk'
import { injected, walletConnect, walletLink } from '../connectors'
import UniswapLogo from '../assets/svg/uniswap-logo.svg'
import SwaprLogo from '../assets/svg/logo.svg'
import SushiswapLogo from '../assets/svg/sushiswap-logo.svg'
import SushiswapNewLogo from '../assets/svg/sushiswap-new-logo.svg'
import HoneyswapLogo from '../assets/svg/honeyswap-logo.svg'
import BaoswapLogo from '../assets/images/baoswap-logo.png'
import LevinswapLogo from '../assets/images/levinswap-logo.svg'
import QuickswapLogo from '../assets/images/quickswap-logo.png'
import DFYNLogo from '../assets/images/dfyn-logo.svg'
import { providers } from 'ethers'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const SOCKET_NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const DAI_ETHEREUM_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
export const DAI_ARBITRUM_ADDRESS = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
export const WETH_GNOSIS_ADDRESS = '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')

export const USDC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C'),
  [ChainId.ARBITRUM_ONE]: new Token(
    ChainId.ARBITRUM_ONE,
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    6,
    'USDC',
    'USD//C'
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    6,
    'USDC',
    'USD//C from Ethereum'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD//C'),
}

export const USDT: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    6,
    'USDT',
    'Tether USD from Ethereum'
  ),
  [ChainId.ARBITRUM_ONE]: new Token(
    ChainId.ARBITRUM_ONE,
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
}

export const WBTC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ARBITRUM_ONE]: new Token(
    ChainId.ARBITRUM_ONE,
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    8,
    'WBTC',
    'Wrapped BTC'
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
    8,
    'WBTC',
    'Wrapped BTC from Ethereum'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped BTC'),
}

export const HONEY = new Token(ChainId.XDAI, '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9', 18, 'HNY', 'Honey')

export const STAKE = new Token(
  ChainId.XDAI,
  '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
  18,
  'STAKE',
  'Stake Token on xDai'
)

export const BAO = new Token(
  ChainId.XDAI,
  '0x82dFe19164729949fD66Da1a37BC70dD6c4746ce',
  18,
  'BAO',
  'BaoToken from Ethereum'
)

export const AGAVE = new Token(ChainId.XDAI, '0x3a97704a1b25F08aa230ae53B352e2e72ef52843', 18, 'AGVE', 'Agave token')

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    DXD[ChainId.MAINNET],
    DAI,
    USDC[ChainId.MAINNET],
    WBTC[ChainId.MAINNET],
    USDT[ChainId.MAINNET],
  ],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.ARBITRUM_ONE]: [
    WETH[ChainId.ARBITRUM_ONE],
    DXD[ChainId.ARBITRUM_ONE],
    USDC[ChainId.ARBITRUM_ONE],
    WBTC[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.ARBITRUM_RINKEBY]: [WETH[ChainId.ARBITRUM_RINKEBY], DXD[ChainId.ARBITRUM_RINKEBY]],
  [ChainId.XDAI]: [
    WXDAI[ChainId.XDAI],
    WETH[ChainId.XDAI],
    DXD[ChainId.XDAI],
    USDC[ChainId.XDAI],
    USDT[ChainId.XDAI],
    WBTC[ChainId.XDAI],
    HONEY,
    STAKE,
    AGAVE,
    BAO,
  ],
  [ChainId.POLYGON]: [WMATIC[ChainId.POLYGON], USDC[ChainId.POLYGON], WBTC[ChainId.POLYGON], USDT[ChainId.POLYGON]],
}

// used for display in the default list when adding liquidity (native currency is already shown
// by default, so no need to add the wrapper to the list)
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [
    DXD[ChainId.MAINNET],
    DAI,
    USDC[ChainId.MAINNET],
    USDT[ChainId.MAINNET],
    WBTC[ChainId.MAINNET],
    SWPR[ChainId.MAINNET],
  ],
  [ChainId.RINKEBY]: [],
  [ChainId.ARBITRUM_ONE]: [
    WETH[ChainId.ARBITRUM_ONE],
    DXD[ChainId.ARBITRUM_ONE],
    SWPR[ChainId.ARBITRUM_ONE],
    WBTC[ChainId.ARBITRUM_ONE],
    USDC[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.ARBITRUM_RINKEBY]: [WETH[ChainId.ARBITRUM_RINKEBY], DXD[ChainId.ARBITRUM_RINKEBY]],
  [ChainId.XDAI]: [DXD[ChainId.XDAI], WETH[ChainId.XDAI], USDC[ChainId.XDAI], SWPR[ChainId.XDAI]],
  [ChainId.POLYGON]: [WMATIC[ChainId.POLYGON], USDC[ChainId.POLYGON], WBTC[ChainId.POLYGON], USDT[ChainId.POLYGON]],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], DXD[ChainId.MAINNET], DAI, USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.ARBITRUM_ONE]: [WETH[ChainId.ARBITRUM_ONE], DXD[ChainId.ARBITRUM_ONE], USDC[ChainId.ARBITRUM_ONE]],
  [ChainId.ARBITRUM_RINKEBY]: [WETH[ChainId.ARBITRUM_RINKEBY], DXD[ChainId.ARBITRUM_RINKEBY]],
  [ChainId.XDAI]: [WXDAI[ChainId.XDAI], DXD[ChainId.XDAI], WETH[ChainId.XDAI], USDC[ChainId.XDAI], STAKE],
  [ChainId.POLYGON]: [WMATIC[ChainId.POLYGON], USDC[ChainId.POLYGON], WBTC[ChainId.POLYGON], USDT[ChainId.POLYGON]],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
    [DAI, USDT[ChainId.MAINNET]],
  ],
}

export const ARBITRUM_ONE_PROVIDER = new providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc')

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    mobile: true,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: 'WalletConnect',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  COINBASE: {
    connector: walletLink,
    name: 'Coinbase',
    iconName: 'coinbase.svg',
    description: 'Connect using Coinbase.',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20
export const DEFAULT_USER_MULTIHOP_ENABLED = true

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%
// used for fiat warning states
export const ALLOWED_FIAT_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(200), BIPS_BASE) // 2%
// price impact numeric values
export const PRICE_IMPACT_NON_EXPERT = 4
export const PRICE_IMPACT_HIGH = 3
export const PRICE_IMPACT_MEDIUM = 2
export const PRICE_IMPACT_LOW = 1
export const NO_PRICE_IMPACT = 0

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const DEFAULT_TOKEN_LIST = 'ipfs://QmUWnK6AFHZ3S1hR7Up1h3Ntax3fP1ZyiTptDNG2cWLTeK'

export const ZERO_USD = CurrencyAmount.usd('0')

export interface NetworkDetails {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
}

export interface NetworkOptionalDetails {
  iconUrls?: string[] // Currently ignored.
  partnerChainId?: ChainId //arbitrum chainId if supported
  isArbitrum: boolean
}

export const NETWORK_DETAIL: { [chainId: number]: NetworkDetails } = {
  [ChainId.MAINNET]: {
    chainId: `0x${ChainId.MAINNET.toString(16)}`,
    chainName: 'Ethereum mainnet',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: Currency.ETHER.symbol || 'ETH',
      decimals: Currency.ETHER.decimals || 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainId.XDAI]: {
    chainId: `0x${ChainId.XDAI.toString(16)}`,
    chainName: 'Gnosis Chain',
    nativeCurrency: {
      name: Currency.XDAI.name || 'xDAI',
      symbol: Currency.XDAI.symbol || 'xDAI',
      decimals: Currency.XDAI.decimals || 18,
    },
    rpcUrls: ['https://rpc.gnosischain.com/'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
  },
  [ChainId.ARBITRUM_ONE]: {
    chainId: `0x${ChainId.ARBITRUM_ONE.toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: Currency.ETHER.symbol || 'ETH',
      decimals: Currency.ETHER.decimals || 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://explorer.arbitrum.io'],
  },
  [ChainId.ARBITRUM_RINKEBY]: {
    chainId: `0x${ChainId.ARBITRUM_RINKEBY.toString(16)}`,
    chainName: 'Arbitrum Rinkeby',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: Currency.ETHER.symbol || 'ETH',
      decimals: Currency.ETHER.decimals || 18,
    },
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io'],
  },
  [ChainId.RINKEBY]: {
    chainId: `0x${ChainId.RINKEBY.toString(16)}`,
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: Currency.ETHER.symbol || 'ETH',
      decimals: Currency.ETHER.decimals || 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
  [ChainId.POLYGON]: {
    chainId: `0x${ChainId.POLYGON.toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: Currency.MATIC.name || 'Matic',
      symbol: Currency.MATIC.symbol || 'MATIC',
      decimals: Currency.MATIC.decimals || 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
}

export const NETWORK_OPTIONAL_DETAIL: { [chainId: number]: NetworkOptionalDetails } = {
  [ChainId.MAINNET]: {
    partnerChainId: ChainId.ARBITRUM_ONE,
    isArbitrum: false,
  },
  [ChainId.XDAI]: {
    isArbitrum: false,
  },
  [ChainId.ARBITRUM_ONE]: {
    partnerChainId: ChainId.MAINNET,
    isArbitrum: true,
  },
  [ChainId.ARBITRUM_RINKEBY]: {
    partnerChainId: ChainId.RINKEBY,
    isArbitrum: true,
  },
  [ChainId.RINKEBY]: {
    partnerChainId: ChainId.ARBITRUM_RINKEBY,
    isArbitrum: false,
  },
}

export const ROUTABLE_PLATFORM_STYLE: {
  [routablePaltformName: string]: { logo: string; alt: string; gradientColor: string; name: string }
} = {
  [UniswapV2RoutablePlatform.UNISWAP.name]: {
    logo: UniswapLogo,
    alt: UniswapV2RoutablePlatform.UNISWAP.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.UNISWAP.name,
  },
  [UniswapV2RoutablePlatform.SUSHISWAP.name]: {
    logo: SushiswapNewLogo,
    alt: UniswapV2RoutablePlatform.SUSHISWAP.name,
    gradientColor: '#FB52A1',
    name: 'Sushi',
  },
  [UniswapV2RoutablePlatform.SWAPR.name]: {
    logo: SwaprLogo,
    alt: UniswapV2RoutablePlatform.SWAPR.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.SWAPR.name,
  },
  [UniswapV2RoutablePlatform.HONEYSWAP.name]: {
    logo: HoneyswapLogo,
    alt: UniswapV2RoutablePlatform.HONEYSWAP.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.HONEYSWAP.name,
  },
  [UniswapV2RoutablePlatform.BAOSWAP.name]: {
    logo: BaoswapLogo,
    alt: UniswapV2RoutablePlatform.BAOSWAP.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.BAOSWAP.name,
  },
  [UniswapV2RoutablePlatform.LEVINSWAP.name]: {
    logo: LevinswapLogo,
    alt: UniswapV2RoutablePlatform.LEVINSWAP.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.LEVINSWAP.name,
  },
  [UniswapV2RoutablePlatform.QUICKSWAP.name]: {
    logo: QuickswapLogo,
    alt: UniswapV2RoutablePlatform.QUICKSWAP.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.QUICKSWAP.name,
  },
  [UniswapV2RoutablePlatform.DFYN.name]: {
    logo: DFYNLogo,
    alt: UniswapV2RoutablePlatform.DFYN.name,
    gradientColor: '#FB52A1',
    name: UniswapV2RoutablePlatform.DFYN.name,
  },
}

export const ROUTABLE_PLATFORM_LOGO: { [routablePaltformName: string]: ReactNode } = {
  [UniswapV2RoutablePlatform.UNISWAP.name]: <img width={16} height={16} src={UniswapLogo} alt="uniswap" />,
  [UniswapV2RoutablePlatform.SUSHISWAP.name]: <img width={16} height={16} src={SushiswapLogo} alt="sushiswap" />,
  [UniswapV2RoutablePlatform.SWAPR.name]: <img width={16} height={16} src={SwaprLogo} alt="swapr" />,
  [UniswapV2RoutablePlatform.HONEYSWAP.name]: <img width={16} height={16} src={HoneyswapLogo} alt="honeyswap" />,
  [UniswapV2RoutablePlatform.BAOSWAP.name]: <img width={16} height={16} src={BaoswapLogo} alt="baoswap" />,
  [UniswapV2RoutablePlatform.LEVINSWAP.name]: <img width={16} height={16} src={LevinswapLogo} alt="levinswap" />,
  [UniswapV2RoutablePlatform.QUICKSWAP.name]: <img width={16} height={16} src={QuickswapLogo} alt="quickswap" />,
  [UniswapV2RoutablePlatform.DFYN.name]: <img width={16} height={16} src={DFYNLogo} alt="dfyn" />,
}

export const ChainLabel: any = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum One',
  [ChainId.ARBITRUM_RINKEBY]: 'Arbitrum Rinkeby',
  [ChainId.XDAI]: 'Gnosis Chain',
  [ChainId.POLYGON]: 'Polygon',
}

export const OLD_SWPR: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xe54942077Df7b8EEf8D4e6bCe2f7B58B0082b0cd', 18, 'SWPR', 'Swapr'),
  [ChainId.ARBITRUM_ONE]: new Token(
    ChainId.ARBITRUM_ONE,
    '0x955b9fe60a5b5093df9Dc4B1B18ec8e934e77162',
    18,
    'SWPR',
    'Swapr'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, '0xA271cCbC126a41f04BAe8fdBDbCEfCF10Bf59a48', 18, 'SWPR', 'Swapr'),
  [ChainId.ARBITRUM_RINKEBY]: new Token(
    ChainId.ARBITRUM_RINKEBY,
    '0xFe45504a21EA46C194000403B43f6DDBA2DCcC80',
    18,
    'SWPR',
    'Swapr'
  ),
}

export const TESTNETS = [4, 421611]
export const SHOW_TESTNETS = true

// addresses to filter by when querying for verified KPI tokens
export const KPI_TOKEN_CREATORS: { [key: number]: string[] } = {
  [ChainId.XDAI]: ['0xe716ec63c5673b3a4732d22909b38d779fa47c3f', '0x9467dcfd4519287e3878c018c02f5670465a9003'],
  [ChainId.RINKEBY]: ['0x1A639b50D807ce7e61Dc9eeB091e6Cea8EcB1595', '0xb4124ceb3451635dacedd11767f004d8a28c6ee7'],
}
