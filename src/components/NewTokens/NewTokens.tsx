"use client";

import { useEffect, useState } from "react";
import { TokenItem } from "./TokenItem/TokenItem";
import { Loading } from "../Loading/Loading";

interface Props {
    className?: string;
}

export const NewTokens = ({ className }: Props) => {
    const [data, setData] = useState<Record<string, any[]> | null>(null);
    const [loading, setLoading] = useState(true);
    const [openToken, setOpenToken] = useState<string | null>(null); // Para manejar el token abierto

    useEffect(() => {
        const fetchData = async () => {
            if (!data) {  // Solo hace la petición si `data` no ha sido cargado aún.
                try {
                    const response = await fetch(`/api/info?file=contract_inf.json`);
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    console.error("Error cargando los datos:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchData();
    }, [data]); // Se ejecuta solo cuando `data` cambia.
    
    const handleToggle = (key: string) => {
        setOpenToken((prev) => (prev === key ? null : key)); // Si el mismo token es tocado, se cierra
    };

    if (loading) return <Loading/>;

    return (
        <div className={`${className} overflow-y-scroll`}>
            <h2 className="text-white font-bold text-2xl text-center p-2">New Tokens X</h2>
            <div className="flex flex-col p-3 text-white">
                {data &&
                    Object.entries(data)
                        .filter(([_, value]) => value[3]?.includes("$")) // Filtra solo los que tienen "$"
                        .map(([key, value]) => (
                            <TokenItem
                                tokenCD={value[6]}
                                tokenMC={value[4]}
                                tokenContract={value[2]}
                                key={key}
                                imgSrc={value[0]}
                                tokenName={key}
                                tokenPrice={value[3]}
                                tokenHolders={value[5]}
                                isOpen={openToken === key} // Verifica si este token está abierto
                                onToggle={() => handleToggle(key)} // Alterna la visibilidad del token
                            />
                        ))}
            </div>
        </div>
    );
};
