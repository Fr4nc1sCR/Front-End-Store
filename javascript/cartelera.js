// Cartelera: filtro por categoría + búsqueda + paginación (un solo estado),
// y modal de pedido que envía el formulario con EmailJS.

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-pizzas');
    const tarjetas = Array.from(grid.querySelectorAll('.pizza-card'));
    const chips = document.querySelectorAll('.chip');
    const buscador = document.getElementById('busqueda');
    const paginacion = document.getElementById('paginacion');
    const info = document.getElementById('resultado-info');
    const vacio = document.getElementById('estado-vacio');

    const estado = { categoria: 'todas', busqueda: '', pagina: 1 };

    const formatoColones = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        maximumFractionDigits: 0
    });

    // Ignora tildes y mayúsculas al buscar ("carnivora" encuentra "Carnívora")
    const normalizar = texto => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    tarjetas.forEach(card => {
        card.dataset.texto = normalizar(card.textContent);
    });

    // ---------- Filtrado y paginación ----------
    function pizzasPorPagina() {
        const columnas = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        if (columnas === 1) return 4;
        if (columnas === 2) return 6;
        return columnas * 2;
    }

    function coincide(card) {
        const categorias = card.dataset.categoria.split(' ');
        const enCategoria = estado.categoria === 'todas' || categorias.includes(estado.categoria);
        return enCategoria && card.dataset.texto.includes(estado.busqueda);
    }

    function render({ animar = true } = {}) {
        const filtradas = tarjetas.filter(coincide);
        const porPagina = pizzasPorPagina();
        const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
        estado.pagina = Math.min(estado.pagina, totalPaginas);

        const inicio = (estado.pagina - 1) * porPagina;
        const visibles = filtradas.slice(inicio, inicio + porPagina);

        tarjetas.forEach(card => {
            card.hidden = !visibles.includes(card);
            card.classList.remove('is-entrando');
        });

        if (animar) {
            visibles.forEach((card, i) => {
                card.style.animationDelay = `${i * 60}ms`;
                void card.offsetWidth; // reinicia la animación
                card.classList.add('is-entrando');
            });
        }

        vacio.hidden = filtradas.length > 0;
        info.innerHTML = filtradas.length
            ? `Mostrando <strong>${inicio + 1}–${inicio + visibles.length}</strong> de <strong>${filtradas.length}</strong> pizzas`
            : '';

        crearPaginacion(totalPaginas, filtradas.length > 0);
    }

    const flecha = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

    function crearPaginacion(totalPaginas, hayResultados) {
        paginacion.innerHTML = '';
        if (!hayResultados || totalPaginas < 2) return;

        const boton = (contenido, pagina, etiqueta) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerHTML = contenido;
            btn.setAttribute('aria-label', etiqueta);
            btn.disabled = pagina < 1 || pagina > totalPaginas;
            if (pagina === estado.pagina && typeof contenido === 'number') {
                btn.setAttribute('aria-current', 'page');
            }
            btn.addEventListener('click', () => irAPagina(pagina));
            paginacion.appendChild(btn);
        };

        boton(flecha('M15 18l-6-6 6-6'), estado.pagina - 1, 'Página anterior');
        for (let i = 1; i <= totalPaginas; i++) boton(i, i, `Página ${i}`);
        boton(flecha('M9 18l6-6-6-6'), estado.pagina + 1, 'Página siguiente');
    }

    function irAPagina(pagina) {
        estado.pagina = pagina;
        render();
        const top = grid.getBoundingClientRect().top + window.scrollY - 200;
        if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }

    function filtrarCategoria(categoria) {
        estado.categoria = categoria;
        estado.pagina = 1;
        chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.filtro === categoria)));
        render();
    }

    // Conteo de pizzas por categoría en cada chip
    chips.forEach(chip => {
        const filtro = chip.dataset.filtro;
        const total = filtro === 'todas'
            ? tarjetas.length
            : tarjetas.filter(c => c.dataset.categoria.split(' ').includes(filtro)).length;
        chip.querySelector('.chip__conteo').textContent = total;
        chip.addEventListener('click', () => filtrarCategoria(filtro));
    });

    buscador.addEventListener('input', () => {
        estado.busqueda = normalizar(buscador.value.trim());
        estado.pagina = 1;
        render();
    });

    document.getElementById('limpiar-filtros').addEventListener('click', () => {
        buscador.value = '';
        estado.busqueda = '';
        filtrarCategoria('todas');
    });

    // Recalcular si cambian las columnas del grid
    let porPaginaActual = pizzasPorPagina();
    window.addEventListener('resize', () => {
        const nuevo = pizzasPorPagina();
        if (nuevo !== porPaginaActual) {
            porPaginaActual = nuevo;
            estado.pagina = 1;
            render({ animar: false });
        }
    });

    // Permite enlazar a la cartelera ya filtrada: cartelera.html?categoria=vegetariana
    const categoriaInicial = new URLSearchParams(location.search).get('categoria');
    if (categoriaInicial && document.querySelector(`.chip[data-filtro="${CSS.escape(categoriaInicial)}"]`)) {
        filtrarCategoria(categoriaInicial);
    } else {
        render();
    }

    // ---------- Modal de pedido ----------
    const modal = document.getElementById('modal-pedido');
    const formulario = document.getElementById('formularioPedido');
    const cantidad = document.getElementById('cantidad');
    const total = document.getElementById('total-pedido');
    let precioUnitario = 0;

    function actualizarTotal() {
        const n = Math.max(1, parseInt(cantidad.value, 10) || 1);
        total.textContent = formatoColones.format(precioUnitario * n);
    }

    grid.addEventListener('click', e => {
        const boton = e.target.closest('.btn-ordenar');
        if (!boton) return;

        const card = boton.closest('.pizza-card');
        const nombre = card.querySelector('h3').textContent;
        const imagen = card.querySelector('img');
        precioUnitario = Number(card.dataset.precio);

        formulario.reset();
        document.getElementById('modal-titulo').textContent = nombre;
        document.getElementById('modal-precio').textContent = `${formatoColones.format(precioUnitario)} por unidad`;
        document.getElementById('modal-imagen').src = imagen.src;
        document.getElementById('modal-imagen').alt = imagen.alt;
        document.getElementById('pizzaSeleccionada').value = nombre;
        actualizarTotal();

        modal.showModal();
    });

    document.getElementById('modal-cerrar').addEventListener('click', () => modal.close());

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.close();
    });

    document.querySelectorAll('[data-paso]').forEach(btn => {
        btn.addEventListener('click', () => {
            const valor = (parseInt(cantidad.value, 10) || 1) + Number(btn.dataset.paso);
            cantidad.value = Math.min(20, Math.max(1, valor));
            actualizarTotal();
        });
    });

    cantidad.addEventListener('input', actualizarTotal);

    // ---------- Envío con EmailJS ----------
    emailjs.init({ publicKey: 'iE4aiTRMjM_MEMtB0' });

    const alerta = Swal.mixin({
        background: '#211a16',
        color: '#f4ead8',
        confirmButtonColor: '#e23d28',
        customClass: {
            popup: 'swal-ss',
            title: 'swal-ss__titulo',
            htmlContainer: 'swal-ss__texto',
            confirmButton: 'swal-ss__boton'
        }
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();

        const pizza = document.getElementById('pizzaSeleccionada').value;
        const unidades = cantidad.value;

        // El <dialog> vive en la capa superior: se cierra antes de mostrar la alerta
        modal.close();

        alerta.fire({
            title: 'Enviando pedido...',
            text: 'Por favor espera un momento.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        emailjs.sendForm('service_sidestreet', 'template_anirl1k', formulario)
            .then(() => {
                alerta.fire({
                    icon: 'success',
                    title: '¡Pedido confirmado!',
                    text: `Pediste ${unidades} × ${pizza}. ¡Ya la estamos preparando!`,
                    confirmButtonText: 'Genial'
                });
                formulario.reset();
            })
            .catch(error => {
                console.error('Error al enviar:', error);
                alerta.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: `No se pudo enviar el pedido. Detalle: ${error.text || JSON.stringify(error)}`,
                    confirmButtonText: 'Cerrar'
                });
            });
    });
});
