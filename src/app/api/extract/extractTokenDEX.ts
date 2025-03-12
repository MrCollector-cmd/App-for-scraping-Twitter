import fetch from 'node-fetch';
import { loadExistingData, saveData, createInfoDirectory } from '../utils/fileHandle';

interface TokenLink {
  type: string;
  url: string;
}

interface TokenData {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  description?: string;
  links?: TokenLink[];
}

const FILE_NAME = "tokens_inf.json";

// Función para obtener datos desde la API
async function fetchTokenData(): Promise<TokenData[]> {
  const url = "https://api.dexscreener.com/token-profiles/latest/v1";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();

    // Si la respuesta es un array, retornamos los datos, si no, lo envolvemos en un array
    return Array.isArray(data) ? data as TokenData[] : [data as TokenData];

  } catch (error) {
    console.error("❌ Error al obtener los datos de la API:", error);
    return [];
  }
}

// Función principal
export async function extractTokenDEX() {
  await createInfoDirectory(); // Asegurar que la carpeta existe

  const existingTokens: TokenData[] = await loadExistingData(FILE_NAME) as TokenData[];
  const newTokens = await fetchTokenData();

  if (newTokens.length === 0) {
    console.log("❌ No se obtuvieron nuevos datos.");
    return;
  }

  // Crear un mapa con los tokens existentes (para comparación rápida)
  const existingMap = new Map(existingTokens.map(token => [token.tokenAddress, token]));

  // Filtrar los tokens nuevos que no están en el archivo
  const updatedTokens = newTokens.filter(token => !existingMap.has(token.tokenAddress));

  // Si hay tokens nuevos, los agregamos a la lista
  if (updatedTokens.length > 0) {
    console.log(`🔄 Agregando ${updatedTokens.length} tokens nuevos.`);
    existingTokens.push(...updatedTokens);
  }

  // Si la API tiene menos tokens que el archivo, eliminamos los sobrantes
  const updatedTokenAddresses = new Set(newTokens.map(token => token.tokenAddress));
  const filteredTokens = existingTokens.filter(token => updatedTokenAddresses.has(token.tokenAddress));

  if (filteredTokens.length < existingTokens.length) {
    console.log(`🗑️ Eliminando ${existingTokens.length - filteredTokens.length} tokens obsoletos.`);
  }

  // Limitar a máximo 10 tokens antes de guardar
  const finalTokens = filteredTokens.slice(0, 10);

  // Guardamos los datos actualizados
  await saveData<TokenData[]>(finalTokens, FILE_NAME);
}
