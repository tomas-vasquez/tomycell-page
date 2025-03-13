import L from "leaflet";
import data from "@/data";
const { departments, workshops } = data.business;

document.addEventListener("DOMContentLoaded", function () {
  // Crear el mapa con la ubicación inicial en el primer departamento
  var map = L.map("map", {
    center: [departments[0].lat, departments[0].lon],
    zoom: 13,
    dragging: !L.Browser.mobile,
  });

  // Agregar capa de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Icono personalizado para los marcadores
  var customIcon = L.icon({
    iconUrl: "/img/map-marker.png",
    iconSize: [32, 52],
    iconAnchor: [16, 52],
    popupAnchor: [0, -52],
  });

  // Función para actualizar los marcadores según el departamento seleccionado
  function updateMarkers(department) {
    // Eliminar todos los marcadores existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Agregar nuevos marcadores
    if (workshops[department.id]) {
      workshops[department.id].forEach((workshop) => {
        L.marker([workshop.lat, workshop.lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<strong>${workshop.title}</strong><br>${workshop.streetAddress}<br>📞 ${workshop.phone}`,
          );
      });
    }
  }

  // Agregar evento a los tabs para cambiar la vista del mapa
  departments.forEach((department) => {
    const sanitizedId = department.id.replace(/\s+/g, "-");
    const tabButton = document.getElementById(`tabNav${sanitizedId}`);

    if (tabButton) {
      tabButton.addEventListener("click", () => {
        map.setView([department.lat, department.lon], 13);
        updateMarkers(department);
      });
    }
  });

  // Mostrar los marcadores del primer departamento al cargar la página
  updateMarkers(departments[0]);
});
