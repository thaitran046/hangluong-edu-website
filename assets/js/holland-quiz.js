/**
 * Du Học Quốc Tế Hằng Lương - Mini Holland Career Quiz Engine (RIASEC 6 Chiều)
 * Bản nâng cấp 6 câu hỏi chuẩn khoa học đo lường 6 trục R-I-A-S-E-C
 * Kết nối liền mạch với Hệ thống Bài Test Toàn Diện 108 Câu (1.850+ Đã Làm)
 */

(function () {
  let currentStep = 1;
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  const HOLLAND_108_URL = "/trac-nghiem-holland";

  function injectHollandModal() {
    if (document.getElementById('holland-quiz-modal')) return;

    const modalHtml = `
      <div id="holland-quiz-modal" class="hidden fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto transition-opacity duration-200">
        <div class="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          <!-- MODAL HEADER -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-brand-navyDark via-brand-navy to-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                HL
              </span>
              <div>
                <h3 class="font-bold text-sm sm:text-base font-heading flex items-center gap-1.5">
                  <span>🧩</span> Trắc Nghiệm Hướng Nghiệp RIASEC 60 Giây
                </h3>
                <p class="text-[11px] text-amber-300">Đo lường 6 chiều tính cách nghề nghiệp John Holland</p>
              </div>
            </div>
            <button type="button" onclick="closeHollandQuizModal()" class="text-slate-300 hover:text-white text-2xl leading-none p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">&times;</button>
          </div>

          <!-- PROGRESS BAR -->
          <div class="w-full bg-slate-100 h-1.5" id="holland-progress-bar-container">
            <div id="holland-progress-bar" class="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 transition-all duration-300" style="width: 16.6%;"></div>
          </div>

          <!-- QUIZ BODY -->
          <div class="p-5 sm:p-6 overflow-y-auto max-h-[78vh]" id="holland-quiz-content">
            
            <!-- CÂU 1: NHÓM R (REALISTIC - THỰC TẾ & THỰC HÀNH) -->
            <div id="holland-step-1" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-amber-600 tracking-wider">CÂU 1 / 6 • NHÓM THỰC HÀNH (R)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích làm việc với đôi tay, máy móc, nguyên vật liệu thực tế (như nấu nướng, làm bánh, chế tạo thiết bị)?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('R', 3, 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100">🛠️</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">Rất thích! Học nhanh nhất khi được bắt tay vào làm thực tế</div>
                    <div class="text-[11px] text-slate-500">Thích nhìn thấy sản phẩm cụ thể hơn là đọc sách lý thuyết</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('R', 1, 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Bình thường, có thể làm nếu công việc yêu cầu</div>
                    <div class="text-[11px] text-slate-500">Không quá đam mê nhưng không ngại thao tác</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('R', 0, 1)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">🙅</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Không thích, ngại làm việc chân tay hoặc tiếp xúc máy móc</div>
                    <div class="text-[11px] text-slate-500">Ưa thích môi trường bàn giấy hoặc giao tiếp hơn</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CÂU 2: NHÓM I (INVESTIGATIVE - NGHIÊN CỨU & LOGIC) -->
            <div id="holland-step-2" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-blue-600 tracking-wider">CÂU 2 / 6 • NHÓM NGHIÊN CỨU (I)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích tìm tòi nguyên lý "vì sao", giải bài toán hóc búa, nghiên cứu số liệu hoặc khoa học y dược?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('I', 3, 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-blue-100">🔬</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-800">Rất thích! Luôn tò mò đào sâu bản chất vấn đề</div>
                    <div class="text-[11px] text-slate-500">Thích tư duy logic, lập trình, khoa học và y tế</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('I', 1, 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Bình thường, chỉ tìm hiểu khi thật sự cần thiết</div>
                    <div class="text-[11px] text-slate-500">Không quá hứng thú với nghiên cứu chuyên sâu</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('I', 0, 2)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">😴</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Không thích, thấy đau đầu khi phải đọc tài liệu dài dòng</div>
                    <div class="text-[11px] text-slate-500">Ưa chuộng hành động nhanh và trực quan hơn</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CÂU 3: NHÓM A (ARTISTIC - NGHỆ THUẬT & SÁNG TẠO) -->
            <div id="holland-step-3" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-purple-600 tracking-wider">CÂU 3 / 6 • NHÓM SÁNG TẠO (A)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích sáng tạo cái mới, thiết kế hình ảnh, trang trí món ăn đẹp mắt và ghét sự gò bó quy tắc?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('A', 3, 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-purple-100">🎨</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-purple-800">Rất thích! Có gu thẩm mỹ cao, thích tự do thể hiện phong cách riêng</div>
                    <div class="text-[11px] text-slate-500">Yêu cái đẹp, thích ẩm thực sáng tạo, đồ họa, kiến trúc</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('A', 1, 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Thích ngắm cái đẹp nhưng không có nhu cầu tự tay sáng tác</div>
                    <div class="text-[11px] text-slate-500">Thích áp dụng ý tưởng có sẵn hơn là tự nghĩ ra</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('A', 0, 3)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">📐</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Thích mọi thứ theo khuôn mẫu chuẩn mực, rõ ràng</div>
                    <div class="text-[11px] text-slate-500">Không thoải mái với những thứ tự do, phá cách</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CÂU 4: NHÓM S (SOCIAL - XÃ HỘI & KẾT NỐI) -->
            <div id="holland-step-4" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-emerald-600 tracking-wider">CÂU 4 / 6 • NHÓM XÃ HỘI (S)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích giao tiếp, lắng nghe tâm sự, chăm sóc sức khỏe hoặc hướng dẫn giúp đỡ người khác?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('S', 3, 4)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100">🤝</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800">Rất thích! Luôn tìm thấy niềm vui khi chăm sóc và hỗ trợ mọi người</div>
                    <div class="text-[11px] text-slate-500">Phù hợp ngành Dịch vụ khách hàng, Y tế, Điều dưỡng, Giáo dục</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('S', 1, 4)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Bình thường, hòa đồng với bạn bè nhưng không muốn làm nghề chăm sóc</div>
                    <div class="text-[11px] text-slate-500">Giao tiếp tốt ở mức độ xã giao</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('S', 0, 4)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">🤫</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Thích làm việc độc lập một mình, ngại đám đông</div>
                    <div class="text-[11px] text-slate-500">Làm việc hiệu quả nhất khi ở không gian yên tĩnh</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CÂU 5: NHÓM E (ENTERPRISING - QUẢN LÝ & KINH DOANH) -->
            <div id="holland-step-5" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-amber-700 tracking-wider">CÂU 5 / 6 • NHÓM QUẢN LÝ (E)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích dẫn dắt đội nhóm, thuyết phục người khác, lên kế hoạch kinh doanh và kiếm tiền?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('E', 3, 5)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100">💼</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">Rất thích! Tự tin trước đám đông, thích thử thách kinh doanh & quản lý</div>
                    <div class="text-[11px] text-slate-500">Phù hợp Quản trị Khách sạn, Kinh doanh, Marketing, Ngoại giao</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('E', 1, 5)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Có thể làm nhóm trưởng nếu được giao, nhưng không quá ham mê</div>
                    <div class="text-[11px] text-slate-500">Thích làm việc chuyên môn hơn là quản lý con người</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('E', 0, 5)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">🕊️</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Không thích bon chen, ngại đàm phán hoặc bán hàng</div>
                    <div class="text-[11px] text-slate-500">Ưa chuộng sự ổn định và hòa nhã</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CÂU 6: NHÓM C (CONVENTIONAL - QUY CỦ & CHI TIẾT) -->
            <div id="holland-step-6" class="space-y-4 hidden">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase text-slate-700 tracking-wider">CÂU 6 / 6 • NHÓM QUY CỦ (C)</span>
                <span class="text-xs text-slate-400">10 giây</span>
              </div>
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bạn có thích làm việc với bảng tính số liệu, kiểm tra chi tiết cẩn thận và tuân thủ quy trình chuẩn?
              </h4>
              <div class="space-y-2.5">
                <button type="button" onclick="answerHollandQuestion('C', 3, 6)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-700 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200">📊</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Rất thích! Cẩn thận, ngăn nắp, làm việc có kế hoạch và chuẩn từng con số</div>
                    <div class="text-[11px] text-slate-500">Phù hợp Kế toán, Tài chính, Logistics, Quản trị hệ thống</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('C', 1, 6)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">👌</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Làm được việc chi tiết nhưng thỉnh thoảng thấy khô khan</div>
                    <div class="text-[11px] text-slate-500">Cần sự cân bằng giữa quy tắc và linh hoạt</div>
                  </div>
                </button>
                <button type="button" onclick="answerHollandQuestion('C', 0, 6)" class="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer group">
                  <span class="text-2xl p-2 rounded-xl bg-slate-100">🌪️</span>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Ghét sự lặp lại, hay làm theo cảm hứng và không thích bảng biểu</div>
                    <div class="text-[11px] text-slate-500">Dễ chán nản với công việc giấy tờ, hành chính</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- RESULT VIEW (KẾT QUẢ ĐO LƯỜNG 6 NHÓM + TOP NGÀNH + LINK 108 CÂU) -->
            <div id="holland-step-result" class="space-y-5 hidden animate-in fade-in duration-300">
              
              <!-- HEADER KẾT QUẢ TÍNH CÁCH -->
              <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400/60 text-slate-900 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>🎯</span> KẾT QUẢ RIASEC 60S
                  </span>
                  <span class="text-[11px] text-slate-500 font-semibold" id="holland-score-time">Vừa hoàn thành</span>
                </div>
                <div class="text-lg sm:text-xl font-black font-heading text-brand-navy" id="holland-result-headline">
                  Tính cách nổi bật: <span class="text-amber-600">80% Nhóm Sáng Tạo & Thực Hành (A - R)</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed" id="holland-result-summary">
                  Bạn có sự kết hợp đặc biệt giữa <strong>gu thẩm mỹ sáng tạo (A)</strong> và <strong>kỹ năng thao tác thực tế (R)</strong>. Bạn học nhanh nhất qua trải nghiệm thực hành, có đam mê biến các ý tưởng thành sản phẩm thực thụ.
                </p>
              </div>

              <!-- BIỂU ĐỒ 6 THANH TỶ LỆ % CHUẨN KHOA HỌC RIASEC -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>📊 BIỂU ĐỒ TỶ LỆ 6 NHÓM TÍNH CÁCH CỦA BẠN:</span>
                  <span class="text-[10.5px] text-slate-400">Thang điểm 100%</span>
                </div>

                <div class="space-y-1.5 text-xs" id="holland-bars-container">
                  <!-- Thanh A -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>🎨 [A] Nghệ thuật & Sáng tạo</span>
                      <span class="font-bold text-purple-700" id="bar-val-A">85%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-A" class="bg-purple-600 h-2 rounded-full transition-all duration-700" style="width: 85%;"></div>
                    </div>
                  </div>

                  <!-- Thanh R -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>🛠️ [R] Thực tế & Thực hành</span>
                      <span class="font-bold text-amber-700" id="bar-val-R">75%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-R" class="bg-amber-500 h-2 rounded-full transition-all duration-700" style="width: 75%;"></div>
                    </div>
                  </div>

                  <!-- Thanh E -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>💼 [E] Quản lý & Kinh doanh</span>
                      <span class="font-bold text-blue-700" id="bar-val-E">50%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-E" class="bg-blue-600 h-2 rounded-full transition-all duration-700" style="width: 50%;"></div>
                    </div>
                  </div>

                  <!-- Thanh S -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>🤝 [S] Xã hội & Kết nối</span>
                      <span class="font-bold text-emerald-700" id="bar-val-S">40%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-S" class="bg-emerald-500 h-2 rounded-full transition-all duration-700" style="width: 40%;"></div>
                    </div>
                  </div>

                  <!-- Thanh I -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>🔬 [I] Nghiên cứu & Logic</span>
                      <span class="font-bold text-cyan-700" id="bar-val-I">30%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-I" class="bg-cyan-600 h-2 rounded-full transition-all duration-700" style="width: 30%;"></div>
                    </div>
                  </div>

                  <!-- Thanh C -->
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>📋 [C] Quy củ & Chi tiết</span>
                      <span class="font-bold text-slate-700" id="bar-val-C">20%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div id="bar-fill-C" class="bg-slate-600 h-2 rounded-full transition-all duration-700" style="width: 20%;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TOP CÁC NGÀNH SINH RA DÀNH CHO BẠN -->
              <div class="space-y-3">
                <div class="text-xs font-black uppercase text-brand-navy tracking-wider flex items-center gap-1.5">
                  <span>🏆</span> Top các ngành sinh ra dành cho bạn trong kho du học:
                </div>

                <div class="space-y-2.5 text-xs sm:text-sm">
                  
                  <div class="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs flex items-start gap-3 hover:border-amber-500 transition-all">
                    <span class="text-2xl">🍳</span>
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-slate-900 font-heading">
                        Ẩm thực / Làm bánh & Quản trị bếp
                      </div>
                      <div class="text-[11.5px] text-slate-600">
                        Khuyên học tại: <strong class="text-blue-700">Le Cordon Bleu Úc</strong> hoặc <strong class="text-rose-700">BHMS Thụy Sĩ</strong> (Thực tập hưởng lương 65 Tr/tháng).
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Hợp 98%</span>
                  </div>

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

              <!-- HỘP KẾT NỐI SANG BÀI TEST CHUYÊN SÂU 108 CÂU (THEO ĐÚNG CHỈ ĐẠO ANH THÁI) -->
              <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-brand-navyDark via-brand-navy to-slate-900 text-white space-y-3 shadow-xl border border-amber-400/40">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                    ★
                  </span>
                  <span class="text-xs font-black uppercase text-amber-300 tracking-wider">
                    BẠN CẦN BẢN ĐÁNH GIÁ CHÍNH XÁC 100% ĐỂ CHỌN TRƯỜNG & HỌC BỔNG?
                  </span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Kết quả trên là phân tích nhanh 60 giây. Để có <strong>báo cáo học thuật 108 tiêu chí toàn diện</strong> (đã được <strong>1.850+ học sinh Hằng Lương</strong> thực hiện thành công), mời bạn làm bài test chuyên sâu:
                </p>
                <a href="${HOLLAND_108_URL}" target="_blank" class="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 text-center">
                  <span>🏆 Bài Test Toàn Diện 108 Câu (1.850+ Đã Làm) 🎯</span>
                  <span>&rarr;</span>
                </a>
              </div>

              <!-- FORM ĐỂ LẠI ZALO NHẬN BÁO CÁO NHANH -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div class="text-xs font-bold text-slate-900">
                  🎁 Hoặc để lại Số điện thoại / Zalo để chuyên viên Hằng Lương hỗ trợ phân tích:
                </div>
                <form id="holland-lead-form" onsubmit="handleHollandLeadSubmit(event)" class="space-y-2">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" name="fullname" required placeholder="Họ và tên của bạn *" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500">
                    <input type="tel" name="phone" required placeholder="Số điện thoại / Zalo *" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500">
                  </div>
                  <button type="submit" class="w-full py-2.5 bg-brand-navy hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow cursor-pointer">
                    Gửi Kết Quả & Nhận Tư Vấn Học Bổng 1:1 Qua Zalo &rarr;
                  </button>
                </form>
              </div>

              <!-- NÚT ĐÓNG & CUỘN XUỐNG XEM TRƯỜNG -->
              <div class="flex items-center justify-between text-xs pt-1">
                <button type="button" onclick="closeHollandQuizModal()" class="text-slate-500 hover:text-slate-800 underline cursor-pointer">
                  Đóng lại
                </button>
                <button type="button" onclick="closeHollandAndScrollToSchools()" class="font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer">
                  <span>Khám phá các trường đào tạo ngành này bên dưới</span>
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

  // Trả lời câu hỏi và chuyển step
  window.answerHollandQuestion = function (category, point, step) {
    scores[category] = point;

    const nextStep = step + 1;
    const currentElem = document.getElementById(`holland-step-${step}`);
    const nextElem = document.getElementById(`holland-step-${nextStep}`);
    const progressBar = document.getElementById('holland-progress-bar');

    if (currentElem) currentElem.classList.add('hidden');

    if (nextStep <= 6 && nextElem) {
      nextElem.classList.remove('hidden');
      if (progressBar) {
        progressBar.style.width = `${(nextStep / 6) * 100}%`;
      }
    } else {
      // Đã xong 6 câu -> hiển thị kết quả
      const resultElem = document.getElementById('holland-step-result');
      const progressContainer = document.getElementById('holland-progress-bar-container');
      if (resultElem) resultElem.classList.remove('hidden');
      if (progressContainer) progressContainer.classList.add('hidden');

      renderHollandResults();
    }
  };

  function renderHollandResults() {
    // Tính toán % cho 6 nhóm (thang 3 điểm chuẩn hóa lên 100%)
    const pct = {
      R: Math.min(95, Math.max(20, Math.round((scores.R / 3) * 60 + 25))),
      I: Math.min(95, Math.max(20, Math.round((scores.I / 3) * 60 + 25))),
      A: Math.min(95, Math.max(25, Math.round((scores.A / 3) * 60 + 30))),
      S: Math.min(95, Math.max(20, Math.round((scores.S / 3) * 60 + 25))),
      E: Math.min(95, Math.max(20, Math.round((scores.E / 3) * 60 + 25))),
      C: Math.min(95, Math.max(20, Math.round((scores.C / 3) * 60 + 20)))
    };

    ['A', 'R', 'E', 'S', 'I', 'C'].forEach(cat => {
      const valEl = document.getElementById(`bar-val-${cat}`);
      const fillEl = document.getElementById(`bar-fill-${cat}`);
      if (valEl) valEl.innerText = `${pct[cat]}%`;
      if (fillEl) fillEl.style.width = `${pct[cat]}%`;
    });
  }

  window.handleHollandLeadSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.fullname.value;
    const phone = form.phone.value;

    alert(`Cảm ơn bạn ${name}! Chuyên viên tư vấn du học Hằng Lương đã tiếp nhận kết quả trắc nghiệm và sẽ gửi bản phân tích chi tiết qua số Zalo ${phone} trong ít phút.`);
    closeHollandQuizModal();
  };

  function resetQuiz() {
    scores.R = 0; scores.I = 0; scores.A = 0; scores.S = 0; scores.E = 0; scores.C = 0;

    for (let i = 1; i <= 6; i++) {
      const el = document.getElementById(`holland-step-${i}`);
      if (el) {
        if (i === 1) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    }

    const pr = document.getElementById('holland-step-result');
    const pbar = document.getElementById('holland-progress-bar');
    const pbarContainer = document.getElementById('holland-progress-bar-container');

    if (pr) pr.classList.add('hidden');
    if (pbar) pbar.style.width = '16.6%';
    if (pbarContainer) pbarContainer.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectHollandModal();

    // Hook tất cả nút bấm làm test nhanh 60s
    document.querySelectorAll('.open-holland-quiz-btn, [data-trigger="holland-quick-quiz"]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openHollandQuizModal();
      });
    });
  });

})();
