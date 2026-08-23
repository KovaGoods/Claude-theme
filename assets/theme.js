document.addEventListener('DOMContentLoaded', function () {

  // ── Header Scroll Effect ──
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── Mobile Menu ──
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // ── Countdown Timer ──
  function startCountdown() {
    const timerKey = 'kova_timer_end';
    let endTime = parseInt(localStorage.getItem(timerKey));
    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(timerKey, endTime);
    }
    function updateTimer() {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        endTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(timerKey, endTime);
        return;
      }
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remaining % (1000 * 60)) / 1000);
      const h = document.getElementById('countdown-hours');
      const m = document.getElementById('countdown-mins');
      const s = document.getElementById('countdown-secs');
      if (h) h.textContent = String(hours).padStart(2, '0');
      if (m) m.textContent = String(mins).padStart(2, '0');
      if (s) s.textContent = String(secs).padStart(2, '0');
    }
    updateTimer();
    setInterval(updateTimer, 1000);
  }
  startCountdown();

  // ── Product Image Gallery ──
  window.changeImage = function (src, el) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.thumbnail-wrap').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  };

  // ── Variant Selector ──
  window.updateVariant = function (input) {
    document.querySelectorAll('.variant-option').forEach(opt => opt.classList.remove('selected'));
    input.closest('.variant-option').classList.add('selected');
  };

  // ── Quantity Controls ──
  window.changeQty = function (delta) {
    const input = document.getElementById('qty-input');
    if (input) {
      let val = parseInt(input.value) + delta;
      if (val < 1) val = 1;
      input.value = val;
    }
  };

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Scroll Reveal Animation ──
  const revealElements = document.querySelectorAll('.why-card, .product-card, .review-card, .trust-item');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  // ── Cart AJAX ──
  function showCartNotification(title) {
    let notification = document.getElementById('cart-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'cart-notification';
      notification.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        background: var(--color-primary); color: white;
        padding: 16px 24px; border-radius: 12px;
        font-size: 14px; font-weight: 600; z-index: 9999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        transform: translateY(100px); transition: transform 0.3s ease;
        max-width: 300px; font-family: 'Montserrat', sans-serif;
        border-left: 4px solid #00C9C8;
      `;
      document.body.appendChild(notification);
    }
    notification.innerHTML = `✅ Added to cart!<br><small style="color:rgba(255,255,255,0.7)">${title}</small>`;
    notification.style.transform = 'translateY(0)';
    setTimeout(function () { notification.style.transform = 'translateY(100px)'; }, 3000);
  }

  function updateCartCount() {
    fetch('/cart.js')
      .then(res => res.json())
      .then(cart => {
        const countEl = document.querySelector('.cart-count');
        if (countEl) countEl.textContent = cart.item_count;
      });
  }

  document.querySelectorAll('.product-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          showCartNotification(data.product_title);
          updateCartCount();
        })
        .catch(() => { form.submit(); });
    });
  });

  // ── Bubble Particles ──
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      const size = Math.random() * 20 + 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 6 + 6;
      bubble.style.cssText = `
        position: absolute; width: ${size}px; height: ${size}px;
        border-radius: 50%;
        border: 1px solid rgba(0,201,200,${Math.random() * 0.3 + 0.1});
        left: ${left}%; bottom: -50px;
        animation: bubbleRise ${duration}s ${delay}s infinite ease-in;
      `;
      particlesContainer.appendChild(bubble);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bubbleRise {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

});
