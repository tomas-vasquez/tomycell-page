import Swal from "sweetalert2";
import data from "@/data";

const { codeArea, workshopsBySection } = data.business;
const arrow = document.getElementById("arrow-id"); // Flecha que apunta al boton

/**
 * Muestra un cuadro de diálogo con opciones de botones.
 * @param {string} title - El título del cuadro de diálogo.
 * @param {Array} options - Las opciones que se mostrarán como botones.
 * @returns {Promise<number>} - Devuelve el índice de la opción seleccionada.
 */
async function showDialog(title, subtitle, options) {
  const buttonsHtml = options
    .map((option, index) => {
      return `<button class="swal2-confirm btn btn-primary" style="width: 100%; margin: 5px;" data-index="${index}">
      ${option} <i class="fas fa-arrow-right ms-2"></i>
    </button>`;
    })
    .join("");

  const subTitle = `<p class="text-light">${subtitle}</p>`;

  return new Promise(function (resolve) {
    Swal.fire({
      title: title,
      html: subTitle + buttonsHtml,
      showCancelButton: false,
      showConfirmButton: false,
      customClass: {
        title: "text-white fs-3",
        popup: "swal2-popup-custom bg-dark",
      },
      didOpen: function () {
        if (arrow) arrow.style.display = "none";
        const buttons = document.querySelectorAll(".swal2-confirm");
        buttons.forEach((button) => {
          button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"), 10);
            Swal.close();
            resolve(index);
          });
        });
      },
    });
  });
}

/**
 * Enviar un mensaje a WhatsApp usando la API de WhatsApp
 * @param {string} msg - El mensaje que se enviará.
 */
async function sendWhatsappMessage(msg) {
  let selectedDepartmentIndex;

  // Verifica si hay más de un departamento
  if (workshopsBySection.length === 1) {
    // Si solo hay un departamento, selecciona automáticamente el primero
    selectedDepartmentIndex = 0;
  } else {
    // Si hay más de uno, muestra el diálogo para seleccionar un departamento
    selectedDepartmentIndex = await showDialog(
      "Contacta con nosotros",
      "Selecciona tu departamento:",
      workshopsBySection.map((s) => s.sectionId),
    );
  }

  const selectedDepartment = workshopsBySection[selectedDepartmentIndex];

  // Verifica si solo hay un taller en el departamento seleccionado
  if (selectedDepartment.workshops.length === 1) {
    const selectedWorkshop = selectedDepartment.workshops[0];
    const whatsappLink = `https://wa.me/${codeArea}${selectedWorkshop.phone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappLink, "_blank");
  } else {
    // Si hay más de un taller, solicita que se seleccione uno
    const workshopsTitles = selectedDepartment.workshops.map(
      (w) => w.workshopId,
    );
    let selectedIndex = await showDialog(
      `Sucursales en ${selectedDepartment.sectionId}`,
      "Selecciona la sucursal que prefieres:",
      workshopsTitles,
    );

    const selectedWorkshop = selectedDepartment.workshops[selectedIndex];
    const whatsappLink = `https://wa.me/${codeArea}${selectedWorkshop.phone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappLink, "_blank");
  }
}

/**
 * Abrir el catalogo de whatsapp
 * @param {string} msg - El mensaje que se enviará.
 */
async function openWhatsappCatalog() {
  let options = workshopsBySection.map((s) => s.sectionId);
  let selectedDepartmentIndex;

  if (options.length === 1) {
    // Si solo hay un departamento, selecciona automáticamente el primero
    selectedDepartmentIndex = options[0];
  } else {
    // Si hay más de uno, muestra el diálogo para seleccionar un departamento
    let selectedIndex = await showDialog(
      "Mira nuestro catálogo",
      "Selecciona tu departamento:",
      options,
    );
    selectedDepartmentIndex = options[selectedIndex];
  }

  const selectedDepartment = workshopsBySection.find(
    (s) => s.sectionId === selectedDepartmentIndex,
  );

  // Verifica si solo hay un taller principal en el departamento
  if (selectedDepartment.workshops.length === 1) {
    const selectedWorkshop = selectedDepartment.workshops[0];
    const whatsappLink = `https://wa.me/c/${codeArea}${selectedWorkshop.phone}`;
    window.open(whatsappLink, "_blank");
  } else {
    var selectedMainBranch = selectedDepartment.workshops.find(
      (w) => w.isMainBranch === true,
    );

    const whatsappLink = `https://wa.me/c/${codeArea}${selectedMainBranch.phone}`;
    window.open(whatsappLink, "_blank");
  }
}

/**
 * Inicializa los botones para enviar mensajes de WhatsApp al hacer clic
 */
document.addEventListener("DOMContentLoaded", function () {
  const whatsappButtons = document.querySelectorAll(".whatsapp-msg-button");

  whatsappButtons.forEach((button) => {
    button.onclick = async function () {
      const msgText = this.getAttribute("msg-text");
      await sendWhatsappMessage(msgText);
    };
  });

  const whatsappButtons2 = document.querySelectorAll(
    ".whatsapp-catalog-button",
  );

  whatsappButtons2.forEach((button) => {
    button.onclick = async function () {
      await openWhatsappCatalog();
    };
  });
});
