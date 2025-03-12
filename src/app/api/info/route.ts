import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dirPath = path.join(process.cwd(), "src/app/api/info");
const filePath = (fileName: string) => path.join(dirPath, fileName);


// Cargar datos desde un archivo JSON
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file") || "contract_inf.json";
    
    try {
        const fileContent = await fs.readFile(filePath(fileName), "utf-8");
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        console.log(`No se encontró ${fileName}, se creará uno nuevo.`);
        return NextResponse.json({});
    }
}

// Guardar datos en un archivo JSON
export async function POST(req: Request) {
    const { fileName, data } = await req.json();
    
    try {
        await fs.writeFile(filePath(fileName), JSON.stringify(data, null, 2), "utf-8");
        return NextResponse.json({ message: `Datos guardados en ${fileName}` });
    } catch (error) {
        return NextResponse.json({ error: "Error al guardar datos" }, { status: 500 });
    }
}