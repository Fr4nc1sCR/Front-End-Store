function filtrarCategoria(categoria) {
    const cards = document.querySelectorAll('.pizza-card');
    cards.forEach(card => {
        if (categoria === 'todas') {
            card.style.display = 'block';
        } else {
            card.style.display = card.classList.contains(categoria) ? 'block' : 'none';
        }
    });
}

function filtrarPizzas() {
    const filtro = document.querySelector('#busqueda').value.toLowerCase();
    const cards = document.querySelectorAll('.pizza-card');
    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(filtro) ? 'block' : 'none';
    });
}