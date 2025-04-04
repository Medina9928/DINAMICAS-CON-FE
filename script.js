// === SECCIÓN DE NÚMEROS VENDIDOS INICIALES (EDITA AQUÍ) ===
const initialSoldNumbers = []; // Cambia estos números manualmente
// === FIN DE LA SECCIÓN ===

const numberButtons = document.querySelectorAll(".number-button");
let selectedNumbers = [];
let adminMode = false;
let soldNumbers = [...initialSoldNumbers]; // Inicializamos con los números manuales
const adminPassword = "rifa2025"; // Cambia esta contraseña si quieres

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
}

// Cargar números vendidos desde la API (simulación con lista inicial)
async function loadSoldNumbers() {
    try {
        const response = await fetch("/api/get-numbers");
        if (!response.ok) throw new Error("Error al cargar números");
        const data = await response.json();
        soldNumbers = data.numbers || initialSoldNumbers; // Si la API falla, usa la lista manual
        updateNumberStates();
    } catch (error) {
        console.error("No se pudo cargar los números vendidos:", error);
        soldNumbers = [...initialSoldNumbers]; // Fallback a la lista manual
        updateNumberStates();
    }
}
loadSoldNumbers();

// Guardar números vendidos en la API (simulación, no persiste en Vercel)
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
document.getElementById("payButton").addEventListener("click", () => {
    if (selectedNumbers.length > 0) {
        const message = `Hola, me interesa participar en la rifa con los números: ${selectedNumbers.join(", ")}.`;
        if (window.confirm(`¿Estás seguro de comprar los números: ${selectedNumbers.join(", ")}?`)) {
            // Abrir WhatsApp inmediatamente
            sendWhatsAppMessage(message);
            
            // Actualizar los números vendidos después de abrir WhatsApp
            selectedNumbers.forEach((number) => {
                if (!soldNumbers.includes(number)) {
                    soldNumbers.push(number);
                }
            });
            saveSoldNumbers().then(() => {
                updateNumberStates();
                selectedNumbers = []; // Limpiar selección
            }).catch((error) => {
                console.error("Error al guardar después de WhatsApp:", error);
            });
        }
    } else {
        alert("Por favor, selecciona al menos un número disponible antes de pagar.");
    }
});

// Enviar mensaje a WhatsApp
function sendWhatsAppMessage(message) {
    const url = `https://api.whatsapp.com/send?phone=573024990764&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Control del modo admin y contador manual
const adminModeBtn = document.getElementById("adminMode");
const manualCountInput = document.getElementById("manualCount");
const soldCountStatic = document.getElementById("soldCountStatic");

adminModeBtn.addEventListener("click", () => {
    if (!adminMode) {
        const password = prompt("Ingresa la contraseña de administrador:");
        if (password === adminPassword) {
            adminMode = true;
            adminModeBtn.textContent = "Guardar y Desactivar Modo Admin";
            adminModeBtn.style.display = "inline";
            manualCountInput.style.display = "inline";
            updateNumberStates();
        } else {
            alert("Contraseña incorrecta.");
        }
    } else {
        adminMode = false;
        manualCountInput.style.display = "none";
        soldCountStatic.textContent = manualCountInput.value || soldNumbers.length;
        adminModeBtn.textContent = "Activar Modo Admin";
        updateNumberStates();
    }
});

// Mostrar botón de admin al presionar Ctrl + A
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "a") {
        adminModeBtn.style.display = "inline";
    }
});
