document.addEventListener('DOMContentLoaded', function () {

    emailjs.init("iE4aiTRMjM_MEMtB0");

    // Abrir modal
    document.querySelectorAll('.btn-ordenar').forEach(boton => {
        boton.addEventListener('click', function () {
            const pizza = this.closest('.pizza-card').querySelector('h3').textContent;

            document.getElementById('tituloModal').textContent = `Pedido - ${pizza}`;
            document.getElementById('pizzaSeleccionada').value = pizza;
            document.getElementById('modalPedido').style.display = 'block';

            // Limpiar campos
            document.getElementById('nombreCliente').value = '';
            document.getElementById('direccionCliente').value = '';
            document.getElementById('cantidad').value = '1';
        });
    });

    // Cerrar modal (función global)
    window.cerrarModal = function () {
        document.getElementById('modalPedido').style.display = 'none';
    }

    window.onclick = function (e) {
        const modal = document.getElementById('modalPedido');
        if (e.target === modal) {
            cerrarModal();
        }
    }

    // Enviar formulario
    document.getElementById('formularioPedido').addEventListener('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Enviando pedido...',
            text: 'Por favor espera un momento.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-text-custom',
                confirmButton: 'swal2-button-custom'
            }
        });

        emailjs.sendForm('service_sidestreet', 'template_anirl1k', this)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡PEDIDO CONFIRMADO!',
                    text: `Has pedido una pizza ${document.getElementById('pizzaSeleccionada').value}. ¡Gracias!`,
                    confirmButtonText: 'Cerrar',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom',
                        htmlContainer: 'swal2-text-custom',
                        confirmButton: 'swal2-button-custom'
                    }
                });

                cerrarModal();
                this.reset();
            })
            .catch((error) => {
                console.error('Error al enviar:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: `No se pudo enviar el pedido. Detalle: ${error.text || JSON.stringify(error)}`,
                    customClass: {
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom',
                        htmlContainer: 'swal2-text-custom',
                        confirmButton: 'swal2-button-custom'
                    }
                });
            });
    });

});