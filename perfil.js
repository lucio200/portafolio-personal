document.addEventListener('DOMContentLoaded', () => {
 
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
    /* ---------------- Header shadow on scroll ---------------- */
    const header = document.getElementById('header');
    const onScrollHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
 
    /* ---------------- Mobile nav toggle ---------------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
 
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
 
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
 
    /* ---------------- Scrollspy: resalta el link activo ---------------- */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
 
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
 
    sections.forEach(section => spyObserver.observe(section));
 
    /* ---------------- Scroll reveal ---------------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
 
    revealEls.forEach((el, i) => {
        const group = el.closest('.skills-container, .projects-container');
        if (group) {
            const indexInGroup = Array.from(group.children).indexOf(el);
            el.style.setProperty('--delay', `${Math.min(indexInGroup, 6) * 0.08}s`);
        }
    });
 
    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add('in-view'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
 
        revealEls.forEach(el => revealObserver.observe(el));
    }
 
    /* ---------------- Efecto de tipeo con resaltado de sintaxis ---------------- */
    const codeEl = document.getElementById('typedCode');
    const cursorEl = document.getElementById('typedCursor');
 
    const rawLines = [
        'const ricardo = {',
        '  rol: "Estudiante de Desarrollo de Software",',
        '  stack: ["HTML", "CSS", "GitHub"],',
        '  enfoque: "interfaces claras y funcionales",',
        '  aprendiendo: true,',
        '  disponible: true',
        '};'
    ];
    const fullText = rawLines.join('\n');
 
    function highlight(text) {
        return text
            .replace(/(const|let)/g, '<span class="kw">$1</span>')
            .replace(/(rol|stack|enfoque|aprendiendo|disponible)(?=:)/g, '<span class="key">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="str">"$1"</span>')
            .replace(/\btrue\b/g, '<span class="bool">true</span>');
    }
 
    if (prefersReducedMotion) {
        codeEl.innerHTML = highlight(fullText);
        if (cursorEl) cursorEl.style.display = 'none';
    } else {
        let i = 0;
        const speed = 18;
 
        function typeNext() {
            if (i <= fullText.length) {
                codeEl.textContent = fullText.slice(0, i);
                i++;
                setTimeout(typeNext, speed);
            } else {
                codeEl.innerHTML = highlight(fullText);
            }
        }
        typeNext();
    }
 
    /* ---------------- Envío de formulario (demo, sin backend) ---------------- */
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.contact-button');
            const original = btn.innerHTML;
            btn.innerHTML = '<span class="btn-prompt">$</span> ¡Mensaje enviado!';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled = false;
                form.reset();
            }, 2200);
        });
    }
 
});
