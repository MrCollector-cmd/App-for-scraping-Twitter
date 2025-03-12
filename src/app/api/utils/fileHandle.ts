
import { promises as fs } from 'fs';
import path from 'path';

export async function createInfoDirectory(): Promise<void> {
    await fs.mkdir('./src/app/api/info', { recursive: true });
}

export async function loadExistingData<T = any[]>(fileName: string): Promise<T> {
    const filePath = path.join('./src/app/api/info', fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        if (!fileContent) {
            console.log(`El archivo ${fileName} está vacío.`);
            return [] as T;
        }
        return JSON.parse(fileContent) as T;
    } catch (err) {
        console.log(`Error al leer el archivo ${fileName}: ${err}`);
        return [] as T; // Retorna un array vacío en caso de error
    }
}

export async function saveData<T>(data: T, fileName: string): Promise<void> {
    const filePath = path.join('./src/app/api/info', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Datos guardados en ${filePath}`);
}
