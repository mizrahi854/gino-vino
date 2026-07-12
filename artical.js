document.addEventListener("DOMContentLoaded", function () {
    // השתמש ב-ID המדויק שקיים ב-HTML
    const button = document.getElementById("accessTrigger"); 
    const panel = document.getElementById("accessMenu");

    if (!button || !panel) {
        console.error("אחד האלמנטים של הנגישות לא נמצא. בדוק את ה-ID ב-HTML.");
        return;
    }

    button.onclick = () => {
        panel.classList.toggle("active");
        panel.classList.toggle("open"); // ליתר ביטחון ל-CSS
    };

    // ... שאר הלוגיקה של הכפתורים ...
});