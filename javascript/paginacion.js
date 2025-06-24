const pizzas = Array.from(document.querySelectorAll('.pizza-card'));
const pizzasPorPagina = 8;
const paginacion = document.getElementById('paginacion');

let categoriaActual = 'todas';

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

document.addEventListener('DOMContentLoaded', () => {
    filtrarCategoria('todas'); // Inicialmente muestra todas
});