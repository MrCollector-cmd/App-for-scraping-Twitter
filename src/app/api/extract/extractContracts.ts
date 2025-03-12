import { createInfoDirectory, loadExistingData, saveData } from '../utils/fileHandle';

// Nombres de los archivos en el directorio ./src/info
const hashtagFile = 'infoHashtag.json';
const kolsFile = 'infoKOLs.json';
const outputFile = 'contracts.json';

// Expresión regular para detectar direcciones de contratos de Solana (Base58, 32-44 caracteres)
const solanaContractRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;

interface ContractsData {
    contracts: string[];
}

export async function processTweets(): Promise<void> {
    // Asegurarse de que el directorio existe
    await createInfoDirectory();

    // Cargar los datos existentes de contratos y asegurar el tipo correcto
    const existingData: ContractsData = await loadExistingData(outputFile);
    
    // Ahora `contracts` tiene el tipo adecuado
    let contracts: string[] = existingData?.contracts ?? [];

    // Cargar los datos de tweets
    const hashtagData = await loadExistingData(hashtagFile);
    const kolsData = await loadExistingData(kolsFile);

    // Verificar que los datos de hashtags y KOLs sean objetos
    if (typeof hashtagData !== 'object' || Array.isArray(hashtagData)) {
        console.error('Error: Los datos de hashtag no son un objeto válido.', hashtagData);
        return;
    }

    if (typeof kolsData !== 'object' || Array.isArray(kolsData)) {
        console.error('Error: Los datos de KOLs no son un objeto válido.', kolsData);
        return;
    }

    // Función para procesar cada tweet
    async function processTweet(tweet: any): Promise<void> {
        if (tweet.message) {
            const match = tweet.message.match(solanaContractRegex);
            if (match && match.length > 0) {
                // Tomamos el primer contrato encontrado en el tweet
                const contract = match[0];

                // Si el contrato no está en la lista, lo agregamos
                if (!contracts.includes(contract)) {
                    contracts.push(contract);
                    console.log(`Contrato ${contract} agregado.`);
                }
            }
        }
    }

    // Función para procesar un objeto de tweets
    async function processSource(data: { [key: string]: any[] }): Promise<void> {
        // Recorremos cada propiedad del objeto
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const tweets = data[key];
                if (Array.isArray(tweets)) {
                    for (const tweet of tweets) {
                        await processTweet(tweet);
                    }
                }
            }
        }
    }

    // Procesar los tweets de ambas fuentes
    await processSource(hashtagData); // Es un objeto con propiedades que contienen arreglos
    await processSource(kolsData);     // Es un objeto con propiedades que contienen arreglos

    // Después de procesar todos los tweets, asegurarse de que solo tengamos los contratos nuevos
    // Actualizamos el archivo de contratos con solo los contratos nuevos encontrados
    await saveData({ contracts }, outputFile);
    console.log('Proceso completado.');
}
