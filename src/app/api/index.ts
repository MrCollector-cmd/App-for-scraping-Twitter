// 'use server';  

import { SearchTweetsFromUsers } from '../api/tools/searchKOLs';
import { SearchTweetsInHashtags } from '../api/tools/searchHashtags';
import { processContracts } from './authContracts/authContracts';
import { processTweets } from './extract/extractContracts';
import { extractTokenDEX } from './extract/extractTokenDEX';

const hashtags = [
    'memecoin', 'pumpfun', 'memetokens', 
    'solanatokens', 'solanameme', 'pumpmeme', 'pumptoken'
];

const usernames = [
    "@cz_binance", "@CarlosMaslaton", "@APompliano", "@RaoulGMI",
    "@Bitboy_Crypto", "@TheCryptoLark", "@coinbureau", 
    "@TradingLatino", "@sassal0x", "@brianarmstrong"
];

let isProcessingHashtags = false;
let isProcessingUsers = false;
let isProcessingContracts = false;
let isProcessingContractsInf = false;
let isProcessingPromotedTokens = false;


// Accedemos a la variable de entorno COUNT_OF_EXEC
let countOfExec = parseInt(process.env.COUNT_OF_EXEC || '0');

async function processHashtags() {
    if (isProcessingHashtags) return;
    isProcessingHashtags = true;

    try {
        console.log("Buscando tweets en hashtags...");
        await SearchTweetsInHashtags(hashtags);
        console.log("Procesamiento de hashtags completado.");
    } catch (error) {
        console.error("Error al procesar hashtags:", error);
    }

    isProcessingHashtags = false;
    setTimeout(processHashtags, 5 * 60 * 1000);
}

async function processUsers() {
    if (isProcessingUsers) return;
    isProcessingUsers = true;

    try {
        console.log("Buscando tweets de usuarios...");
        await SearchTweetsFromUsers(usernames);
        console.log("Procesamiento de usuarios completado.");
    } catch (error) {
        console.error("Error al procesar usuarios:", error);
    }

    isProcessingUsers = false;
    setTimeout(processUsers, 5 * 60 * 1000);
}

async function processContractsSolscan() {
    if (isProcessingContractsInf) return;
    isProcessingContractsInf = true;

    try {
        console.log("Procesando contratos en Solscan...");
        await processContracts();
        console.log("Procesamiento de contratos completado.");
    } catch (error) {
        console.error("Error al procesar contratos:", error);
    }

    isProcessingContractsInf = false;
    setTimeout(processContractsSolscan, 5 * 60 * 1000);
}

async function processFormatContracts() {
    if (isProcessingContracts) return;
    isProcessingContracts = true;

    try {
        console.log("Buscando contratos en tweets...");
        await processTweets();
        console.log("Procesamiento de contratos completado.");
    } catch (error) {
        console.error("Error al procesar tweets:", error);
    }

    isProcessingContracts = false;
    setTimeout(processFormatContracts, 1 * 60 * 1000);
}

async function processTokensDEX() {
    if (isProcessingPromotedTokens) return;
    isProcessingPromotedTokens = true;

    try {
        console.log("Buscando contratos en tweets...");
        await extractTokenDEX();
        console.log("Procesamiento de contratos completado.");
    } catch (error) {
        console.error("Error al procesar tweets:", error);
    }

    isProcessingPromotedTokens = false;
    setTimeout(processTokensDEX, 5 * 60 * 1000);
}

export const runServer = ()=>{
    if (typeof window === 'undefined' && countOfExec === 0) {
        processHashtags();
        processUsers();
        processFormatContracts();
        processContractsSolscan();
        processTokensDEX();
        countOfExec++;
        // Actualiza la variable de entorno (necesitas reiniciar el servidor para que este cambio surta efecto)
        process.env.COUNT_OF_EXEC = countOfExec.toString();
    }
    
}