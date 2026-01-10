document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });

  const subtotalEl = document.getElementById("subtotal");
  const deliveryPriceEl = document.getElementById("deliveryPrice");
  const totalPriceEl = document.getElementById("totalPrice");

  const subtotal = Number(localStorage.getItem("cartSubtotal")) || 0;
  subtotalEl.textContent = subtotal;

  function updateTotal(delivery) {
    deliveryPriceEl.textContent = delivery;
    totalPriceEl.textContent = subtotal + delivery;
  }

  const deliveryRadios = document.querySelectorAll("input[name='delivery']");
  const addressFields = document.getElementById("addressFields");
  const pickupDateBox = document.getElementById("pickupDateBox");
  const pickupDate = document.getElementById("pickupDate");

  function updateDelivery() {
    const selected = document.querySelector("input[name='delivery']:checked").value;

    if (selected === "delivery") {
      addressFields.style.display = "block";
      pickupDateBox.style.display = "none";
      updateTotal(30);
    } else {
      addressFields.style.display = "none";
      pickupDateBox.style.display = "block";
      updateTotal(0);
    }
  }

  deliveryRadios.forEach(r => r.addEventListener("change", updateDelivery));
  updateDelivery();

  const form = document.querySelector(".checkout-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const id = document.getElementById("idNumber").value;
    const birth = new Date(document.getElementById("birthDate").value);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (!/^\d{9}$/.test(id) || age < 18) {
      alert("לא ניתן לבצע הזמנה. מכירת אלכוהול מגיל 18 בלבד.");
      return;
    }

    alert("ההזמנה נשלחה בהצלחה 🍷");
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
