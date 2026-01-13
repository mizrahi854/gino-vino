// ==============================
// HAMBURGER MENU MOBILE
// ==============================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});

// ==============================
// FAQ INTERACTIVE
// ==============================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});



let cartCount = 0;
const cartCountEl = document.getElementById('cart-count');
const popup = document.getElementById('cart-popup');
const continueBtn = document.querySelector('.continue-shopping');

// כל כפתורי "הוסף לסל" באתר צריכים את הקלאס הזה
document.querySelectorAll('.product-card button').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    cartCountEl.textContent = cartCount;

    // הצגת Popup
    popup.style.display = 'block';

    // אוטומטי הסתרה אחרי 3 שניות אם לא נלחץ
    setTimeout(() => { popup.style.display = 'none'; }, 3000);
  });
});

// כפתור "המשך בקניות" סוגר את הפופאפ
continueBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("המוצר נוסף לסל");
}


const images = [
  {src: 'תמונת.jpg/1.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/תמונת.jpg/1dc46c78-eeb7-485b-94c4-b2c8e7d907f2.jpg.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/2.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/3.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/4.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/5.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/6.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/7.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/8.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/9.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/10.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/12.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/13.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/14.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/15.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/17.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/18.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/19.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/21.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/22.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/23.jpg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/24.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/25.jpg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/27.jpg', caption: 'תמונה 2'},
    {src: 'תמונת.jpg/תמונה.jpeg', caption: 'לוגו'},
  {src: 'תמונת.jpg/תמונה2.jpeg', caption: 'תמונה 1'},
  {src: 'תמונת.jpg/תמונה3.jpeg', caption: 'תמונה 2'},
  {src: 'תמונת.jpg/1.jpg', caption: 'לוגו'},
  {src: 'תמונת.jpg/WhatsApp Video 2025-07-31 at 21.30.25.mp4', caption: 'וידאו'},
  {src: 'תמונת.jpg/לוגווו.mp4', caption: 'וידאו'},
  {src: 'תמונת.jpg/וידיוא.mp4', caption: 'וידאו'}
];

const previewItems = document.querySelectorAll('.preview-item');
const lightbox = document.getElementById('lightbox');
const lightboxImgContainer = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.lightbox .close');
const nextBtn = document.querySelector('.lightbox .next');
const prevBtn = document.querySelector('.lightbox .prev');
const seeMoreBtn = document.querySelector('.see-more-btn');

let currentIndex = 0;

// פתיחת לייטבוקס כשמקליקים על תמונה
previewItems.forEach(item => {
  item.addEventListener('click', () => {
    currentIndex = parseInt(item.dataset.index);
    showLightbox();
  });
});

// כפתור "ראה עוד"
seeMoreBtn.addEventListener('click', () => {
  currentIndex = 0;
  showLightbox();
});

function showLightbox() {
  const img = images[currentIndex];
  if(img.src.endsWith('.mp4')) {
    lightboxImgContainer.innerHTML = `<video controls autoplay style="max-width:90%; max-height:80%; border-radius:10px;"><source src="${img.src}" type="video/mp4"></video>`;
  } else {
    lightboxImgContainer.innerHTML = `<img src="${img.src}" alt="${img.caption}" style="max-width:90%; max-height:80%; border-radius:10px;">`;
  }
  lightbox.style.display = 'flex';
}

// סגירה
closeBtn.addEventListener('click', () => lightbox.style.display = 'none');

// דפדוף
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  showLightbox();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showLightbox();
});

lightbox.addEventListener('click', e => {
  if(e.target === lightbox) lightbox.style.display = 'none';
});

const closeBtnMobile = document.getElementById('closeMobileNav');
closeBtnMobile.addEventListener('click', () => {
  mobileNav.classList.remove('active');
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });
});
const ageGate = document.getElementById('ageGate');
const ageYes = document.getElementById('ageYes');
const ageNo = document.getElementById('ageNo');

// אם לא אישר גיל – חוסמים
if (!localStorage.getItem('ageVerified')) {
  ageGate.style.display = 'flex';
}

// אישור גיל
ageYes.addEventListener('click', () => {
  localStorage.setItem('ageVerified', 'true');
  ageGate.style.display = 'none';
});

// לא מאשר – יוצא מהאתר
ageNo.addEventListener('click', () => {
  window.location.href = 'https://www.google.com';
});
















document.addEventListener('DOMContentLoaded', () => {

  const ageGate = document.getElementById('ageGate');
  const ageYes = document.getElementById('ageYes');
  const ageNo = document.getElementById('ageNo');

  // אם אחד מהם לא קיים – לא מריצים כלום
  if (!ageGate || !ageYes || !ageNo) {
    console.warn('Age gate elements not found');
    return;
  }

  // אם עוד לא אישר גיל
  if (!localStorage.getItem('ageVerified')) {
    ageGate.style.display = 'flex';
  }

  ageYes.addEventListener('click', () => {
    localStorage.setItem('ageVerified', 'true');
    ageGate.style.display = 'none';
  });

  ageNo.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  // פתיחה/סגירה של ההמבורגר
  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });

  // סוגר את התפריט כשמקליקים על כל קישור בתפריט
  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
    });
  });

  // …שאר הקוד שלך כאן (משלוחים, חישוב מחירים, טופס וכו')
});

document.addEventListener("DOMContentLoaded", () => {
  const mobileNav = document.getElementById("mobileNav");

  // סוגר את המובייל נב בר כשנטען דף חדש
  mobileNav.classList.remove("active");
});
