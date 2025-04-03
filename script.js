const numberButtons = document.querySelectorAll(".number-button");
let selectedNumbers = [];
let adminMode = false;
let soldNumbers = [];
const adminPassword = "rifa2025"; // Cambia esta contraseña si quieres

// URL de la configuración Edge
const EDGE_CONFIG_URL = 'https://edge-config.vercel.com/ecfg_9fhzpvxahkkajukuqgxaxqlfxdmo?token=334aa3f6-336c-468c-bf08-004ffd3f8b35';

// Actualizar el estado de los botones
function updateNumberStates() {
    numberButtons.forEach((button) => {
        if (soldNumbers.includes(button.value)) {
            button.classList.add("sold");
            button.disabled = !adminMode; // Deshabilitar solo si no está en modo admin
        } else {
            button.classList.remove("sold");
            button.disabled = false;
            if (!selectedNumbers.includes(button.value)) {
                button.classList.remove("selected");
            }
        }
    });
    displaySoldNumbers();
}

// Cargar números vendidos desde Vercel Edge Config
async function loadSoldNumbers() {
    try {
        const response = await fetch(EDGE_CONFIG_URL);
        if (!response.ok) throw new Error("Error al cargar números");
        soldNumbers = await response.json();
        updateNumberStates();
    } catch (error) {
        console.error("No se pudo cargar los números vendidos:", error);
        soldNumbers = [];
        updateNumberStates();
    }
}
loadSoldNumbers();

// Guardar números vendidos en la API
async function saveSoldNumbers() {
    try {
        const response = await fetch("/api/update-numbers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numbers: soldNumbers }),
        });
        if (!response.ok) throw new Error("Error al guardar números");
    } catch (error) {
        console.error("Error al guardar los números vendidos:", error);
    }
}

// Seleccionar o habilitar números
numberButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const number = button.value;
        if (adminMode) {
            // Modo administrador: habilitar número vendido
            if (soldNumbers.includes(number)) {
                soldNumbers = soldNumbers.filter((num) => num !== number);
                await saveSoldNumbers();
                button.classList.remove("sold");
                button.disabled = false;
                updateNumberStates();
                alert(`Número ${number} habilitado nuevamente.`);
            }
        } else {
            // Modo normal: seleccionar número
            if (!soldNumbers.includes(number)) {
                if (selectedNumbers.includes(number)) {
                    selectedNumbers = selectedNumbers.filter((num) => num !== number);
                    button.classList.remove("selected");
                } else {
                    selectedNumbers.push(number);
                    button.classList.add("selected");
                }
            }
        }
    });
});

// Botón de pagar
document.getElementById("payButton").addEventListener("click", async () => {
    if (selectedNumbers.length > 0) {
        const message = `Hola, me interesa participar en la rifa con los números: ${selectedNumbers.join(", ")}.`;
        if (confirm(`¿Estás seguro de comprar los números: ${selectedNumbers.join(", ")}?`)) {
            selectedNumbers.forEach((number) => {
                if (!soldNumbers.includes(number)) {
                    soldNumbers.push(number);
                }
            });
            await saveSoldNumbers();
            updateNumberStates();
            sendWhatsAppMessage(message);
            selectedNumbers = [];
        }
    } else {
        alert("Por favor, selecciona al menos un número disponible antes de pagar.");
    }
});

// Activar modo administrador con Ctrl+Shift+Y y contraseña
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "Y") {
        if (!adminMode) {
            const password = prompt("Ingresa la contraseña de administrador:");
            if (password === adminPassword) {
                adminMode = true;
                document.getElementById("adminMode").style.display = "block";
                updateNumberStates(); // Actualizar para permitir clics en números vendidos
                alert("Modo administrador activado. Haz clic en un número vendido o usa 'Eliminar' en la lista.");
            } else {
                alert("Contraseña incorrecta.");
            }
        }
    }
});

// Desactivar modo administrador con el botón
document.getElementById("adminMode").addEventListener("click", () => {
    if (adminMode) {
        adminMode = false;
        document.getElementById("adminMode").style.display = "none";
        alert("Modo administrador desactivado.");
        selectedNumbers = [];
        updateNumberStates();
    }
});

// Mostrar lista de números vendidos
function displaySoldNumbers() {
    const soldNumbersUl = document.getElementById("soldNumbersUl");
    const soldCount = document.getElementById("soldCount");
    soldNumbersUl.innerHTML = "";
    soldCount.textContent = soldNumbers.length;

    soldNumbers.forEach((number) => {
        const li = document.createElement("li");
        li.textContent = number;
        if (adminMode) {
            const removeButton = document.createElement("button");
            removeButton.textContent = "Eliminar";
            removeButton.onclick = async () => {
                soldNumbers = soldNumbers.filter((num) => num !== number);
                await saveSoldNumbers();
                updateNumberStates();
                alert(`Número ${number} habilitado nuevamente.`);
            };
            li.appendChild(removeButton);
        }
        soldNumbersUl.appendChild(li);
    });
}

// Enviar mensaje por WhatsApp
function sendWhatsAppMessage(message) {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573024990764&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
}
