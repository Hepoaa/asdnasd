/* =====================================================
   SÉ QUE ERES TÚ - Main Application
   20 Capítulos + Galería Multimedia + Música
   ===================================================== */

// Media files for the gallery (38 images + 1 video)
const galleryMedia = {
    video: 'assets/WhatsApp Video 2026-01-31 at 12.56.58 AM.mp4',
    images: [
        // 8 fotos principales de WhatsApp
        'assets/WhatsApp Image 2026-01-31 at 12.56.46 AM (1).jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.56.46 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.56.47 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.57.02 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.57.04 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.57.05 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.57.10 AM.jpeg',
        'assets/WhatsApp Image 2026-01-31 at 12.57.13 AM.jpeg',
        // 30 imágenes adicionales
        'assets/imgi_74_default.jpg',
        'assets/imgi_82_default.jpg',
        'assets/imgi_87_default.jpg',
        'assets/imgi_89_default.jpg',
        'assets/imgi_91_default.jpg',
        'assets/imgi_94_default.jpg',
        'assets/imgi_98_default.jpg',
        'assets/imgi_108_default.jpg',
        'assets/imgi_119_default.jpg',
        'assets/imgi_120_default.jpg',
        'assets/imgi_122_default.jpg',
        'assets/imgi_123_default.jpg',
        'assets/imgi_124_default.jpg',
        'assets/imgi_125_default.jpg',
        'assets/imgi_126_default.jpg',
        'assets/imgi_127_default.jpg',
        'assets/imgi_128_default.jpg',
        'assets/imgi_129_default.jpg',
        'assets/imgi_130_default.jpg',
        'assets/imgi_131_default.jpg',
        'assets/imgi_132_default.jpg',
        'assets/imgi_134_default.jpg',
        'assets/imgi_138_default.jpg',
        'assets/imgi_139_default.jpg',
        'assets/imgi_141_default.jpg',
        'assets/imgi_142_default.jpg',
        'assets/imgi_143_default.jpg',
        'assets/imgi_145_default.jpg'
    ]
};

// Personal Love Story Content - 20 pages
const bookContent = generateBookContent();

// Main App State
const app = {
    book: null,
    isReadingMode: false,
    isNightMode: false,
    isAutoplay: false,
    autoplayInterval: null,
    autoplaySpeed: 5000,
    isMuted: false,
    gallery: {
        currentIndex: -1, // -1 = video, 0+ = images
        isVideoPlaying: true,
        slideInterval: null
    }
};

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    welcomeScreen: document.getElementById('welcome-screen'),
    bookContainer: document.getElementById('book-container'),
    book: document.getElementById('book'),
    currentPage: document.getElementById('current-page'),
    totalPages: document.getElementById('total-pages'),
    navPrev: document.getElementById('nav-prev'),
    navNext: document.getElementById('nav-next'),
    btnIndex: document.getElementById('btn-index'),
    btnReadingMode: document.getElementById('btn-reading-mode'),
    btnNightMode: document.getElementById('btn-night-mode'),
    btnAutoplay: document.getElementById('btn-autoplay'),
    btnSound: document.getElementById('btn-sound'),
    indexModal: document.getElementById('index-modal'),
    indexGrid: document.getElementById('index-grid'),
    zoomModal: document.getElementById('zoom-modal'),
    zoomImage: document.getElementById('zoom-image'),
    autoplayControls: document.getElementById('autoplay-controls'),
    autoplaySpeed: document.getElementById('autoplay-speed'),
    speedValue: document.getElementById('speed-value'),
    floatingPetals: document.getElementById('floating-petals'),
    // Gallery elements
    galleryVideo: document.getElementById('gallery-video'),
    galleryImage: document.getElementById('gallery-image'),
    galleryPrev: document.getElementById('gallery-prev'),
    galleryNext: document.getElementById('gallery-next'),
    galleryDots: document.getElementById('gallery-dots'),
    // Music
    backgroundMusic: document.getElementById('background-music'),
    // Quiz elements
    startQuizBtn: document.getElementById('start-quiz-btn'),
    quizScreen: document.getElementById('quiz-screen'),
    quizCard: document.getElementById('quiz-card'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    questionText: document.getElementById('question-text'),
    quizOptions: document.getElementById('quiz-options'),
    quizResult: document.getElementById('quiz-result'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    scoreNumber: document.getElementById('score-number'),
    resultMessage: document.getElementById('result-message'),
    retryQuizBtn: document.getElementById('retry-quiz-btn'),
    continueToBookBtn: document.getElementById('continue-to-book-btn'),
    quizHearts: document.getElementById('quiz-hearts')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    createFloatingPetals();
    initGalleryDots();
    createQuizFloatingHearts();
});

// Loading Animation
function initLoading() {
    elements.totalPages.textContent = '20';

    setTimeout(() => {
        elements.loadingScreen.classList.add('fade-out');
        elements.welcomeScreen.classList.remove('hidden');

        setTimeout(() => {
            elements.loadingScreen.classList.add('hidden');
        }, 800);
    }, 2800);
}

// =====================================================
// QUIZ SYSTEM
// =====================================================

const quizQuestions = [
    { q: "¿Cuál es mi comida favorita absoluta?", a: "Hamburguesa", options: ["Pizza", "Tacos", "Hamburguesa", "Sushi"] },
    { q: "¿Cuál sería mi plan perfecto para un fin de semana?", a: "Quedarme en casa viendo pelis contigo", options: ["Ir de fiesta con amigos", "Quedarme en casa viendo pelis contigo", "Salir a escalar montañas", "Dormir todo el día"] },
    { q: "¿Cuál es mi viaje soñado?", a: "Noruega en una cabaña", options: ["París y la Torre Eiffel", "Nueva York de compras", "Noruega en una cabaña", "La playa en el Caribe"] },
    { q: "¿Qué es lo que más me molesta?", a: "Que me mientan", options: ["El tráfico", "Que me mientan", "Que haya desorden", "La gente lenta"] },
    { q: "¿Cuál es mi mayor miedo?", a: "El océano", options: ["Las alturas", "Las arañas", "La oscuridad", "El océano"] },
    { q: "¿Qué música puedo escuchar por horas?", a: "Corridos", options: ["Reggaetón", "Rock", "Pop", "Corridos"] },
    { q: "¿Cuál es mi bebida favorita?", a: "Agua natural", options: ["Cerveza", "Agua natural", "Coca-Cola", "Jugo de naranja"] },
    { q: "¿Cuál es mi color favorito?", a: "Negro", options: ["Azul", "Rojo", "Negro", "Blanco"] },
    { q: "¿Cuándo es mi cumpleaños?", a: "25 de agosto", options: ["15 de septiembre", "25 de agosto", "10 de julio", "5 de agosto"] },
    { q: "¿Qué es lo que más me gusta de ti?", a: "Todo, de pies a cabeza", options: ["Tus ojos", "Tu sonrisa", "Todo, de pies a cabeza", "Tu forma de ser"] }
];

let quizState = {
    currentQuestion: 0,
    score: 0,
    isAnswering: false
};

// Start Quiz Button (from welcome screen)
elements.startQuizBtn?.addEventListener('click', () => {
    // Start music immediately on first user interaction
    startBackgroundMusic();

    elements.welcomeScreen.classList.add('hidden');
    elements.quizScreen.classList.remove('hidden');
    startQuiz();
});

function startQuiz() {
    quizState.currentQuestion = 0;
    quizState.score = 0;
    quizState.isAnswering = false;

    elements.quizCard.classList.remove('hidden');
    elements.quizResult.classList.add('hidden');

    loadQuizQuestion();
}

function loadQuizQuestion() {
    const q = quizQuestions[quizState.currentQuestion];
    const total = quizQuestions.length;

    // Update progress
    const progress = ((quizState.currentQuestion + 1) / total) * 100;
    elements.progressFill.style.width = progress + '%';
    elements.progressText.textContent = `${quizState.currentQuestion + 1} / ${total}`;

    // Update question
    elements.questionText.textContent = q.q;

    // Shuffle and display options
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    elements.quizOptions.innerHTML = '';

    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => handleQuizAnswer(option, btn));
        elements.quizOptions.appendChild(btn);
    });
}

function handleQuizAnswer(selected, button) {
    if (quizState.isAnswering) return;
    quizState.isAnswering = true;

    const correct = quizQuestions[quizState.currentQuestion].a;
    const isCorrect = selected === correct;

    // Disable all buttons
    const allButtons = elements.quizOptions.querySelectorAll('.quiz-option');
    allButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        }
    });

    if (isCorrect) {
        quizState.score++;
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
    }

    // Next question after delay
    setTimeout(() => {
        quizState.currentQuestion++;
        quizState.isAnswering = false;

        if (quizState.currentQuestion < quizQuestions.length) {
            loadQuizQuestion();
        } else {
            showQuizResult();
        }
    }, 1200);
}

function showQuizResult() {
    elements.quizCard.classList.add('hidden');
    elements.quizResult.classList.remove('hidden');

    const score = quizState.score;
    const total = quizQuestions.length;

    elements.scoreNumber.textContent = score;

    // Determine result message
    let emoji, title, message;

    if (score === 10) {
        emoji = '💍';
        title = '¡PERFECTA!';
        message = '¡Eres la novia perfecta! Me conoces mejor que nadie. Te amo ❤️';
    } else if (score >= 8) {
        emoji = '💖';
        title = '¡Increíble!';
        message = '¡Me conoces casi a la perfección! Eres especial 😍';
    } else if (score >= 6) {
        emoji = '💕';
        title = '¡Muy bien!';
        message = 'Sabes bastante sobre mí. ¡Seguimos conociéndonos! 😊';
    } else if (score >= 4) {
        emoji = '💗';
        title = 'Nada mal';
        message = 'Creo que necesitamos pasar más tiempo juntos 😉';
    } else {
        emoji = '💝';
        title = 'Mmm...';
        message = '¡Tenemos mucho por descubrir juntos! 🥰';
    }

    elements.resultEmoji.textContent = emoji;
    elements.resultTitle.textContent = title;
    elements.resultMessage.textContent = message;
}

// Retry Quiz
elements.retryQuizBtn?.addEventListener('click', () => {
    startQuiz();
});

// Continue to Book
elements.continueToBookBtn?.addEventListener('click', async () => {
    await audioManager.init();
    audioManager.playBookOpen();

    // Start background music
    startBackgroundMusic();

    elements.quizScreen.classList.add('hidden');
    elements.bookContainer.classList.remove('hidden');

    setTimeout(() => {
        elements.bookContainer.classList.add('visible');
        initBook();
        initGallery();
    }, 100);
});

// Create floating hearts for quiz
function createQuizFloatingHearts() {
    if (!elements.quizHearts) return;

    const hearts = ['💕', '💖', '💗', '💓', '❤️', '💘'];

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (6 + Math.random() * 8) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        elements.quizHearts.appendChild(heart);
    }
}

// Background Music Function
function startBackgroundMusic() {
    const music = elements.backgroundMusic;
    if (!music) return;

    music.volume = 0.5;
    music.loop = true;

    // Try to play
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('🎵 Música reproduciéndose');
        }).catch(error => {
            console.log('🎵 Autoplay bloqueado, esperando interacción del usuario...');
            // Try again on any user interaction
            document.addEventListener('click', function resumeMusic() {
                music.play().then(() => {
                    console.log('🎵 Música iniciada tras interacción');
                    document.removeEventListener('click', resumeMusic);
                }).catch(() => { });
            }, { once: false });
        });
    }
}

// Initialize Book Engine
function initBook() {
    app.book = new BookEngine(elements.book);
    app.book.totalPages = 20;
    app.book.init(bookContent);

    app.book.on('pageChange', updatePageIndicator);
    app.book.on('flipStart', () => {
        audioManager.playPageFlip();
    });

    updatePageIndicator(app.book.getCurrentPageNumbers());
    updateNavigationButtons();
    generateIndexThumbnails();
}

function updatePageIndicator(pages) {
    elements.currentPage.textContent = pages.right;
    updateNavigationButtons();
}

function updateNavigationButtons() {
    if (!app.book) return;
    elements.navPrev.disabled = !app.book.canGoBackward();
    elements.navNext.disabled = !app.book.canGoForward();
}

// =====================================================
// GALLERY SYSTEM
// =====================================================

function initGalleryDots() {
    if (!elements.galleryDots) return;

    // Create dot for video
    const videoDot = document.createElement('span');
    videoDot.className = 'gallery-dot active';
    videoDot.dataset.index = '-1';
    videoDot.innerHTML = '▶';
    videoDot.addEventListener('click', () => showGalleryItem(-1));
    elements.galleryDots.appendChild(videoDot);

    // Create dots for images
    galleryMedia.images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot';
        dot.dataset.index = i;
        dot.addEventListener('click', () => showGalleryItem(i));
        elements.galleryDots.appendChild(dot);
    });
}

function initGallery() {
    if (!elements.galleryVideo) return;

    // Start with video
    app.gallery.currentIndex = -1;
    app.gallery.isVideoPlaying = true;

    elements.galleryVideo.classList.remove('hidden');
    elements.galleryImage.classList.add('hidden');
    elements.galleryVideo.play().catch(() => { });

    // When video ends, start image slideshow
    elements.galleryVideo.addEventListener('ended', () => {
        startImageSlideshow();
    });

    // Gallery navigation
    elements.galleryPrev?.addEventListener('click', () => {
        if (app.gallery.currentIndex === -1) {
            showGalleryItem(galleryMedia.images.length - 1);
        } else if (app.gallery.currentIndex === 0) {
            showGalleryItem(-1);
        } else {
            showGalleryItem(app.gallery.currentIndex - 1);
        }
    });

    elements.galleryNext?.addEventListener('click', () => {
        if (app.gallery.currentIndex === -1) {
            showGalleryItem(0);
        } else if (app.gallery.currentIndex >= galleryMedia.images.length - 1) {
            showGalleryItem(-1);
        } else {
            showGalleryItem(app.gallery.currentIndex + 1);
        }
    });
}

function showGalleryItem(index) {
    app.gallery.currentIndex = index;

    // Stop any running slideshow
    if (app.gallery.slideInterval) {
        clearInterval(app.gallery.slideInterval);
        app.gallery.slideInterval = null;
    }

    // Update dots
    const dots = elements.galleryDots?.querySelectorAll('.gallery-dot');
    dots?.forEach((dot, i) => {
        const dotIndex = parseInt(dot.dataset.index);
        dot.classList.toggle('active', dotIndex === index);
    });

    if (index === -1) {
        // Show video
        elements.galleryVideo.classList.remove('hidden');
        elements.galleryImage.classList.add('hidden');
        elements.galleryVideo.currentTime = 0;
        elements.galleryVideo.play().catch(() => { });
        app.gallery.isVideoPlaying = true;
    } else {
        // Show image
        elements.galleryVideo.pause();
        elements.galleryVideo.classList.add('hidden');
        elements.galleryImage.classList.remove('hidden');
        elements.galleryImage.src = galleryMedia.images[index];
        app.gallery.isVideoPlaying = false;

        // Start slideshow from this image
        startImageSlideshow();
    }
}

function startImageSlideshow() {
    if (app.gallery.slideInterval) {
        clearInterval(app.gallery.slideInterval);
    }

    // If coming from video, show first image
    if (app.gallery.currentIndex === -1) {
        showGalleryItem(0);
        return;
    }

    // Change image every 2 seconds
    app.gallery.slideInterval = setInterval(() => {
        let nextIndex = app.gallery.currentIndex + 1;
        if (nextIndex >= galleryMedia.images.length) {
            nextIndex = 0; // Loop back to first image (not video)
        }

        // Update image with fade effect
        elements.galleryImage.style.opacity = '0';
        setTimeout(() => {
            elements.galleryImage.src = galleryMedia.images[nextIndex];
            app.gallery.currentIndex = nextIndex;
            elements.galleryImage.style.opacity = '1';

            // Update dots
            const dots = elements.galleryDots?.querySelectorAll('.gallery-dot');
            dots?.forEach((dot) => {
                const dotIndex = parseInt(dot.dataset.index);
                dot.classList.toggle('active', dotIndex === nextIndex);
            });
        }, 300);
    }, 2000);
}

// =====================================================
// NAVIGATION
// =====================================================

elements.navPrev.addEventListener('click', () => {
    if (app.book) app.book.prevPage();
});

elements.navNext.addEventListener('click', () => {
    if (app.book) app.book.nextPage();
});

elements.btnIndex.addEventListener('click', () => {
    openModal(elements.indexModal);
});

function generateIndexThumbnails() {
    elements.indexGrid.innerHTML = '';

    const chapterNames = [
        '1. El Vacío', '2. El Impacto', '3. La Intuición', '4. La Sorpresa',
        '5. Acercamiento', '6. Mi Hogar', '7. La Máscara', '8. La Paz',
        '9. El Tiempo', '10. La Confesión', '11. El Refugio', '12. La Confianza',
        '13. Los Detalles', '14. Un Equipo', '15. La Tormenta', '16. La Duda',
        '17. El Perdón', '18. Paciencia', '19. Aceptarnos', '20. Tú'
    ];

    for (let i = 1; i <= 20; i++) {
        const thumb = document.createElement('button');
        thumb.className = 'index-thumbnail';
        thumb.innerHTML = `<span class="thumb-num">${i}</span><span class="thumb-title">${chapterNames[i - 1].split('. ')[1]}</span>`;
        thumb.setAttribute('aria-label', `Ir a ${chapterNames[i - 1]}`);

        thumb.addEventListener('click', () => {
            if (app.book) {
                app.book.goToPage(i);
                closeModal(elements.indexModal);
            }
        });

        elements.indexGrid.appendChild(thumb);
    }
}

// =====================================================
// CONTROLS
// =====================================================

elements.btnReadingMode.addEventListener('click', () => {
    app.isReadingMode = !app.isReadingMode;
    document.body.classList.toggle('reading-mode', app.isReadingMode);
    elements.btnReadingMode.classList.toggle('active', app.isReadingMode);
});

elements.btnNightMode.addEventListener('click', () => {
    app.isNightMode = !app.isNightMode;
    document.body.classList.toggle('night-mode', app.isNightMode);
    elements.btnNightMode.classList.toggle('active', app.isNightMode);
});

elements.btnAutoplay.addEventListener('click', () => {
    app.isAutoplay = !app.isAutoplay;
    elements.btnAutoplay.classList.toggle('active', app.isAutoplay);
    elements.autoplayControls.classList.toggle('hidden', !app.isAutoplay);

    if (app.isAutoplay) {
        startAutoplay();
    } else {
        stopAutoplay();
    }
});

elements.autoplaySpeed.addEventListener('input', (e) => {
    app.autoplaySpeed = parseInt(e.target.value) * 1000;
    elements.speedValue.textContent = e.target.value + 's';

    if (app.isAutoplay) {
        stopAutoplay();
        startAutoplay();
    }
});

function startAutoplay() {
    app.autoplayInterval = setInterval(() => {
        if (app.book && app.book.canGoForward()) {
            app.book.nextPage();
        } else {
            stopAutoplay();
            app.isAutoplay = false;
            elements.btnAutoplay.classList.remove('active');
            elements.autoplayControls.classList.add('hidden');
        }
    }, app.autoplaySpeed);
}

function stopAutoplay() {
    if (app.autoplayInterval) {
        clearInterval(app.autoplayInterval);
        app.autoplayInterval = null;
    }
}

// Sound/Music Toggle
elements.btnSound.addEventListener('click', () => {
    app.isMuted = !app.isMuted;

    // Toggle background music
    if (elements.backgroundMusic) {
        elements.backgroundMusic.muted = app.isMuted;
    }

    // Toggle sound effects
    audioManager.toggleMute();

    elements.btnSound.classList.toggle('active', !app.isMuted);

    const svg = elements.btnSound.querySelector('svg');
    if (app.isMuted) {
        svg.innerHTML = `
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
        `;
    } else {
        svg.innerHTML = `
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
        `;
    }
});

// =====================================================
// MODALS
// =====================================================

function openModal(modal) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.add('visible');
    });

    if (modal === elements.indexModal && app.book) {
        const thumbnails = elements.indexGrid.querySelectorAll('.index-thumbnail');
        thumbnails.forEach((thumb, i) => {
            const pages = app.book.getCurrentPageNumbers();
            thumb.classList.toggle('current', i + 1 === pages.left || i + 1 === pages.right);
        });
    }
}

function closeModal(modal) {
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 400);
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const modal = overlay.closest('.modal');
        closeModal(modal);
    });
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// =====================================================
// FLOATING PETALS
// =====================================================

function createFloatingPetals() {
    const petalCount = 12;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (8 + Math.random() * 10) + 's';
        petal.style.animationDelay = (Math.random() * 10) + 's';
        petal.style.opacity = 0.3 + Math.random() * 0.4;
        petal.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        elements.floatingPetals.appendChild(petal);
    }
}

// =====================================================
// BOOK CONTENT - 20 PAGES (Sin fotos - ahora están en la galería)
// =====================================================

function generateBookContent() {
    const pages = [];
    const createPage = (front, back) => ({ front, back });

    // Página 1: El Vacío
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">I</div>
            <h2 class="chapter-title">El Vacío</h2>
            <div class="chapter-ornament">💔</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Antes de ti era un tontito disociado que era un emo siempre y pensaba que estar solo estaba mejor. Si tuviera que resumir todo lo que era antes así lo diría.
            </p>
            <p class="story-text">
                Me la pasaba casi siempre solo o con mis amigos a veces, estaba en el celular, ni ponía atención a las clases...
            </p>
            <p class="story-text">
                Estaba con el corazón roto. No tenía a alguien con el que sentirme feliz y querido. No hablo de algo físico sino emocional.
            </p>
            <p class="story-text highlight">
                Hasta que un día...
            </p>
        </div>`
    ));

    // Página 2: El Impacto
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">II</div>
            <h2 class="chapter-title">El Impacto</h2>
            <div class="chapter-ornament">⚡</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Cuando te conocí por casualidad, suerte, decisión... no sé cómo lo tomes. Fue una casualidad muy bonita.
            </p>
            <p class="story-text big-quote">
                ¿O no fue casualidad?
            </p>
            <p class="story-text">
                Cuando te vi por primera vez fue cuando me hablaste y respondí como tonto, ¿verdad? Después de ahí te ponía más atención, veía dónde estabas, a veces te buscaba...
            </p>
            <p class="story-text">
                Cuando salimos de la clase y sabía que venías para acá, <span class="highlight">te lo juro que sabía que era para hablarme.</span>
            </p>
            <p class="story-text">
                Después me di cuenta que sí me hablaste, me pediste el número y empezamos a hablar.
            </p>
        </div>`
    ));

    // Página 3: La Intuición
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">III</div>
            <h2 class="chapter-title">La Intuición</h2>
            <div class="chapter-ornament">✨</div>
        </div>`,
        `<div class="page-content centered-content">
            <p class="story-text">
                Después de hablar y hablar me empezaste a agradar.
            </p>
            <p class="story-text big-quote">
                Sentía que eras para mí y que eras la niña que siempre había querido.
            </p>
            <p class="story-text highlight">
                Pensé que te conocía de siempre...
            </p>
            <div class="page-ornament">💕</div>
        </div>`
    ));

    // Página 4: La Sorpresa
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">IV</div>
            <h2 class="chapter-title">La Sorpresa</h2>
            <div class="chapter-ornament">🌟</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Descubrí quién eres y me di cuenta que <span class="highlight">no eras como las demás.</span>
            </p>
            <p class="story-text">
                Tu risa, tu forma de hablar me parecían muy bonitas.
            </p>
            <p class="story-text">
                Tú querías tener algo serio y bonito.
            </p>
            <p class="story-text big-quote">
                Y no eras como la gente de hoy en día.
            </p>
        </div>`
    ));

    // Página 5: Acercamiento
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">V</div>
            <h2 class="chapter-title">Acercamiento</h2>
            <div class="chapter-ornament">🦋</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Tenía miedo de acercarme mucho o ser muy directo o intenso y arruinarlo.
            </p>
            <p class="story-text">
                Pero después con la confianza me solté.
            </p>
            <p class="story-text highlight">
                Empecé a ser yo mismo.
            </p>
            <p class="story-text">
                Cada día hablaba más y no me callaba o no era tan tímido.
            </p>
        </div>`
    ));

    // Página 6: Mi Hogar
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">VI</div>
            <h2 class="chapter-title">Mi Hogar</h2>
            <div class="chapter-ornament">🏠</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Después de que demostraras tus sentimientos dije:
            </p>
            <p class="story-text big-quote">
                "Aquí es, contigo me siento en casa."
            </p>
            <p class="story-text">
                Me sentía querido y muy cómodo.
            </p>
            <p class="story-text">
                Todos los errores que tuvimos queríamos enfrentarlos y no mucha gente lo hace. <span class="highlight">Así que vi siempre un futuro contigo.</span>
            </p>
        </div>`
    ));

    // Página 7: La Máscara
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">VII</div>
            <h2 class="chapter-title">La Máscara</h2>
            <div class="chapter-ornament">🎭</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Después del tiempo dejé de fingir y contenerme como era. Empecé a decir tonterías, cosas sin sentido como yo siempre soy.
            </p>
            <p class="story-text highlight">
                No me daba miedo que me vieras así.
            </p>
            <p class="story-text">
                En cambio antes con los demás sí me contenía y era muy tímido.
            </p>
            <p class="story-text big-quote">
                Contigo pude ser yo.
            </p>
        </div>`
    ));

    // Página 8: La Paz
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">VIII</div>
            <h2 class="chapter-title">La Paz</h2>
            <div class="chapter-ornament">☮️</div>
        </div>`,
        `<div class="page-content centered-content">
            <p class="story-text big-quote">
                En medio de mi caos,<br>tú eras el silencio cómodo.
            </p>
            <p class="story-text highlight">
                Me hacías sentir tranquilo.
            </p>
        </div>`
    ));

    // Página 9: El Tiempo
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">IX</div>
            <h2 class="chapter-title">El Tiempo</h2>
            <div class="chapter-ornament">⏰</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text big-quote">
                Contigo las horas parecían minutos.
            </p>
            <p class="story-text">
                Cualquier momento que estaba contigo se acababa muy rápido y yo quería mucho más.
            </p>
            <p class="story-text highlight">
                Siento que contigo puedo pasar todo el día y no me cansaría.
            </p>
            <p class="story-text">
                Porque es tiempo de calidad pura.
            </p>
        </div>`
    ));

    // Página 10: La Confesión
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">X</div>
            <h2 class="chapter-title">La Confesión</h2>
            <div class="chapter-ornament">💌</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Admitir lo que sentía. El momento de decirlo. El miedo al rechazo y sentirme valiente.
            </p>
            <p class="story-text">
                Ese momento lo pensaba meses atrás. Quería pedírtelo en un lugar bonito y que lo sintieras especial.
            </p>
            <p class="story-text highlight">
                Aunque con vergüenza lo dije...
            </p>
            <p class="story-text big-quote">
                Fue con todo mi amor.
            </p>
        </div>`
    ));

    // Página 11: El Refugio
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XI</div>
            <h2 class="chapter-title">El Refugio</h2>
            <div class="chapter-ornament">🛡️</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Sentirse seguro. Establecer que, pase lo que pase...
            </p>
            <p class="story-text big-quote">
                Nuestros brazos son el lugar donde nada malo puede pasar.
            </p>
            <p class="story-text highlight">
                Y pasara lo que pasara íbamos a estar juntos.
            </p>
        </div>`
    ));

    // Página 12: La Confianza
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XII</div>
            <h2 class="chapter-title">La Confianza</h2>
            <div class="chapter-ornament">🤝</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Un miedo que tenía siempre: a que alguien te pueda engañar.
            </p>
            <p class="story-text highlight">
                Pero contigo aprendí a romper los traumas que tenía.
            </p>
            <p class="story-text big-quote">
                Empecé a confiar ciegamente.
            </p>
        </div>`
    ));

    // Página 13: Los Detalles
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XIII</div>
            <h2 class="chapter-title">Los Detalles</h2>
            <div class="chapter-ornament">💝</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Nuestro lenguaje del amor.
            </p>
            <p class="story-text big-quote">
                Aprendí que amar está en las cosas pequeñas.
            </p>
            <p class="story-text">
                En abrazos, mensajes, fotos, algo cotidiano, una palabra o cualquier cosa que sea de ti.
            </p>
        </div>`
    ));

    // Página 14: Un Equipo
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XIV</div>
            <h2 class="chapter-title">Un Equipo</h2>
            <div class="chapter-ornament">👫</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text big-quote">
                Dejamos de ser uno.<br>De ser yo a nosotros.
            </p>
            <p class="story-text">
                Entender que los problemas los tenemos que enfrentar los dos y no solo uno debe de llevar todo.
            </p>
            <p class="story-text highlight">
                Los 2 nos apoyamos y continuamos juntos.
            </p>
        </div>`
    ));

    // Página 15: La Tormenta
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XV</div>
            <h2 class="chapter-title">La Tormenta</h2>
            <div class="chapter-ornament">⛈️</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Nuestros peores días. Cuando hay buenos días, también hay muy malos.
            </p>
            <p class="story-text">
                Cuando no nos soportábamos <span class="highlight">y te quedaste.</span>
            </p>
            <p class="story-text big-quote">
                Me di cuenta que me amas incluso en medio de la tormenta, y que podemos llegar muy lejos juntos.
            </p>
        </div>`
    ));

    // Página 16: La Duda
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XVI</div>
            <h2 class="chapter-title">La Duda</h2>
            <div class="chapter-ornament">💭</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Mis miedos, mis inseguridades, mis traumas, mis pensamientos...
            </p>
            <p class="story-text big-quote">
                Aun así me hiciste creer en nosotros.
            </p>
            <p class="story-text highlight">
                Y nuestro valor.
            </p>
        </div>`
    ));

    // Página 17: El Perdón
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XVII</div>
            <h2 class="chapter-title">El Perdón</h2>
            <div class="chapter-ornament">🕊️</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Entender que amar también es pedirnos perdón, dejar el orgullo.
            </p>
            <p class="story-text">
                Aunque yo siempre digo cosas que no haría, <span class="highlight">sí lo haría por ti.</span>
            </p>
            <p class="story-text big-quote">
                Dejaría el orgullo para salvar nuestro vínculo.
            </p>
        </div>`
    ));

    // Página 18: Tener Paciencia
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XVIII</div>
            <h2 class="chapter-title">Tener Paciencia</h2>
            <div class="chapter-ornament">🌱</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Los ritmos son distintos.
            </p>
            <p class="story-text big-quote">
                Aprender a esperar.
            </p>
            <p class="story-text">
                Respetar nuestro tiempo y espacio, y nuestras emociones sin presionarnos.
            </p>
        </div>`
    ));

    // Página 19: Aceptarnos
    pages.push(createPage(
        `<div class="page-content chapter-page">
            <div class="chapter-number">XIX</div>
            <h2 class="chapter-title">Aceptarnos</h2>
            <div class="chapter-ornament">💞</div>
        </div>`,
        `<div class="page-content">
            <p class="story-text">
                Amar nuestros defectos.
            </p>
            <p class="story-text">
                Donde dejamos de idealizarnos para amarnos como somos.
            </p>
            <p class="story-text big-quote highlight">
                Eres perfectamente imperfecta.
            </p>
        </div>`
    ));

    // Página 20: TÚ (Final)
    pages.push(createPage(
        `<div class="page-content chapter-page final-page">
            <div class="chapter-number">XX</div>
            <h2 class="chapter-title">Tú</h2>
            <div class="chapter-ornament big-heart">♥</div>
        </div>`,
        `<div class="page-content centered-content final-content">
            <p class="story-text">
                Al final de todo, todo se resume en una palabra.
            </p>
            <p class="story-text">
                Estoy seguro de que eres...
            </p>
            <p class="final-word">TÚ</p>
            <div class="final-heart">♥</div>
        </div>`
    ));

    return pages;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.visible').forEach(modal => {
            closeModal(modal);
        });
    }
});

elements.book?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
