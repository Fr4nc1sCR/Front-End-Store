window.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.reseñas-carousel-track');
    const cards = Array.from(track.children);

    // Clonar las reseñas
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
});
