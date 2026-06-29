(function(){
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── 1. Scroll reveal ── */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function(el, i){
    el.style.transitionDelay = (i % 6) * 0.06 + 's';
    revealObserver.observe(el);
  });

  /* ── 2. Stat counters ── */
  function parseStat(raw){
    var m = String(raw).match(/^([^\d.]*)([\d.]+)(.*)$/);
    if (!m) return { prefix:'', target:0, suffix:String(raw), decimals:0 };
    var prefix = m[1], numStr = m[2], suffix = m[3];
    var decimals = numStr.indexOf('.') > -1 ? numStr.split('.')[1].length : 0;
    return { prefix:prefix, target:parseFloat(numStr), suffix:suffix, decimals:decimals };
  }
  document.querySelectorAll('.stat-card .num').forEach(function(el){
    var parsed = parseStat(el.textContent.trim());
    el.textContent = parsed.prefix + (0).toFixed(parsed.decimals) + parsed.suffix;
    var started = false;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && !started) {
          started = true;
          var start = performance.now(), duration = 1400;
          function tick(now){
            var t = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            var current = (parsed.target * eased).toFixed(parsed.decimals);
            el.textContent = parsed.prefix + current + parsed.suffix;
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ── 3. Tilt + glow cards ── */
  document.querySelectorAll('.skill-card, .proj-card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var max = 9;
      var rotateX = (0.5 - py) * max;
      var rotateY = (px - 0.5) * max;
      card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      card.style.setProperty('--glow-x', (px * 100) + '%');
      card.style.setProperty('--glow-y', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ── 4. Skill radar reveal ── */
  var radar = document.getElementById('skillRadar');
  if (radar) {
    var radarObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          radar.classList.add('revealed');
          radarObs.disconnect();
        }
      });
    }, { threshold: 0.35 });
    radarObs.observe(radar);
  }

  /* ── 5. Ambient data-particle backdrop (canvas2D) ── */
  function ambientField(canvas, density, color){
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, points = [], visible = true, raf;

    function resize(){
      var parent = canvas.parentElement;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
      points = [];
      for (var i = 0; i < density; i++){
        points.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var io = new IntersectionObserver(function(entries){ visible = entries[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    function draw(){
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      var maxLinkDist = Math.min(w, h) * 0.18 || 120;
      ctx.clearRect(0, 0, w, h);
      points.forEach(function(p){
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
      for (var i = 0; i < points.length; i++){
        for (var j = i + 1; j < points.length; j++){
          var a = points[i], b = points[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxLinkDist) {
            ctx.strokeStyle = 'rgba(' + color + ',' + (0.08 * (1 - d / maxLinkDist)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      points.forEach(function(p){
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ',0.35)';
        ctx.fill();
      });
    }
    draw();
  }
  ambientField(document.getElementById('aboutCanvas'), 36, '255,140,66');
  ambientField(document.getElementById('skillsCanvas'), 42, '255,209,102');

  /* ── 6. Timeline scroll-scrub + dot pulse ── */
  if (typeof ScrollTrigger !== 'undefined') {
    var timelineEl = document.querySelector('.timeline');
    var progressLine = document.getElementById('tlProgress');
    if (timelineEl && progressLine) {
      ScrollTrigger.create({
        trigger: timelineEl,
        start: 'top 75%',
        end: 'bottom 70%',
        scrub: true,
        onUpdate: function(self){
          progressLine.style.transform = 'scaleY(' + self.progress + ')';
        }
      });
    }
    document.querySelectorAll('.tl-dot').forEach(function(dot){
      gsap.fromTo(dot, { scale: 0.3, opacity: 0.4 }, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: dot, start: 'top 80%', toggleActions: 'play none none reverse' }
      });
    });
  }
})();
