/* =========================================================
   תכלת הנדסה — script.js
   כל האתר: ניווט, אנימציות גלילה, מונים, טופסים, מודל שירותים,
   מאמרים, אפקטים ויזואליים.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     0. UTILITIES
  --------------------------------------------------------- */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const debounce = (fn, delay = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  const throttle = (fn, limit = 100) => {
    let waiting = false;
    return (...args) => {
      if (waiting) return;
      fn.apply(null, args);
      waiting = true;
      setTimeout(() => (waiting = false), limit);
    };
  };

  const onDOMReady = (cb) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb);
    } else {
      cb();
    }
  };

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  const initScrollProgress = () => {
    const bar = $("#scroll-progress");
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    };

    window.addEventListener("scroll", throttle(update, 16), { passive: true });
    window.addEventListener("resize", debounce(update, 150));
    update();
  };

  /* ---------------------------------------------------------
     2. HEADER SHRINK ON SCROLL
  --------------------------------------------------------- */
  const initHeaderScroll = () => {
    const header = $("#site-header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };

    window.addEventListener("scroll", throttle(onScroll, 50), { passive: true });
    onScroll();
  };

  /* ---------------------------------------------------------
     3. MOBILE MENU
  --------------------------------------------------------- */
  const initMobileMenu = () => {
    const hamburger = $("#hamburger");
    const menu = $("#mobile-menu");
    const backdrop = $("#menuBackdrop");
    if (!hamburger || !menu) return;

    const setMenu = (open) => {
      hamburger.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      if (backdrop) backdrop.classList.toggle("show", open);
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    hamburger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    if (backdrop) backdrop.addEventListener("click", () => setMenu(false));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    });
  };

  /* ---------------------------------------------------------
     4. SMOOTH SCROLL + ACTIVE NAV LINK (scrollspy)
  --------------------------------------------------------- */
  const initSmoothScrollAndSpy = () => {
    const header = $("#site-header");
    const headerHeight = () => (header ? header.offsetHeight : 0);

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", function (ev) {
        const href = this.getAttribute("href");
        if (!href || href.length < 2) return;
        const target = $(href);
        if (!target) return;
        ev.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 8;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

    // Scrollspy: highlight the current section's nav link
    const navLinks = $$(".main-nav a[href^='#']");
    if (!navLinks.length || !("IntersectionObserver" in window)) return;

    const sections = navLinks
      .map((link) => $(link.getAttribute("href")))
      .filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("nav-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: `-${headerHeight() + 40}px 0px -60% 0px`, threshold: 0 }
    );

    sections.forEach((s) => spy.observe(s));
  };

  /* ---------------------------------------------------------
     5. SCROLL-REVEAL ENGINE
     (.reveal / .reveal-left / .reveal-right / .reveal-rotate / .fade-in)
  --------------------------------------------------------- */
  const initScrollReveal = () => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-rotate, .fade-in";
    const items = $$(selector);
    if (!items.length) return;

    // Auto stagger: give siblings inside the same parent an incremental --i
    // (unless one was already set explicitly, e.g. the mobile menu links).
    const groups = new Map();
    items.forEach((el) => {
      if (el.style.getPropertyValue("--i")) return;
      const parent = el.parentElement;
      const idx = groups.get(parent) || 0;
      el.style.setProperty("--i", Math.min(idx, 6));
      groups.set(parent, idx + 1);
    });

    const reveal = (el) => {
      el.classList.add("in-view", "visible", "active");
    };

    if (!("IntersectionObserver" in window)) {
      items.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));

    // Safety net: never leave content permanently invisible
    setTimeout(() => items.forEach(reveal), 4000);
  };

  /* ---------------------------------------------------------
     6. ANIMATED COUNTERS (fixed: reads data-target, decimal-aware)
  --------------------------------------------------------- */
  const initCounters = () => {
    const counters = $$(".num[data-target]");
    if (!counters.length) return;

    const animate = (el) => {
      const raw = el.getAttribute("data-target") || "0";
      const target = parseFloat(raw);
      if (isNaN(target)) return;
      const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;

      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const val = eased * target;
        el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("he-IL");
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString("he-IL");
          el.classList.add("counted");
        }
      };

      if (prefersReducedMotion) {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString("he-IL");
        el.classList.add("counted");
      } else {
        requestAnimationFrame(step);
      }
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => io.observe(el));
  };

  /* ---------------------------------------------------------
     7. CARD TILT (3D pointer-follow) — service / why / report / testimonial cards
  --------------------------------------------------------- */
  const initCardTilt = () => {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices

    const cards = $$(".service-card, .why-card, .report-card, .testi");
    if (!cards.length) return;

    const MAX_TILT = 6;

    cards.forEach((card) => {
      let raf = null;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rotateX = (-y * MAX_TILT).toFixed(2);
          const rotateY = (x * MAX_TILT).toFixed(2);
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  };

  /* ---------------------------------------------------------
     8. MAGNETIC BUTTONS — main CTAs pull gently toward the cursor
  --------------------------------------------------------- */
  const initMagneticButtons = () => {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const buttons = $$(".hero-cta, .header-cta, .btn-primary, .btn-gold");
    const STRENGTH = 0.25;

    buttons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  };

  /* ---------------------------------------------------------
     9. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  const initRipple = () => {
    const selector = ".btn, .header-cta, .hero-cta, .mm-cta, .quick-form button, .contact-form button, .btn-view";
    $$(selector).forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const existing = btn.querySelector(".ripple-anim");
        if (existing) existing.remove();

        const rect = btn.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height);
        const circle = document.createElement("span");
        circle.className = "ripple-anim";
        circle.style.width = circle.style.height = diameter + "px";
        circle.style.left = e.clientX - rect.left - diameter / 2 + "px";
        circle.style.top = e.clientY - rect.top - diameter / 2 + "px";
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
      });
    });
  };

/* ---------------------------------------------------------
     10. SERVICE DETAIL MODAL (openService — called from index.html)
  --------------------------------------------------------- */
  const SERVICES = [
    {
      icon: "fa-building-circle-check",
      title: "בדק בית בדירה חדשה מקבלן",
      text: "דירה חדשה מקבלן היא לא תמיד מושלמת. מאות דירות נמסרות מדי שנה עם ליקויי בנייה, חריגות תקן ובעיות איטום שיתגלו רק לאחר אכלוס. ברגע שחתמתם – האחריות עליכם. בדיקה מקצועית תמנע תקלות יקרות ועוגמת נפש.",
      points: [
        "זיהוי ליקויי בנייה וחריגות לפני שהנכס עובר לרשותכם",
        "בדיקת מעטפת, ריצוף, חדרים רטובים, מרפסות ומערכות",
        "הבטחת עמידה בתקנים מחייבים (ת\"י 2413, ת\"י 1752 ועוד)",
        "דו\"ח ליקויים מקצועי לדרישת תיקון על חשבון הקבלן במסגרת חוק המכר",
      ],
    },
    {
      icon: "fa-house-chimney",
      title: "בדק בית לדירה יד 2",
      text: "רכישת דירה יד שנייה היא צעד משמעותי. דירות אלו עברו בלאי, תחזוקה ולעיתים שיפוצים לא מקצועיים. בדיקה מקדימה תמנע קניית \"חתול בשק\" והוצאות בלתי צפויות של עשרות אלפי שקלים.",
      points: [
        "גילוי ליקויי בנייה נסתרים או סמויים",
        "בדיקת שלד, מעטפת (סדקים, טיח, איטום) וחשמל",
        "איתור רטיבויות ונזילות באמצעות ציוד תרמי ומדי לחות",
        "דו\"ח מפורט שיכול לשמש ככלי מיקוח מול המוכר",
      ],
    },
    {
      icon: "fa-house-user",
      title: "בית פרטי / וילה",
      text: "בניית בית פרטי היא אחת ההשקעות הגדולות בחיים. נכס כזה כולל מערכות נרחבות, עבודות חוץ, גג ומרתף – כולם מהווים מקור פוטנציאלי לליקויים הדורש בדיקה מקיפה.",
      points: [
        "בדיקה מבנית מקיפה: יסודות, שלד, קונסטרוקציה וקירות תומכים",
        "מעטפת: גגות, קירות חוץ, סדקים, טיח, בידוד ואיטום",
        "מערכות: מים, ביוב, חשמל, גז, מיזוג אוויר",
        "עבודות חוץ: גינות, מרפסות, חניות וריצוף חוץ",
      ],
    },
    {
      icon: "fa-building-shield",
      title: "לאחר תמ\"א 38 / חיזוק מבנה",
      text: "פרויקט תמ\"א 38 נועד לשדרג את הבניין, אך לעיתים מבוצע ע\"י קבלני משנה ללא פיקוח הדוק והדירות עוברות שיפוץ מהיר ורשלני. אנו בודקים שהדירה נמסרה לפי התקנים.",
      points: [
        "בדיקה קפדנית של תוספות הבנייה (ממ\"ד, מרפסת) והתאמתן לתקן",
        "בחינת איכות העבודה וזיהוי פגמים בשיפוץ",
        "איתור ליקויים ובעיות לפני תום תקופת הבדק",
        "הכנת דו\"ח מפורט לדרישת תיקון ליקויים מהיזם או הקבלן",
      ],
    },
    {
      icon: "fa-droplet",
      title: "איתור נזילות ורטיבות",
      text: "רטיבות בקירות היא לא מטרד אסתטי בלבד – היא מסכנת את יציבות המבנה. אנחנו מאתרים את מקור הבעיה בדיוק מרבי וללא צורך בשבירת קירות והרס.",
      points: [
        "סריקה תרמוגרפית לאיתור נזילות באמצעות מצלמה תרמית",
        "מדידת לחות בתוך הקירות, הרצפה והתקרה",
        "בדיקת איכות האיטום, תקינות השיפועים והניקוזים",
        "הפקת דו\"ח הנדסי קביל בבית משפט ובחברות ביטוח",
      ],
    },
    {
      icon: "fa-file-contract",
      title: "דו\"ח ליקויים מפורט לקבלן",
      text: "תיעוד מדויק, דרישה מקצועית ופתרון אפקטיבי. הדו\"ח משמש כבסיס משפטי והנדסי מסודר לדרישה מהקבלן לתיקון כלל הליקויים במסגרת האחריות וחוק המכר.",
      points: [
        "רשימת ליקויים מלאה ומסודרת בחלוקה לפי מיקום וחומרה",
        "הסברים טכניים מפורטים עם הפניות לתקנים ישראליים מחייבים",
        "תיעוד ויזואלי ומצולם של כל ליקוי שנמצא בנכס",
        "המלצות הנדסיות וטכניות לביצוע התיקונים הנדרשים",
      ],
    },
  ];

  const initServiceModal = () => {
    const modal = document.querySelector("#serviceModal");
    const body = document.querySelector("#modalBody");
    const closeBtn = document.querySelector("#modalClose");
    if (!modal || !body) return;

    const close = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const open = (index) => {
      const s = SERVICES[index];
      if (!s) return;
      body.innerHTML = `
        <div class="modal-ico"><i class="fa-solid ${s.icon}"></i></div>
        <h2>${s.title}</h2>
        <p>${s.text}</p>
        <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        <a href="#contact" class="btn btn-gold">קבלו הצעת מחיר לבדיקה זו</a>
      `;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const ctaLink = body.querySelector(".btn");
      if (ctaLink) ctaLink.addEventListener("click", close);
    };

    if (closeBtn) closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) close();
    });

    // Exposed globally because index.html calls onclick="openService(i)"
    window.openService = open;
  };
  /* ---------------------------------------------------------
     11. ARTICLES: read-more toggle + show-more-articles toggle
  --------------------------------------------------------- */
/* ---------------------------------------------------------
     11. ARTICLES: Toggle Read More & Show All
  --------------------------------------------------------- */
  const initArticles = () => {


    // ב. לוגיקה לכפתור הראשי (הצג/הסתר מאמרים נוספים)
    const toggleBtn = $("#toggleArticlesBtn");
    const grid = $("#articlesGrid");
    
    if (toggleBtn && grid) {
      toggleBtn.addEventListener("click", () => {
        const isCurrentlyShowing = toggleBtn.getAttribute("data-showing") === "true";
        const shouldShow = !isCurrentlyShowing;
        
        // עדכון מצב הכפתור
        toggleBtn.setAttribute("data-showing", String(shouldShow));
        toggleBtn.textContent = shouldShow ? "הצג פחות מאמרים ↑" : "ראה את כל המאמרים ↓";
        
        // הצגה/הסתרה של המאמרים הנסתרים
        $$(".hidden-article", grid).forEach((art) => {
          art.style.display = shouldShow ? "block" : "none";
          if (shouldShow) {
             art.classList.add("fade-in");
          }
        });

        // גלילה חזרה לתחילת הסקשן אם סוגרים
        if (!shouldShow) {
          const section = document.getElementById("articles");
          if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  };
  /* ---------------------------------------------------------
     12. FAQ ACCORDION (close other items when one opens)
  --------------------------------------------------------- */
  const initFaqAccordion = () => {
    const items = $$(".faq-item");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  };

  /* ---------------------------------------------------------
     13. LEAD FORMS (submitLead — called from index.html)
  --------------------------------------------------------- */
  const WHATSAPP_NUMBER = "972508448818";
  const SITE_NAME = "תכלת הנדסה";

  const submitLead = (event, source) => {
    if (event) event.preventDefault();
    const form = event ? event.target : null;
    if (!form) return false;

    const getVal = (name) => {
      const field = form.querySelector(`[name="${name}"]`);
      return field ? field.value.trim() : "";
    };

    const name = getVal("name");
    const phone = getVal("phone");
    const email = getVal("email");
    const area = getVal("area");
    const inspectionType = getVal("inspection_type");
    const message = getVal("message");

    if (!name || !phone) {
      alert("נא למלא שם וטלפון על מנת שנוכל לחזור אליכם.");
      return false;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("he-IL");
    const timeStr = now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

    const lines = [
      "היי, אשמח לקבל הצעת מחיר לבדק בית:",
      `שם: ${name}`,
      `טלפון: ${phone}`,
    ];
    if (email) lines.push(`אימייל: ${email}`);
    if (area) lines.push(`אזור: ${area}`);
    if (inspectionType) lines.push(`סוג בדיקה: ${inspectionType}`);
    if (message) lines.push(`הערות: ${message}`);
    lines.push(`תאריך: ${dateStr}`);
    lines.push(`שעה: ${timeStr}`);
    lines.push(`אתר: ${SITE_NAME}`);
    lines.push(`(נשלח מטופס: ${source === "quick" ? "פנייה מהירה" : "טופס יצירת קשר"})`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    if (typeof window.gtag_report_conversion === "function") {
      window.gtag_report_conversion(url);
    } else {
      window.open(url, "_blank", "noopener");
    }

    form.reset();
    return false;
  };

  window.submitLead = submitLead;

  /* ---------------------------------------------------------
     14. CONVERSION TRACKING (guarded — no-op if gtag isn't loaded)
  --------------------------------------------------------- */
  const initConversionTracking = () => {
    $$('a[href^="tel:"], a[href^="https://wa.me"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (typeof window.gtag_report_conversion === "function") {
          window.gtag_report_conversion();
        }
      });
    });
  };

  /* ---------------------------------------------------------
     15. BACK TO TOP
  --------------------------------------------------------- */
  const initBackToTop = () => {
    const btn = $("#backToTop");
    if (!btn) return;

    const onScroll = () => btn.classList.toggle("show", window.scrollY > 600);
    window.addEventListener("scroll", throttle(onScroll, 100), { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  };

  /* ---------------------------------------------------------
     16. HERO PARALLAX (subtle depth on scroll)
  --------------------------------------------------------- */
  const initHeroParallax = () => {
    if (prefersReducedMotion) return;
    const hero = $(".hero");
    const video = $(".hero-video");
    const bg = $(".hero-bg");
    if (!hero || (!video && !bg)) return;

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      const translate = progress * 60;
      const scale = 1 + progress * 0.08;
      const el = video || bg;
      requestAnimationFrame(() => {
        el.style.transform = `translateY(${translate}px) scale(${scale})`;
      });
    };

    window.addEventListener("scroll", throttle(onScroll, 16), { passive: true });
  };

  /* ---------------------------------------------------------
     17. GLOBAL SAFETY NET
     Ensures nothing is ever stuck invisible due to a JS error.
  --------------------------------------------------------- */
  const globalSafetyNet = () => {
    window.addEventListener("load", () => {
      setTimeout(() => {
        $$(".reveal, .reveal-left, .reveal-right, .reveal-rotate, .fade-in").forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.opacity === "0") {
            el.classList.add("in-view", "visible", "active");
          }
        });
      }, 3000);
    });
  };

  /* ---------------------------------------------------------
     18. ACCESSIBILITY WIDGET (single, working implementation)
     Matches the markup in index.html (#a11yToggle / #a11yPanel /
     #a11yClose / button[data-a11y]) and the CSS in styles.css
     (.a11y-panel.open + html.a11y-* state classes).
  --------------------------------------------------------- */
  const initAccessibility = () => {
    const trigger = $("#a11yToggle");
    const panel = $("#a11yPanel");
    const closeBtn = $("#a11yClose");
    const root = document.documentElement;
    if (!trigger || !panel) return;

    const A11Y_CLASSES = [
      "a11y-contrast",
      "a11y-grayscale",
      "a11y-underline",
      "a11y-readable-font",
      "a11y-stop-anim",
    ];
    const STORAGE_KEY = "tchelet-a11y-state";

    const setOpen = (open) => {
      panel.classList.toggle("open", open);
      panel.setAttribute("aria-hidden", String(!open));
      trigger.setAttribute("aria-expanded", String(open));
    };

    trigger.addEventListener("click", () => {
      setOpen(!panel.classList.contains("open"));
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => setOpen(false));
    }

    document.addEventListener("click", (e) => {
      if (
        panel.classList.contains("open") &&
        !panel.contains(e.target) &&
        e.target !== trigger &&
        !trigger.contains(e.target)
      ) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) setOpen(false);
    });

    let fontStep = 0; // -2..+3 steps of 10%

    const applyFontStep = () => {
      root.style.fontSize = fontStep === 0 ? "" : `${100 + fontStep * 10}%`;
    };

    const persist = () => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            fontStep,
            classes: A11Y_CLASSES.filter((c) => root.classList.contains(c)),
          })
        );
      } catch (e) {}
    };

    const setButtonActive = (btn, active) => {
      if (btn) btn.classList.toggle("active", active);
    };

    const actionToClass = {
      contrast: "a11y-contrast",
      grayscale: "a11y-grayscale",
      underline: "a11y-underline",
      "readable-font": "a11y-readable-font",
      "stop-anim": "a11y-stop-anim",
    };

    $$("button[data-a11y]", panel).forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.a11y;

        if (action === "font-inc") {
          fontStep = Math.min(fontStep + 1, 3);
          applyFontStep();
        } else if (action === "font-dec") {
          fontStep = Math.max(fontStep - 1, -2);
          applyFontStep();
        } else if (action === "reset") {
          fontStep = 0;
          root.style.fontSize = "";
          A11Y_CLASSES.forEach((c) => root.classList.remove(c));
          $$("button[data-a11y]", panel).forEach((b) => b.classList.remove("active"));
          try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
          return;
        } else if (actionToClass[action]) {
          const isActive = root.classList.toggle(actionToClass[action]);
          setButtonActive(btn, isActive);
        }

        persist();
      });
    });

    // Restore saved preferences on load
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        fontStep = saved.fontStep || 0;
        applyFontStep();
        (saved.classes || []).forEach((c) => {
          root.classList.add(c);
          const action = Object.keys(actionToClass).find((k) => actionToClass[k] === c);
          setButtonActive($(`button[data-a11y="${action}"]`, panel), true);
        });
      }
    } catch (e) {}
  };

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  onDOMReady(() => {
    try { initScrollProgress(); } catch (e) { console.error("scroll-progress", e); }
    try { initHeaderScroll(); } catch (e) { console.error("header-scroll", e); }
    try { initMobileMenu(); } catch (e) { console.error("mobile-menu", e); }
    try { initSmoothScrollAndSpy(); } catch (e) { console.error("smooth-scroll", e); }
    try { initScrollReveal(); } catch (e) { console.error("scroll-reveal", e); }
    try { initCounters(); } catch (e) { console.error("counters", e); }
    try { initCardTilt(); } catch (e) { console.error("card-tilt", e); }
    try { initMagneticButtons(); } catch (e) { console.error("magnetic-buttons", e); }
    try { initRipple(); } catch (e) { console.error("ripple", e); }
    try { initServiceModal(); } catch (e) { console.error("service-modal", e); }
    try { initArticles(); } catch (e) { console.error("articles", e); }
    try { initFaqAccordion(); } catch (e) { console.error("faq", e); }
    try { initConversionTracking(); } catch (e) { console.error("conversion-tracking", e); }
    try { initBackToTop(); } catch (e) { console.error("back-to-top", e); }
    try { initHeroParallax(); } catch (e) { console.error("hero-parallax", e); }
    try { initAccessibility(); } catch (e) { console.error("accessibility", e); }
    globalSafetyNet();
  });
})();