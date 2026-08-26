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

// Variables de estado
let selectedMovie = null;
let selectedSchedule = null;

// Elementos del DOM
const moviesGrid = document.getElementById('moviesGrid');
const scheduleSection = document.getElementById('scheduleSection');
const selectedMovieInfo = document.getElementById('selectedMovieInfo');
const scheduleButtons = document.getElementById('scheduleButtons');

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

    // Remover selección de horario anterior
    selectedSchedule = null;
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
}

// Inicializar aplicación
function init() {
    renderMovies();
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', init);