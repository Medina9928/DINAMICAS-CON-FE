// === SECCIÓN DE NÚMEROS VENDIDOS INICIALES (EDITA AQUÍ) ===
const initialSoldNumbers = ["01", "03", "05", "91", "10"]; // Cambia estos números manualmente
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
    displaySoldNumbers();
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

// Activar modo administrador con Ctrl
