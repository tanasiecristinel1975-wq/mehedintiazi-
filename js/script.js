/* ============================================================
   MEHEDINTI AZI - script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. DATA SI ORA IN TIMP REAL
  // ----------------------------------------------------------
  function updateDateTime() {
    const el = document.getElementById('data-ora');
    if (!el) return;
    const now = new Date();
    const zile = ['Duminică','Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă'];
    const luni = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
                  'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    const z = zile[now.getDay()];
    const d = now.getDate();
    const l = luni[now.getMonth()];
    const y = now.getFullYear();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    el.textContent = `${z}, ${d} ${l} ${y} | ${h}:${m}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 30000);

  // ----------------------------------------------------------
  // 2. MENIU MOBIL (hamburger)
  // ----------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', function () {
      navList.classList.toggle('open');
      hamburger.textContent = navList.classList.contains('open') ? '✕' : '☰';
    });
  }

  // ----------------------------------------------------------
  // 3. STICKY NAV - adauga shadow la scroll
  // ----------------------------------------------------------
  const nav = document.querySelector('nav.main-nav');
  window.addEventListener('scroll', function () {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.style.boxShadow = '0 3px 15px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    }
  });

  // ----------------------------------------------------------
  // 4. COOKIE BAR
  // ----------------------------------------------------------
  const cookieBar = document.getElementById('cookie-bar');
  const cookieBtn = document.getElementById('cookie-accept');
  if (cookieBar && cookieBtn) {
    if (!localStorage.getItem('cookie_accepted')) {
      cookieBar.style.display = 'flex';
    }
    cookieBtn.addEventListener('click', function () {
      localStorage.setItem('cookie_accepted', '1');
      cookieBar.style.display = 'none';
    });
  }

  // ----------------------------------------------------------
  // 5. TICKER BREAKING NEWS - pauza la hover
  // ----------------------------------------------------------
  const breakingList = document.querySelector('.breaking-list');
  if (breakingList) {
    breakingList.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
    });
    breakingList.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
    });
  }

  // ----------------------------------------------------------
  // 6. LAZY LOAD imagini (simplu, cu IntersectionObserver)
  // ----------------------------------------------------------
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(function(img) { observer.observe(img); });
  } else {
    lazyImgs.forEach(function(img) { img.src = img.dataset.src; });
  }

  // ----------------------------------------------------------
  // 7. CONTOR VIZITE ARTICOL (simulat - pt demonstratie)
  // ----------------------------------------------------------
  const viewCounters = document.querySelectorAll('.view-count');
  viewCounters.forEach(function(el) {
    const base = parseInt(el.dataset.base) || 100;
    const rand = Math.floor(Math.random() * 500) + base;
    el.textContent = rand.toLocaleString('ro-RO') + ' citiri';
  });

  // ----------------------------------------------------------
  // 8. BACK TO TOP button
  // ----------------------------------------------------------
  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------
  // 9. SEARCH - focus effect
  // ----------------------------------------------------------
  const searchInput = document.querySelector('.header-search input');
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      this.style.width = '220px';
    });
    searchInput.addEventListener('blur', function() {
      this.style.width = '180px';
    });
    // Submit search
    const searchForm = document.querySelector('.header-search');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) {
          window.location.href = '?s=' + encodeURIComponent(q);
        }
      });
    }
  }

  // ----------------------------------------------------------
  // 10. PROTECTIE CONTINUT - dezactiveaza copiere si click dreapta
  // ----------------------------------------------------------
  const continutArticol = document.querySelector('.article-content');
  if (continutArticol) {

    // Dezactiveaza click dreapta pe articol
    continutArticol.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      afiseazaMesajCopyright();
    });

    // Dezactiveaza Ctrl+C, Ctrl+A, Ctrl+X pe articol
    continutArticol.addEventListener('keydown', function(e) {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
        e.preventDefault();
        afiseazaMesajCopyright();
      }
    });

    // Dezactiveaza selectia textului pe articol
    continutArticol.style.userSelect = 'none';
    continutArticol.style.webkitUserSelect = 'none';
    continutArticol.style.msUserSelect = 'none';
  }

  // Dezactiveaza click dreapta pe toate imaginile
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
    img.setAttribute('draggable', 'false');
  });

  function afiseazaMesajCopyright() {
    const mesajExistent = document.getElementById('mesaj-copyright');
    if (mesajExistent) return;
    const mesaj = document.createElement('div');
    mesaj.id = 'mesaj-copyright';
    mesaj.innerHTML = '&#169; MehedintiAzi.ro &mdash; Continutul este protejat. Preluarea stirilor este permisa doar cu citarea sursei.';
    mesaj.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1a3a5c;color:#fff;padding:12px 24px;border-radius:4px;font-size:14px;z-index:99999;box-shadow:0 4px 15px rgba(0,0,0,0.3);text-align:center;max-width:90%;';
    document.body.appendChild(mesaj);
    setTimeout(function() { mesaj.remove(); }, 3000);
  }

  console.log('Mehedinti Azi - site incarcat cu succes!');
});
