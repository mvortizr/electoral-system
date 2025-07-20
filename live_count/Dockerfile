# Paso 1: Usa una imagen base de Node.js. Esto nos da un entorno con Node.js y npm preinstalados.
FROM node:18-alpine

# Paso 2: Establece el directorio de trabajo dentro del contenedor. Aquí se copiará el código de tu app.
WORKDIR /app

# Paso 3: Copia los archivos de configuración de dependencias. Esto permite que Docker use el cache.
COPY package.json package-lock.json ./

# Paso 4: Instala las dependencias de Node.js.
# --production solo instala dependencias de producción, lo que hace la imagen más pequeña.
RUN npm install --production

# Paso 5: Copia el resto del código de tu aplicación al contenedor.
COPY . .

# Paso 6: Compila tu aplicación NestJS. Esto genera los archivos JavaScript en la carpeta 'dist'.
RUN npm run build

# Paso 7: Expone el puerto en el que la aplicación NestJS escuchará. (Por defecto 3000)
EXPOSE 3000

# Paso 8: Define el comando para iniciar la aplicación cuando el contenedor se ejecuta.
# Aquí estamos diciendo que ejecute el archivo 'main.js' que se generó en 'dist'.
CMD [ "node", "dist/main" ]