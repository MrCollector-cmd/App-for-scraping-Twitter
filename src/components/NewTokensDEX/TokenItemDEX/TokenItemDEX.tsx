"use client";

import Link from "next/link";

interface Props {
    url: string;
    chainId: string;
    tokenAddress: string;
    icon?: string;
    description?: string;
}

export const TokenItemDEX = (token: Props) => {
    return (
        <Link key={token.tokenAddress} target="_blank" href={token.url} passHref>
            <div className="py-2 px-3 flex justify-center items-center my-6 mx-5 rounded-2xl bg-purple-800 cursor-pointer overflow-hidden transition-transform transform hover:scale-105 max-w-full shadow-md">
                <img
                    className="h-[4em] w-[4em] object-cover rounded-full cursor-pointer mr-3"
                    src={token.icon || "/default-token.png"}
                    alt="Token Image"
                />
                <div className="flex-grow">
                    <p className="text-white text-sm line-clamp-2">
                        {token.description || "Sin descripción disponible."}
                    </p>
                </div>
            </div>
        </Link>
    );
};
