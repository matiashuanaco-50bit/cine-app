// Datos de películas con horarios disponibles
const movies = [
    {
        id: 1,
        title: "El Viaje Estelar",
        category: "Ciencia Ficción",
        emoji: "🚀",
        schedules: ["16:30", "19:00", "21:30"]
    },
    {
        id: 2,
        title: "Corazones en la Noche",
        category: "Romance",
        emoji: "💕",
        schedules: ["17:00", "19:30", "22:00"]
    },
    {
        id: 3,
        title: "La Risa del Caos",
        category: "Comedia",
        emoji: "😂",
        schedules: ["16:00", "18:00", "20:00", "22:00"]
    },
    {
        id: 4,
        title: "Sombras del Misterio",
        category: "Thriller",
        emoji: "🕵️",
        schedules: ["19:00", "21:00", "23:00"]
    }
];

// Constantes
const PRICE_PER_TICKET = 3500;

// Variables de estado
let selectedMovie = null;
let selectedSchedule = null;
let ticketCount = 1;

// Elementos del DOM
const moviesGrid = document.getElementById('moviesGrid');
const scheduleSection = document.getElementById('scheduleSection');
const selectedMovieInfo = document.getElementById('selectedMovieInfo');
const scheduleButtons = document.getElementById('scheduleButtons');
const ticketCountElement = document.getElementById('ticketCount');
const totalPriceElement = document.getElementById('totalPrice');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const btnConfirm = document.getElementById('btnConfirm');
const modalOverlay = document.getElementById('modalOverlay');
const btnNewBooking = document.getElementById('btnNewBooking');

// Renderizar películas
function renderMovies() {
    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" id="movie-${movie.id}">
            <div class="movie-poster">
                <div class="poster-placeholder">${movie.emoji}</div>
                <div class="select-indicator">✓</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-category">${movie.category}</p>
            </div>
        </div>
    `).join('');

    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = parseInt(card.id.split('-')[1]);
            selectMovie(movieId);
        });
    });
}

// Seleccionar película
function selectMovie(movieId) {
    // Remover selección anterior
    document.querySelectorAll('.movie-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Remover selección de horario anterior y reiniciar cantidad de entradas
    selectedSchedule = null;
    ticketCount = 1;
    updateTicketDisplay();
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Seleccionar nueva película
    selectedMovie = movies.find(m => m.id === movieId);
    const movieCard = document.getElementById(`movie-${movieId}`);
    movieCard.classList.add('selected');

    // Mostrar sección de horarios
    renderScheduleSection();
}

// Renderizar sección de horarios
function renderScheduleSection() {
    if (!selectedMovie) return;

    // Mostrar información de película seleccionada
    selectedMovieInfo.innerHTML = `
        <div class="movie-name">${selectedMovie.emoji} ${selectedMovie.title}</div>
        <div class="movie-cat">${selectedMovie.category}</div>
    `;

    // Renderizar botones de horarios
    scheduleButtons.innerHTML = selectedMovie.schedules.map(schedule => `
        <button class="schedule-btn" data-time="${schedule}">${schedule}</button>
    `).join('');

    // Agregar event listeners a los botones de horario
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectSchedule(btn.dataset.time);
        });
    });

    // Activar sección de horarios
    scheduleSection.classList.add('active');
}

// Seleccionar horario
function selectSchedule(time) {
    // Remover selección anterior
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Seleccionar nuevo horario
    selectedSchedule = time;
    const selectedBtn = document.querySelector(`[data-time="${time}"]`);
    selectedBtn.classList.add('selected');

    // Validar si se puede habilitar el botón de confirmación
    updateConfirmButtonState();
}

// Aumentar cantidad de entradas
function increaseTickets() {
    ticketCount++;
    updateTicketDisplay();
}

// Disminuir cantidad de entradas
function decreaseTickets() {
    if (ticketCount > 1) {
        ticketCount--;
        updateTicketDisplay();
    }
}

// Actualizar la visualización de entradas y precio
function updateTicketDisplay() {
    ticketCountElement.textContent = ticketCount;
    const total = PRICE_PER_TICKET * ticketCount;
    totalPriceElement.textContent = `$${total.toLocaleString('es-ES')}`;
    updateConfirmButtonState();
}

// Validar estado del botón de confirmación
function updateConfirmButtonState() {
    const isEnabled = selectedMovie && selectedSchedule && ticketCount >= 1;
    btnConfirm.disabled = !isEnabled;
}

// Mostrar modal de confirmación
function showConfirmationModal() {
    document.getElementById('modalMovie').textContent = `${selectedMovie.emoji} ${selectedMovie.title}`;
    document.getElementById('modalSchedule').textContent = selectedSchedule;
    document.getElementById('modalTickets').textContent = `${ticketCount} ${ticketCount === 1 ? 'entrada' : 'entradas'}`;
    
    const total = PRICE_PER_TICKET * ticketCount;
    document.getElementById('modalTotal').textContent = `$${total.toLocaleString('es-ES')}`;
    
    modalOverlay.classList.add('active');
}

// Cerrar modal y hacer otra reserva
function makeAnotherBooking() {
    modalOverlay.classList.remove('active');
    
    // Reiniciar estado
    selectedMovie = null;
    selectedSchedule = null;
    ticketCount = 1;
    
    // Limpiar UI
    document.querySelectorAll('.movie-card').forEach(card => {
        card.classList.remove('selected');
    });
    scheduleSection.classList.remove('active');
    updateTicketDisplay();
}

// Event listeners para control de entradas
if (btnMinus) btnMinus.addEventListener('click', decreaseTickets);
if (btnPlus) btnPlus.addEventListener('click', increaseTickets);

// Event listener para confirmar reserva
if (btnConfirm) {
    btnConfirm.addEventListener('click', showConfirmationModal);
}

// Event listener para hacer otra reserva
if (btnNewBooking) {
    btnNewBooking.addEventListener('click', makeAnotherBooking);
}

// Inicializar aplicación
function init() {
    renderMovies();
    updateConfirmButtonState();
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', init);