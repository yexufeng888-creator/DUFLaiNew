/* ============================================================
   DUFL — Premium Animation Engine v3
   Scroll storytelling · Stagger reveals · Parallax layers
   Smooth counter · Magnetic hover · Cursor glow · Card tilt
   60fps GPU-accelerated · Reduced motion respectful
   ============================================================ */
(function(){
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer:fine)').matches;

  /* ===== 1. Scroll-Linked Reveal Observer ===== */
  function initScrollReveal(){
    if (!('IntersectionObserver' in window)) return;

    // Smooth staggered card reveals
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          // Add stagger delay for children
          if (entry.target.classList.contains('stagger-children')){
            var children = Array.from(entry.target.children);
            children.forEach(function(child, i){
              child.style.transitionDelay = (i * 0.07) + 's';
              child.classList.add('visible');
            });
          } else {
            entry.target.classList.add('visible');
          }
          // Keep observing for re-trigger if desired, or unobserve for one-time
          if (!entry.target.classList.contains('reveal-repeat')){
            observer.unobserve(entry.target);
          }
        } else if (entry.target.classList.contains('reveal-repeat')){
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(function(el){
      observer.observe(el);
    });

    // Also handle stagger-children containers
    document.querySelectorAll('.stagger-children').forEach(function(container){
      Array.from(container.children).forEach(function(child){
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity .6s var(--ease-out), transform .6s var(--ease-out)';
      });
      // Check if already in viewport
      var rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0){
        Array.from(container.children).forEach(function(child, i){
          child.style.transitionDelay = (i * 0.07) + 's';
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      } else {
        observer.observe(container);
      }
    });

    // Immediately show elements in viewport
    setTimeout(function(){
      document.querySelectorAll('.reveal').forEach(function(el){
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 80 && rect.bottom > -80){
          el.classList.add('visible');
        }
      });
    }, 200);
  }

  /* ===== 2. Smooth Counter Animation ===== */
  function initCounters(){
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var el = entry.target;
          var target = parseFloat(el.getAttribute('data-target'));
          var suffix = el.getAttribute('data-suffix') || '';
          var decimals = parseInt(el.getAttribute('data-decimals')) || 0;
          var duration = parseInt(el.getAttribute('data-duration')) || 2400;

          if (isNaN(target)) return;

          var startTime = performance.now();
          var startVal = 0;

          function frame(now){
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // Custom ease-out curve
            var eased = 1 - Math.pow(1 - progress, 4);
            var current = target * eased;

            el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;

            if (progress < 1){
              requestAnimationFrame(frame);
            } else {
              el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
            }
          }
          requestAnimationFrame(frame);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(function(el){
      observer.observe(el);
    });
  }

  /* ===== 3. Parallax Scroll Layers ===== */
  function initParallax(){
    if (prefersReducedMotion) return;
    var layers = document.querySelectorAll('[data-depth]');
    if (!layers.length) return;

    var ticking = false;
    function update(){
      var scrollY = window.scrollY;
      layers.forEach(function(el){
        var depth = parseFloat(el.dataset.depth) || 0.1;
        el.style.transform = 'translate3d(0, ' + (scrollY * depth * 0.4) + 'px, 0)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function(){
      if (!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ===== 4. 3D Card Tilt — Mouse-follow perspective ===== */
  function initTilt(){
    if (prefersReducedMotion || !hasFinePointer){ applyFlatFallback(); return; }
    var cards = document.querySelectorAll('.tilt-3d');
    if (!cards.length) return;

    cards.forEach(function(card){
      var maxTilt = parseFloat(card.dataset.tiltMax) || 12;
      var scale = parseFloat(card.dataset.tiltScale) || 1.02;
      var speed = parseInt(card.dataset.tiltSpeed) || 300;
      var hasGlare = card.dataset.tiltGlare === 'true';

      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform ' + speed + 'ms var(--ease-out), box-shadow ' + speed + 'ms ease';

      var glare = null;
      if (hasGlare){
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;border-radius:inherit;background:radial-gradient(circle at center,rgba(255,255,255,.25) 0%,transparent 70%);opacity:0;transition:opacity .4s';
        if (!card.style.position || card.style.position === 'static') card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glare);
      }

      Array.from(card.children).forEach(function(child){
        if (child !== glare){ child.style.position = 'relative'; child.style.zIndex = '2'; }
      });

      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = 'perspective(1200px) rotateX(' + (-y * maxTilt) + 'deg) rotateY(' + (x * maxTilt) + 'deg) scale3d(' + scale + ',' + scale + ',' + scale + ')';
        card.style.boxShadow = (-x * maxTilt * 0.6) + 'px ' + (-y * maxTilt * 0.6 + 8) + 'px 36px rgba(0,0,0,.08)';

        if (glare){
          glare.style.opacity = '0.45';
          glare.style.background = 'radial-gradient(circle at ' + ((x+0.5)*100) + '% ' + ((y+0.5)*100) + '%, rgba(255,255,255,.22) 0%, transparent 70%)';
        }
      });

      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.boxShadow = '';
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  function applyFlatFallback(){
    document.querySelectorAll('.tilt-3d').forEach(function(card){
      card.addEventListener('mouseenter', function(){
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--shadow-lg)';
      });
      card.addEventListener('mouseleave', function(){
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
      });
    });
  }

  /* ===== 5. Magnetic Hover ===== */
  function initMagnetic(){
    if (prefersReducedMotion || !hasFinePointer) return;
    var els = document.querySelectorAll('.magnetic');
    if (!els.length) return;

    els.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        el.style.transition = 'transform .15s ease-out';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
      });
    });
  }

  /* ===== 6. Float Animation ===== */
  function initFloat(){
    if (prefersReducedMotion) return;
    document.querySelectorAll('.float-3d').forEach(function(el, i){
      el.style.animation = 'float3D ' + (3.5 + i * 0.6) + 's ease-in-out ' + (i * .35) + 's infinite';
    });
  }

  /* ===== 7. Cursor Glow ===== */
  function initCursorGlow(){
    if (prefersReducedMotion || !hasFinePointer) return;
    var glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;width:700px;height:700px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(196,69,54,.03) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity .5s;opacity:0;will-change:left,top';
    document.body.prepend(glow);

    var timeout;
    document.addEventListener('mousemove', function(e){
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
      clearTimeout(timeout);
      timeout = setTimeout(function(){ glow.style.opacity = '0'; }, 2000);
    }, { passive: true });
  }

  /* ===== 8. Back-to-Top Scroll Progress ===== */
  function initScrollProgress(){
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function(){
      var threshold = window.innerHeight * 0.6;
      if (window.scrollY > threshold){
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Init All ===== */
  function init(){
    initScrollReveal();
    initCounters();
    initParallax();
    initTilt();
    initMagnetic();
    initFloat();
    initCursorGlow();
    initScrollProgress();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* Inject animation keyframes */
(function(){
  var s = document.createElement('style');
  s.textContent = [
    '@keyframes float3D{0%,100%{transform:translateY(0) rotateX(0deg)}25%{transform:translateY(-6px) rotateX(1deg)}75%{transform:translateY(3px) rotateX(-0.5deg)}}',
    '.tilt-glare{pointer-events:none!important}',
    '@media(prefers-reduced-motion:reduce){.tilt-3d,.magnetic,.float-3d,.reveal-3d,.cursor-glow{animation:none!important;transform:none!important;transition:none!important}[data-depth]{transform:none!important}}'
  ].join('\n');
  document.head.appendChild(s);
})();
