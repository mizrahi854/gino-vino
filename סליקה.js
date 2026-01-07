document.addEventListener("DOMContentLoaded", () => {

  /* ===== תפריט המבורגר ===== */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  }

  /* ===== מחירים ===== */
  const subtotalEl = document.getElementById("subtotal");
  const deliveryPriceEl = document.getElementById("deliveryPrice");
  const totalPriceEl = document.getElementById("totalPrice");

  let subtotal = Number(localStorage.getItem("cartSubtotal")) || 0;
  subtotalEl.textContent = subtotal;

  function updateTotal(deliveryCost) {
    deliveryPriceEl.textContent = deliveryCost;
    totalPriceEl.textContent = subtotal + deliveryCost;
  }

  updateTotal(0);

  /* ===== משלוח / איסוף ===== */
  const deliveryRadios = document.querySelectorAll("input[name='delivery']");
  const addressFields = document.getElementById("addressFields");
  const pickupDateBox = document.getElementById("pickupDateBox");
  const pickupDateInput = document.getElementById("pickupDate");

  // פונקציה לעדכון תצוגה
  function updateDeliveryView() {
    const selected = document.querySelector("input[name='delivery']:checked");

    if (!selected) {
      addressFields.style.display = "none";
      pickupDateBox.style.display = "none";
      pickupDateInput.required = false;
      addressFields.querySelectorAll("input").forEach(input => input.required = false);
      return;
    }

    if (selected.value === "delivery") {
      addressFields.style.display = "block";
      addressFields.querySelectorAll("input").forEach(input => input.required = true);
      pickupDateBox.style.display = "none";
      pickupDateInput.required = false;
      updateTotal(30);
    } else { // איסוף עצמי
      addressFields.style.display = "none";
      addressFields.querySelectorAll("input").forEach(input => input.required = false);
      pickupDateBox.style.display = "block";
      pickupDateInput.required = true;
      updateTotal(0);

      // עדכון תאריך ברירת מחדל + מינימום/מקסימום
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 14); // שבועיים קדימה
      const formatDate = (date) => date.toISOString().split('T')[0];

      pickupDateInput.min = formatDate(today);
      pickupDateInput.max = formatDate(maxDate);

      // אם הערך ריק, נמלא היום
      if (!pickupDateInput.value) {
        pickupDateInput.value = formatDate(today);
      }
    }
  }

  // מאזינים לשינוי ברדיו
  deliveryRadios.forEach(radio => {
    radio.addEventListener("change", updateDeliveryView);
  });

  // עדכון ראשוני כשנטען הדף
  updateDeliveryView();

  /* ===== טופס + גיל 18 + וואטסאפ ===== */
  const checkoutForm = document.querySelector(".checkout-form");
  const idInput = document.getElementById("idNumber");
  const birthInput = document.getElementById("birthDate");

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedDelivery = document.querySelector("input[name='delivery']:checked");
    if (!selectedDelivery) {
      alert("חובה לבחור בין איסוף עצמי או משלוח");
      return;
    }

    const id = idInput.value.trim();
    const birthDateValue = birthInput.value;

    if (!/^\d{9}$/.test(id)) {
      alert("יש להזין תעודת זהות תקינה עם 9 ספרות");
      return;
    }

    if (!birthDateValue) {
      alert("יש להזין תאריך לידה");
      return;
    }

    const birthDate = new Date(birthDateValue);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 18) {
      alert("לא ניתן לבצע הזמנה – מכירת אלכוהול מותרת מגיל 18 בלבד");
      return;
    }

    localStorage.setItem("ageVerified", "true");

    sendWhatsAppOrder();
  });

  function sendWhatsAppOrder() {
    const phone = document.querySelector("input[type='tel']").value;
    const total = totalPriceEl.textContent;

    const message = `
התקבלה הזמנה חדשה 🍷
טלפון: ${phone}
סה״כ לתשלום: ${total} ₪
    `.trim();

    const whatsappUrl =
      "https://wa.me/972XXXXXXXXX?text=" + encodeURIComponent(message);

    window.open(whatsappUrl, "_blank");

    alert("ההזמנה נשלחה! ניתן להמשיך לעגלה או לחזור לקניות");
  }

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
