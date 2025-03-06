// Importaciones de librerías necesarias
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap para componentes interactivos
import * as bootstrap from "bootstrap";

import AOS from "aos"; // Librería para animaciones al hacer scroll
import Swiper from "swiper"; // Librería para carrusel de testimonios
import { Pagination, Autoplay } from "swiper/modules"; // Módulos de Swiper
import L from "leaflet"; // Librería para mapas interactivos
import { markers } from "@/data/ubication.json"; // Importación de datos de ubicación

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
      delay: 10000, // Tiempo de espera entre diapositivas
      disableOnInteraction: false, // No detener autoplay al interactuar
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Crear el mapa y centrarlo en Santa Cruz con un nivel de zoom de 13
  var map = L.map("map").setView([-17.7772, -63.181], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Crear un icono personalizado para el marcador
  var customIcon = L.icon({
    iconUrl: "/img/map-marker.png", // Ruta de tu imagen
    iconSize: [32, 52], // Tamaño del icono
    iconAnchor: [16, 52], // Punto de anclaje del icono
    popupAnchor: [0, -52], // Posición del popup
  });

  // Agregar marcadores al mapa
  markers.forEach(function (lugar) {
    var googleMapsUrl = `https://maps.google.com/?q=${lugar.lat},${lugar.lon}`; // URL para abrir en Google Maps

    // Crear y añadir marcador con popup informativo usando el icono personalizado
    L.marker([lugar.lat, lugar.lon], {
      icon: customIcon,
    })
      .addTo(map)
      .bindPopup(
        `<b>${lugar.nombre}</b><br>${lugar.descripcion}<br>
			<a href='${googleMapsUrl}' target='_blank'>Abrir en Google Maps</a>`,
      );
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

// ==================== Video Modal ====================
document.addEventListener("DOMContentLoaded", function () {
  // Obtén todos los botones que abren el modal
  const buttons = document.querySelectorAll('[id^="openModalButton"]');

  console.log(buttons);
  const modal = new bootstrap.Modal(document.getElementById("videoModal"));
  const iframe = document.getElementById("videoFrame");

  console.log(buttons);
  // Añade un evento a cada botón para abrir el modal con el video correspondiente
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const videoURL = this.getAttribute("data-video"); // Obtén la URL del video
      iframe.src = videoURL; // Asigna la URL al iframe
      modal.show(); // Muestra el modal
    });
  });

  // Evento para cerrar el modal y limpiar el iframe (evitar que el video siga reproduciéndose)
  document
    .getElementById("videoModal")
    .addEventListener("hidden.bs.modal", function () {
      iframe.src = ""; // Limpia la URL del iframe
    });
});
