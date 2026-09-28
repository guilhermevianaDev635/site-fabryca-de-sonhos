/* Efeitos modernos - Fabryca de Sonhos
   Uso: colocar <script src="efeitos.js"></script> antes do </body> */
(function () {
  
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- CSS dos efeitos ---------- */
  var css = `
  .progresso{position:fixed;top:0;left:0;width:100%;height:3px;background:var(--madeira);transform:scaleX(0);transform-origin:left;z-index:1100;pointer-events:none}

  header{transition:transform .4s ease, background .3s ease}
  header.escondido{transform:translateY(-100%)}
  header.compacto{background:rgba(36,26,16,.97)}
  .header-inner{transition:padding .3s ease}
  header.compacto .header-inner{padding-top:11px;padding-bottom:11px}

  nav a:not(.nav-cta){position:relative}
  nav a:not(.nav-cta)::after{content:"";position:absolute;left:0;bottom:-5px;width:100%;height:2px;background:var(--madeira);transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
  nav a:not(.nav-cta):hover::after{transform:scaleX(1)}

  .hero .hero-content{animation:none;opacity:1;will-change:transform,opacity}
  .hero h1 .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
  .hero h1 .wi{display:inline-block;transform:translateY(110%);animation:palavra .9s cubic-bezier(.22,.61,.36,1) forwards}
  @keyframes palavra{to{transform:translateY(0)}}
  .hero p,.hero .btn{animation:subir .8s cubic-bezier(.22,.61,.36,1) backwards}
  .hero p{animation-delay:.7s}
  .hero .btn{animation-delay:.9s}
  @keyframes subir{from{opacity:0;transform:translateY(20px)}}

  .rv{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s cubic-bezier(.22,.61,.36,1)}
  .rv.rv-in{opacity:1;transform:none}
  .rv-wipe{clip-path:inset(0 100% 0 0);transform:scale(1.06);transition:clip-path 1s cubic-bezier(.7,0,.2,1),transform 1.2s cubic-bezier(.22,.61,.36,1)}
  .rv-wipe.rv-in{clip-path:inset(0 0 0 0);transform:none}
  .rv-wipe.rv-done{clip-path:none}

  .btn,.nav-cta{position:relative;overflow:hidden}
  .btn::after,.nav-cta::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);transition:left .6s ease;pointer-events:none}
  .btn:hover::after,.nav-cta:hover::after{left:130%}

  .grid-portfolio .zoom{overflow:hidden;border-radius:6px;box-shadow:var(--sombra-leve);cursor:zoom-in;height:280px;transition:transform .35s ease,box-shadow .35s ease}
  .grid-portfolio .zoom:hover{transform:translateY(-4px);box-shadow:var(--sombra)}
  .grid-portfolio .zoom img{height:100%;border-radius:0;box-shadow:none;transition:transform .8s cubic-bezier(.22,.61,.36,1)}
  .grid-portfolio .zoom img:hover,.grid-portfolio .zoom:hover img{transform:scale(1.08)}
  .grid-portfolio.ativa .zoom{animation:entra .6s cubic-bezier(.22,.61,.36,1) backwards}
  .grid-portfolio.ativa .zoom:nth-child(2){animation-delay:.1s}
  .grid-portfolio.ativa .zoom:nth-child(3){animation-delay:.2s}
  @keyframes entra{from{opacity:0;transform:translateY(26px) scale(.97)}}
  @media(max-width:560px){.grid-portfolio .zoom{height:220px}}

  .lightbox{position:fixed;inset:0;z-index:2000;background:rgba(20,14,8,.92);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease;cursor:zoom-out}
  .lightbox.aberto{opacity:1;pointer-events:auto}
  .lightbox img{max-width:100%;max-height:100%;border-radius:8px;transform:scale(.92);transition:transform .4s cubic-bezier(.22,.61,.36,1)}
  .lightbox.aberto img{transform:scale(1)}

  .whatsapp::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #25D366;animation:pulso 2.4s ease-out infinite;pointer-events:none}
  @keyframes pulso{from{transform:scale(1);opacity:.7}to{transform:scale(1.7);opacity:0}}
  `;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- Barra de progresso ---------- */
  var barra = document.createElement('div');
  barra.className = 'progresso';
  document.body.appendChild(barra);

  /* ---------- Título do hero palavra por palavra ---------- */
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    var palavras = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.innerHTML = '';
    palavras.forEach(function (p, i) {
      var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      var wi = document.createElement('span'); wi.className = 'wi';
      wi.style.animationDelay = (0.15 + i * 0.07) + 's';
      wi.textContent = p;
      w.appendChild(wi);
      h1.appendChild(w);
      h1.appendChild(document.createTextNode(' '));
    });
  }

  /* ---------- Revelar ao rolar ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { (e.target._alvo || e.target).classList.add('rv-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  function revelar(seletor, classe, escalonar) {
    $(seletor).forEach(function (el, i) {
      el.classList.add(classe);
      if (escalonar) el.style.transitionDelay = (i % 4) * 0.1 + 's';
      if (classe === 'rv-wipe') {
        el.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'clip-path') el.classList.add('rv-done');
        });
      }
      if (classe === 'rv-wipe') { el.parentElement._alvo = el; io.observe(el.parentElement); }
      else io.observe(el);
    });
  }

  revelar('.sobre-grid > div > *, .sketchup .container > div:first-child > *, .empresa > div, .projetos-head, .estatisticas-secao h2, .estatisticas-secao .container > p, .avaliacoes h2, .avaliacoes .sub, .diferenciais h2', 'rv');
  revelar('.sobre img, .empresa img', 'rv-wipe');
  revelar('.stat, .diferenciais-grid > div, .baralho-wrap', 'rv', true);

  /* ---------- Galeria ampliada (lightbox) ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  function fechar() { lb.classList.remove('aberto'); }
  lb.addEventListener('click', fechar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });

  $('.grid-portfolio img').forEach(function (img) {
    var z = document.createElement('div');
    z.className = 'zoom';
    img.parentNode.insertBefore(z, img);
    z.appendChild(img);
    z.addEventListener('click', function () {
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.classList.add('aberto');
    });
  });

  /* ---------- Botões magnéticos (só com mouse) ---------- */
  if (window.matchMedia('(hover:hover)').matches) {
    $('.btn, .nav-cta').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Rolagem: progresso, cabeçalho e parallax ---------- */
  var header = document.querySelector('header');
  var hero = document.querySelector('.hero');
  var heroConteudo = document.querySelector('.hero .hero-content');
  var ultimo = 0, ticking = false;

  function atualizar() {
    var y = window.pageYOffset;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = 'scaleX(' + (total > 0 ? y / total : 0) + ')';

    header.classList.toggle('compacto', y > 40);
    header.classList.toggle('escondido', y > ultimo && y > 500);
    ultimo = y;

    if (hero && y < hero.offsetHeight) {
      var p = y / hero.offsetHeight;
      hero.style.backgroundPosition = 'center ' + (50 + p * 25) + '%';
      if (heroConteudo) {
        heroConteudo.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        heroConteudo.style.opacity = Math.max(0, 1 - p * 1.2);
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(atualizar); ticking = true; }
  }, { passive: true });
  atualizar();
})();
