// Comportamiento compartido por todas las páginas:
// header al hacer scroll, menú móvil, animaciones de entrada y carrusel de reseñas.

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');

    // ---------- Header: fondo al hacer scroll + ocultar al bajar ----------
    let ultimoScroll = window.scrollY;

    function actualizarHeader() {
        const actual = window.scrollY;

        header.classList.toggle('is-scrolled', actual > 20);

        if (document.body.classList.contains('nav-abierto')) return;

        if (actual > ultimoScroll && actual > 300) {
            header.classList.add('is-hidden');
        } else if (actual < ultimoScroll) {
            header.classList.remove('is-hidden');
        }

        ultimoScroll = actual;
    }

    actualizarHeader();
    window.addEventListener('scroll', actualizarHeader, { passive: true });

    // ---------- Menú móvil ----------
    function cerrarMenu() {
        document.body.classList.remove('nav-abierto');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
    }

    toggle.addEventListener('click', () => {
        const abierto = document.body.classList.toggle('nav-abierto');
        toggle.setAttribute('aria-expanded', String(abierto));
        toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
        header.classList.remove('is-hidden');
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', cerrarMenu));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cerrarMenu();
    });

    window.matchMedia('(min-width: 861px)').addEventListener('change', cerrarMenu);

    // ---------- Animaciones al entrar en pantalla ----------
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ---------- Carrusel infinito: duplicar contenido para un loop continuo ----------
    document.querySelectorAll('[data-loop]').forEach(track => {
        Array.from(track.children).forEach(item => {
            const clon = item.cloneNode(true);
            clon.setAttribute('aria-hidden', 'true');
            track.appendChild(clon);
        });
    });

    // ---------- Año del footer ----------
    document.querySelectorAll('[data-anio]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});
