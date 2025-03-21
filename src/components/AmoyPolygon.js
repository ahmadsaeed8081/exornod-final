import { defineChain } from 'viem'
 
export const AmoyPolygon = defineChain({
  id: 80002,
  name: 'AmoyPolygon',
  nativeCurrency: { name: 'AmoyPolygon', symbol: 'Matic', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-amoy-bor-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: { name: 'amoy.polygonScan', url: 'https://amoy.polygonscan.com/' },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
})