const pizzas = Array.from(document.querySelectorAll('.pizza-card'));
let pizzasPorPagina = calcularPizzasPorPagina();
const paginacion = document.getElementById('paginacion');
let categoriaActual = 'todas';

function calcularPizzasPorPagina() {
    const ancho = window.innerWidth;
    if (ancho >= 1440) return 8;     // Pantallas grandes
    if (ancho >= 768) return 6;      // Tablets
    return 4;                        // Teléfonos
}

function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    crearPaginacion();
    mostrarPagina(1);
}

function obtenerPizzasFiltradas() {
    if (categoriaActual === 'todas') return pizzas;
    return pizzas.filter(pizza => pizza.classList.contains(categoriaActual));
}

function mostrarPagina(numeroPagina) {
    const pizzasFiltradas = obtenerPizzasFiltradas();

    pizzas.forEach(pizza => {
        pizza.classList.add('ocultando');
        setTimeout(() => {
            pizza.style.display = 'none';
            pizza.classList.remove('ocultando');
        }, 300);
    });

    setTimeout(() => {
        pizzasFiltradas.forEach((pizza, index) => {
            if (index >= (numeroPagina - 1) * pizzasPorPagina && index < numeroPagina * pizzasPorPagina) {
                pizza.style.display = 'block';
                pizza.classList.add('ocultando');
                setTimeout(() => {
                    pizza.classList.remove('ocultando');
                }, 10);
            }
        });
    }, 300);

    const botones = document.querySelectorAll('.paginacion button');
    botones.forEach((btn, i) => {
        btn.classList.toggle('activo', i === numeroPagina - 1);
    });
}

function crearPaginacion() {
    const totalPizzas = obtenerPizzasFiltradas().length;
    const totalPaginas = Math.ceil(totalPizzas / pizzasPorPagina);
    paginacion.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => mostrarPagina(i));
        paginacion.appendChild(btn);
    }
}

// Recalcular cuando se redimensiona la ventana
window.addEventListener('resize', () => {
    const nuevoValor = calcularPizzasPorPagina();
    if (nuevoValor !== pizzasPorPagina) {
        pizzasPorPagina = nuevoValor;
        crearPaginacion();
        mostrarPagina(1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    filtrarCategoria('todas');
});