/**
 * Convierte un path relativo o URL a una URL pública completa
 * @param {string} value - Path relativo (/uploads/...) o URL completa
 * @returns {string|null} - URL pública completa o null
 */
function toPublicUrl(value) {
  const baseUrl = process.env.APP_URL || 'http://localhost:4000';
  
  if (!value) return null;
  
  // Si ya es una URL completa, devolverla tal cual
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  
  // Si es un path relativo que empieza con /uploads/, construir URL completa
  if (value.startsWith('/uploads/')) {
    return `${baseUrl}${value}`;
  }
  
  // Para cualquier otro caso, devolver el valor original
  return value;
}

module.exports = { toPublicUrl };
