document.addEventListener("DOMContentLoaded", () => {

  /* ===== תפריט המבורגר ===== */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  /* ===== מחירים ===== */
  const subtotalEl = document.getElementById("subtotal");
  const deliveryPriceEl = document.getElementById("deliveryPrice");
  const totalPriceEl = document.getElementById("totalPrice");

  // כרגע סכום בסיס (אפשר להחליף אחר כך לסל אמיתי)
  let subtotal = 0;
  subtotalEl.textContent = subtotal;

  function updateTotal(deliveryCost) {
    deliveryPriceEl.textContent = deliveryCost;
    totalPriceEl.textContent = subtotal + deliveryCost;
  }

  updateTotal(0);

  /* ===== משלוח / איסוף ===== */
  const deliveryRadios = document.querySelectorAll("input[name='delivery']");
  const addressFields = document.getElementById("addressFields");

  deliveryRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "delivery") {
        addressFields.style.display = "block";
        updateTotal(30);
      } else {
        addressFields.style.display = "none";
        updateTotal(0);
      }
    });
  });

});


const checkoutForm = document.querySelector('.checkout-form');
const idInput = document.getElementById('idNumber');
const birthInput = document.getElementById('birthDate');

checkoutForm.addEventListener('submit', function (e) {
  const id = idInput.value.trim();
  const birthDateValue = birthInput.value;

  // בדיקת תעודת זהות
  if (!/^\d{9}$/.test(id)) {
    alert('יש להזין תעודת זהות תקינה עם 9 ספרות');
    e.preventDefault();
    return;
  }

  if (!birthDateValue) {
    alert('יש להזין תאריך לידה');
    e.preventDefault();
    return;
  }

  const birthDate = new Date(birthDateValue);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    alert('לא ניתן לבצע הזמנה – מכירת אלכוהול מותרת מגיל 18 בלבד');
    e.preventDefault();
    return;
  }

  // שמירת אישור גיל לכל האתר
  localStorage.setItem('ageVerified', 'true');
});
if (!localStorage.getItem('ageVerified')) {
  alert('יש לאשר גיל 18 לפני ביצוע הזמנה');
  return;
}
