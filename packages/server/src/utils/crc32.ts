/**
 * Tabla de lookup precalculada para CRC32
 * Se genera una sola vez y se reutiliza en todas las llamadas
 */
let crcTable: number[] | null = null;

function generateCrcTable(): number[] {
    if (crcTable !== null) {
        return crcTable;
    }
    
    crcTable = [];
    // Generar la tabla de lookup
    for (let i = 0; i < 256; i++) {
        let crc = i;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 1) ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1;
        }
        crcTable[i] = crc;
    }
    
    return crcTable;
}

/**
 * Calcula el CRC32 de una cadena de texto
 * @param str - La cadena de texto a procesar
 * @returns El valor CRC32 como número sin signo (unsigned 32-bit)
 */
export function crc32(str: string): number {
    const table = generateCrcTable();
    
    // Calcular CRC32
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < str.length; i++) {
        const byte = str.charCodeAt(i);
        crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xFF];
    }
    
    // Invertir bits y convertir a unsigned
    crc = (crc ^ 0xFFFFFFFF) >>> 0;
    
    return crc;
}
