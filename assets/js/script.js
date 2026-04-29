// Esperar a que el DOM esté completamente cargado para evitar errores
document.addEventListener("DOMContentLoaded", (event) => {
    
    // 1. Inicializar Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sincronizar Lenis con ScrollTrigger de GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 2. Inicializar Swiper (Slider Hero con Cross-fade)
    const heroSwiper = new Swiper('.hero-swiper', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        loop: true,
        speed: 1200, // Transición suave
    });

    // 3. Animaciones GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Hero
    let tlHero = gsap.timeline();
    tlHero.from(".gsap-hero-text > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 })
            .from(".hero-swiper", { x: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6")
            .from(".gsap-hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4");

    // Reveal standard
    gsap.utils.toArray('.gsap-reveal').forEach(element => {
        gsap.fromTo(element, 
            { autoAlpha: 0, y: 40 }, 
            {
                duration: 0.8, autoAlpha: 1, y: 0, ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });

    // Animación individual para cada Card de Servicio
    gsap.utils.toArray('.gsap-service-card').forEach(card => {
        gsap.fromTo(card, 
            { opacity: 0, y: 30 }, 
            {
                duration: 0.6, opacity: 1, y: 0, ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Animación individual para Galería
    gsap.utils.toArray('.gsap-gallery').forEach(img => {
        gsap.fromTo(img, 
            { scale: 0.9, opacity: 0 }, 
            {
                duration: 0.6, scale: 1, opacity: 1, ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: img,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuBtn.querySelector('i');
    let isMenuOpen = false;

    // Timeline de GSAP para el menú (pausada por defecto)
    const menuTl = gsap.timeline({ paused: true, reversed: true });

    // 1. Aparecer el fondo desenfocado
    menuTl.to(mobileMenuOverlay, {
        duration: 0.4,
        opacity: 1,
        display: 'flex',
        ease: 'power2.inOut'
    })
    // 2. Animación escalonada (stagger) de los links subiendo
    .to(mobileLinks, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.1, // Retraso entre cada link
        ease: 'power3.out'
    }, "-=0.2"); // Inicia un poco antes de que termine el fondo

    // Función para abrir/cerrar
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'; // Bloquea el scroll del body
            menuIcon.classList.replace('fa-bars', 'fa-times'); // Cambia a ícono X
            menuIcon.style.transform = 'rotate(90deg)'; // Micro-interacción rotación
            menuTl.play();
        } else {
            document.body.style.overflow = ''; // Restaura el scroll
            menuIcon.classList.replace('fa-times', 'fa-bars'); // Vuelve a hamburguesa
            menuIcon.style.transform = 'rotate(0deg)';
            menuTl.reverse();
        }
    };

    // Evento al botón de hamburguesa
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer click en un link (el smooth scroll lo maneja Lenis nativamente)
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });
});




