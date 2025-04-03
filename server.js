document.addEventListener('DOMContentLoaded', () => {
    const soldNumbersUl = document.getElementById('soldNumbersUl');
    const soldCount = document.getElementById('soldCount');
    const numberButtons = document.querySelectorAll('.number-button');
    const ws = new WebSocket(`ws://${window.location.host}`);

    // Actualiza la lista de números vendidos
    function updateSoldNumbersUI(soldNumbers) {
        soldNumbersUl.innerHTML = '';
        soldNumbers.forEach(number => {
            const li = document.createElement('li');
            li.textContent = number;
            soldNumbersUl.appendChild(li);

            // Desactiva el botón del número vendido
            const button = document.querySelector(`.number-button[value="${number}"]`);
            if (button) {
                button.disabled = true;
            }
        });
        soldCount.textContent = soldNumbers.length;
    }

    // Conexión WebSocket
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.soldNumbers) {
            updateSoldNumbersUI(data.soldNumbers);
        }
    };

    // Maneja la compra de número
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.value;
            fetch('/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ number })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    button.disabled = true;
                    ws.send(JSON.stringify({ action: 'purchase', number }));
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
