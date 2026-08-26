// ========================= BASE DE DATOS DE PELÍCULAS =========================
const moviesDatabase = [
    {
        id: 1,
        title: "Dune: Part Two",
        genre: "action",
        format: "3d",
        poster: "🌍",
        synopsis: "Paul Atreides viaja al planeta Arrakis para vengar la muerte de su familia. En el desierto, descubre su verdadero potencial mientras se une a los Fremen.",
        cast: "Timothée Chalamet, Zendaya, Oscar Isaac, Rebecca Ferguson",
        duration: "2h 46m",
        rating: "PG-13",
        language: "Doblada / Subtitulada",
        trailer: "https://www.youtube.com/embed/n9xhJsAgZmw",
        avgRating: 4.7,
        schedules: ["15:30", "18:00", "20:30", "23:00"]
    },
    {
        id: 2,
        title: "Oppenheimer",
        genre: "drama",
        format: "2d",
        poster: "💣",
        synopsis: "La historia de J. Robert Oppenheimer y su papel crucial en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.",
        cast: "Cillian Murphy, Robert Downey Jr., Emily Blunt, Matt Damon",
        duration: "3h 0m",
        rating: "+13",
        language: "Subtitulada",
        trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
        avgRating: 4.8,
        schedules: ["16:00", "19:15", "22:00"]
    },
    {
        id: 3,
        title: "Inside Out 2",
        genre: "comedy",
        format: "3d",
        poster: "😄",
        synopsis: "Riley entra a la adolescencia y sus emociones vuelven a reunirse para ayudarla a navegar este nuevo capítulo de su vida.",
        cast: "Amy Poehler, Phyllis Smith, Lewis Black, Mindy Kaling",
        duration: "1h 36m",
        rating: "ATP",
        language: "Doblada",
        trailer: "https://www.youtube.com/embed/hA2lIGM8eEU",
        avgRating: 4.6,
        schedules: ["14:00", "16:30", "19:00", "21:30"]
    },
    {
        id: 4,
        title: "Spider-Man: Across the Spider-Verse",
        genre: "action",
        format: "3d",
        poster: "🕷️",
        synopsis: "Miles Morales enfrenta nuevas amenazas mientras viaja a través del multiverso junto a otros Spider-People.",
        cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jake Johnson",
        duration: "2h 20m",
        rating: "+16",
        language: "Doblada / Subtitulada",
        trailer: "https://www.youtube.com/embed/gKzLwUQqJ6s",
        avgRating: 4.9,
        schedules: ["15:00", "17:45", "20:15", "22:45"]
    }
];

// ========================= VARIABLES GLOBALES =========================
let currentUser = null;
let selectedMovie = null;
let selectedDate = new Date().toISOString().split('T')[0];
let selectedTime = null;
let selectedSeats = [];
let currentReviewMovieId = null;
let paymentCompleted = false;

// ========================= UTILIDADES =========================
function generateReservationCode() {
    return 'RES' + Date.now().toString().slice(-8);
}

function generateAvatar(name) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const color = colors[name.charCodeAt(0) % colors.length];
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 40, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0).toUpperCase(), 20, 20);
    return canvas.toDataURL();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

function generateQRCode(text) {
    const qr = new QRious({
        element: document.getElementById('qrCode'),
        value: text,
        size: 200,
        level: 'H',
        background: '#fff',
        foreground: '#000'
    });
}

// ========================= LOCALSTORAGE =========================
function saveUser(user) {
    localStorage.setItem('cineappUser', JSON.stringify(user));
}

function loadUser() {
    const user = localStorage.getItem('cineappUser');
    return user ? JSON.parse(user) : null;
}

function deleteUser() {
    localStorage.removeItem('cineappUser');
}

function saveReviews(reviews) {
    localStorage.setItem('cineappReviews', JSON.stringify(reviews));
}

function loadReviews() {
    const reviews = localStorage.getItem('cineappReviews');
    return reviews ? JSON.parse(reviews) : {};
}

function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('cineappReservations') || '[]');
    reservations.push(reservation);
    localStorage.setItem('cineappReservations', JSON.stringify(reservations));
}

// ========================= AUTENTICACIÓN =========================
function initAuth() {
    currentUser = loadUser();
    const loginBtn = document.getElementById('loginBtn');
    const userLogged = document.getElementById('userLogged');
    const logoutBtn = document.getElementById('logoutBtn');

    if (currentUser) {
        loginBtn.style.display = 'none';
        userLogged.style.display = 'flex';
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userAvatar').src = currentUser.avatar;
    } else {
        loginBtn.style.display = 'block';
        userLogged.style.display = 'none';
    }

    loginBtn.addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('active');
    });

    document.getElementById('closeLoginModal').addEventListener('click', () => {
        document.getElementById('loginModal').classList.remove('active');
    });

    // Tabs del auth
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById(tabName + 'Form').classList.add('active');
        });
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#loginForm input[type="email"]').value;
        const password = document.querySelector('#loginForm input[type="password"]').value;
        
        const user = {
            name: email.split('@')[0],
            email: email,
            avatar: generateAvatar(email.split('@')[0])
        };

        currentUser = user;
        saveUser(user);
        document.getElementById('loginModal').classList.remove('active');
        initAuth();
        document.getElementById('loginForm').reset();
    });

    // Registro
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#registerForm input[type="text"]').value;
        const email = document.querySelector('#registerForm input[type="email"]').value;
        const password = document.querySelector('#registerForm input[type="password"]:first-of-type').value;
        const confirmPassword = document.querySelector('#registerForm input[type="password"]:last-of-type').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const user = {
            name: name,
            email: email,
            avatar: generateAvatar(name)
        };

        currentUser = user;
        saveUser(user);
        document.getElementById('loginModal').classList.remove('active');
        initAuth();
        document.getElementById('registerForm').reset();
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            deleteUser();
            currentUser = null;
            initAuth();
            location.reload();
        });
    }
}

// ========================= PELÍCULAS =========================
function renderMovies(moviesToShow = moviesDatabase) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = moviesToShow.map(movie => `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <div style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%;">
                    ${movie.poster}
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.format.toUpperCase()}</span>
                    <span>${movie.rating}</span>
                    <span class="movie-rating">⭐ ${movie.avgRating}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Event listeners para tarjetas
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = parseInt(card.dataset.movieId);
            showMovieDetails(movieId);
        });
    });
}

function showMovieDetails(movieId) {
    selectedMovie = moviesDatabase.find(m => m.id === movieId);
    currentReviewMovieId = movieId;

    if (!selectedMovie) return;

    // Cargar reseñas
    const allReviews = loadReviews();
    const movieReviews = allReviews[movieId] || [];

    // Mostrar datos en el modal
    document.getElementById('detailTitle').textContent = selectedMovie.title;
    document.getElementById('starRating').textContent = '⭐'.repeat(Math.round(selectedMovie.avgRating));
    document.getElementById('ratingText').textContent = `${selectedMovie.avgRating} / 5 (${movieReviews.length} opiniones)`;
    document.getElementById('detailSynopsis').textContent = selectedMovie.synopsis;
    document.getElementById('detailCast').textContent = selectedMovie.cast;
    document.getElementById('detailDuration').textContent = selectedMovie.duration;
    document.getElementById('detailRating').textContent = selectedMovie.rating;
    document.getElementById('detailLanguage').textContent = selectedMovie.language;
    document.getElementById('trailerFrame').src = selectedMovie.trailer;

    // Renderizar reseñas
    renderReviews(movieReviews);

    // Selector de estrellas en reseñas
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('selected');
        star.addEventListener('click', function() {
            document.querySelectorAll('.star').forEach(s => {
                if(parseInt(s.dataset.value) <= parseInt(this.dataset.value)) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    // Enviar reseña
    document.getElementById('submitReviewBtn').addEventListener('click', submitReview);

    document.getElementById('trailerModal').classList.add('active');
}

function renderReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #b0b3d9; text-align: center;">Sin reseñas aún. ¡Sé el primero!</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-stars">${'⭐'.repeat(review.rating)}</span>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function submitReview() {
    if (!currentUser) {
        alert('Debes iniciar sesión para dejar una reseña');
        return;
    }

    const selectedStars = document.querySelectorAll('.star.selected').length;
    const reviewText = document.getElementById('reviewText').value;

    if (selectedStars === 0 || !reviewText) {
        alert('Por favor, selecciona una calificación y escribe un comentario');
        return;
    }

    let allReviews = loadReviews();
    if (!allReviews[currentReviewMovieId]) {
        allReviews[currentReviewMovieId] = [];
    }

    allReviews[currentReviewMovieId].push({
        author: currentUser.name,
        rating: selectedStars,
        text: reviewText
    });

    saveReviews(allReviews);

    // Limpiar formulario
    document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
    document.getElementById('reviewText').value = '';

    renderReviews(allReviews[currentReviewMovieId]);
    alert('¡Reseña enviada correctamente!');
}

// ========================= SELECCIÓN DE ASIENTOS =========================
function renderSeats() {
    const seatsGrid = document.getElementById('seatsGrid');
    seatsGrid.innerHTML = '';

    // Generar 80 asientos (8 filas x 10 columnas)
    const totalSeats = 80;
    const occupiedSeats = [5, 12, 14, 18, 24, 31, 35, 42, 48, 55, 62, 68];

    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.seatNumber = i;

        if (occupiedSeats.includes(i)) {
            seat.classList.add('occupied');
            seat.textContent = '✕';
        } else {
            seat.classList.add('free');
            seat.textContent = i;
            seat.addEventListener('click', () => toggleSeat(i));
        }

        seatsGrid.appendChild(seat);
    }
}

function toggleSeat(seatNumber) {
    const seat = document.querySelector(`[data-seat-number="${seatNumber}"]`);

    if (seat.classList.contains('occupied')) return;

    if (selectedSeats.includes(seatNumber)) {
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        seat.classList.remove('selected');
    } else {
        selectedSeats.push(seatNumber);
        seat.classList.add('selected');
    }

    updateSeatsDisplay();
}

function updateSeatsDisplay() {
    const seatsList = selectedSeats.sort((a, b) => a - b).join(', ');
    document.getElementById('selectedSeatsDisplay').textContent = seatsList || 'Ninguno';

    const pricePerSeat = 5500;
    const total = selectedSeats.length * pricePerSeat;
    document.getElementById('totalSeatsPrice').textContent = formatCurrency(total);

    // Habilitar botón de pago
    const proceedBtn = document.getElementById('proceedCheckoutBtn');
    if (proceedBtn) {
        proceedBtn.disabled = selectedSeats.length === 0 || !selectedTime;
    }
}

// ========================= CHECKOUT =========================
function openCheckout() {
    if (selectedSeats.length === 0 || !selectedTime) {
        alert('Por favor, selecciona al menos un asiento y una hora');
        return;
    }

    const pricePerSeat = 5500;
    const total = selectedSeats.length * pricePerSeat;

    // Llenar resumen
    document.getElementById('checkoutMovie').textContent = selectedMovie.title;
    document.getElementById('checkoutDateTime').textContent = `${selectedDate} ${selectedTime}`;
    document.getElementById('checkoutSeats').textContent = selectedSeats.join(', ');
    document.getElementById('checkoutQuantity').textContent = selectedSeats.length;
    document.getElementById('checkoutTotal').textContent = formatCurrency(total);
    document.getElementById('bankAmount').textContent = formatCurrency(total);

    // Mostrar sección de checkout
    document.getElementById('seatsSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
    document.getElementById('trailerModal').classList.remove('active');

    paymentCompleted = false;
    updateFinalizeBtnState();
}

// ========================= SIMULADOR DE PAGO =========================
document.addEventListener('DOMContentLoaded', () => {
    const uploadReceiptBtn = document.getElementById('uploadReceiptBtn');
    const receiptFile = document.getElementById('receiptFile');

    if (uploadReceiptBtn && receiptFile) {
        uploadReceiptBtn.addEventListener('click', () => receiptFile.click());

        receiptFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('receiptFileName').textContent = file.name;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('receiptPreview');
                    const img = document.getElementById('receiptImage');
                    img.src = event.target.result;
                    preview.style.display = 'block';
                    paymentCompleted = true;
                    updateFinalizeBtnState();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const simulatePaymentBtn = document.getElementById('simulatePaymentBtn');
    if (simulatePaymentBtn) {
        simulatePaymentBtn.addEventListener('click', () => {
            paymentCompleted = true;
            document.getElementById('receiptFileName').textContent = 'Transferencia simulada completada ✓';
            updateFinalizeBtnState();
        });
    }
});

function updateFinalizeBtnState() {
    const finalizeBtn = document.getElementById('finalizePaymentBtn');
    if (finalizeBtn) {
        finalizeBtn.disabled = !paymentCompleted;
    }
}

// ========================= TICKET DIGITAL =========================
function generateTicket() {
    if (!currentUser) {
        alert('Debes iniciar sesión');
        return;
    }

    const pricePerSeat = 5500;
    const total = selectedSeats.length * pricePerSeat;
    const reservationCode = generateReservationCode();

    // Guardar reserva
    const reservation = {
        code: reservationCode,
        user: currentUser.name,
        movie: selectedMovie.title,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        total: total
    };

    saveReservation(reservation);

    // Llenar ticket
    document.getElementById('ticketUserName').textContent = currentUser.name;
    document.getElementById('ticketMovie').textContent = selectedMovie.title;
    document.getElementById('ticketDateTime').textContent = `${selectedDate} ${selectedTime}`;
    document.getElementById('ticketRoom').textContent = 'Sala 5';
    document.getElementById('ticketSeats').textContent = selectedSeats.join(', ');
    document.getElementById('ticketAmount').textContent = formatCurrency(total);
    document.getElementById('ticketCode').textContent = reservationCode;

    // Generar QR
    generateQRCode(reservationCode);

    // Mostrar modal
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('ticketModal').classList.add('active');
}

// ========================= BUSCADOR Y FILTROS =========================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const formatSelect = document.getElementById('formatSelect');
    const genreSelect = document.getElementById('genreSelect');

    function filterMovies() {
        const searchTerm = searchInput.value.toLowerCase();
        const format = formatSelect.value;
        const genre = genreSelect.value;

        const filtered = moviesDatabase.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
            const matchesFormat = !format || movie.format === format;
            const matchesGenre = !genre || movie.genre === genre;

            return matchesSearch && matchesFormat && matchesGenre;
        });

        renderMovies(filtered);
    }

    searchInput.addEventListener('input', filterMovies);
    formatSelect.addEventListener('change', filterMovies);
    genreSelect.addEventListener('change', filterMovies);
}

// ========================= COPIAR DATOS BANCARIOS =========================
document.addEventListener('DOMContentLoaded', () => {
    const copyAliasBtn = document.getElementById('copyAliasBtn');
    const copyCVUBtn = document.getElementById('copyCVUBtn');

    if (copyAliasBtn) {
        copyAliasBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('cine.app.reservas');
            alert('Alias copiado al portapapeles');
        });
    }

    if (copyCVUBtn) {
        copyCVUBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('0000003100012345678901');
            alert('CVU copiado al portapapeles');
        });
    }
});

// ========================= IMPRESIÓN Y DESCARGA DE TICKET =========================
document.addEventListener('DOMContentLoaded', () => {
    const printTicketBtn = document.getElementById('printTicketBtn');
    const downloadTicketBtn = document.getElementById('downloadTicketBtn');
    const closeTrailerModal = document.getElementById('closeTrailerModal');
    const closeTicketModal = document.getElementById('closeTicketModal');
    const selectSeatsBtn = document.getElementById('selectSeatsBtn');
    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
    const finalizePaymentBtn = document.getElementById('finalizePaymentBtn');
    const newBookingBtn = document.getElementById('newBookingBtn');

    if (printTicketBtn) {
        printTicketBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (downloadTicketBtn) {
        downloadTicketBtn.addEventListener('click', () => {
            const ticketContent = document.getElementById('ticketContent').innerHTML;
            const link = document.createElement('a');
            link.href = 'data:text/html,' + encodeURIComponent(ticketContent);
            link.download = 'ticket-cineapp.html';
            link.click();
        });
    }

    if (closeTrailerModal) {
        closeTrailerModal.addEventListener('click', () => {
            document.getElementById('trailerModal').classList.remove('active');
        });
    }

    if (closeTicketModal) {
        closeTicketModal.addEventListener('click', () => {
            document.getElementById('ticketModal').classList.remove('active');
        });
    }

    if (selectSeatsBtn) {
        selectSeatsBtn.addEventListener('click', () => {
            if (!selectedMovie) {
                alert('Debes seleccionar una película');
                return;
            }

            document.getElementById('trailerModal').classList.remove('active');
            document.getElementById('seatsSection').style.display = 'block';

            // Limpiar sección previa si existe
            const existingSchedules = document.querySelector('.seats-section > div:first-of-type');
            if (existingSchedules && existingSchedules.style.marginBottom === '25px') {
                existingSchedules.remove();
            }

            // Renderizar horarios y asientos
            renderSchedules();
            renderSeats();
            
            // Scroll hacia la sección
            document.getElementById('seatsSection').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener('click', openCheckout);
    }

    if (finalizePaymentBtn) {
        finalizePaymentBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Debes iniciar sesión');
                return;
            }
            generateTicket();
        });
    }

    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', () => {
            document.getElementById('ticketModal').classList.remove('active');
            selectedMovie = null;
            selectedSeats = [];
            selectedTime = null;
            paymentCompleted = false;
            document.getElementById('moviesGrid').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// ========================= HORARIOS =========================
function renderSchedules() {
    const container = document.getElementById('seatsSection');
    
    // Remover horarios previos si existen
    const existingSchedules = container.querySelector('.schedules-wrapper');
    if (existingSchedules) {
        existingSchedules.remove();
    }

    let schedulesHtml = '<div class="schedules-wrapper" style="margin-bottom: 25px;">';
    schedulesHtml += '<label style="color: #b0b3d9; margin-right: 15px; display: block; margin-bottom: 12px;">Selecciona horario:</label>';
    schedulesHtml += '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';

    selectedMovie.schedules.forEach(schedule => {
        schedulesHtml += `
            <button class="schedule-btn" data-time="${schedule}" style="
                background: rgba(72, 219, 251, 0.1);
                border: 2px solid rgba(72, 219, 251, 0.3);
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">${schedule}</button>
        `;
    });

    schedulesHtml += '</div></div>';

    const scheduleContainer = document.createElement('div');
    scheduleContainer.innerHTML = schedulesHtml;
    
    // Insertar antes de la leyenda de asientos
    const seatsContainer = container.querySelector('.seats-container');
    container.insertBefore(scheduleContainer, seatsContainer);

    // Event listeners para horarios
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.schedule-btn').forEach(b => {
                b.style.background = 'rgba(72, 219, 251, 0.1)';
                b.style.borderColor = 'rgba(72, 219, 251, 0.3)';
                b.style.color = '#ffffff';
            });

            selectedTime = this.dataset.time;
            this.style.background = 'linear-gradient(135deg, #48dbfb, #00d4ff)';
            this.style.borderColor = '#00d4ff';
            this.style.color = '#0a0e27';

            updateSeatsDisplay();
        });
    });
}

// ========================= CIERRE DE MODALES FUERA =========================
document.addEventListener('click', (e) => {
    const loginModal = document.getElementById('loginModal');
    const trailerModal = document.getElementById('trailerModal');
    const ticketModal = document.getElementById('ticketModal');

    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }

    if (e.target === trailerModal) {
        trailerModal.classList.remove('active');
    }

    if (e.target === ticketModal) {
        ticketModal.classList.remove('active');
    }
});

// ========================= INICIALIZACIÓN =========================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    renderMovies();
    initSearch();

    // Fecha hoy por defecto
    const today = new Date();
    selectedDate = today.toISOString().split('T')[0];
});
