"use client";

import { useEffect, useState } from "react";
import { TokenItemDEX } from "./TokenItemDEX/TokenItemDEX";
import { Loading } from "../Loading/Loading";

interface TokenData {
    url: string;
    chainId: string;
    tokenAddress: string;
    icon?: string;
    description?: string;
}

interface Props {
    className?: string;
}

export const NewTokensDEX = ({ className }: Props) => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await fetch("/api/info?file=tokens_inf.json");
                if (!response.ok) throw new Error("Error al cargar los tokens");
                const data = await response.json();
                // Si los datos no son un arreglo o están vacíos, evita procesarlos
                setTokens(Array.isArray(data) && data.length ? data.slice(0, 10) : []);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    if (loading)return <Loading />

    return (
        <div className={`${className} overflow-y-auto overflow-x-hidden`}>
            <h2 className="text-white font-bold text-2xl text-center p-2">New Tokens DEX</h2>

            {error && <p className="text-red-500 text-center">Error: {error}</p>}

            {tokens.length === 0 && !error && (
                <p className="text-gray-400 text-center">No tokens available.</p>
            )}

            <div>
                {tokens.map((token) => (
                    <TokenItemDEX key={token.tokenAddress} {...token} />
                ))}
            </div>
        </div>
    );
};
