import './App.css'
import {
    Config,
    useAccount,
    useBalance,
    useClient,
    useConnectorClient
} from "wagmi";
import DailyPochiPochiABI from "./abis/DailyPochiPochi.json"
const DAILY_POCHI_POCHI_ADDRESS = "0xf959Bc942509454E23e8D64ed090a5AA93Cda65c"

import {Web3} from "web3";
import {useEffect, useMemo, useState} from "react";
import BlockNumber from "./components/BlockNumber.tsx";
import {Chain, Client, Transport} from "viem";
import {japanopenchainTestnet} from "./chains/definitions/japanopenchainTestnet.ts";

function clientToWeb3js(client?: Client<Transport, Chain>) {
    if (!client) {
        return new Web3();
    }

    const { transport } = client;
    if (transport.type === 'fallback') {
        return new Web3(transport.transports[0].value.url);
    }
    return new Web3(transport);
}

function useWeb3js({ chainId }: { chainId?: number } = {}) {
    const client = useClient<Config>({ chainId });
    return useMemo(() => clientToWeb3js(client), [client]);
}

function useWeb3jsSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId });
    return useMemo(() => clientToWeb3js(client), [client]);
}

function App() {
    const { address, isConnected } = useAccount()
    const balance = useBalance({address})

    const web3 = useWeb3js({ chainId: japanopenchainTestnet.id });
    const web3Signer = useWeb3jsSigner({ chainId: japanopenchainTestnet.id });
    // call用とsend用を分けないと動かなかった
    const contract = new web3.eth.Contract(DailyPochiPochiABI, DAILY_POCHI_POCHI_ADDRESS)
    const contractSigner = new web3Signer.eth.Contract(DailyPochiPochiABI, DAILY_POCHI_POCHI_ADDRESS)

    const [ point, setPoint ] = useState(0)
    const [ errorMessage, setErrorMessage ] = useState("")
    const [ canPochi, setCanPochi ] = useState(false)
    const [ nextPochiDate, setNextPochiDate ] = useState<Date>()

    useEffect(() =>{
        if (address === undefined) {
            setPoint(0)
            setNextPochiDate(undefined)
            return
        }

        const x = async () => {
            const p: number = await contract.methods.points(address).call()
            setPoint(p)

            const updateUnixTime: any = await contract.methods.updated_at(address).call()
            const oneDay = 24*60*60 as number
            const nextPochiUnixTime = Math.floor(Number(updateUnixTime) / oneDay) * oneDay + oneDay
            const d = new Date(nextPochiUnixTime*1000)
            setCanPochi(d < new Date())
            setNextPochiDate(!canPochi ? d : undefined)
        }
        x().catch(reason => setErrorMessage(reason))

    }, [address])

    const pochi = async () => {
        if (!isConnected) {
            alert("ウォレット接続してください")
            return
        }
        await contractSigner.methods.pochi().send({from: address})
        alert("完了！")
    }

    return (
        <>
            <div className={"header"}>
                <appkit-button/>
            </div>

            <h1>デイポチ</h1>

            {
                balance?.data !== undefined && balance.data.value < 10 ** 17 &&
                <div>テストネットトークンが少ないため無料で取得しましょう。詳細は
                    <a
                        href="https://www.japanopenchain.org/docs/developer/testnet-faucet/"
                        target="_blank"
                    >
                        https://www.japanopenchain.org/docs/developer/testnet-faucet/
                    </a>
                </div>
            }

            {
                errorMessage?.length > 0 &&
                <div>エラー: {errorMessage}</div>
            }
            <div>ポイント: {point.toString()}</div>
            {
                nextPochiDate !== undefined &&
                <div>次回: {nextPochiDate.toString()}</div>
            }
            <button onClick={pochi} disabled={!canPochi}>クリック</button>
            <div className={"footer"}>
                <div>
                    <a
                        href="https://explorer.testnet.japanopenchain.org/address/0xf959Bc942509454E23e8D64ed090a5AA93Cda65c?tab=contract"
                        target="_blank"
                    >
                        contract
                    </a>
                </div>
                <div>
                    <a
                        href="https://github.com/kiraku-ltd/daily-pochi2"
                        target="_blank"
                    >
                        github
                    </a>
                </div>

                <BlockNumber/>
            </div>
        </>
    )
}

export default App
