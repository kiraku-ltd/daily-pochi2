import {useBlockNumber} from "wagmi";

function BlockNumber() {
    const { data }  = useBlockNumber({watch: true})

    return (
        <>
            <div>block: {data?.toString()}</div>
        </>
    )
}

export default BlockNumber
