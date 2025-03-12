import { runServer } from "../index";  // Importa la función runServer

export async function GET() {
    try {
        // Ejecutar runServer solo si no se ha ejecutado antes
        if (process.env.COUNT_OF_EXEC === '0') {
            runServer();  // Ejecuta el código de tu servidor
            return new Response(JSON.stringify({ message: 'Servidor inicializado correctamente' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Servidor ya ha sido inicializado' }), { status: 200 });
        }
    } catch (error) {
        console.error("Error al inicializar el servidor:", error);
        return new Response(JSON.stringify({ message: 'Error al inicializar el servidor' }), { status: 500 });
    }
}
