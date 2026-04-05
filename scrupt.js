

        // Header scroll effect
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        function closeMobileMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Counter animation
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '+');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + (counter.getAttribute('data-count').includes('%') ? '%' : '+');
                    }
                };
                updateCounter();
            });
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    if (entry.target.classList.contains('hero-stats')) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .safety-card, .article-card, .testimonial-card, .process-item, .hero-stats').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });



        // מנגנון "קרא עוד / קרא פחות" לכל כרטיסייה בנפרד
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.expandable-content');
        const fullContent = card.querySelector('.content-full');
        const previewContent = card.querySelector('.content-preview');
        
        if (fullContent.classList.contains('show')) {
            // אם הטקסט המלא פתוח - נסגור אותו
            fullContent.classList.remove('show');
            previewContent.style.display = 'block';
            this.textContent = 'קרא עוד';
        } else {
            // אם הטקסט סגור - נפתח אותו
            fullContent.classList.add('show');
            previewContent.style.display = 'none';
            this.textContent = 'קרא פחות';
        }
    });
});

// מנגנון הצגה והסתרה של כל תחומי הפעילות
const toggleAllServicesBtn = document.getElementById('toggleAllServices');
if(toggleAllServicesBtn) {
    toggleAllServicesBtn.addEventListener('click', function() {
        const hiddenServices = document.querySelectorAll('.hidden-service');
        let isShowing = false;
        
        hiddenServices.forEach(service => {
            if (service.classList.contains('show')) {
                service.classList.remove('show');
            } else {
                service.classList.add('show');
                isShowing = true;
            }
        });

        if (isShowing) {
            this.textContent = 'הצג פחות תחומי פעילות';
        } else {
            this.textContent = 'צפה בכל תחומי הפעילות';
            // גלילה חזרה לתחילת אזור השירותים כשסוגרים את הרשימה
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        }
    });
}



        // פונקציית פתיחה וסגירה לשאלות נפוצות (אקורדיון)
        function toggleFAQ(button) {
            const item = button.parentElement;
            
            // סגירת כל השאלות האחרות הפתוחות (כדי שלא הכל יהיה פתוח במקביל)
            const allQuestions = document.querySelectorAll('.faq-item');
            allQuestions.forEach(q => {
                if (q !== item && q.classList.contains('active')) {
                    q.classList.remove('active');
                }
            });

            // פתיחה או סגירה של השאלה עליה לחצו
            item.classList.toggle('active');
        }


    document.addEventListener('DOMContentLoaded', function() {
        // מנגנון פתיחה וסגירה של הטקסט המלא (קרא עוד)
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const cardContent = this.parentElement;
                const fullText = cardContent.querySelector('.content-full');
                const previewText = cardContent.querySelector('.content-preview');
                
                if (fullText.classList.contains('show')) {
                    fullText.classList.remove('show');
                    previewText.style.display = 'block';
                    this.textContent = 'קרא עוד';
                } else {
                    fullText.classList.add('show');
                    previewText.style.display = 'none';
                    this.textContent = 'סגור מאמר';
                }
            });
        });

        // מנגנון כפתור "ראה את כל המאמרים"
        const toggleBtn = document.getElementById('toggleArticlesBtn');
        const hiddenArticles = document.querySelectorAll('.hidden-article');
        
        toggleBtn.addEventListener('click', function() {
            const isShowing = this.getAttribute('data-showing') === 'true';
            
            if (isShowing) {
                // הסתרת המאמרים
                hiddenArticles.forEach(article => {
                    article.style.display = 'none';
                    // סגירת טקסט פתוח אם יש
                    const fullText = article.querySelector('.content-full');
                    const previewText = article.querySelector('.content-preview');
                    const btn = article.querySelector('.read-more-btn');
                    fullText.classList.remove('show');
                    previewText.style.display = 'block';
                    btn.textContent = 'קרא עוד';
                });
                this.textContent = 'ראה את כל המאמרים';
                this.setAttribute('data-showing', 'false');
                // גלילה חזרה לתחילת אזור המאמרים
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
            } else {
                // חשיפת כל המאמרים
                hiddenArticles.forEach(article => {
                    article.style.display = 'flex'; // כי הקלאס .article-card משתמש ב-flex
                });
                this.textContent = 'הצג פחות מאמרים';
                this.setAttribute('data-showing', 'true');
            }
        });
    });


        
        // פונקציית פתיחה וסגירה לשאלות נפוצות (אקורדיון)
        function toggleFAQ(button) {
            const item = button.parentElement;
            
            // סגירת כל השאלות האחרות הפתוחות (כדי שלא הכל יהיה פתוח במקביל)
            const allQuestions = document.querySelectorAll('.faq-item');
            allQuestions.forEach(q => {
                if (q !== item && q.classList.contains('active')) {
                    q.classList.remove('active');
                }
            });

            // פתיחה או סגירה של השאלה עליה לחצו
            item.classList.toggle('active');
        }



    document.addEventListener('DOMContentLoaded', function() {
        // מנגנון פתיחה וסגירה של הטקסט המלא (קרא עוד)
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const cardContent = this.parentElement;
                const fullText = cardContent.querySelector('.content-full');
                const previewText = cardContent.querySelector('.content-preview');
                
                if (fullText.classList.contains('show')) {
                    fullText.classList.remove('show');
                    previewText.style.display = 'block';
                    this.textContent = 'קרא עוד';
                } else {
                    fullText.classList.add('show');
                    previewText.style.display = 'none';
                    this.textContent = 'סגור מאמר';
                }
            });
        });

        // מנגנון כפתור "ראה את כל המאמרים"
        const toggleBtn = document.getElementById('toggleArticlesBtn');
        const hiddenArticles = document.querySelectorAll('.hidden-article');
        
        toggleBtn.addEventListener('click', function() {
            const isShowing = this.getAttribute('data-showing') === 'true';
            
            if (isShowing) {
                // הסתרת המאמרים
                hiddenArticles.forEach(article => {
                    article.style.display = 'none';
                    // סגירת טקסט פתוח אם יש
                    const fullText = article.querySelector('.content-full');
                    const previewText = article.querySelector('.content-preview');
                    const btn = article.querySelector('.read-more-btn');
                    fullText.classList.remove('show');
                    previewText.style.display = 'block';
                    btn.textContent = 'קרא עוד';
                });
                this.textContent = 'ראה את כל המאמרים';
                this.setAttribute('data-showing', 'false');
                // גלילה חזרה לתחילת אזור המאמרים
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
            } else {
                // חשיפת כל המאמרים
                hiddenArticles.forEach(article => {
                    article.style.display = 'flex'; // כי הקלאס .article-card משתמש ב-flex
                });
                this.textContent = 'הצג פחות מאמרים';
                this.setAttribute('data-showing', 'true');
            }
        });
    });



        // פונקציות למודאל (חלון קופץ)
        function openReviewModal(id) {
            document.getElementById('reviewModal' + id).style.display = 'flex';
        }

        function closeReviewModal(id) {
            document.getElementById('reviewModal' + id).style.display = 'none';
        }

        // לוגיקה לכפתור "ראה הכל" / "סגור"
        let isExpanded = false;

        function toggleReviews() {
            const extraReviews = document.querySelectorAll('.extra-review');
            const btn = document.getElementById('toggleReviewsBtn');
            const grid = document.getElementById('reviewsGrid');

            if (!isExpanded) {
                // מצב פתיחה - הצג את כולם
                extraReviews.forEach(review => {
                    review.classList.add('show');
                });
                grid.classList.add('expanded');
                btn.innerHTML = 'הצג פחות / סגור המלצות ∧';
                isExpanded = true;
            } else {
                // מצב סגירה - הסתר את הנוספים
                extraReviews.forEach(review => {
                    review.classList.remove('show');
                });
                grid.classList.remove('expanded');
                btn.innerHTML = 'ראה את כל ההמלצות ∨';
                isExpanded = false;
                
                // גלילה חלקה בחזרה לכותרת ההמלצות
                document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
            }
        }

    document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. אנימציית מספרים רצים (Counters) ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            
            const targetAttr = counter.getAttribute('data-count');
            const target = parseInt(targetAttr);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            counter.classList.add('animated');
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + (targetAttr.includes('%') ? '%' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (targetAttr.includes('%') ? '%' : '+');
                }
            };
            updateCounter();
        });
    }

    // --- 2. אנימציות כניסה וזיהוי גלילה (Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // אם הגענו למספרים ב-Hero
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .safety-card, .article-card, .process-item, .hero-stats').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // --- 3. מנגנון הצגת/הסתרת מאמרים (הכפתור שלא עבד) ---
    const toggleArticlesBtn = document.getElementById('toggleArticlesBtn');
    const hiddenArticles = document.querySelectorAll('.hidden-article');

    if (toggleArticlesBtn) {
        toggleArticlesBtn.addEventListener('click', function() {
            // בודק אם המאמרים כרגע מוצגים או מוסתרים
            const isShowing = this.getAttribute('data-showing') === 'true';

            if (isShowing) {
                // סגירה
                hiddenArticles.forEach(article => {
                    article.style.display = 'none';
                });
                this.textContent = 'ראה את כל המאמרים';
                this.setAttribute('data-showing', 'false');
                // גלילה חזרה לתחילת המאמרים
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
            } else {
                // פתיחה
                hiddenArticles.forEach(article => {
                    article.style.display = 'flex'; // משתמש ב-flex כדי לשמור על עיצוב הכרטיסייה
                });
                this.textContent = 'הצג פחות מאמרים';
                this.setAttribute('data-showing', 'true');
            }
        });
    }

    // --- 4. מנגנון "קרא עוד" בתוך המאמרים ---
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // אם זה קישור לדף אחר (article1.html), אל תעצור אותו
            if (this.getAttribute('href') !== '#') return;
            
            e.preventDefault();
            const cardContent = this.parentElement;
            const fullText = cardContent.querySelector('.content-full');
            const previewText = cardContent.querySelector('.content-preview');
            
            if (fullText.classList.contains('show')) {
                fullText.classList.remove('show');
                previewText.style.display = 'block';
                this.textContent = 'קרא עוד';
            } else {
                fullText.classList.add('show');
                previewText.style.display = 'none';
                this.textContent = 'סגור מאמר';
            }
        });
    });

    // --- 5. המלצות (הצג הכל / סגור) ---
    let reviewsExpanded = false;
    window.toggleReviews = function() {
        const extra = document.querySelectorAll('.extra-review');
        const btn = document.getElementById('toggleReviewsBtn');
        const section = document.getElementById('testimonials');

        if (!reviewsExpanded) {
            extra.forEach(r => {
                r.style.display = 'flex';
                setTimeout(() => r.style.opacity = '1', 10);
            });
            btn.innerHTML = 'הצג פחות ∧';
            reviewsExpanded = true;
        } else {
            extra.forEach(r => {
                r.style.display = 'none';
                r.style.opacity = '0';
            });
            btn.innerHTML = 'ראה את כל ההמלצות ∨';
            reviewsExpanded = false;
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
});

// פונקציות FAQ ומודאלים (גלובליות)
function toggleFAQ(button) {
    const item = button.parentElement;
    document.querySelectorAll('.faq-item').forEach(q => {
        if (q !== item) q.classList.remove('active');
    });
    item.classList.toggle('active');
}

function openReviewModal(id) {
    document.getElementById('reviewModal' + id).style.display = 'flex';
}
function closeReviewModal(id) {
    document.getElementById('reviewModal' + id).style.display = 'none';
}