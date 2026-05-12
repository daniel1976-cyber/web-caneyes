const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directorio actual (donde se ejecuta el script)
const dir = __dirname;

// Función principal
async function optimizeImages() {
    console.log('Iniciando optimización de imágenes...');
    
    // Leer todos los archivos del directorio
    const files = fs.readdirSync(dir);
    
    // Filtrar solo las imágenes JPG, JPEG y PNG
    const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
    });
    
    if (images.length === 0) {
        console.log('No se encontraron imágenes para optimizar en este directorio.');
        return;
    }

    console.log(`Se encontraron ${images.length} imágenes. Comenzando conversión a WebP...`);

    for (const file of images) {
        const inputPath = path.join(dir, file);
        const fileNameWithoutExt = path.basename(file, path.extname(file));
        
        // Vamos a guardar la nueva imagen con la extensión .webp
        const outputPath = path.join(dir, `${fileNameWithoutExt}.webp`);
        
        try {
            // Obtener el tamaño original
            const originalStats = fs.statSync(inputPath);
            const originalSizeKB = (originalStats.size / 1024).toFixed(2);
            
            // Convertir y comprimir a formato WebP (calidad 80 da un resultado excelente y muy ligero)
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);
                
            // Obtener el nuevo tamaño
            const newStats = fs.statSync(outputPath);
            const newSizeKB = (newStats.size / 1024).toFixed(2);
            
            // Calcular ahorro
            const percentSaved = (100 - ((newStats.size / originalStats.size) * 100)).toFixed(1);
            
            console.log(`✅ [ÉXITO] ${file}: ${originalSizeKB}KB -> ${newSizeKB}KB (Ahorro: ${percentSaved}%)`);
            
        } catch (error) {
            console.error(`❌ [ERROR] Falló al optimizar ${file}:`, error.message);
        }
    }
    
    console.log('\n¡Optimización completada! 🎉');
    console.log('Revisa tu carpeta, tendrás versiones .webp de tus fotos.');
}

optimizeImages();
