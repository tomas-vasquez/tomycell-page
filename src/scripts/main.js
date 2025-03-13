// Importaciones de librerías necesarias
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap para componentes interactivos
import AOS from "aos"; // Librería para animaciones al hacer scroll
import Swiper from "swiper"; // Librería para carrusel de testimonios
import { Pagination, Autoplay } from "swiper/modules"; // Módulos de Swiper

// ==================== Configuración del Carrusel (Swiper) ====================
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    modules: [Autoplay, Pagination], // Se usan los módulos de paginación y autoplay
    scrollbar: {
      el: ".swiper-scrollbar", // Contenedor para la barra de desplazamiento
      draggable: true, // Permite arrastrar la barra
    },
    pagination: {
      el: ".swiper-pagination", // Contenedor para los puntos de paginación
      clickable: true, // Permite hacer clic en los puntos de paginación
    },
    slidesPerView: 1, // Configuración por defecto para móviles
    centeredSlides: true, // Centrar el testimonio activo
    spaceBetween: 10, // Espacio entre los testimonios
    breakpoints: {
      576: {
        slidesPerView: 1,
      }, // En dispositivos móviles muestra 1 testimonio
      768: {
        slidesPerView: 2,
      }, // En tablet muestra 2 testimonios
      1024: {
        slidesPerView: 3,
      }, // En laptop muestra 3 testimonios
    },
    autoplay: {
      delay: 5000, // Tiempo de espera entre diapositivas
      disableOnInteraction: false, // No detener autoplay al interactuar
    },
  });
});

// ==================== OnLoad ====================
window.onload = function () {
  const spinner = document.querySelector(".spinner-overlay");

  // Cambiar la opacidad a 0 para el efecto de desvanecimiento
  spinner.style.opacity = "0";

  // Después de 1 segundo (tiempo de la transición), ocultar el spinner
  setTimeout(() => {
    spinner.style.display = "none"; // Ocultar el spinner
  }, 1000); // Esperar el tiempo de la transición

  AOS.init({
    duration: 600, // Duración de la animación en milisegundos
    easing: "ease-in-out", // Tipo de transición
    once: false, // La animación puede ocurrir varias veces
  });
};

import "@/scripts/dialogs.js";
import "@/scripts/map.js";
