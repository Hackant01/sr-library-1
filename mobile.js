// ============================================================
// SR LIBRARY — DYNAMIC FEATURES JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── NAVBAR SCROLL EFFECT ────────────────────────────────
    const navbar = document.querySelector('.navbar');
    const backTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
        if (backTop) backTop.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    if (backTop) {
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── HAMBURGER / MOBILE MENU ─────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose  = document.querySelector('.menu-close');

    function toggleMenu(open) {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('active')));
    menuClose?.addEventListener('click', () => toggleMenu(false));

    mobileMenu?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', e => {
        if (mobileMenu?.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburger?.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // ── GENERATE PARTICLES ──────────────────────────────────
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random()*100}%;
                bottom:${Math.random()*20}%;
                --dur:${Math.random()*6+5}s;
                --delay:${Math.random()*6}s;
            `;
            particlesContainer.appendChild(p);
        }
    }

    // ── TYPING EFFECT ───────────────────────────────────────
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const phrases = [
            'Dark Room • Deep Focus • Big Success',
            'UPSC · MPPSC · SSC · Banking · JEE · NEET',
            'Your Success Starts Here',
            'Silence is the New Study Hack'
        ];
        let pi = 0, ci = 0, deleting = false;
        function type() {
            const phrase = phrases[pi];
            typingEl.textContent = phrase.slice(0, ci);
            if (!deleting) {
                ci++;
                if (ci > phrase.length) { deleting = true; setTimeout(type, 1600); return; }
                setTimeout(type, 60);
            } else {
                ci--;
                if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 300); return; }
                setTimeout(type, 30);
            }
        }
        type();
    }

    // ── SCROLL REVEAL ───────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    // ── COUNTER ANIMATION ───────────────────────────────────
    const counters = document.querySelectorAll('[data-count]');
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            let cur = 0;
            const step = target / 60;
            const interval = setInterval(() => {
                cur = Math.min(cur + step, target);
                el.textContent = Math.floor(cur) + suffix;
                if (cur >= target) clearInterval(interval);
            }, 25);
            countObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));

    // ── STUDY TIMER ─────────────────────────────────────────
    const display     = document.getElementById('timer-display');
    const bar         = document.getElementById('timer-bar');
    const startBtn    = document.getElementById('timer-start');
    const pauseBtn    = document.getElementById('timer-pause');
    const resetBtn    = document.getElementById('timer-reset');
    const modeButtons = document.querySelectorAll('.timer-mode-btn');

    if (display) {
        const modes = { pomodoro: 25*60, 'short-break': 5*60, 'long-break': 15*60 };
        let currentMode = 'pomodoro';
        let totalTime   = modes[currentMode];
        let timeLeft    = totalTime;
        let interval    = null;
        let running     = false;

        function fmt(s) {
            const m = String(Math.floor(s / 60)).padStart(2, '0');
            const sec = String(s % 60).padStart(2, '0');
            return `${m}:${sec}`;
        }
        function updateUI() {
            display.textContent = fmt(timeLeft);
            if (bar) bar.style.width = (timeLeft / totalTime * 100) + '%';
        }
        function stopTimer() {
            clearInterval(interval); interval = null; running = false;
            if (startBtn) startBtn.textContent = '▶ Start';
        }
        function startTimer() {
            if (running) return;
            running = true;
            if (startBtn) startBtn.textContent = '⏸ Running';
            interval = setInterval(() => {
                if (timeLeft <= 0) { stopTimer(); showToast('⏰ Time is up! Take a break.'); return; }
                timeLeft--;
                updateUI();
            }, 1000);
        }

        startBtn?.addEventListener('click', startTimer);
        pauseBtn?.addEventListener('click', () => { stopTimer(); });
        resetBtn?.addEventListener('click', () => {
            stopTimer(); timeLeft = totalTime; updateUI();
        });

        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                totalTime = modes[currentMode];
                stopTimer(); timeLeft = totalTime; updateUI();
            });
        });
        updateUI();
    }

    // ── GALLERY LIGHTBOX ────────────────────────────────────
    const lightbox  = document.querySelector('.lightbox');
    const lbImg     = document.querySelector('.lightbox img');
    const lbClose   = document.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img')?.src;
            if (lightbox && lbImg && src) {
                lbImg.src = src;
                lightbox.classList.add('active');
            }
        });
    });
    lbClose?.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox?.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') lightbox?.classList.remove('active');
    });

    // ── TESTIMONIAL SLIDER ──────────────────────────────────
    const track = document.querySelector('.testimonials-track');
    const dots  = document.querySelectorAll('.t-dot');
    if (track && dots.length) {
        let idx = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const perView = window.innerWidth >= 768 ? 2 : 1;
        const maxIdx = Math.ceil(cards.length / perView) - 1;

        function goTo(i) {
            idx = Math.max(0, Math.min(i, maxIdx));
            const pct = idx * (100 / perView);
            track.style.transform = `translateX(-${pct}%)`;
            dots.forEach((d, di) => d.classList.toggle('active', di === idx));
        }
        dots.forEach((d, di) => d.addEventListener('click', () => goTo(di)));
        setInterval(() => goTo(idx >= maxIdx ? 0 : idx + 1), 5000);
    }

    // ── CONTACT FORM ────────────────────────────────────────
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const msg    = form.querySelector('.form-msg');
            const submit = form.querySelector('.form-submit');

            // Phone validation: must be exactly 10 digits
            const phoneInput = form.querySelector('#fphone');
            const phoneVal   = phoneInput ? phoneInput.value.trim() : '';
            if (!/^\d{10}$/.test(phoneVal)) {
                if (msg) {
                    msg.textContent = '⚠️ Please enter a valid 10-digit mobile number.';
                    msg.className   = 'form-msg error';
                }
                phoneInput?.focus();
                return;
            }

            // Disable button and show loading state
            submit.disabled     = true;
            submit.innerHTML    = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

            try {
                const data = new FormData(form);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: data
                });
                const result = await response.json();

                if (result.success) {
                    if (msg) {
                        msg.textContent = '✅ Thank you! We will get back to you shortly.';
                        msg.className   = 'form-msg success';
                    }
                    form.reset();
                    showToast('✅ Message sent successfully!');
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                if (msg) {
                    msg.textContent = '❌ Something went wrong. Please try again or call us directly.';
                    msg.className   = 'form-msg error';
                }
                showToast('❌ Failed to send message. Please retry.');
            } finally {
                submit.disabled  = false;
                submit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            }
        });
    }

    // ── TOAST NOTIFICATION ──────────────────────────────────
    function showToast(msg) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fa-solid fa-bell"></i>${msg}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
    window.showToast = showToast;

});
