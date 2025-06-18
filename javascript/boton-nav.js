document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Cambia el ícono del botón entre ☰ y ✖
    toggleBtn.textContent = navMenu.classList.contains('active') ? '✖' : '☰';
  });
});