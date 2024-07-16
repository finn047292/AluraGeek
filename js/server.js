const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const formidable = require('formidable');

const PORT = 3000;

// Función para leer los productos desde el archivo datos.json
const readProducts = (callback) => {
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, JSON.parse(data));
    });
};

// Función para escribir los productos en el archivo datos.json
const writeProducts = (products, callback) => {
    fs.writeFile('datos.json', JSON.stringify(products, null, 2), callback);
};

// Servidor HTTP
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/productos') {
        readProducts((err, products) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error leyendo los datos' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        });
    } else if (req.method === 'POST' && req.url === '/api/productos') {
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, 'uploads');
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error procesando el formulario' }));
                return;
            }

            const { nombre, precio } = fields;
            const imagen = files.imagen ? path.join('/uploads', path.basename(files.imagen.path)) : '';

            const nuevoProducto = {
                producto: nombre,
                valor: parseFloat(precio),
                imagen: imagen
            };

            readProducts((err, products) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error leyendo los datos' }));
                    return;
                }

                products.push(nuevoProducto);

                writeProducts(products, (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error escribiendo los datos' }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(nuevoProducto));
                });
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});