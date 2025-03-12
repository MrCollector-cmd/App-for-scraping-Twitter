import axios from 'axios';
import { exec } from 'child_process';

// Ejecuta el servidor de Next.js
exec('next dev', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error al iniciar Next.js: ${stderr}`);
        return;
    }
    console.log(stdout);
});

// Después de iniciar Next.js, realiza la llamada HTTP con axios
setTimeout(async () => {
    try {
        await axios.get('http://localhost:3000/api/server');
        console.log('Servidor inicializado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar la inicialización del servidor:', error);
    }
}, 10000); // Espera 5 segundos para asegurarte de que Next.js esté funcionando