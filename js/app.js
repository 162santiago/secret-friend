

let participants = []; // arreglo global

async function initApp() {
    try {
        // Leer el archivo Base64 desde assets
        const response = await fetch('users_encrypted.json');
        if (!response.ok) {
            alert("Error: No se pudo cargar el archivo.");
            return;
        }

        const base64Text = await response.text();

        // Decodificar Base64 → JSON string
        const jsonString = atob(base64Text);

        // Parsear JSON
        participants = JSON.parse(jsonString);

        if (!participants || participants.length === 0) {
            alert("Error: No se pudieron cargar los datos del sorteo.");
            return;
        }

        // Llamar a la función que renderiza la cuadrícula del sorteo
        renderGameGrid();

    } catch (err) {
        console.error(err);
        alert("Error al leer o parsear el archivo Base64.");
    }
}


    // Renderizar tarjetas de juego
    function renderGameGrid() {
        const grid = document.getElementById('user-grid');
        grid.innerHTML = '';
        participants.forEach(p => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerText = p.name;
            card.onclick = () => selectUser(p);
            grid.appendChild(card);
        });
    }

    // Seleccionar usuario para revelar
    function selectUser(user) {
        selectedUser = user;
        document.getElementById('game-view').classList.add('hidden');
        document.getElementById('reveal-view').classList.remove('hidden');
        document.getElementById('reveal-title').innerText = `Hola, ${user.name}`;
        document.getElementById('authPin').value = '';
        document.getElementById('secret-result').classList.add('hidden');
    }

    // Verificar PIN y mostrar resultado
    function checkPin() {
        const inputPin = document.getElementById('authPin').value;
        if (inputPin === selectedUser.pin) {
            // Encuentra el nombre del amigo secreto usando el matchId
            const match = participants.find(p => p.id === selectedUser.matchId);
            document.getElementById('result-name').innerText = match.name;
            document.getElementById('secret-result').classList.remove('hidden');
        } else {
            document.getElementById('secret-result').classList.add('hidden');
            alert("PIN Incorrecto. Inténtalo de nuevo.");
            document.getElementById('authPin').value = '';
        }
    }

    // Volver a la pantalla de selección
    function backToGame() {
        selectedUser = null;
        document.getElementById('reveal-view').classList.add('hidden');
        document.getElementById('game-view').classList.remove('hidden');
    }

    // Inicializar la aplicación al cargar la página
    window.onload = initApp;
