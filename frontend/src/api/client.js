import axios from 'axios';

// Configuración de red para dispositivos físicos y emuladores
// Reemplaza localhost/10.0.2.2 con la IP de tu máquina en la red local
const SERVER_IP = '192.168.100.10';
const SERVER_PORT = '4000';

const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}/api`;

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export default client;
