(function () {
  document.documentElement.classList.add('js');

  // Año del pie
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Copiar email
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.copy);
      var text = el ? el.textContent.trim() : '';
      var done = function () {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = 'Copiar'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectText(el); });
      } else {
        selectText(el);
      }
    });
  });
  function selectText(el) {
    if (!el) return;
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  // Índice: marca el capítulo visible
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('on'); });
        var a = byId[e.target.id];
        if (a) {
          a.classList.add('on');
          if (a.scrollIntoView && window.innerWidth <= 900) {
            a.parentElement.parentElement.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('main section').forEach(function (s) { spy.observe(s); });

  }

  // Visor de imágenes
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var link = document.getElementById('lb-link');
  document.querySelectorAll('button.shot[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      img.src = b.dataset.full;
      img.alt = b.dataset.caption || '';
      cap.textContent = b.dataset.caption || '';
      link.href = b.dataset.link || '#';
      link.hidden = !b.dataset.link;
      if (box.showModal) box.showModal(); else window.open(b.dataset.full, '_blank');
    });
  });
  document.getElementById('lb-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
})();
