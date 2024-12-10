import {defineChain} from "viem";

export const japanopenchainTestnet = defineChain({
    id: 10081,
    name: 'Japan Open Chain (Testnet)',
    nativeCurrency: { name: 'Japan Open Chain Testnet', symbol: 'JOCT', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc-3.testnet.japanopenchain.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'JOC Testnet explorer',
            url: 'https://explorer.testnet.japanopenchain.org/',
            apiUrl: 'https://explorer.testnet.japanopenchain.org/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1,
        },
    },
})
