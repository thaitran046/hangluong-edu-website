/**
 * Du Học Quốc Tế Hằng Lương - Instant Search Hub (Thư Viện Tìm Kiếm Đa Tầng)
 * Tự động tìm kiếm tức thì theo 6 Tab + Gợi ý thông minh ngành nghề liên quan
 * Không tải lại trang, hỗ trợ phím tắt Ctrl + K / Cmd + K
 */

(function () {
  let searchData = [];
  let currentTab = 'all';
  let currentQuery = '';
  let isModalOpen = false;

  // Danh mục ngành học trọng điểm để gợi ý thông minh
  const majorTaxonomies = [
    { name: "Ẩm thực / Làm bánh", key: "am thuc lam banh", icon: "🍳", count: 7, url: "/nganh-hoc/am-thuc-lam-banh" },
    { name: "Công nghệ thông tin & AI", key: "cong nghe thong tin", icon: "💻", count: 15, url: "/nganh-hoc/cong-nghe-thong-tin" },
    { name: "Quản trị Khách sạn & Du lịch", key: "khach san du lich", icon: "🏨", count: 8, url: "/nganh-hoc/quan-tri-khach-san" },
    { name: "Kinh doanh & Tài chính", key: "kinh doanh tai chinh", icon: "📊", count: 12, url: "/nganh-hoc/kinh-doanh" },
    { name: "Y Dược & Điều Dưỡng", key: "y duoc dieu duong", icon: "🩺", count: 7, url: "/nganh-hoc/y-duoc" },
    { name: "Kỹ thuật & Cơ khí", key: "ky thuat co khi", icon: "⚙️", count: 6, url: "/nganh-hoc/ky-thuat" },
    { name: "Logistics & Chuỗi cung ứng", key: "logistics", icon: "🚢", count: 5, url: "/nganh-hoc/logistics" },
    { name: "Nghệ thuật & Thiết kế", key: "thiet ke do hoa", icon: "🎨", count: 4, url: "/nganh-hoc/thiet-ke" }
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

  // Khởi tạo và nạp dữ liệu JSON Index
  async function loadSearchIndex() {
    try {
      const res = await fetch('/assets/data/search-index.json');
      if (res.ok) {
        searchData = await res.json();
      } else {
        console.warn('Không tải được search-index.json, thử đường dẫn dự phòng...');
        const fallbackRes = await fetch('../assets/data/search-index.json');
        if (fallbackRes.ok) searchData = await fallbackRes.json();
      }
    } catch (err) {
      console.error('Lỗi nạp dữ liệu search-index:', err);
    }
  }

  // Tạo và chèn giao diện Modal vào DOM
  function injectSearchModal() {
    if (document.getElementById('instant-search-hub')) return;

    const modalHtml = `
      <div id="instant-search-hub" class="hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto transition-opacity duration-200">
        <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 sm:my-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
          
          <!-- MODAL HEADER: BĂNG TÌM KIẾM CHÍNH -->
          <div class="p-5 sm:p-6 bg-gradient-to-r from-brand-navyDark via-brand-navy to-slate-900 text-white relative">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-amber-300">Thư Viện Tra Cứu Thông Tin Hằng Lương Edu</span>
              </div>
              <div class="flex items-center gap-3">
                <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-white/10 border border-white/20 rounded">ESC để đóng</kbd>
                <button id="close-search-hub-btn" class="text-slate-300 hover:text-white text-2xl leading-none p-1 rounded-lg hover:bg-white/10 transition-colors">&times;</button>
              </div>
            </div>

            <!-- Ô INPUT TÌM KIẾM TO BẢN -->
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input type="text" id="search-hub-input" autocomplete="off" placeholder="Bạn đang cần tìm gì? (Ví dụ: Monash, Ẩm thực, Học bổng 100%, Deakin, Visa Úc...)" class="w-full pl-12 pr-12 py-3.5 bg-white text-slate-900 rounded-2xl text-sm sm:text-base font-medium shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-400/40 placeholder-slate-400 transition-all">
              <button id="clear-search-hub-btn" class="hidden absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
            </div>

            <!-- 6 TABS LỌC THEO LOẠI NỘI DUNG -->
            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-4 no-scrollbar border-t border-white/10 mt-4 text-xs font-semibold" id="search-hub-tabs">
              <button data-tab="all" class="search-tab-btn active px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold whitespace-nowrap shadow transition-all">
                Tất Cả <span class="tab-count ml-1 opacity-80">(108)</span>
              </button>
              <button data-tab="truonghoc" class="search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all">
                Trường Học <span class="tab-count ml-1 opacity-70">(36)</span>
              </button>
              <button data-tab="hocbong" class="search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all">
                Học Bổng <span class="tab-count ml-1 opacity-70">(23)</span>
              </button>
              <button data-tab="nganhhoc" class="search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all">
                Ngành Nghề <span class="tab-count ml-1 opacity-70">(25)</span>
              </button>
              <button data-tab="sukien" class="search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all">
                Hội Thảo <span class="tab-count ml-1 opacity-70">(11)</span>
              </button>
              <button data-tab="camnang" class="search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all">
                Cẩm Nang & Visa <span class="tab-count ml-1 opacity-70">(13)</span>
              </button>
            </div>
          </div>

          <!-- PHẦN GỢI Ý THÔNG MINH NGÀNH HỌC (TAXONOMY SMART CHIPS) -->
          <div id="search-major-suggestions" class="px-5 sm:px-6 py-3.5 bg-amber-50/70 border-b border-amber-200/60 flex flex-wrap items-center gap-2 text-xs">
            <span class="font-bold text-amber-900 flex items-center gap-1">
              <span>🎯</span> Danh mục phù hợp:
            </span>
            <div class="flex flex-wrap items-center gap-2" id="smart-chips-container">
              <!-- Render động các chips ngành liên quan -->
            </div>
          </div>

          <!-- KẾT QUẢ TÌM KIẾM (SCROLLABLE CONTAINER) -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50 min-h-[300px]" id="search-results-list">
            <!-- Render kết quả động tại đây -->
          </div>

          <!-- FOOTER CỦA MODAL -->
          <div class="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div id="search-status-bar">
              Đang hiển thị <strong>108</strong> nội dung tuyển sinh & học bổng
            </div>
            <div class="flex items-center gap-3">
              <button onclick="openConsultModal('Tư vấn từ Search Hub', '', false)" class="text-brand-navy hover:text-amber-600 font-bold hover:underline">
                Chưa tìm thấy? Nhận tư vấn 1:1 miễn phí &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents();
  }

  // Gắn sự kiện điều khiển Modal
  function bindModalEvents() {
    const modal = document.getElementById('instant-search-hub');
    const input = document.getElementById('search-hub-input');
    const closeBtn = document.getElementById('close-search-hub-btn');
    const clearBtn = document.getElementById('clear-search-hub-btn');
    const tabs = document.querySelectorAll('.search-tab-btn');

    // Nút đóng
    closeBtn.addEventListener('click', closeSearchModal);

    // Click ngoài vùng trắng để đóng
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeSearchModal();
    });

    // Xóa text
    clearBtn.addEventListener('click', function () {
      input.value = '';
      currentQuery = '';
      clearBtn.classList.add('hidden');
      renderResults();
      input.focus();
    });

    // Lắng nghe gõ phím tức thì (Realtime Debounce)
    let debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const val = this.value.trim();
      currentQuery = val;
      if (val) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }

      debounceTimer = setTimeout(() => {
        renderResults();
      }, 50);
    });

    // Chuyển Tab
    tabs.forEach(btn => {
      btn.addEventListener('click', function () {
        tabs.forEach(t => {
          t.className = "search-tab-btn px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all";
        });
        this.className = "search-tab-btn active px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold whitespace-nowrap shadow transition-all";
        currentTab = this.getAttribute('data-tab');
        renderResults();
      });
    });
  }

  // Mở modal tìm kiếm
  window.openSearchModal = function (initialQuery = '') {
    injectSearchModal();
    const modal = document.getElementById('instant-search-hub');
    const input = document.getElementById('search-hub-input');
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    isModalOpen = true;

    if (initialQuery) {
      input.value = initialQuery;
      currentQuery = initialQuery;
    }

    renderResults();
    setTimeout(() => input.focus(), 100);
  };

  // Đóng modal
  window.closeSearchModal = function () {
    const modal = document.getElementById('instant-search-hub');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    isModalOpen = false;
  };

  // Bắt phím tắt Ctrl + K / Cmd + K và Escape
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

  // Gắn sự kiện cho các ô input tìm kiếm hiện có trên Header
  function hookExistingInputs() {
    document.querySelectorAll('form[action*="tim-khoa-hoc"], form[role="search"]').forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = (this.querySelector('input[type="text"], input[type="search"]') || {}).value || '';
        openSearchModal(query);
      });
    });

    document.querySelectorAll('input[name="search"], input[name="s"]').forEach(input => {
      input.addEventListener('focus', function () {
        const val = this.value;
        openSearchModal(val);
      });
      input.addEventListener('click', function () {
        const val = this.value;
        openSearchModal(val);
      });
    });
  }

  // Hàm lọc và hiển thị kết quả
  function renderResults() {
    const resultsContainer = document.getElementById('search-results-list');
    const statusBar = document.getElementById('search-status-bar');
    const chipsContainer = document.getElementById('smart-chips-container');
    const rawQuery = currentQuery.trim();
    const cleanQuery = removeVietnameseTones(rawQuery);

    // 1. Cập nhật gợi ý ngành thông minh (Smart Taxonomy Suggestions)
    renderSmartChips(cleanQuery, chipsContainer);

    // 2. Lọc dữ liệu theo tab và từ khóa
    let filtered = searchData.filter(item => {
      // Lọc theo Tab
      if (currentTab !== 'all' && item.type !== currentTab) {
        return false;
      }

      // Nếu không có từ khóa -> Hiện tất cả
      if (!cleanQuery) return true;

      // Tìm kiếm đa trường không dấu
      const titleMatch = removeVietnameseTones(item.title).includes(cleanQuery);
      const snippetMatch = removeVietnameseTones(item.snippet).includes(cleanQuery);
      const countryMatch = removeVietnameseTones(item.country).includes(cleanQuery);
      const majorMatch = removeVietnameseTones(item.major).includes(cleanQuery);
      const badgeMatch = removeVietnameseTones(item.badge).includes(cleanQuery);

      return titleMatch || snippetMatch || countryMatch || majorMatch || badgeMatch;
    });

    // 3. Cập nhật thanh trạng thái bộ đếm
    if (rawQuery) {
      statusBar.innerHTML = `Tìm thấy <strong>${filtered.length}</strong> kết quả phù hợp cho từ khóa <q class="text-amber-600 font-bold">"${rawQuery}"</q>`;
    } else {
      statusBar.innerHTML = `Đang hiển thị <strong>${filtered.length}</strong> nội dung tuyển sinh & học bổng`;
    }

    // 4. Nếu không có kết quả
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-12 text-center space-y-3">
          <div class="text-4xl">🔍</div>
          <h4 class="text-base font-bold text-slate-800">Không tìm thấy kết quả nào cho "${rawQuery}"</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Hãy thử tìm bằng từ khóa ngắn hơn như: <em>Úc, Deakin, Làm bánh, Monash, Học bổng, Visa</em>... hoặc liên hệ trực tiếp chuyên viên Hằng Lương.
          </p>
          <div class="pt-2">
            <button onclick="openConsultModal('Yêu cầu tìm kiếm chưa có: ' + '${rawQuery}', '', false)" class="px-5 py-2.5 bg-brand-navy hover:bg-amber-500 hover:text-slate-950 text-white font-bold rounded-xl text-xs transition-colors shadow">
              Nhận Hỗ Trợ Tìm Kiếm Miễn Phí 1:1
            </button>
          </div>
        </div>
      `;
      return;
    }

    // 5. Render danh sách thẻ kết quả
    const htmlCards = filtered.map(item => {
      let badgeStyle = "bg-blue-100 text-blue-800 border-blue-200";
      let icon = "🎓";
      if (item.type === 'hocbong') {
        badgeStyle = "bg-amber-100 text-amber-900 border-amber-200";
        icon = "🎁";
      } else if (item.type === 'nganhhoc') {
        badgeStyle = "bg-purple-100 text-purple-900 border-purple-200";
        icon = "📚";
      } else if (item.type === 'sukien') {
        badgeStyle = "bg-rose-100 text-rose-900 border-rose-200";
        icon = "📅";
      } else if (item.type === 'camnang') {
        badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-200";
        icon = "💡";
      }

      return `
        <article class="bg-white hover:bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col sm:flex-row items-start justify-between gap-4 group">
          <div class="space-y-2 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}">
                <span>${icon}</span> ${item.typeName}
              </span>
              <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                🌍 ${item.country}
              </span>
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                ${item.badge}
              </span>
            </div>

            <h4 class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors font-heading">
              <a href="${item.url}" class="hover:underline">${item.title}</a>
            </h4>

            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              ${item.snippet}
            </p>

            <div class="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span><strong>Chuyên ngành:</strong> ${item.major}</span>
              <span class="text-emerald-700 font-semibold">• ${item.meta}</span>
            </div>
          </div>

          <div class="sm:self-center flex-shrink-0 w-full sm:w-auto">
            <a href="${item.url}" class="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-brand-navy hover:text-white text-brand-navy font-bold text-xs rounded-xl transition-all shadow-sm">
              <span>Xem chi tiết</span>
              <span>&rarr;</span>
            </a>
          </div>
        </article>
      `;
    }).join('');

    resultsContainer.innerHTML = htmlCards;
  }

  // Render gợi ý ngành học thông minh
  function renderSmartChips(cleanQuery, container) {
    if (!container) return;

    // Lọc các ngành liên quan hoặc hiển thị các ngành phổ biến
    let matchedMajors = majorTaxonomies;
    if (cleanQuery) {
      matchedMajors = majorTaxonomies.filter(m => 
        removeVietnameseTones(m.name).includes(cleanQuery) || 
        m.key.includes(cleanQuery)
      );
      // Nếu không khớp ngành nào cụ thể, vẫn giữ các ngành hot nhất
      if (matchedMajors.length === 0) matchedMajors = majorTaxonomies.slice(0, 4);
    } else {
      matchedMajors = majorTaxonomies.slice(0, 5);
    }

    container.innerHTML = matchedMajors.map(m => `
      <a href="${m.url}" onclick="handleMajorChipClick(event, '${m.name}')" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-700 border border-amber-300 font-semibold text-[11px] transition-all shadow-sm group">
        <span>${m.icon}</span>
        <span>${m.name}</span>
        <span class="text-[10px] text-slate-400 group-hover:text-slate-950 font-bold ml-0.5">(${m.count}) &rarr;</span>
      </a>
    `).join('');
  }

  // Click vào chip ngành thì lọc nhanh hoặc chuyển trang
  window.handleMajorChipClick = function (e, majorName) {
    e.preventDefault();
    const input = document.getElementById('search-hub-input');
    if (input) {
      input.value = majorName;
      currentQuery = majorName;
      document.getElementById('clear-search-hub-btn').classList.remove('hidden');
      renderResults();
      input.focus();
    }
  };

  // Khởi động khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', async () => {
    await loadSearchIndex();
    injectSearchModal();
    hookExistingInputs();
  });

})();
