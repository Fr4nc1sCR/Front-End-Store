// Abrir modal
document.querySelectorAll('.btn-ordenar').forEach(boton => {
    boton.addEventListener('click', function () {
        const pizza = this.closest('.pizza-card').querySelector('h3').textContent;
        document.getElementById('tituloModal').textContent = `Pedido - ${pizza}`;
        document.getElementById('pizzaSeleccionada').value = pizza;
        document.getElementById('modalPedido').style.display = 'block';

        // Limpiar campos del formulario
        document.getElementById('nombreCliente').value = '';
        document.getElementById('direccionCliente').value = '';
        document.getElementById('cantidad').value = '1';
    });
});

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalPedido').style.display = 'none';
}

// Cerrar al hacer clic fuera del contenido
window.onclick = function (e) {
    const modal = document.getElementById('modalPedido');
    if (e.target == modal) {
        cerrarModal();
    }
}

// Puedes procesar el formulario aquí
document.getElementById('formularioPedido').addEventListener('submit', function (e) {
    e.preventDefault();
    alert(`Pedido confirmado de ${document.getElementById('pizzaSeleccionada').value}. ¡Gracias!`);
    cerrarModal();
});