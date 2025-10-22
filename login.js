
// assets/login.js
// => جاوااسکریپت کامل برای نمایش مودال لاگین و چک کردن وضعیت
// قرار بدید <script src="/assets/login.js" defer></script> در همه صفحات

(function(){
  // تنظیمات قابل تغییر:
  const VALID_CREDENTIALS = { username: "admin", password: "1234" }; // نمونه
  const STORAGE_KEY = "site_logged_in_v1"; // نام کلید در localStorage
  const ALLOW_PERSIST = true; // آیا گزینه "مرا به خاطر بسپار" فعال باشد

  // اگر صفحه خودش عنصر لاگین دارد (مثلاً صفحه مدیریت)، می‌توان از آن استفاده کرد.
  // اما این اسکریپت خودش مودال را می‌سازد و به DOM اضافه می‌کند:
  function injectCSS() {
    if (document.getElementById('login-overlay-style')) return;
    const css = `
#login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
#login-box {
  background: #fff;
  direction: rtl;
  min-width: 320px;
  max-width: 420px;
  padding: 22px;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  text-align: center;
  font-family: Tahoma, sans-serif;
}
#login-box h2 { margin: 0 0 12px; font-size: 20px; }
.login-input { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; }
.login-btn { width: 100%; padding: 10px; margin-top: 8px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
.login-btn:active { transform: translateY(1px); }
.login-note { font-size: 13px; color: #666; margin-top: 10px; }
.login-error { color: #c62828; font-size: 14px; margin-top: 8px; display: none; }
#login-footer { display:flex; justify-content: space-between; align-items: center; margin-top:10px; gap:8px; }
#remember { transform: scale(1.1); }
    `;
    const s = document.createElement('style');
    s.id = 'login-overlay-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function createOverlay() {
    if (document.getElementById('login-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.innerHTML = `
      <div id="login-box" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <h2 id="login-title">ورود به سایت</h2>
        <input id="login-username" class="login-input" placeholder="نام کاربری" autocomplete="username" />
        <input id="login-password" type="password" class="login-input" placeholder="رمز عبور" autocomplete="current-password" />
        <div id="login-footer">
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;">
            ${ALLOW_PERSIST ? '<input id="remember" type="checkbox" />' : ''}
            <span>مرا به خاطر بسپار</span>
          </label>
          <button id="login-submit" class="login-btn">ورود</button>
        </div>
        <div id="login-error" class="login-error">نام کاربری یا رمز عبور اشتباه است.</div>
        <div class="login-note">برای تست: admin / 1234</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // جلوگیری از تعامل با صفحه زير (برای مرورگرها که pointer-events: none می‌کنیم)
    document.body.style.pointerEvents = "none"; // غیرفعال کردن کلی تعامل
    overlay.style.pointerEvents = "auto"; // اما مودال قابل تعامل باشه

    // فوکوس روی فیلد اول
    const u = document.getElementById('login-username');
    setTimeout(()=>u.focus(), 10);

    // event listener
    document.getElementById('login-submit').addEventListener('click', tryLogin);
    document.getElementById('login-password').addEventListener('keydown', function(e){
      if (e.key === 'Enter') tryLogin();
    });
  }

  function removeOverlay() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.remove();
    document.body.style.pointerEvents = ""; // بازگرداندن حالت پیش‌فرض
  }

  function showError(msg) {
    const el = document.getElementById('login-error');
    if (!el) return;
    el.textContent = msg || 'نام کاربری یا رمز عبور اشتباه است.';
    el.style.display = 'block';
  }

  function tryLogin() {
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const remember = ALLOW_PERSIST && document.getElementById('remember') && document.getElementById('remember').checked;

    if (u === VALID_CREDENTIALS.username && p === VALID_CREDENTIALS.password) {
      // موفقیت
      try {
        if (remember) {
          localStorage.setItem(STORAGE_KEY, "true");
        } else {
          sessionStorage.setItem(STORAGE_KEY, "true"); // موقتی تا بسته شدن تب
        }
      } catch (e) {
        // اگر localStorage غیرقابل دسترس بود، از sessionStorage استفاده کن
        sessionStorage.setItem(STORAGE_KEY, "true");
      }
      removeOverlay();
      return;
    }

    // در غیر این صورت خطا نشان بده
    showError();
  }

  function isLoggedIn() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return true;
    } catch (e) {}
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return true;
    return false;
  }

  // تابع خروج که می‌تونی در هر صفحه صدا بزنی:
  window.logout = function() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
    try { sessionStorage.removeItem(STORAGE_KEY); } catch(e){}
    // اگر بخواهی می‌توانی کاربر را به صفحه لاگین هدایت کنی:
    createOverlay(); // دوباره مودال را نشان بده
  };

  // اجرای اولیه: inject css، سپس چک لاگین و در صورت نیاز نمایش مودال
  document.addEventListener('DOMContentLoaded', function(){
    injectCSS();
    if (!isLoggedIn()) {
      createOverlay();
    } else {
      // لاگین شده است => هیچ کار اضافی
    }
  });

})();

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A novel set in the Roaring Twenties exploring themes of wealth and excess.",
    image: "https://covers.openlibrary.org/b/id/7222246-L.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel about totalitarianism and surveillance.",
    image: "https://covers.openlibrary.org/b/id/7222246-L.jpg"
  },
  // بقیه کتاب‌ها اینجا می‌رن...
];