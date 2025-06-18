let lastScrollY = window.scrollY;
let isScrolling;
const header = document.querySelector('.encabezado');

function ocultarEncabezado() {
    header.classList.add('oculto');
    header.classList.remove('visible');
}

function mostrarEncabezado() {
    header.classList.add('visible');
    header.classList.remove('oculto');
}

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY === 0) {
        mostrarEncabezado();
    } else if (currentScrollY > lastScrollY) {
        ocultarEncabezado();
    } else if (currentScrollY < lastScrollY) {
        mostrarEncabezado();
    }

    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        if (window.scrollY > 0) {
            mostrarEncabezado();
        }
    }, 200);

    lastScrollY = currentScrollY;
});
