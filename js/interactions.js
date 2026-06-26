/* ==============================================
   ECHODATAGRIDAPEX - Advanced Interactions
   ============================================== */

(function() {
    'use strict';

    // ============ CURSOR GLOW EFFECT ============
    function createCursorGlow() {
        if (window.innerWidth < 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursor.style.left = glowX + 'px';
            cursor.style.top = glowY + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }

    createCursorGlow();

    // ============ PARALLAX SCROLL ============
    function parallaxElements() {
        const parallaxEls = document.querySelectorAll('[data-parallax]');
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    parallaxElements();

    // ============ SVG LINE DRAW ANIMATION ============
    function drawLines() {
        const lines = document.querySelectorAll('.draw-line');
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'drawLine 2s ease forwards';
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        lines.forEach(line => lineObserver.observe(line));
    }

    drawLines();

    // ============ TYPING EFFECT ============
    function typeText(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    document.querySelectorAll('[data-typing]').forEach(el => {
        const text = el.getAttribute('data-typing');
        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(el, text);
                    typeObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        typeObserver.observe(el);
    });

    // ============ FORM HANDLING ============
    const forms = document.querySelectorAll('form[data-form]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '✓ Sent Successfully';
                btn.style.background = 'var(--accent-green)';

                setTimeout(() => {
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 2000);
            }, 1500);
        });
    });

    // ============ BACK TO TOP ============
    function createBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
        `;
        btn.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            width: 48px;
            height: 48px;
            background: var(--gradient-primary);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
        `;

        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    createBackToTop();

    // ============ TEXT SCRAMBLE ============
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    document.querySelectorAll('[data-scramble]').forEach(el => {
        const text = el.getAttribute('data-scramble');
        const fx = new TextScramble(el);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fx.setText(text);
                    observer.unobserve(el);
                }
            });
        });
        observer.observe(el);
    });

    // ============ PROGRESS BAR ON SCROLL ============
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 10000;
            transition: width 0.1s ease;
            width: 0;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    createScrollProgress();

    // ============ CONSOLE STYLE BANNER ============
    const styles = [
        'background: linear-gradient(135deg, #00d4ff, #8b5cf6)',
        'color: white',
        'padding: 12px 24px',
        'border-radius: 8px',
        'font-size: 14px',
        'font-weight: bold'
    ].join(';');

    console.log('%c🚀 ECHODATAGRIDAPEX.COM', styles);
    console.log('%cEngineering the future of digital experiences.', 'color: #00d4ff; font-size: 12px;');
    console.log('%cInterested in joining our team? Contact: contact@echodatagridapex.com', 'color: #b3b3b3; font-size: 11px;');

})();