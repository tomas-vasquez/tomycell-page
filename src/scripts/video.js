// Importar las bibliotecas necesarias
import Player from "@vimeo/player";
import Swal from "sweetalert2";

// Ejecutar el código cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Obtener el contenedor del video
  const videoContainer = document.getElementById("video-container");

  if (videoContainer) {
    // Obtener referencias a los elementos del DOM
    const iframe = document.getElementById("vimeo-player");
    const playButton = document.getElementById("play-button");
    const arrow = document.getElementById("arrow-id"); // Flecha indicadora
    const spinner= document.getElementById("loading-spinner"); // Flecha indicadora

    // Comprobar si el iframe, playButton o arrow existen antes de continuar
    if (!iframe || !playButton || !arrow) {
      console.error("Uno o más elementos del DOM no se encontraron.");
      return; // Salir si algún elemento esencial no existe
    }

    const player = new Player(iframe);
    const showArrowBeforeEnd = 5;

    /**
     * Intentar reproducir el video cada segundo hasta que se inicie
     */
    function tryPlay() {
      player.getPaused().then((paused) => {
        if (!paused) {
          clearInterval(playInterval); // Detener el intervalo si ya se está reproduciendo
        } else {
          player
            .play()
            .then(() => {
              clearInterval(playInterval); // Detener el intervalo si logra reproducirse
            })
            .catch(() => {});
        }
      });
    }

    // Establecer un intervalo para intentar reproducir el video
    const playInterval = setInterval(tryPlay, 1000);

    /**
     * Evento: El video ha finalizado
     */
    player.on("ended", function () {
      // Mostrar el botón de reproducción nuevamente
      playButton.style.display = "block";
      playButton.style.pointerEvents = "auto";
      playButton.innerHTML = '<i class="fas fa-sync-alt"></i>';

      // Permitir que el usuario reinicie el video con el botón
      playButton.addEventListener("click", function () {
        player.play();
      });

      // Ocultar la flecha al finalizar el video
      arrow.style.display = "none";
    });

    /**
     * Evento: El video está pausado
     */
    player.on("pause", function () {
      playButton.style.display = "block"; // Mostrar el botón de play
      spinner.style.display = "none";
      videoContainer.style.backgroundColor = "transparent"; // Ajustar fondo
      arrow.style.display = "none"; // Ocultar la flecha mientras está pausado
    });

    /**
     * Evento: El video comienza a reproducirse
     */
    player.on("play", function () {
      spinner.style.display = "none";
      playButton.style.display = "none"; // Ocultar el botón de play
    });

    /**
     * Determinar el objetivo dependiendo del tamaño de pantalla
     */
    const targetInMobile = document.getElementById("arrow-target-in-mobile");
    const targetInLaptop = document.getElementById("arrow-target-in-laptop");

    // Seleccionar el objetivo según el tamaño de la pantalla
    let target = window.innerWidth <= 768 ? targetInMobile : targetInLaptop;

    if (target && arrow) {
      /**
       * Evento: Mostrar la flecha solo en los últimos X segundos del video
       */
      player.on("timeupdate", function (data) {
        player.getDuration().then((duration) => {
          const remainingTime = duration - data.seconds; // Calcular el tiempo restante

          if (remainingTime <= showArrowBeforeEnd && !Swal.isVisible()) {
            arrow.style.display = "block"; // Mostrar la flecha
          } else {
            arrow.style.display = "none"; // Ocultar la flecha si aún no es el momento
          }
        });
      });

      // Obtener las coordenadas del elemento objetivo
      const targetRect = target.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      // Obtener las coordenadas de la flecha
      const arrowRect = arrow.getBoundingClientRect();
      const arrowX = arrowRect.left + arrowRect.width / 2;
      const arrowY = arrowRect.top + arrowRect.height / 2;

      // Calcular el ángulo entre la flecha y el objetivo
      const deltaX = targetX - arrowX;
      const deltaY = targetY - arrowY;
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Aplicar la rotación a la flecha
      arrow.style.setProperty("--angle", `${angle}deg`);
    }

    // Asegurar que la flecha esté oculta al inicio
    if (arrow) {
      arrow.style.display = "none";
    }
  } else {
    console.error("El contenedor de video no se encontró.");
  }
});
