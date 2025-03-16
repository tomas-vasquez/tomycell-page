import L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";

import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

import data from "@/data";
const { codeArea, workshopsBySection } = data.business;

document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("map");

  // Verificar si el elemento existe
  if (mapElement) {
    // Crear el mapa con la ubicación inicial en el primer taller de la primera sección
    const initialSection = workshopsBySection[0];
    const initialWorkshop = initialSection.workshops[0];
   
   L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    const map = L.map("map", {
      center: [initialWorkshop.lat, initialWorkshop.lon],
      zoom: 13,
      dragging: !L.Browser.mobile,
      gestureHandling: true
    });

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );

    // Icono personalizado para los marcadores
    const customIcon = L.icon({
      iconUrl: "/img/map-marker.png",
      iconSize: [32, 52],
      iconAnchor: [16, 52],
      popupAnchor: [0, -52],
    });

    // Función para actualizar los marcadores según la sección seleccionada
    function updateMarkers(section) {
      // Eliminar todos los marcadores existentes
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Agregar nuevos marcadores
      section.workshops.forEach((workshop) => {
        L.marker([workshop.lat, workshop.lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<strong>${workshop.workshopId}</strong>
            <br>${workshop.streetAddress}
            <br><i class="fab fa-whatsapp me-1"></i>
            <a href="http://wa.me/${codeArea}${workshop.phone}">
            ${workshop.phone}</a>`
          );
      });
    }

    // Mostrar los marcadores de la primera sección al cargar la página
    updateMarkers(initialSection);

    // Agregar eventos a los tabs para cambiar la vista del mapa
    workshopsBySection.forEach((section) => {
      const sanitizedId = section.sectionId.replace(/\s+/g, "-");
      const tabButton = document.getElementById(`tabNav${sanitizedId}`);

      if (tabButton) {
        tabButton.addEventListener("click", () => {
          map.setView([section.lat, section.lon], 13);
          updateMarkers(section);
        });
      }
    });
  }
});
