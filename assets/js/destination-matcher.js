/**
 * Hằng Lương Edu - Smart Study Abroad Destination Matcher
 * Công Cụ Tìm Quốc Gia Du Học Theo Ngân Sách, Bậc Học, Ngành Học & Mục Tiêu
 * Thiết kế chuẩn CRO theo mô hình phễu Edutime tối ưu hóa cho du học Hằng Lương
 */

(function () {
  'use strict';

  // 1. Data Matrix of Countries
  const DESTINATION_DATABASE = [
    {
      id: "thuy_si",
      name: "Thụy Sĩ",
      flag: "🇨🇭",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=80",
      costRange: "280 - 550 triệu/năm",
      budgetLevels: ["300-500", "500-800", ">800", "<300"],
      levels: ["dai_hoc", "thac_si", "cao_dang"],
      majors: ["am_thuc", "khach_san", "kinh_te"],
      priorities: ["viec_lam", "chi_phi_thap", "hoc_bong"],
      matchReason: "Thực tập hưởng lương 2.500 CHF/tháng (~65tr) giúp bù đắp chi phí. Thủ phủ ẩm thực & dịch vụ số 1 thế giới.",
      badge: "Phù hợp nhất",
      badgeColor: "emerald"
    },
    {
      id: "uc",
      name: "Úc (Australia)",
      flag: "🇦🇺",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&auto=format&fit=crop&q=80",
      costRange: "380 - 750 triệu/năm",
      budgetLevels: ["300-500", "500-800", ">800"],
      levels: ["dai_hoc", "thac_si", "cao_dang", "thpt"],
      majors: ["am_thuc", "cntt", "kinh_te", "y_duoc", "ky_thuat", "khach_san"],
      priorities: ["dinh_cu", "hoc_bong", "viec_lam"],
      matchReason: "Làm thêm 48h/2 tuần lương tối thiểu 24 AUD/h. Chính sách ở lại làm việc 2-4 năm và ưu tiên định cư tay nghề.",
      badge: "Phù hợp nhất",
      badgeColor: "red"
    },
    {
      id: "canada",
      name: "Canada",
      flag: "🇨🇦",
      image: "https://images.unsplash.com/photo-1517935703635-2717090c2210?w=600&auto=format&fit=crop&q=80",
      costRange: "320 - 650 triệu/năm",
      budgetLevels: ["300-500", "500-800", ">800"],
      levels: ["cao_dang", "dai_hoc", "thac_si", "thpt"],
      majors: ["am_thuc", "cntt", "kinh_te", "ky_thuat", "khach_san", "y_duoc"],
      priorities: ["dinh_cu", "viec_lam", "chi_phi_thap"],
      matchReason: "Chương trình Co-op thực tập có lương, cấp giấy phép đi làm PGWP 3 năm sau tốt nghiệp và lộ trình định cư rộng mở.",
      badge: "Phù hợp nhất",
      badgeColor: "emerald"
    },
    {
      id: "malaysia",
      name: "Malaysia",
      flag: "🇲🇾",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80",
      costRange: "120 - 250 triệu/năm",
      budgetLevels: ["<300", "300-500"],
      levels: ["dai_hoc", "cao_dang", "thac_si", "thpt"],
      majors: ["cntt", "kinh_te", "khach_san", "ky_thuat", "am_thuc"],
      priorities: ["chi_phi_thap", "hoc_bong", "viec_lam"],
      matchReason: "Ngân sách dưới 300 triệu cực kỳ phù hợp. Nhận bằng kép chuẩn Anh Quốc & Úc (Lancaster, De Montfort) tiết kiệm 70% chi phí.",
      badge: "Tối ưu ngân sách",
      badgeColor: "blue"
    },
    {
      id: "singapore",
      name: "Singapore",
      flag: "🇸🇬",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80",
      costRange: "250 - 480 triệu/năm",
      budgetLevels: ["<300", "300-500", "500-800"],
      levels: ["cao_dang", "dai_hoc", "thac_si"],
      majors: ["kinh_te", "cntt", "khach_san"],
      priorities: ["hoc_bong", "viec_lam", "chi_phi_thap"],
      matchReason: "Học rút ngắn 2-2.5 năm lấy bằng Cử nhân top ĐH Anh/Úc, an toàn số 1 châu Á, tỷ lệ đậu visa lên đến 99%.",
      badge: "Có thể cân nhắc",
      badgeColor: "amber"
    },
    {
      id: "my",
      name: "Mỹ (USA)",
      flag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&auto=format&fit=crop&q=80",
      costRange: "450 - 850 triệu/năm",
      budgetLevels: ["500-800", ">800", "300-500"],
      levels: ["dai_hoc", "cao_dang", "thac_si", "thpt"],
      majors: ["cntt", "kinh_te", "ky_thuat", "y_duoc"],
      priorities: ["hoc_bong", "dinh_cu", "viec_lam"],
      matchReason: "Cơ hội ở lại làm việc 3 năm với khối ngành STEM (OPT). Học bổng lên đến 50% tại Arizona State và USF.",
      badge: "Có thể cân nhắc",
      badgeColor: "amber"
    },
    {
      id: "anh",
      name: "Anh Quốc (UK)",
      flag: "🇬🇧",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80",
      costRange: "550 - 900 triệu/năm",
      budgetLevels: ["500-800", ">800"],
      levels: ["thac_si", "dai_hoc", "thpt"],
      majors: ["kinh_te", "cntt", "y_duoc", "ky_thuat"],
      priorities: ["hoc_bong", "viec_lam"],
      matchReason: "Thạc sĩ chỉ 1 năm duy nhất giúp tiết kiệm thời gian & sinh hoạt phí. Cấp Graduate Visa ở lại làm việc 2 năm.",
      badge: "Có thể cân nhắc",
      badgeColor: "blue"
    }
  ];

  // Current State
  const filterState = {
    budget: "<300",
    level: "thac_si",
    major: "am_thuc",
    priority: "dinh_cu"
  };

  const labelMap = {
    budget: {
      "<300": "dưới 300 triệu",
      "300-500": "300 - 500 triệu",
      "500-800": "500 - 800 triệu",
      ">800": "trên 800 triệu"
    },
    level: {
      "dai_hoc": "Đại học",
      "thac_si": "Thạc sĩ / Sau đại học",
      "cao_dang": "Học nghề / Cao đẳng",
      "thpt": "THPT / Dự bị"
    },
    major: {
      "am_thuc": "Ẩm thực / Làm bánh",
      "khach_san": "Quản trị Khách sạn",
      "kinh_te": "Kinh tế / Quản trị KD",
      "cntt": "CNTT / Lập trình / AI",
      "y_duoc": "Y Dược / Điều dưỡng",
      "ky_thuat": "Kỹ thuật / Cơ khí"
    },
    priority: {
      "dinh_cu": "cơ hội định cư",
      "hoc_bong": "săn học bổng cao",
      "viec_lam": "việc làm & Co-op có lương",
      "chi_phi_thap": "chi phí tối ưu / tiết kiệm"
    }
  };

  // 2. Matching Logic
  function getMatchedDestinations() {
    return DESTINATION_DATABASE.map(item => {
      let score = 0;
      let isPrimary = false;

      // Budget match
      if (item.budgetLevels.includes(filterState.budget)) {
        score += 40;
        if (item.budgetLevels[0] === filterState.budget) score += 10;
      }

      // Priority match
      if (item.priorities.includes(filterState.priority)) {
        score += 30;
        if (item.priorities[0] === filterState.priority) score += 10;
      }

      // Major match
      if (item.majors.includes(filterState.major)) {
        score += 20;
        if (item.majors[0] === filterState.major) score += 10;
      }

      // Level match
      if (item.levels.includes(filterState.level)) {
        score += 15;
      }

      // Special synergy rules (Bếp/Ẩm thực -> Thụy Sĩ & Úc là vua)
      if (filterState.major === "am_thuc") {
        if (item.id === "thuy_si") score += 25;
        if (item.id === "uc") score += 20;
      }

      // Special synergy for Định cư -> Úc & Canada là vua
      if (filterState.priority === "dinh_cu") {
        if (item.id === "uc" || item.id === "canada") score += 25;
      }

      // Special synergy for Dưới 300 triệu -> Malaysia là vua
      if (filterState.budget === "<300") {
        if (item.id === "malaysia") score += 30;
      }

      const badgeText = score >= 80 ? "Phù hợp nhất" : (score >= 60 ? "Có thể cân nhắc" : "Khám phá thêm");
      const badgeStyle = score >= 80 ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200";

      return {
        ...item,
        score,
        badgeText,
        badgeStyle
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Return top 5 suggestions
  }

  // 3. Render Results to DOM
  function renderDestinationResults() {
    const listContainer = document.getElementById("destination-results-grid");
    const summaryText = document.getElementById("destination-query-summary");
    const countBadge = document.getElementById("destination-count-badge");

    if (!listContainer) return;

    const matched = getMatchedDestinations();

    // Update count badge
    if (countBadge) {
      countBadge.textContent = `Đã tìm thấy ${matched.length} gợi ý phù hợp nhất.`;
    }

    // Update summary text
    if (summaryText) {
      const bText = labelMap.budget[filterState.budget] || filterState.budget;
      const lText = labelMap.level[filterState.level] || filterState.level;
      const mText = labelMap.major[filterState.major] || filterState.major;
      const pText = labelMap.priority[filterState.priority] || filterState.priority;

      summaryText.innerHTML = `Dựa trên ngân sách <strong>${bText}</strong>, bậc <strong>${lText}</strong>, ngành <strong>${mText}</strong> và ưu tiên <strong>${pText}</strong>.`;
    }

    // Render cards
    listContainer.innerHTML = matched.map((item, index) => {
      return `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all overflow-hidden flex flex-col justify-between group">
          <div>
            <!-- Card Image with Flag Overlay -->
            <div class="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-900">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <!-- Flag Badge -->
              <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-sm border border-white/20">
                <span class="text-lg">${item.flag}</span>
                <span class="text-xs font-bold text-slate-900">${item.name}</span>
              </div>

              <!-- Match Tag -->
              <div class="absolute top-2.5 left-2.5">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.badgeStyle} border shadow-xs">
                  ${item.badgeText}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-3.5 space-y-2">
              <p class="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                ${item.matchReason}
              </p>
              
              <div class="pt-1">
                <div class="text-[10px] uppercase font-bold text-slate-400">Ngân sách dự kiến:</div>
                <div class="text-xs sm:text-sm font-extrabold text-red-600">
                  ${item.costRange}
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <label class="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer">
              <input type="checkbox" name="compare_country" value="${item.id}" class="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer">
              <span>So sánh</span>
            </label>
            <button type="button" onclick="openConsultModal('Tư vấn du học ${item.name}', 'Ngành ${labelMap.major[filterState.major]}')" class="text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform cursor-pointer">
              <span>Chi tiết</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. Bind Pill Button Clicks
  function initPillControls() {
    const categories = ["budget", "level", "major", "priority"];

    categories.forEach(cat => {
      const container = document.getElementById(`filter-col-${cat}`);
      if (!container) return;

      container.querySelectorAll(".dest-pill-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          // Remove active from peers
          container.querySelectorAll(".dest-pill-btn").forEach(b => {
            b.classList.remove("border-red-500", "bg-red-50/50", "text-red-700", "font-bold", "ring-1", "ring-red-500");
            b.classList.add("border-slate-200", "bg-white", "text-slate-700");
            const dot = b.querySelector(".pill-dot");
            if (dot) {
              dot.classList.remove("bg-red-500");
              dot.classList.add("bg-slate-300");
            }
          });

          // Mark current active
          this.classList.remove("border-slate-200", "bg-white", "text-slate-700");
          this.classList.add("border-red-500", "bg-red-50/50", "text-red-700", "font-bold", "ring-1", "ring-red-500");
          const activeDot = this.querySelector(".pill-dot");
          if (activeDot) {
            activeDot.classList.remove("bg-slate-300");
            activeDot.classList.add("bg-red-500");
          }

          // Update state
          filterState[cat] = this.getAttribute("data-val");

          // Auto-render live
          renderDestinationResults();
        });
      });
    });

    // Big Action Button "XEM QUỐC GIA PHÙ HỢP"
    const submitBtn = document.getElementById("btn-match-destinations");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        renderDestinationResults();
        const resultsEl = document.getElementById("destination-results-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // Lead Form Submission
    const leadForm = document.getElementById("dest-lead-form");
    if (leadForm) {
      leadForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const phoneInput = this.querySelector("input[name='phone']");
        const phone = phoneInput ? phoneInput.value.trim() : "";
        if (!phone) {
          alert("Vui lòng nhập số điện thoại hoặc Zalo để chuyên viên liên hệ!");
          return;
        }

        const bText = labelMap.budget[filterState.budget];
        const mText = labelMap.major[filterState.major];
        const pText = labelMap.priority[filterState.priority];

        if (typeof window.openConsultModal === "function") {
          window.openConsultModal("Gợi ý điểm đến du học theo ngân sách", `Ngân sách: ${bText} | Ngành: ${mText} | Ưu tiên: ${pText}`);
          const noteInput = document.getElementById("consult-note");
          if (noteInput) {
            noteInput.value = `[Form Gợi Ý Điểm Đến] SĐT: ${phone} | Ngân sách: ${bText} | Bậc: ${labelMap.level[filterState.level]} | Ngành: ${mText} | Ưu tiên: ${pText}`;
          }
        } else {
          alert(`Cảm ơn bạn! Chuyên gia Hằng Lương đã tiếp nhận yêu cầu tư vấn quốc gia phù hợp với ngân sách ${bText} và ngành ${mText}. Chúng tôi sẽ gọi lại qua số ${phone} trong 15 phút!`);
          this.reset();
        }
      });
    }
  }

  // 5. Initialize on Load
  function init() {
    initPillControls();
    renderDestinationResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose
  window.renderDestinationResults = renderDestinationResults;
})();
