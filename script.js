window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        document.getElementById('mobileToggle').addEventListener('click', () => {
            document.getElementById('nav').classList.toggle('active');
        });
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Si es el botón de reservar, mostramos/ocultamos el widget
                if (targetId === '#reservar') {
                    const widget = document.getElementById('reservar');
                    if (widget) {
                        widget.classList.toggle('active');
                    }
                    return;
                }
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

// ===== LIGHTBOX =====
let currentLightboxIndex = 0;
let lightboxImages = [];

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
    lightboxImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('img').alt
    }));

    currentLightboxIndex = index;

    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close" onclick="closeLightbox()"><i class="fas fa-times"></i></div>
            <button class="lightbox-prev" onclick="navigateLightbox(-1)"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-next" onclick="navigateLightbox(1)"><i class="fas fa-chevron-right"></i></button>
            <div class="lightbox-content">
                <span class="lightbox-counter"></span>
                <img class="lightbox-img" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
    if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;
    updateLightbox();
}

function updateLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');

    img.style.opacity = '0';
    img.style.transform = 'scale(0.9)';

    setTimeout(() => {
        img.src = lightboxImages[currentLightboxIndex].src;
        img.alt = lightboxImages[currentLightboxIndex].caption;
        caption.textContent = lightboxImages[currentLightboxIndex].caption;
        counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 200);
}

// Initialize lightbox on DOM ready
document.addEventListener('DOMContentLoaded', initLightbox);
