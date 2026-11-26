/**
 * Du Học Quốc Tế Hằng Lương - Spotlight Search Modal (Kết hợp Cách 1 & Cách 2)
 * Bấm tìm kiếm -> Màn hình tối lại, bảng to (Modal) hiện lên ở chính giữa màn hình.
 * Gõ chữ -> Xem gợi ý nhanh + Chỉ mục ngành học tức thì.
 * Bấm Enter / Tìm kiếm -> Chuyển sang Trang Thư Viện Toàn Diện (/tim-kiem?s=...) với 6 Tabs.
 */

(function () {
  let searchData = [];
  let isModalOpen = false;

  // Danh mục ngành học trọng điểm để gợi ý thông minh khi tìm kiếm
  const majorTaxonomies = [
    { 
      name: "Ẩm thực / Làm bánh", 
      keywords: ["am thuc", "lam banh", "bep", "nau an", "dau bep", "pastry", "cookery", "culinary", "bhms", "cordon bleu", "angliss"],
      icon: "🍳", 
      count: 7, 
      url: "/nganh-hoc/am-thuc-lam-banh" 
    },
    { 
      name: "Công nghệ thông tin & AI", 
      keywords: ["it", "cong nghe", "thong tin", "ai", "tri tue nhan tao", "phan mem", "lap trinh", "computer", "data", "du lieu", "an ninh mang", "apu", "deakin"],
      icon: "💻", 
      count: 15, 
      url: "/nganh-hoc/cong-nghe-thong-tin" 
    },
    { 
      name: "Quản trị Khách sạn & Du lịch", 
      keywords: ["khach san", "du lich", "hospitality", "hotel", "resort", "nha hang", "bhms", "taylors", "angliss"],
      icon: "🏨", 
      count: 8, 
      url: "/nganh-hoc/quan-tri-khach-san" 
    },
    { 
      name: "Kinh doanh & Tài chính", 
      keywords: ["kinh doanh", "tai chinh", "ke toan", "marketing", "business", "finance", "acca", "sim", "sunway", "monash"],
      icon: "📊", 
      count: 12, 
      url: "/nganh-hoc/kinh-doanh" 
    },
    { 
      name: "Y Dược & Điều Dưỡng", 
      keywords: ["y", "duoc", "dieu duong", "nursing", "bac si", "y te", "health", "flinders", "adelaide", "deakin"],
      icon: "🩺", 
      count: 7, 
      url: "/nganh-hoc/y-duoc" 
    },
    { 
      name: "Kỹ thuật & Cơ khí", 
      keywords: ["ky thuat", "co khi", "xay dung", "dien tu", "mechatronics", "engineering", "uts", "curtin"],
      icon: "⚙️", 
      count: 6, 
      url: "/nganh-hoc/ky-thuat" 
    },
    { 
      name: "Logistics & Chuỗi cung ứng", 
      keywords: ["logistics", "supply chain", "chuoi cung ung", "kho van", "xuat nhap khau", "cang bien"],
      icon: "🚢", 
      count: 5, 
      url: "/nganh-hoc/logistics" 
    }
  ];

  // Helper xóa dấu tiếng Việt
  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  // Nạp dữ liệu JSON Index
  async function loadSearchData() {
    try {
      const res = await fetch('/assets/data/search-index.json');
      if (res.ok) {
        searchData = await res.json();
      } else {
        const fb = await fetch('../assets/data/search-index.json');
        if (fb.ok) searchData = await fb.json();
      }
    } catch (e) {
      console.warn('Lỗi nạp search data:', e);
    }
  }

  // Tạo và chèn giao diện Modal vào trang
  function injectModalHtml() {
    if (document.getElementById('spotlight-search-modal')) return;

    const html = `
      <div id="spotlight-search-modal" class="hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto transition-opacity duration-200">
        
        <!-- BẢNG TO (MODAL) Ở CHÍNH GIỮA MÀN HÌNH -->
        <div class="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 sm:my-12 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
          
          <!-- PHẦN HEADER CỦA BẢNG TO: Ô NHẬP TÌM KIẾM -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-brand-navyDark via-brand-navy to-slate-900 text-white relative">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Thư Viện Tra Cứu Thông Tin Hằng Lương
              </span>
              <div class="flex items-center gap-2">
                <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-white/10 border border-white/20 rounded">ESC để đóng</kbd>
                <button type="button" onclick="closeSearchModal()" class="text-slate-300 hover:text-white text-2xl leading-none p-1 rounded-lg hover:bg-white/10 transition-colors">&times;</button>
              </div>
            </div>

            <form id="spotlight-form" onsubmit="handleSpotlightSubmit(event)">
              <div class="relative flex items-center bg-white rounded-2xl shadow-inner border-2 border-amber-400/50 focus-within:border-amber-400 transition-all p-1">
                <span class="pl-3.5 pr-2 text-slate-400">
                  <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </span>
                <input type="search" id="spotlight-input" autocomplete="off" placeholder="Bạn đang cần tìm gì? (Ví dụ: Monash, Ẩm thực, Học bổng 100%, Deakin...)" class="w-full bg-transparent text-slate-900 px-2 py-2.5 text-sm sm:text-base font-medium focus:outline-none placeholder-slate-400">
                <button type="submit" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <span>Tìm kiếm</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </form>
          </div>

          <!-- DÒNG DANH MỤC PHÙ HỢP (CHỈ HIỆN KHI GÕ TỪ KHÓA KHỚP NGÀNH HỌC) -->
          <div id="modal-taxonomy-suggestions" class="hidden px-5 py-3 bg-amber-50/80 border-b border-amber-200/70 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-amber-900 flex items-center gap-1">
                <span>🎯</span> Danh mục phù hợp:
              </span>
              <div id="modal-taxonomy-chips" class="flex flex-wrap items-center gap-2">
                <!-- Render động các chip ngành học -->
              </div>
            </div>
          </div>

          <!-- KHU VỰC HIỆN GỢI Ý & KẾT QUẢ TRỰC TIẾP TRONG BẢNG -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50 min-h-[220px]" id="modal-results-container">
            <!-- Render động các gợi ý nhanh -->
          </div>

          <!-- DÒNG DƯỚI CÙNG (FOOTER): NÚT XEM TOÀN BỘ KẾT QUẢ SANG TRANG /TIM-KIEM -->
          <div class="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" id="modal-footer-action">
            <span class="text-slate-500" id="modal-counter-text">
              Nhập từ khóa để tra cứu hơn 100+ trường và học bổng
            </span>
            <button type="button" id="modal-view-all-btn" onclick="goToFullSearchPage()" class="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-navy hover:bg-amber-500 hover:text-slate-950 text-white font-bold transition-all shadow text-center cursor-pointer">
              Xem Toàn Bộ Kết Quả (6 Tabs) &rarr;
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // Gắn sự kiện bàn phím và click ngoài
    const modal = document.getElementById('spotlight-search-modal');
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeSearchModal();
    });

    const input = document.getElementById('spotlight-input');
    let timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleModalLiveSearch(this.value.trim());
      }, 50);
    });
  }

  // Mở bảng to (Modal)
  window.openSearchModal = function (initialQuery = '') {
    injectModalHtml();
    const modal = document.getElementById('spotlight-search-modal');
    const input = document.getElementById('spotlight-input');
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    isModalOpen = true;

    if (initialQuery) {
      input.value = initialQuery;
    }
    handleModalLiveSearch(input.value.trim());
    setTimeout(() => input.focus(), 80);
  };

  // Đóng bảng to (Modal)
  window.closeSearchModal = function () {
    const modal = document.getElementById('spotlight-search-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    isModalOpen = false;
  };

  // Phím tắt Cmd + K hoặc Ctrl + K để mở / ESC để đóng
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isModalOpen) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === 'Escape' && isModalOpen) {
      closeSearchModal();
    }
  });

  // Khi bấm Enter hoặc bấm nút "Tìm kiếm" -> chuyển sang trang /tim-kiem?s=...
  window.handleSpotlightSubmit = function (e) {
    if (e) e.preventDefault();
    goToFullSearchPage();
  };

  window.goToFullSearchPage = function () {
    const input = document.getElementById('spotlight-input');
    const q = input ? input.value.trim() : '';
    closeSearchModal();
    if (q) {
      window.location.href = '/tim-kiem?s=' + encodeURIComponent(q);
    } else {
      window.location.href = '/tim-kiem';
    }
  };

  // Xử lý hiển thị gợi ý nhanh khi đang gõ chữ trong bảng
  function handleModalLiveSearch(rawQuery) {
    const cleanQ = removeVietnameseTones(rawQuery);
    const taxSection = document.getElementById('modal-taxonomy-suggestions');
    const taxChips = document.getElementById('modal-taxonomy-chips');
    const resultsContainer = document.getElementById('modal-results-container');
    const counterText = document.getElementById('modal-counter-text');
    const viewAllBtn = document.getElementById('modal-view-all-btn');

    // 1. Chỉ mục ngành học: CHỈ HIỆN KHI TÌM KIẾM KHỚP VỚI NGÀNH HỌC (Tuyệt đối không hiện khi ô trống)
    if (cleanQ && cleanQ.length >= 2) {
      const matchedTax = majorTaxonomies.filter(item => {
        const nameM = removeVietnameseTones(item.name).includes(cleanQ);
        const kwM = item.keywords.some(k => {
          if (cleanQ.length === 2) {
            return k === cleanQ || cleanQ.includes(k);
          }
          return cleanQ.includes(k) || k.includes(cleanQ);
        });
        return nameM || kwM;
      });

      if (matchedTax.length > 0) {
        taxSection.classList.remove('hidden');
        taxChips.innerHTML = matchedTax.map(t => `
          <a href="${t.url}" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-amber-300 font-semibold text-xs transition-all shadow-xs group">
            <span>${t.icon}</span>
            <span>${t.name}</span>
            <span class="text-[10.5px] font-bold text-amber-700 group-hover:text-slate-950">${t.count} nội dung &rarr;</span>
          </a>
        `).join('');
      } else {
        taxSection.classList.add('hidden');
      }
    } else {
      taxSection.classList.add('hidden');
    }

    // 2. Nếu chưa gõ gì: Hiện các từ khóa phổ biến để bấm nhanh
    if (!cleanQ) {
      counterText.innerHTML = "Gợi ý các từ khóa đang được quan tâm nhất:";
      viewAllBtn.innerHTML = "Xem Thư Viện 108+ Nội Dung (6 Tabs) &rarr;";
      
      resultsContainer.innerHTML = `
        <div class="space-y-4 py-2">
          <div class="text-xs text-slate-500 font-semibold">TỪ KHÓA HOT HÔM NAY:</div>
          <div class="flex flex-wrap gap-2 text-xs">
            <button type="button" onclick="quickFillSearch('Monash')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🏛️ ĐH Monash Go8
            </button>
            <button type="button" onclick="quickFillSearch('Ẩm thực')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🍳 Ngành Ẩm thực / Làm bánh
            </button>
            <button type="button" onclick="quickFillSearch('Học bổng 100%')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🎁 Học bổng 100%
            </button>
            <button type="button" onclick="quickFillSearch('Deakin')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🇦🇺 ĐH Deakin Úc
            </button>
            <button type="button" onclick="quickFillSearch('BHMS Thụy Sĩ')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🇨🇭 BHMS Thụy Sĩ 20.000 CHF
            </button>
            <button type="button" onclick="quickFillSearch('Visa AL2')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🛂 Visa Úc AL2
            </button>
            <button type="button" onclick="quickFillSearch('SIM Singapore')" class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-slate-700 font-medium transition-colors">
              🇸🇬 SIM Singapore
            </button>
          </div>
        </div>
      `;
      return;
    }

    // 3. Lọc danh sách kết quả khớp
    const matchedItems = searchData.filter(item => {
      const titleM = removeVietnameseTones(item.title).includes(cleanQ);
      const snipM = removeVietnameseTones(item.snippet).includes(cleanQ);
      const cM = removeVietnameseTones(item.country).includes(cleanQ);
      const mM = removeVietnameseTones(item.major).includes(cleanQ);
      const bM = removeVietnameseTones(item.badge).includes(cleanQ);
      return titleM || snipM || cM || mM || bM;
    });

    counterText.innerHTML = `Tìm thấy <strong class="text-amber-600 font-bold">${matchedItems.length}</strong> kết quả cho "${rawQuery}"`;
    viewAllBtn.innerHTML = `Xem toàn bộ ${matchedItems.length} kết quả trên Trang Thư Viện (6 Tabs) &rarr;`;

    if (matchedItems.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center space-y-2">
          <div class="text-3xl">🔍</div>
          <div class="text-sm font-bold text-slate-700">Chưa tìm thấy kết quả nhanh cho "${rawQuery}"</div>
          <p class="text-xs text-slate-500">Bấm nút "Xem toàn bộ kết quả" hoặc nhấn Enter để qua trang tra cứu đầy đủ.</p>
        </div>
      `;
      return;
    }

    // Hiển thị 4-5 kết quả xem nhanh hàng đầu
    const topItems = matchedItems.slice(0, 5);
    resultsContainer.innerHTML = topItems.map(item => {
      let badgeStyle = "bg-blue-100 text-blue-800";
      let icon = "🎓";
      if (item.type === 'hocbong') {
        badgeStyle = "bg-amber-100 text-amber-900";
        icon = "🎁";
      } else if (item.type === 'nganhhoc') {
        badgeStyle = "bg-purple-100 text-purple-900";
        icon = "📚";
      } else if (item.type === 'sukien') {
        badgeStyle = "bg-rose-100 text-rose-900";
        icon = "📅";
      } else if (item.type === 'camnang') {
        badgeStyle = "bg-emerald-100 text-emerald-900";
        icon = "💡";
      }

      return `
        <a href="${item.url}" class="block bg-white hover:bg-amber-50/40 p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all group">
          <div class="flex items-center justify-between gap-2 mb-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${badgeStyle}">
                ${icon} ${item.typeName}
              </span>
              <span class="text-[10.5px] font-semibold text-slate-500">
                🌍 ${item.country}
              </span>
            </div>
            <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              ${item.badge}
            </span>
          </div>
          <div class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors font-heading line-clamp-1">
            ${item.title}
          </div>
          <div class="text-[11.5px] text-slate-500 line-clamp-1 mt-0.5">
            ${item.snippet}
          </div>
        </a>
      `;
    }).join('');
  }

  window.quickFillSearch = function (text) {
    const input = document.getElementById('spotlight-input');
    if (input) {
      input.value = text;
      handleModalLiveSearch(text);
      input.focus();
    }
  };

  // Khởi động
  document.addEventListener('DOMContentLoaded', () => {
    loadSearchData();
    injectModalHtml();

    const isSearchPage = window.location.pathname.includes('/tim-kiem');

    // Hook tất cả các ô input tìm kiếm ở Header / Banner
    document.querySelectorAll('.open-search-modal-trigger, form[action*="tim-kiem"] input, form[action*="tim-khoa-hoc"] input').forEach(el => {
      // Nếu đang ở chính trang /tim-kiem và ô đó là ô tìm kiếm chính của trang thì không mở modal
      if (isSearchPage && el.id === 'search-page-input') return;

      el.addEventListener('focus', function (e) {
        e.preventDefault();
        openSearchModal(this.value || '');
      });
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openSearchModal(this.value || '');
      });
    });

    // Hook nút kính lúp tìm kiếm trên thanh điều hướng mobile (header a[href*="tim-kiem"])
    document.querySelectorAll('header a[href*="/tim-kiem"], .mobile-search-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (isSearchPage) {
          const mainInput = document.getElementById('search-page-input');
          if (mainInput) {
            e.preventDefault();
            mainInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            mainInput.focus();
            return;
          }
        }
        e.preventDefault();
        openSearchModal();
      });
    });

    // Hook form submit trên header để mở modal nếu chưa gõ
    document.querySelectorAll('form[action*="tim-kiem"], form[action*="tim-khoa-hoc"]').forEach(form => {
      if (form.id === 'search-page-form') return; // Không can thiệp form của trang kết quả
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = (this.querySelector('input') || {}).value || '';
        openSearchModal(q);
      });
    });
  });

})();
