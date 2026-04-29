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


<!-- ============================================================
     JAVASCRIPT: Control del carrusel
     ============================================================ -->

(function() {
  const nqCarouselController = {
    currentSlide: 0,
    slides: [],
    dots: [],
    autoplayInterval: null,
    autoplayDelay: 5000,

    init() {
      this.slides = document.querySelectorAll('.nq-carousel-slide');
      this.dots = document.querySelectorAll('.nq-dot');
      this.autoplay();
      
      // Pausa autoplay al interactuar
      document.querySelector('.nq-carousel').addEventListener('mouseenter', () => this.stopAutoplay());
      document.querySelector('.nq-carousel').addEventListener('mouseleave', () => this.autoplay());
    },

    showSlide(n) {
      // Limpia todos los slides
      this.slides.forEach(slide => slide.classList.remove('nq-carousel-active'));
      this.dots.forEach(dot => dot.classList.remove('nq-dot-active'));

      // Muestra el slide actual
      this.slides[n].classList.add('nq-carousel-active');
      this.dots[n].classList.add('nq-dot-active');
      this.currentSlide = n;
    },

    next() {
      this.stopAutoplay();
      const n = (this.currentSlide + 1) % this.slides.length;
      this.showSlide(n);
      this.autoplay();
    },

    prev() {
      this.stopAutoplay();
      const n = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.showSlide(n);
      this.autoplay();
    },

    goTo(n) {
      this.stopAutoplay();
      this.showSlide(n);
      this.autoplay();
    },

    autoplay() {
      this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    },

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  };

  // Inicializa cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => nqCarouselController.init());
  } else {
    nqCarouselController.init();
  }

  // Expone el controlador globalmente para onclick handlers
  window.nqCarousel = nqCarouselController;
})();
