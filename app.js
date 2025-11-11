// Servidor Express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Importamos Mongoose para MongoDB

const app = express();

// --- Configuración de Conexión a la Base de Datos ---

// Leemos las variables de entorno para la conexión
// DB_HOST será 'mongodb' (el nombre del servicio en docker-compose.yml)
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'mi_db';
const PORT = process.env.PORT || 3000;

// La URI de conexión utiliza el nombre del servicio como hostname
const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Conexión a MongoDB
mongoose.connect(DB_URI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err.message);
    });

// --- Configuración del Servidor Express ---

// Middleware para servir archivos estáticos (su frontend estático)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba para la API
app.get('/api', (req, res) => {
    // Comprobación simple del estado de la conexión a la base de datos
    const dbStatus = mongoose.connection.readyState === 1 ? 'Conectada' : 'Desconectada';

    res.json({
        mensaje: '¡Hola desde Express en Docker!',
        base_de_datos: {
            tipo: 'MongoDB',
            estado: dbStatus
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

