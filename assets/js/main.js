/**
 * Hằng Lương Edu - Main Interactive Engine
 * Handles Course Finder, Countdown, Modals, Forms & Mobile Drawer
 */

// Sample Database for Course Finder
const COURSE_DATABASE = [
  {
    id: 1,
    name: "Cử nhân Khoa học Máy tính & Trí tuệ Nhân tạo (AI)",
    school: "Monash University",
    country: "Úc",
    flag: "🇦🇺",
    level: "Đại học",
    major: "Công nghệ thông tin",
    scholarship: "100%",
    duration: "3 năm",
    tuition: "45,000 AUD/năm",
    badge: "Group of Eight (Top 50 Thế Giới)"
  },
  {
    id: 2,
    name: "Cử nhân Quản trị Kinh doanh Quốc tế & Marketing",
    school: "Taylor's University",
    country: "Malaysia",
    flag: "🇲🇾",
    level: "Đại học",
    major: "Kinh tế - Kinh doanh",
    scholarship: "50%",
    duration: "3 năm",
    tuition: "8,500 USD/năm",
    badge: "Top 1 Đại học Tư thục Đông Nam Á"
  },
  {
    id: 3,
    name: "Thạc sĩ Khoa học Dữ liệu & An ninh Mạng (Cybersecurity)",
    school: "Asia Pacific University (APU)",
    country: "Malaysia",
    flag: "🇲🇾",
    level: "Thạc sĩ",
    major: "Công nghệ thông tin",
    scholarship: "30%",
    duration: "1.5 năm",
    tuition: "10,200 USD/khóa",
    badge: "Bằng cấp kép De Montfort (UK)"
  },
  {
    id: 4,
    name: "Cử nhân Quản trị Du lịch & Khách sạn Quốc tế",
    school: "Sunway University & Le Cordon Bleu",
    country: "Malaysia",
    flag: "🇲🇾",
    level: "Đại học",
    major: "Du lịch - Khách sạn",
    scholarship: "100%",
    duration: "3 năm",
    tuition: "9,000 USD/năm",
    badge: "Bằng kép Đại học Lancaster (Anh Quốc)"
  },
  {
    id: 5,
    name: "Chương trình Chuyển tiếp Đại học Buffalo & RMIT Úc",
    school: "Singapore Institute of Management (SIM)",
    country: "Singapore",
    flag: "🇸🇬",
    level: "Đại học",
    major: "Kinh tế - Kinh doanh",
    scholarship: "100%",
    duration: "2 - 3 năm",
    tuition: "18,000 SGD/năm",
    badge: "Học viện hàng đầu Singapore"
  },
  {
    id: 6,
    name: "Cử nhân Điều dưỡng & Khoa học Y Sinh",
    school: "Deakin University",
    country: "Úc",
    flag: "🇦🇺",
    level: "Đại học",
    major: "Y dược - Điều dưỡng",
    scholarship: "50%",
    duration: "3 - 4 năm",
    tuition: "38,000 AUD/năm",
    badge: "Ưu tiên định cư diện tay nghề Úc"
  },
  {
    id: 7,
    name: "Cao đẳng Nâng cao Quản trị Khách sạn & Co-op có lương",
    school: "Fanshawe College",
    country: "Canada",
    flag: "🇨🇦",
    level: "Cao đẳng",
    major: "Du lịch - Khách sạn",
    scholarship: "Học bổng nhập học $2,000",
    duration: "2 năm",
    tuition: "16,500 CAD/năm",
    badge: "Visa làm việc 3 năm PGWP"
  },
  {
    id: 8,
    name: "Cử nhân Kỹ thuật Cơ điện tử & Robotics",
    school: "Arizona State University (ASU)",
    country: "Mỹ",
    flag: "🇺🇸",
    level: "Đại học",
    major: "Kỹ thuật",
    scholarship: "Học bổng $15,000/năm",
    duration: "4 năm",
    tuition: "33,000 USD/năm",
    badge: "Top 1 Đại học Đổi mới sáng tạo Mỹ (US News)"
  }
];

// Initialize DOM Events
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initCourseFinder();
  initModals();
  initForms();
  initMobileMenu();
  initStickyHeader();
});

// 1. Live Countdown Timer
function initCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);
  targetDate.setHours(9, 0, 0, 0);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    document.querySelectorAll(".cd-days").forEach(el => el.textContent = pad(days));
    document.querySelectorAll(".cd-hours").forEach(el => el.textContent = pad(hours));
    document.querySelectorAll(".cd-minutes").forEach(el => el.textContent = pad(minutes));
    document.querySelectorAll(".cd-seconds").forEach(el => el.textContent = pad(seconds));
  }

  update();
  setInterval(update, 1000);
}

// 2. Course Finder Engine
function initCourseFinder() {
  const btnSearch = document.getElementById("btn-find-course");
  const modal = document.getElementById("course-modal");
  const resultList = document.getElementById("course-results-list");

  if (!btnSearch || !modal || !resultList) return;

  btnSearch.addEventListener("click", () => {
    const country = document.getElementById("finder-country")?.value || "";
    const major = document.getElementById("finder-major")?.value || "";
    const level = document.getElementById("finder-level")?.value || "";

    const filtered = COURSE_DATABASE.filter(c => {
      const matchCountry = !country || c.country.toLowerCase().includes(country.toLowerCase());
      const matchMajor = !major || c.major.toLowerCase().includes(major.toLowerCase());
      const matchLevel = !level || c.level.toLowerCase().includes(level.toLowerCase());
      return matchCountry && matchMajor && matchLevel;
    });

    renderCourseResults(filtered.length > 0 ? filtered : COURSE_DATABASE);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
}

function renderCourseResults(courses) {
  const list = document.getElementById("course-results-list");
  const countEl = document.getElementById("course-results-count");
  if (!list) return;

  if (countEl) countEl.textContent = `${courses.length} khóa học & trường phù hợp`;

  list.innerHTML = courses.map(c => `
    <div class="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="text-xl">${c.flag}</span>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">${c.country}</span>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Học bổng ${c.scholarship}</span>
          <span class="text-xs font-medium text-slate-500">• ${c.level}</span>
        </div>
        <h4 class="text-base font-bold text-slate-900">${c.name}</h4>
        <p class="text-sm text-blue-900 font-semibold flex items-center gap-1.5">
          <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a10.978 10.978 0 00-.25 2.529c0 3.327 2.378 6.138 5.75 6.78 3.372-.642 5.75-3.453 5.75-6.78 0-.877-.09-1.728-.25-2.529l2.644-1.131a1 1 0 000-1.84l-7-3zM10 4.217l4.5 1.928-4.5 1.928-4.5-1.928L10 4.217z"/></svg>
          ${c.school} <span class="text-xs font-normal text-slate-500">(${c.badge})</span>
        </p>
        <div class="text-xs text-slate-500 flex gap-4 pt-1">
          <span>Thời gian: <strong class="text-slate-700">${c.duration}</strong></span>
          <span>Học phí: <strong class="text-slate-700">${c.tuition}</strong></span>
        </div>
      </div>
      <button onclick="openConsultationModal('${c.school}', '${c.name}')" class="whitespace-nowrap w-full md:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-sm shadow transition-colors">
        Tư Vấn Miễn Phí
      </button>
    </div>
  `).join("");
}

// 3. Modal Handlers
function initModals() {
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
      document.body.style.overflow = "auto";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
}

function openConsultationModal(schoolName = "", courseName = "") {
  const modal = document.getElementById("consult-modal");
  if (!modal) return;

  const noteInput = document.getElementById("consult-note");
  if (noteInput && schoolName) {
    noteInput.value = `Quan tâm trường: ${schoolName} (${courseName})`;
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// 4. Form Handlers & Toast
function initForms() {
  document.querySelectorAll(".lead-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerHTML : "Đăng ký";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Đang gửi...`;
      }

      const formData = new FormData(form);
      const lead = {
        name: formData.get("fullname") || "Khách hàng",
        phone: formData.get("phone") || "",
        email: formData.get("email") || "",
        country: formData.get("country") || "Chung",
        note: formData.get("note") || "",
        time: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem("hangluong_leads") || "[]");
        existing.push(lead);
        localStorage.setItem("hangluong_leads", JSON.stringify(existing));
      } catch (err) {}

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
        document.body.style.overflow = "auto";
        showToast("Đăng ký thành công! Chuyên viên Hằng Lương sẽ liên hệ trong vòng 15 phút.", "success");
      }, 700);
    });
  });
}

function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : "toast-error"}`;
  toast.innerHTML = `
    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// 5. Mobile Menu Drawer
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const drawer = document.getElementById("mobile-drawer");
  const closeBtn = document.getElementById("mobile-drawer-close");
  const backdrop = document.getElementById("mobile-drawer-backdrop");

  if (!btn || !drawer) return;

  function open() {
    drawer.classList.remove("translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function close() {
    drawer.classList.add("translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  btn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);
}

// 6. Sticky Header
function initStickyHeader() {
  const header = document.getElementById("main-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("shadow-md", "py-2.5");
      header.classList.remove("py-4");
    } else {
      header.classList.remove("shadow-md", "py-2.5");
      header.classList.add("py-4");
    }
  });
}

// Global hook for consultation buttons
window.openConsultModal = function(school, course) {
  openConsultationModal(school, course);
};
