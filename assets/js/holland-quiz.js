/**
 * Du Học Quốc Tế Hằng Lương - Mini Holland Career Quiz Engine (RIASEC)
 * Trắc nghiệm định hướng nghề nghiệp 45s - Tương thích 100+ ngành học
 */

(function () {
  let currentStep = 1;
  const userAnswers = {};

  function injectHollandModal() {
    if (document.getElementById('holland-quiz-modal')) return;

    const modalHtml = `
      <div id="holland-quiz-modal" class="hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto transition-opacity duration-200">
        <div class="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          <!-- MODAL HEADER -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-brand-navyDark via-brand-navy to-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                HL
              </span>
              <div>
                <h3 class="font-bold text-sm sm:text-base font-heading flex items-center gap-1.5">
                  <span>🧩</span> Mini Trắc Nghiệm Tính Cách Nghề Nghiệp
                </h3>
                <p class="text-[11px] text-amber-300">Chuẩn mô hình trắc nghiệm tâm lý học John Holland (RIASEC)</p>
              </div>
            </div>
            <button type="button" onclick="closeHollandQuizModal()" class="text-slate-300 hover:text-white text-2xl leading-none p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">&times;</button>
          </div>

          <!-- PROGRESS BAR -->
          <div class="w-full bg-slate-100 h-1.5" id="holland-progress-bar-container">
            <div id="holland-progress-bar" class="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 transition-all duration-300" style="width: 33%;"></div>
          </div>

          <!-- QUIZ BODY -->
          <div class="p-5 sm:p-6 overflow-y-auto max-h-[75vh]" id="holland-quiz-content">
            
            <!-- STEP 1 -->
            <div id="holland-step-1" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-amber-600 tracking-wider">CÂU HỎI 1 / 3</span>
                <span class="text-xs text-slate-400">Thời gian: 15s</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Lúc rảnh rỗi hoặc khi học tập, bạn cảm thấy hứng thú nhất với hoạt động nào sau đây?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="selectHollandOption('q1', 'AR', 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100 transition-colors">🍳</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">Tự tay nấu ăn, làm bánh, vẽ tranh, trang trí hoặc làm đồ thủ công</div>
                    <div class="text-[11px] text-slate-500">Thích cái đẹp, sản phẩm thực tế cầm nắm và thưởng thức được</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q1', 'IC', 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">💻</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-800">Mày mò máy tính, chơi game, xem các tiến bộ công nghệ hoặc số liệu</div>
                    <div class="text-[11px] text-slate-500">Thích tư duy logic, tìm tòi nguyên lý hoạt động của máy móc</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q1', 'ES', 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 transition-colors">👥</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800">Gặp gỡ bạn bè, trò chuyện, tư vấn giúp đỡ người khác hoặc tổ chức sự kiện</div>
                    <div class="text-[11px] text-slate-500">Thích kết nối con người, năng nổ, giao tiếp tự nhiên</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- STEP 2 -->
            <div id="holland-step-2" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-amber-600 tracking-wider">CÂU HỎI 2 / 3</span>
                <span class="text-xs text-slate-400">Thời gian: 15s</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn đánh giá thế mạnh nổi bật nhất của bản thân là gì?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="selectHollandOption('q2', 'AR', 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100 transition-colors">🎨</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">Sự khéo léo, óc thẩm mỹ và khả năng sáng tạo không theo khuôn mẫu</div>
                    <div class="text-[11px] text-slate-500">Thích thực hành thực tế hơn là ngồi đọc sách lý thuyết khô khan</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q2', 'IC', 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">🔬</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-800">Khả năng tập trung cao, phân tích chi tiết và tư duy giải quyết vấn đề</div>
                    <div class="text-[11px] text-slate-500">Cẩn trọng, chu đáo, thích mọi thứ rõ ràng và chính xác</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q2', 'ES', 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 transition-colors">💼</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800">Khả năng thuyết phục, truyền cảm hứng và dẫn dắt người khác</div>
                    <div class="text-[11px] text-slate-500">Dễ thích nghi, tự tin trước đám đông và thích thử thách thương mại</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- STEP 3 -->
            <div id="holland-step-3" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-amber-600 tracking-wider">CÂU HỎI 3 / 3</span>
                <span class="text-xs text-slate-400">Thời gian: 15s</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Môi trường làm việc quốc tế mơ ước của bạn trong 3 - 5 năm tới?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="selectHollandOption('q3', 'AR', 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100 transition-colors">👨‍🍳</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">Khu bếp nhà hàng 5 sao, xưởng bánh ngọt cao cấp hoặc studio sáng tạo</div>
                    <div class="text-[11px] text-slate-500">Năng động, tự do thể hiện phong cách cá nhân, lương cao theo tay nghề</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q3', 'IC', 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">🏢</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-800">Tòa nhà công nghệ cao, phòng lab nghiên cứu hoặc viện tài chính</div>
                    <div class="text-[11px] text-slate-500">Môi trường chuyên nghiệp, bảo chứng học thuật, cơ hội làm việc toàn cầu</div>
                  </div>
                </button>

                <button type="button" onclick="selectHollandOption('q3', 'ES', 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-3 group cursor-pointer">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 transition-colors">🏨</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800">Khách sạn - Resort sang trọng, hãng hàng không hoặc công ty đa quốc gia</div>
                    <div class="text-[11px] text-slate-500">Được đi nhiều nơi, tiếp xúc nhiều nền văn hóa và cơ hội thăng tiến quản lý</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- RESULT VIEW (HIỂN THỊ KẾT QUẢ ĐÚNG THEO YÊU CẦU ANH THÁI) -->
            <div id="holland-step-result" class="space-y-5 hidden animate-in fade-in duration-300">
              
              <!-- BADGE KẾT QUẢ TÍNH CÁCH CHUẨN HOLLAND -->
              <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400/60 text-slate-900 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🎯</span>
                  <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">KẾT QUẢ TRẮC NGHIỆM TÂM LÝ</span>
                </div>
                <div class="text-lg sm:text-xl font-black font-heading text-brand-navy">
                  Tính cách của bạn: <span class="text-amber-600">80% Nhóm Sáng Tạo & Thực Hành (A-R)</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  Bạn thuộc nhóm <strong>Artistic (Nghệ thuật & Sáng tạo)</strong> kết hợp <strong>Realistic (Thực tế & Thao tác tay nghề)</strong>. Bạn thích tự tay tạo ra sản phẩm thực tế, có gu thẩm mỹ cao, ghét sự gò bó lý thuyết suông và học nhanh nhất qua thực hành.
                </p>
              </div>

              <!-- TOP CÁC NGÀNH SINH RA DÀNH CHO BẠN -->
              <div class="space-y-3">
                <div class="text-xs font-black uppercase text-brand-navy tracking-wider flex items-center gap-1.5">
                  <span>🏆</span> Top các ngành sinh ra dành cho bạn trong kho du học:
                </div>

                <div class="space-y-2.5 text-xs sm:text-sm">
                  
                  <!-- Ngành 1 -->
                  <div class="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs flex items-start gap-3 hover:border-amber-500 transition-all">
                    <span class="text-2xl">🍳</span>
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-slate-900 font-heading">
                        Ẩm thực / Làm bánh
                      </div>
                      <div class="text-[11.5px] text-slate-600">
                        Khuyên học tại: <strong class="text-blue-700">Le Cordon Bleu Úc</strong> hoặc <strong class="text-rose-700">BHMS Thụy Sĩ</strong> (Thực tập hưởng lương 65 Tr/tháng).
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Hợp 98%</span>
                  </div>

                  <!-- Ngành 2 -->
                  <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3 hover:border-amber-400 transition-all">
                    <span class="text-2xl">🎨</span>
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-slate-900 font-heading">
                        Thiết kế Đồ họa & Game Design
                      </div>
                      <div class="text-[11.5px] text-slate-600">
                        Khuyên học tại: <strong class="text-blue-700">Deakin University Úc</strong> (Top 1% Thế Giới cơ sở vật chất 5 sao).
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Hợp 88%</span>
                  </div>

                  <!-- Ngành 3 -->
                  <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3 hover:border-amber-400 transition-all">
                    <span class="text-2xl">🏡</span>
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-slate-900 font-heading">
                        Kiến trúc & Thiết kế Nội thất
                      </div>
                      <div class="text-[11.5px] text-slate-600">
                        Khuyên học tại: <strong class="text-blue-700">UTS (Đại học Công nghệ Sydney Úc)</strong>.
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Hợp 82%</span>
                  </div>

                </div>
              </div>

              <!-- FORM ĐỂ LẠI ZALO NHẬN BÁO CÁO TOÀN DIỆN (CHỐT LEAD) -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="text-xs font-bold text-slate-900">
                  🎁 Nhận Bản Báo Cáo Phân Tích Chi Tiết & Bảng Học Bổng 2026:
                </div>
                <form id="holland-lead-form" onsubmit="handleHollandLeadSubmit(event)" class="space-y-2">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" name="fullname" required placeholder="Họ và tên của bạn *" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500">
                    <input type="tel" name="phone" required placeholder="Số điện thoại / Zalo *" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500">
                  </div>
                  <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow cursor-pointer">
                    Gửi Phân Tích & Tư Vấn Học Bổng 1:1 Qua Zalo &rarr;
                  </button>
                </form>
              </div>

              <!-- NÚT ĐÓNG & CUỘN XUỐNG XEM TRƯỜNG -->
              <div class="flex items-center justify-between text-xs pt-2">
                <button type="button" onclick="closeHollandQuizModal()" class="text-slate-500 hover:text-slate-800 underline cursor-pointer">
                  Đóng lại
                </button>
                <button type="button" onclick="closeHollandAndScrollToSchools()" class="font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer">
                  <span>Khám phá 8 trường đào tạo ngành này bên dưới</span>
                  <span>&darr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('holland-quiz-modal');
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeHollandQuizModal();
    });
  }

  window.openHollandQuizModal = function () {
    injectHollandModal();
    const modal = document.getElementById('holland-quiz-modal');
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    resetQuiz();
  };

  window.closeHollandQuizModal = function () {
    const modal = document.getElementById('holland-quiz-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  window.closeHollandAndScrollToSchools = function () {
    closeHollandQuizModal();
    const section = document.getElementById('schools-network-section') || document.querySelector('section.bg-slate-50');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.selectHollandOption = function (questionId, code, step) {
    userAnswers[questionId] = code;

    if (step === 1) {
      document.getElementById('holland-step-1').classList.add('hidden');
      document.getElementById('holland-step-2').classList.remove('hidden');
      document.getElementById('holland-progress-bar').style.width = '66%';
    } else if (step === 2) {
      document.getElementById('holland-step-2').classList.add('hidden');
      document.getElementById('holland-step-3').classList.remove('hidden');
      document.getElementById('holland-progress-bar').style.width = '100%';
    } else if (step === 3) {
      document.getElementById('holland-step-3').classList.add('hidden');
      document.getElementById('holland-step-result').classList.remove('hidden');
      document.getElementById('holland-progress-bar-container').classList.add('hidden');
    }
  };

  window.handleHollandLeadSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.fullname.value;
    const phone = form.phone.value;

    alert(`Cảm ơn bạn ${name}! Chuyên viên Hằng Lương đã tiếp nhận kết quả trắc nghiệm và sẽ gửi bản phân tích chi tiết qua số Zalo ${phone} trong ít phút.`);
    closeHollandQuizModal();
  };

  function resetQuiz() {
    currentStep = 1;
    const p1 = document.getElementById('holland-step-1');
    const p2 = document.getElementById('holland-step-2');
    const p3 = document.getElementById('holland-step-3');
    const pr = document.getElementById('holland-step-result');
    const pbar = document.getElementById('holland-progress-bar');
    const pbarContainer = document.getElementById('holland-progress-bar-container');

    if (p1) p1.classList.remove('hidden');
    if (p2) p2.classList.add('hidden');
    if (p3) p3.classList.add('hidden');
    if (pr) pr.classList.add('hidden');
    if (pbar) pbar.style.width = '33%';
    if (pbarContainer) pbarContainer.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectHollandModal();

    // Tự động hook tất cả các nút có class hoặc href liên quan đến test Holland
    document.querySelectorAll('.open-holland-quiz-btn, a[href*="test-holland"]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openHollandQuizModal();
      });
    });
  });

})();
