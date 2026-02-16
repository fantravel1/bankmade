/* ============================================
   BANKMADE.COM — Main JavaScript
   Interactivity, Animations, Counters, Carousel
   ============================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initHeader();
    initMobileMenu();
    initParticles();
    initCounters();
    initBarCharts();
    initQuotesCarousel();
    initBackToTop();
    initModalSystem();
    initTickerDuplicate();
    initSmoothScroll();
  });

  /* ---------- Scroll Animations (Intersection Observer) ---------- */
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right, .scale-in');
    if (!animatedElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Sticky Header ---------- */
  function initHeader() {
    var header = document.querySelector('.main-header');
    if (!header) return;

    var scrollThreshold = 60;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', throttle(updateHeader, 100), { passive: true });
    updateHeader();
  }

  /* ---------- Mobile Menu ---------- */
  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Floating Particles ---------- */
  function initParticles() {
    var container = document.querySelector('.hero-particles');
    if (!container) return;

    for (var i = 0; i < 30; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      container.appendChild(particle);
    }
  }

  /* ---------- Animated Counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      el.textContent = prefix + formatNumber(current, decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target, decimals) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(num, decimals) {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString('en-US');
  }

  /* ---------- Bar Chart Animation ---------- */
  function initBarCharts() {
    var bars = document.querySelectorAll('.bar-fill');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var width = entry.target.getAttribute('data-width');
          if (width) {
            entry.target.style.width = width;
          }
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  /* ---------- Quotes Carousel ---------- */
  function initQuotesCarousel() {
    var slides = document.querySelectorAll('.quote-slide');
    var dots = document.querySelectorAll('.quote-dot');
    if (!slides.length) return;

    var currentSlide = 0;
    var totalSlides = slides.length;
    var interval;

    function showSlide(index) {
      slides.forEach(function (slide) { slide.classList.remove('active'); });
      dots.forEach(function (dot) { dot.classList.remove('active'); });

      currentSlide = (index + totalSlides) % totalSlides;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    // Dot click
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        resetInterval();
      });
    });

    // Auto-play
    function startInterval() {
      interval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
      clearInterval(interval);
      startInterval();
    }

    // Touch/swipe support
    var carousel = document.querySelector('.quotes-carousel');
    if (carousel) {
      var touchStartX = 0;
      var touchEndX = 0;

      carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            showSlide(currentSlide + 1);
          } else {
            showSlide(currentSlide - 1);
          }
          resetInterval();
        }
      }, { passive: true });
    }

    showSlide(0);
    startInterval();
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', throttle(function () {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 150), { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Modal System ---------- */
  function initModalSystem() {
    var overlay = document.querySelector('.modal-overlay');
    var modal = document.querySelector('.modal');
    if (!overlay || !modal) return;

    // Open modal on legend card click
    document.querySelectorAll('[data-modal]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var name = this.getAttribute('data-modal-name') || '';
        var initials = this.getAttribute('data-modal-initials') || '';
        var role = this.getAttribute('data-modal-role') || '';
        var bio = this.getAttribute('data-modal-bio') || '';
        var aum = this.getAttribute('data-modal-aum') || '';
        var country = this.getAttribute('data-modal-country') || '';
        var category = this.getAttribute('data-modal-category') || '';
        var philosophy = this.getAttribute('data-modal-philosophy') || '';

        modal.querySelector('.modal-avatar').textContent = initials;
        modal.querySelector('.modal-name').textContent = name;
        modal.querySelector('.modal-role').textContent = role;
        modal.querySelector('.modal-bio').textContent = bio;

        var stats = modal.querySelectorAll('.modal-stat-value');
        if (stats[0]) stats[0].textContent = aum;
        if (stats[1]) stats[1].textContent = country;
        if (stats[2]) stats[2].textContent = category;

        var philEl = modal.querySelector('.modal-philosophy p');
        if (philEl) philEl.textContent = philosophy;

        overlay.classList.add('open');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    function closeModal() {
      overlay.classList.remove('open');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    overlay.addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Prevent modal click from closing
    modal.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  /* ---------- Ticker Duplicate for Seamless Loop ---------- */
  function initTickerDuplicate() {
    var track = document.querySelector('.ticker-track');
    if (!track) return;

    // Clone children for seamless loop
    var items = track.innerHTML;
    track.innerHTML = items + items;
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerHeight = document.querySelector('.main-header').offsetHeight || 0;
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ---------- Utility: Throttle ---------- */
  function throttle(fn, wait) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

})();
