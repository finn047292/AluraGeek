let menuProductos = [];

async function getProductos() {
    try {
        const response = await fetch('datos.json');
        const data = await response.json();
        console.log('Datos obtenidos:', data);
        
        menuProductos = data;
        
        return data;
    } catch (error) {
        console.error('ERROR:', error);
        throw error;
    }
}

async function mostrarProductos() {
    try {
        await getProductos();
        const containerProductos = document.querySelector('.productos');
        
        if (menuProductos.length === 0) {
            containerProductos.textContent = 'Sin productos';
        } else {
            menuProductos.forEach(producto => cardProducto(producto));
        }
    } catch (error) {
        console.error('ERROR', error);
    }
}

async function cardProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('card');

    const imagen = document.createElement('img');
    if (producto.imagen) {
        if (producto.imagen instanceof File) {
            const reader = new FileReader();
            reader.onload = function () {
                imagen.src = reader.result;
            };
            reader.readAsDataURL(producto.imagen);
        } else {
            imagen.src = producto.imagen;
        }
    } else {
        imagen.src = 'placeholder_imagen.png'; 
    }
    imagen.alt = 'Imagen del producto';

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('card-container--info');

    const nombreProducto = document.createElement('p');
    nombreProducto.textContent = producto.producto;
   
    const valorProducto = document.createElement('div');
    valorProducto.classList.add('card-container--value');

    const valor = document.createElement('p');
    valor.textContent = `$ ${producto.valor.toFixed(2)}`;

    const trashIcon = document.createElement('img');
    trashIcon.classList.add('trash');
    trashIcon.src = 'img/trash.png';
    trashIcon.alt = 'Icono';

    valorProducto.appendChild(valor);
    valorProducto.appendChild(trashIcon);

    infoContainer.appendChild(nombreProducto);
    infoContainer.appendChild(valorProducto);

    card.appendChild(imagen);
    card.appendChild(infoContainer);

    const containerProductos = document.querySelector('.productos');
    containerProductos.appendChild(card);

    /* Evento para eliminar un producto */
    trashIcon.addEventListener('click', async () => {
        try {
            const afirmacion = confirm("¿Quiere eliminar el producto?");
            if (afirmacion) {
                card.remove();
                menuProductos = menuProductos.filter(p => p !== producto);
                if (containerProductos.children.length === 0) {
                    containerProductos.textContent = 'Sin productos';
                }
            }
        } catch (error) {
            console.error('ERROR', error);
        }
    });
}

const formProducto = document.getElementById("form-producto");

formProducto.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const nombre = document.getElementById("nombre").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const imagen = document.getElementById("imagen").files[0];

        const nuevoProducto = {
            producto: nombre,
            valor: precio,
            imagen: imagen,
        };

        menuProductos.push(nuevoProducto);

        formProducto.reset();

        await cardProducto(nuevoProducto);

        /* Mensaje de éxito */
        const sucessoSpan = document.createElement("span");
        sucessoSpan.textContent = "Producto agregado con éxito";
        sucessoSpan.style.color = "blue"; 
        formProducto.appendChild(sucessoSpan);

        setTimeout(() => {
            formProducto.removeChild(sucessoSpan);
        }, 3000); 
    } catch (error) {
        console.error("ERROR", error);
    }
});

/* Inicializa la visualización de los productos al cargar la página */
document.addEventListener("DOMContentLoaded", mostrarProductos);
