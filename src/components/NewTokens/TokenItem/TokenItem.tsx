'use client'

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export interface Props {
    imgSrc: string;
    tokenName: string;
    tokenHolders: string;
    tokenPrice: string;
    tokenContract: string;
    tokenMC: string;
    tokenCD: string;
    isOpen: boolean; // Nuevo prop para indicar si está abierto
    onToggle: () => void; // Función para alternar estado
}

export const TokenItem = ({ imgSrc, tokenName, tokenHolders, tokenPrice, isOpen, tokenContract, tokenMC, tokenCD, onToggle }: Props) => {
    const [showContent, setShowContent] = useState(isOpen);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowContent(true);
        } else {
            // Esperar que la animación de altura termine antes de ocultar el contenido
            setTimeout(() => setShowContent(false), 300); // Tiempo suficiente para la animación
        }
    }, [isOpen]);

    // Formatear tokenCD para que solo muestre los últimos dos dígitos del año
    const formattedTokenCD = tokenCD ? tokenCD.replace(/(\d{4})/, match => match.slice(2)) : "N/A";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tokenContract);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full">
            <div
                className="cursor-pointer bg-purple-800 rounded-xl my-2 m-3 flex flex-col sm:flex-row justify-start items-center p-1 hover:scale-102 transition-all"
                onClick={onToggle}
            >
                <img
                    src={imgSrc}
                    alt={tokenName}
                    className="rounded-full my-2 mx-3 sm:w-[7%] w-[15%]"
                />
                <div className="m-3">
                    <h2>Name: {tokenName}</h2>
                    <span>Date Creation: {formattedTokenCD}</span>
                    <span className="ml-3">Price: {tokenPrice}</span>
                    <span className="ml-3">Holders: {tokenHolders}</span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, height: 0, padding: "0px" }} // Inicia con padding 0
                animate={{
                    opacity: isOpen ? 1 : 0,
                    height: isOpen ? "auto" : 0,
                    padding: isOpen ? "20px" : "0px" // Cambia el padding durante la animación
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-y-hidden overflow-x-auto bg-purple-700 text-white mt-1 rounded-lg"
            >
                {/* Solo animar cuando se abre */}
                {isOpen && showContent && (
                    <>
                        <h3 className="font-bold">More information</h3>
                        <span>Contract: </span><p className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300" onClick={copyToClipboard}>
                            {tokenContract}
                            <span className="text-sm">{copied ? "(Copied!)" : "(Tap to copy)"}</span>
                        </p>
                        <p>Market Cap: {tokenMC}</p>
                    </>
                )}
            </motion.div>

        </div>
    );
};
