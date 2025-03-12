'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TokenInfo } from "../ui/tokenInfo";

interface SearcherProps {
    className: string;
}

export function Searcher({ className }: SearcherProps) {
    const [address, setAddress] = useState("");
    const [tokenData, setTokenData] = useState<any>(null);

    const fetchTokenData = async () => {
        if (!/^\w{32,44}$/.test(address)) {
            alert("Invalid address.");
            return;
        }

        try {
            const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${address}`);
            const data = await response.json();
            if (data.length > 0) {
                setTokenData(data[0]);
            } else {
                alert("Token not found.");
            }
        } catch (error) {
            console.error("Error retrieving token data:", error);
            alert("Error searching for the token");
        }
    };

    return (
        <div className={className}>
            <h2 className="text-white font-bold text-2xl text-center p-2">Search Token</h2>

            <div className="display flex lg:h-[em] justify-center items-center">
                <Input
                    placeholder="Insert token address on the solana chain"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mx-3"
                />
                <Button text="Search" onClick={fetchTokenData} className="mx-3 cursor-pointer"/>
            </div>
            {tokenData && <TokenInfo data={tokenData} className="m-3"/>}
        </div>
    );
}
