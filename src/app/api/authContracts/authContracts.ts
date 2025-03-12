import { loadExistingData, saveData, createInfoDirectory } from '../utils/fileHandle';
import { startBrowser, openNewPage, closeBrowser } from '../scraper/puppeteerSetup';
import { extractInfUrlFromContract } from '../extract/extractInfUrlOfContracts';

// Definir el tipo esperado para los datos de los contratos
interface ContractsData {
    contracts: string[];
}

export async function processContracts(): Promise<void> {
    const browser = await startBrowser();
    const page = await openNewPage(browser);

    // Cargar los contratos desde 'contracts.json' y asegurar el tipo correcto
    const contractsData: ContractsData = await loadExistingData('contracts.json');
    // Filtrar direcciones de contrato no nulas
    const contractAddresses: string[] = (contractsData.contracts || []).filter((addr): addr is string => addr !== null);

    if (contractAddresses.length === 0) {
        console.log("No hay contratos para procesar.");
        await closeBrowser(browser);
        return;
    }

    // Cargar datos existentes de 'contract_inf.json'
    let result: Record<string, any[]> = await loadExistingData('contract_inf.json');

    // Extraer los contratos ya guardados (se encuentran en la posición 2 de cada array)
    const existingContracts: string[] = Object.values(result).map(data => data[2]);
    // Verificar si falta alguno o la cantidad no coincide
    const missingContracts = contractAddresses.filter(addr => !existingContracts.includes(addr));
    
    if (missingContracts.length > 0 || existingContracts.length !== contractAddresses.length) {
        console.log("No coinciden los contratos, borrando contract_inf.json y re-creándolo.");
        result = {}; // Se borra toda la información antigua
    }

    // Procesar cada contrato (se vuelve a procesar todos los contratos de contracts.json)
    for (const contractAddress of contractAddresses) {
        console.log(`Procesando contrato: ${contractAddress}`);

        // Extraer información del contrato
        const { imageUrl, nameToken, marketCap, currentSupply, holders, creationDate } = await extractInfUrlFromContract(page, contractAddress);

        // Determinar la nueva clave (nombre del token o la dirección si no se encontró nombre)
        const newKey = nameToken || contractAddress;

        // Actualizar o agregar la entrada
        result[newKey] = [
            imageUrl,
            nameToken,
            contractAddress,
            marketCap,
            currentSupply,
            holders,
            creationDate
        ];
    }

    // Guardar el archivo con la información actualizada (sobrescribe el contenido anterior)
    await saveData(result, 'contract_inf.json');
    console.log(`Total contratos: ${Object.keys(result).length}`);
    console.log('Proceso completado.');

    await closeBrowser(browser);
}
