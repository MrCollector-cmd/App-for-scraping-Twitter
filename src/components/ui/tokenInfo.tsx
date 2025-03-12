interface TokenInfoProps {
    data: any;
    className?: string
}

export function TokenInfo({ data, className }: TokenInfoProps) {
    return (
        <div className={`${className} mt-4 p-4 rounded-2xl bg-purple-800 text-white`}>
            <h2 className="text-lg font-bold">{data.baseToken.name} ({data.baseToken.symbol})</h2>
            <p>Precio en USD: ${data.priceUsd}</p>
            <p>Precio en SOL: {data.priceNative}</p>
            <p>Volumen (24h): ${data.volume.h24}</p>
            <p>Liquidez: ${data.liquidity.usd}</p>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Ver en DexScreener</a>
        </div>
    );
}