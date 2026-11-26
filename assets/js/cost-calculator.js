/**
 * Hằng Lương Edu - Smart Study Abroad Cost Calculator Engine
 * Công Cụ Tính Chi Phí Du Học Thông Minh & Bảng Dự Toán Cá Nhân Hóa
 * Dữ liệu cập nhật chuẩn theo quy định Lãnh sự & tỷ giá ngân hàng 2026
 */

(function () {
  'use strict';

  // 1. Comprehensive Database for 7 Key Study Abroad Destinations
  const STUDY_COST_DATA = {
    uc: {
      id: "uc",
      name: "Úc (Australia)",
      flag: "🇦🇺",
      currency: "AUD",
      exchangeRate: 16500, // 1 AUD = 16,500 VND
      visaFee: 1600, // AUD Subclass 500
      insuranceAnnual: 650, // OSHC AUD/năm
      flightEstimate: 650, // AUD (~10.7 triệu VNĐ)
      medicalCheck: 200, // AUD (~3.3 triệu VNĐ)
      livingExpensesAnnual: 29710, // AUD/năm (chuẩn Bộ Di Trú Úc)
      partTimeHourlyMin: 24.1, // AUD/giờ (lương tối thiểu Úc)
      partTimeAnnualEstimate: 18500, // AUD (~48h/2 tuần)
      housingShare: 14000, // Tiền thuê nhà/KTX
      foodShare: 8500, // Ăn uống
      transportShare: 3500, // Đi lại
      miscShare: 3710, // Điện thoại, sinh hoạt cá nhân
      schools: [
        { id: "monash", name: "Monash University (Group of Eight - Top 50)", tuitionCoeff: 1.15, maxScholarship: 100 },
        { id: "deakin", name: "Deakin University (Melbourne & Geelong)", tuitionCoeff: 0.95, maxScholarship: 50 },
        { id: "rmit", name: "RMIT University (Melbourne)", tuitionCoeff: 1.05, maxScholarship: 100 },
        { id: "adelaide", name: "University of Adelaide (Go8 Nam Úc)", tuitionCoeff: 1.1, maxScholarship: 50 },
        { id: "uts", name: "UTS - University of Technology Sydney", tuitionCoeff: 1.08, maxScholarship: 50 },
        { id: "wsy", name: "Western Sydney University (WSU)", tuitionCoeff: 0.88, maxScholarship: 50 },
        { id: "tafe", name: "Hệ thống TAFE NSW / TAFE QLD (Đào tạo nghề)", tuitionCoeff: 0.55, maxScholarship: 20 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Tiếng Anh Học Thuật (ELICOS 20-30 tuần)", baseTuition: 11000, durationYears: 0.5 },
        cao_dang: { id: "cao_dang", name: "Cao đẳng / Du học nghề (VET/Diploma 2 năm)", baseTuition: 16000, durationYears: 2 },
        dai_hoc: { id: "dai_hoc", name: "Đại học / Cử nhân (Bachelor 3-4 năm)", baseTuition: 36000, durationYears: 3 },
        thac_si: { id: "thac_si", name: "Thạc sĩ (Master 1.5 - 2 năm)", baseTuition: 39000, durationYears: 2 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, QTKD, Marketing & Tài chính", factor: 1.0 },
        cntt: { id: "cntt", name: "Công nghệ Thông tin, AI & Data Science", factor: 1.08 },
        khach_san: { id: "khach_san", name: "Quản trị Khách sạn, Du lịch & Ẩm thực", factor: 0.95 },
        y_duoc: { id: "y_duoc", name: "Y Dược, Điều dưỡng & Y Sinh", factor: 1.25 },
        ky_thuat: { id: "ky_thuat", name: "Kỹ thuật Xây dựng, Cơ khí & Kiến trúc", factor: 1.12 },
        truyen_thong: { id: "truyen_thong", name: "Truyền thông & Thiết kế Đồ họa", factor: 1.02 }
      }
    },
    canada: {
      id: "canada",
      name: "Canada",
      flag: "🇨🇦",
      currency: "CAD",
      exchangeRate: 18500, // 1 CAD = 18,500 VND
      visaFee: 235, // CAD (Study Permit 150 + Biometrics 85)
      insuranceAnnual: 850, // CAD (UHIP/Guard.me)
      flightEstimate: 1100, // CAD
      medicalCheck: 220, // CAD
      livingExpensesAnnual: 20635, // CAD/năm (chuẩn Lãnh sự 2024-2026)
      partTimeHourlyMin: 17.5,
      partTimeAnnualEstimate: 14500, // CAD
      housingShare: 10500,
      foodShare: 5500,
      transportShare: 2000,
      miscShare: 2635,
      schools: [
        { id: "fanshawe", name: "Fanshawe College (Ontario - Thực tập Co-op)", tuitionCoeff: 0.9, maxScholarship: 30 },
        { id: "georgebrown", name: "George Brown College (Trung tâm Toronto)", tuitionCoeff: 0.95, maxScholarship: 25 },
        { id: "seneca", name: "Seneca Polytechnic (Toronto)", tuitionCoeff: 0.92, maxScholarship: 25 },
        { id: "humber", name: "Humber College (Ontario)", tuitionCoeff: 0.94, maxScholarship: 30 },
        { id: "tru", name: "Thompson Rivers University (BC)", tuitionCoeff: 1.05, maxScholarship: 40 },
        { id: "brock", name: "Brock University (Ontario)", tuitionCoeff: 1.1, maxScholarship: 50 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Tiếng Anh ESL (4-8 tháng)", baseTuition: 8500, durationYears: 0.5 },
        cao_dang: { id: "cao_dang", name: "Cao đẳng Co-op (Diploma 2 năm)", baseTuition: 16500, durationYears: 2 },
        dai_hoc: { id: "dai_hoc", name: "Đại học / Cử nhân (Bachelor 4 năm)", baseTuition: 28000, durationYears: 4 },
        thac_si: { id: "thac_si", name: "Sau đại học / Post-Graduate (1-2 năm)", baseTuition: 19500, durationYears: 2 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, QTKD & Chuỗi Cung Ứng", factor: 1.0 },
        cntt: { id: "cntt", name: "Công nghệ Thông tin, Lập trình & An ninh Mạng", factor: 1.05 },
        khach_san: { id: "khach_san", name: "Quản trị Khách sạn & Ẩm thực Co-op", factor: 0.95 },
        y_duoc: { id: "y_duoc", name: "Chăm sóc Sức khỏe & Điều dưỡng", factor: 1.15 },
        ky_thuat: { id: "ky_thuat", name: "Kỹ thuật, Cơ khí & Tự động hóa", factor: 1.1 },
        truyen_thong: { id: "truyen_thong", name: "Thiết kế Đa phương tiện & Hoạt hình", factor: 1.0 }
      }
    },
    my: {
      id: "my",
      name: "Mỹ (USA)",
      flag: "🇺🇸",
      currency: "USD",
      exchangeRate: 25500, // 1 USD = 25,500 VND
      visaFee: 535, // USD (MRV $185 + SEVIS $350)
      insuranceAnnual: 1200, // USD
      flightEstimate: 800, // USD
      medicalCheck: 120, // USD
      livingExpensesAnnual: 15000, // USD/năm
      partTimeHourlyMin: 15.0,
      partTimeAnnualEstimate: 7500, // USD (On campus)
      housingShare: 8500,
      foodShare: 4000,
      transportShare: 1200,
      miscShare: 1300,
      schools: [
        { id: "asu", name: "Arizona State University (#1 Đổi Mới Sáng Tạo)", tuitionCoeff: 1.15, maxScholarship: 50 },
        { id: "usf", name: "University of South Florida (Top 100 Quốc Gia)", tuitionCoeff: 1.0, maxScholarship: 40 },
        { id: "sjsu", name: "San Jose State University (Thung Lũng Silicon)", tuitionCoeff: 1.05, maxScholarship: 30 },
        { id: "greenriver", name: "Green River College (Cao đẳng 2+2 Chuyển tiếp Top)", tuitionCoeff: 0.45, maxScholarship: 25 },
        { id: "seattle", name: "Seattle Colleges (Washington)", tuitionCoeff: 0.48, maxScholarship: 25 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Tiếng Anh Tăng Cường (IEP)", baseTuition: 8000, durationYears: 0.5 },
        cao_dang: { id: "cao_dang", name: "Cao đẳng Cộng đồng 2+2 (Associate Degree)", baseTuition: 11000, durationYears: 2 },
        dai_hoc: { id: "dai_hoc", name: "Đại học 4 năm (Bachelor's Degree)", baseTuition: 29000, durationYears: 4 },
        thac_si: { id: "thac_si", name: "Thạc sĩ (Master 1.5 - 2 năm)", baseTuition: 30000, durationYears: 2 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, Tài chính, QTKD & Marketing", factor: 1.0 },
        cntt: { id: "cntt", name: "Khoa học Máy tính, AI & Phần mềm (STEM)", factor: 1.1 },
        khach_san: { id: "khach_san", name: "Quản trị Khách sạn & Du lịch", factor: 0.95 },
        y_duoc: { id: "y_duoc", name: "Tiền Y Khoa (Pre-Med), Y Sinh", factor: 1.25 },
        ky_thuat: { id: "ky_thuat", name: "Kỹ thuật, Điện tử & Robotic (STEM)", factor: 1.15 },
        truyen_thong: { id: "truyen_thong", name: "Truyền thông & Nghệ thuật Thị giác", factor: 1.0 }
      }
    },
    thuy_si: {
      id: "thuy_si",
      name: "Thụy Sĩ (Switzerland)",
      flag: "🇨🇭",
      currency: "CHF",
      exchangeRate: 29000, // 1 CHF = 29,000 VND
      visaFee: 150, // CHF
      insuranceAnnual: 1200, // CHF
      flightEstimate: 700, // CHF
      medicalCheck: 100, // CHF
      livingExpensesAnnual: 3600, // CHF/năm (ĐÃ BAO GỒM KTX VÀ 3 BỮA ĂN TRỌN GÓI TRONG HỌC PHÍ, chỉ tiêu vặt!)
      partTimeHourlyMin: 22.0,
      partTimeAnnualEstimate: 14500, // CHF (Thực tập hưởng lương 2.359 - 2.500 CHF/tháng x 6 tháng!)
      housingShare: 0, // Đã bao gồm trong học phí
      foodShare: 0, // Đã bao gồm trong học phí
      transportShare: 1500,
      miscShare: 2100,
      schools: [
        { id: "bhms", name: "BHMS Lucerne (Top 12 Thế Giới - Cam kết Co-op)", tuitionCoeff: 1.0, maxScholarship: 50 },
        { id: "shms", name: "SHMS Swiss Hotel Management School (Lâu đài Caux)", tuitionCoeff: 1.18, maxScholarship: 30 },
        { id: "cesar", name: "César Ritz Colleges Switzerland", tuitionCoeff: 1.15, maxScholarship: 30 },
        { id: "caa", name: "Culinary Arts Academy (Học viện Ẩm thực số 1)", tuitionCoeff: 1.05, maxScholarship: 30 }
      ],
      levels: {
        cao_dang: { id: "cao_dang", name: "Cao đẳng Nâng cao Khách sạn (Diploma 1-2 năm)", baseTuition: 34000, durationYears: 2 },
        dai_hoc: { id: "dai_hoc", name: "Cử nhân Quản trị Khách sạn / Ẩm thực (3 năm)", baseTuition: 38000, durationYears: 3 },
        thac_si: { id: "thac_si", name: "Thạc sĩ Quản trị Khách sạn Quốc tế (1 năm)", baseTuition: 40000, durationYears: 1 }
      },
      majors: {
        khach_san: { id: "khach_san", name: "Quản trị Khách sạn, Resort & Sự kiện Quốc tế", factor: 1.0 },
        am_thuc: { id: "am_thuc", name: "Nghệ thuật Ẩm thực & Làm bánh Chuyên nghiệp (CAA)", factor: 1.02 },
        kinh_te: { id: "kinh_te", name: "Quản trị Kinh doanh Dịch vụ Cao cấp (Luxury)", factor: 1.05 }
      }
    },
    malaysia: {
      id: "malaysia",
      name: "Malaysia",
      flag: "🇲🇾",
      currency: "USD",
      exchangeRate: 25500, // 1 USD = 25,500 VND
      visaFee: 600, // USD (EMGS Visa Approval & Medical)
      insuranceAnnual: 150, // USD
      flightEstimate: 150, // USD (~3.8 triệu)
      medicalCheck: 80, // USD
      livingExpensesAnnual: 5000, // USD/năm (~127 triệu/năm, siêu tiết kiệm!)
      partTimeHourlyMin: 4.0,
      partTimeAnnualEstimate: 2000, // USD
      housingShare: 2600,
      foodShare: 1600,
      transportShare: 400,
      miscShare: 400,
      schools: [
        { id: "taylors", name: "Taylor's University (Top 1 ĐH Tư thục Đông Nam Á)", tuitionCoeff: 1.1, maxScholarship: 50 },
        { id: "sunway", name: "Sunway University (Bằng kép ĐH Lancaster Anh Quốc)", tuitionCoeff: 1.05, maxScholarship: 100 },
        { id: "apu", name: "Asia Pacific University (APU - Số 1 Công Nghệ & AI)", tuitionCoeff: 0.98, maxScholarship: 30 },
        { id: "inti", name: "INTI International University & Colleges", tuitionCoeff: 0.85, maxScholarship: 30 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Tiếng Anh Chuyên sâu (3-6 tháng)", baseTuition: 2800, durationYears: 0.5 },
        cao_dang: { id: "cao_dang", name: "Cao đẳng Chuyển tiếp (Diploma 2 năm)", baseTuition: 5800, durationYears: 2 },
        dai_hoc: { id: "dai_hoc", name: "Cử nhân (Bằng Anh/Úc cấp 3 năm)", baseTuition: 8800, durationYears: 3 },
        thac_si: { id: "thac_si", name: "Thạc sĩ (Bằng kép Anh Quốc 1-1.5 năm)", baseTuition: 10500, durationYears: 1.5 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, Tài chính, QTKD & Marketing", factor: 1.0 },
        cntt: { id: "cntt", name: "Công nghệ Thông tin, An ninh Mạng & AI", factor: 1.08 },
        khach_san: { id: "khach_san", name: "Quản trị Khách sạn & Ẩm thực Le Cordon Bleu", factor: 1.02 },
        ky_thuat: { id: "ky_thuat", name: "Kỹ thuật Cơ điện tử & Tự động hóa", factor: 1.05 },
        truyen_thong: { id: "truyen_thong", name: "Thiết kế Đồ họa & Game Design", factor: 1.0 }
      }
    },
    singapore: {
      id: "singapore",
      name: "Singapore",
      flag: "🇸🇬",
      currency: "SGD",
      exchangeRate: 19500, // 1 SGD = 19,500 VND
      visaFee: 180, // SGD (Student Pass)
      insuranceAnnual: 250, // SGD
      flightEstimate: 150, // SGD (~3.0 triệu)
      medicalCheck: 80, // SGD
      livingExpensesAnnual: 14000, // SGD/năm
      partTimeHourlyMin: 0, // Trường tư không cho phép làm thêm
      partTimeAnnualEstimate: 0,
      housingShare: 8000,
      foodShare: 4200,
      transportShare: 1000,
      miscShare: 800,
      schools: [
        { id: "sim", name: "SIM GE (Chuyển tiếp Buffalo Mỹ, RMIT, London)", tuitionCoeff: 1.05, maxScholarship: 100 },
        { id: "jcu", name: "James Cook University Singapore (Trường Công của Úc)", tuitionCoeff: 1.15, maxScholarship: 100 },
        { id: "curtin", name: "Curtin University Singapore", tuitionCoeff: 1.1, maxScholarship: 50 },
        { id: "kaplan", name: "Kaplan Singapore (Bằng ĐH Dublin, Murdoch)", tuitionCoeff: 0.95, maxScholarship: 30 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Tiếng Anh CAE (2-6 tháng)", baseTuition: 6000, durationYears: 0.5 },
        cao_dang: { id: "cao_dang", name: "Cao đẳng Nâng cao (Diploma 8-12 tháng)", baseTuition: 13500, durationYears: 1 },
        dai_hoc: { id: "dai_hoc", name: "Cử nhân (Bằng Anh/Úc rút ngắn 2-3 năm)", baseTuition: 22000, durationYears: 2.5 },
        thac_si: { id: "thac_si", name: "Thạc sĩ (Bằng ĐH Quốc tế 1 năm)", baseTuition: 26000, durationYears: 1 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, Tài chính, Fintech & Logistics", factor: 1.0 },
        cntt: { id: "cntt", name: "Khoa học Dữ liệu, Cybersecurity & AI", factor: 1.08 },
        khach_san: { id: "khach_san", name: "Quản trị Du lịch & Khách sạn Quốc tế", factor: 0.95 },
        y_duoc: { id: "y_duoc", name: "Tâm lý học & Khoa học Y Sinh", factor: 1.1 },
        truyen_thong: { id: "truyen_thong", name: "Truyền thông Đại chúng & Digital Media", factor: 1.0 }
      }
    },
    anh: {
      id: "anh",
      name: "Anh Quốc (UK)",
      flag: "🇬🇧",
      currency: "GBP",
      exchangeRate: 33000, // 1 GBP = 33,000 VND
      visaFee: 490, // GBP
      insuranceAnnual: 776, // GBP (IHS Health Surcharge)
      flightEstimate: 600, // GBP
      medicalCheck: 100, // GBP
      livingExpensesAnnual: 13500, // GBP/năm (ngoài London)
      partTimeHourlyMin: 11.44, // GBP/giờ
      partTimeAnnualEstimate: 8500, // GBP (~20h/tuần)
      housingShare: 7500,
      foodShare: 3500,
      transportShare: 1200,
      miscShare: 1300,
      schools: [
        { id: "leeds", name: "University of Leeds (Russell Group - Top 100)", tuitionCoeff: 1.2, maxScholarship: 50 },
        { id: "bristol", name: "University of Bristol (Russell Group)", tuitionCoeff: 1.25, maxScholarship: 50 },
        { id: "nottingham", name: "Nottingham Trent University (Học bổng cao)", tuitionCoeff: 0.95, maxScholarship: 50 },
        { id: "northampton", name: "University of Northampton (Học phí hợp lý)", tuitionCoeff: 0.85, maxScholarship: 30 }
      ],
      levels: {
        tieng_anh: { id: "tieng_anh", name: "Dự bị Đại học (Foundation 1 năm)", baseTuition: 15500, durationYears: 1 },
        dai_hoc: { id: "dai_hoc", name: "Cử nhân (Bachelor 3 năm)", baseTuition: 19500, durationYears: 3 },
        thac_si: { id: "thac_si", name: "Thạc sĩ (Master 1 năm duy nhất!)", baseTuition: 21500, durationYears: 1 }
      },
      majors: {
        kinh_te: { id: "kinh_te", name: "Kinh tế, Tài chính & Phân tích Kinh doanh", factor: 1.0 },
        cntt: { id: "cntt", name: "Khoa học Máy tính & AI", factor: 1.08 },
        khach_san: { id: "khach_san", name: "Quản trị Dịch vụ & Du lịch", factor: 0.95 },
        y_duoc: { id: "y_duoc", name: "Dược phẩm & Khoa học Sức khỏe", factor: 1.2 },
        ky_thuat: { id: "ky_thuat", name: "Kỹ thuật Xây dựng, Hàng không & Cơ khí", factor: 1.12 },
        truyen_thong: { id: "truyen_thong", name: "Truyền thông, Thời trang & Thiết kế", factor: 1.05 }
      }
    }
  };

  // 2. Formatting Helpers
  function formatNumber(num) {
    if (isNaN(num)) return "0";
    return Math.round(num).toLocaleString('vi-VN');
  }

  function formatCurrency(amount, currency) {
    return `${formatNumber(amount)} ${currency}`;
  }

  function formatVND(amountVND) {
    if (amountVND >= 1000000000) {
      const billions = (amountVND / 1000000000).toFixed(2);
      return `${billions} tỷ VNĐ`;
    }
    const millions = Math.round(amountVND / 1000000);
    return `${millions} triệu VNĐ`;
  }

  // 3. Populate Selects dynamically based on selected Country
  function updateCountryOptions(countryKey) {
    const countryData = STUDY_COST_DATA[countryKey] || STUDY_COST_DATA.uc;

    // A. Populate Levels (Bậc học)
    const levelSelect = document.getElementById("calc-level");
    if (levelSelect) {
      const currentLevel = levelSelect.value;
      levelSelect.innerHTML = "";
      Object.keys(countryData.levels).forEach((key) => {
        const lvl = countryData.levels[key];
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = lvl.name;
        if (key === currentLevel || (!currentLevel && key === "dai_hoc")) {
          opt.selected = true;
        }
      });
      if (!levelSelect.value) {
        levelSelect.selectedIndex = 0;
      }
    }

    // B. Populate Majors (Ngành học)
    const majorSelect = document.getElementById("calc-major");
    if (majorSelect) {
      const currentMajor = majorSelect.value;
      majorSelect.innerHTML = "";
      Object.keys(countryData.majors).forEach((key) => {
        const mjr = countryData.majors[key];
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = mjr.name;
        if (key === currentMajor || (!currentMajor && key === "kinh_te")) {
          opt.selected = true;
        }
      });
      if (!majorSelect.value) {
        majorSelect.selectedIndex = 0;
      }
    }

    // C. Populate Schools (Trường học đối tác)
    const schoolSelect = document.getElementById("calc-school");
    if (schoolSelect) {
      schoolSelect.innerHTML = "";
      countryData.schools.forEach((sch, index) => {
        const opt = document.createElement("option");
        opt.value = sch.id;
        opt.textContent = `${sch.name} (Học bổng đến ${sch.maxScholarship}%)`;
        if (index === 0) opt.selected = true;
        schoolSelect.appendChild(opt);
      });
    }

    // Update Currency labels across the UI
    document.querySelectorAll(".calc-currency-label").forEach((el) => {
      el.textContent = countryData.currency;
    });
    document.querySelectorAll(".calc-country-flag").forEach((el) => {
      el.textContent = countryData.flag;
    });
    document.querySelectorAll(".calc-country-name").forEach((el) => {
      el.textContent = countryData.name;
    });

    // Update exchange rate badge
    const rateBadge = document.getElementById("calc-exchange-rate-badge");
    if (rateBadge) {
      rateBadge.textContent = `Tỷ giá: 1 ${countryData.currency} = ${formatNumber(countryData.exchangeRate)} VNĐ`;
    }
  }

  // 4. Main Calculation Function
  function calculateStudyCost() {
    const countryEl = document.getElementById("calc-country");
    const levelEl = document.getElementById("calc-level");
    const majorEl = document.getElementById("calc-major");
    const schoolEl = document.getElementById("calc-school");
    const scholarshipEl = document.getElementById("calc-scholarship");
    const partTimeEl = document.getElementById("calc-parttime");

    if (!countryEl || !levelEl || !majorEl) return null;

    const countryKey = countryEl.value || "uc";
    const countryData = STUDY_COST_DATA[countryKey] || STUDY_COST_DATA.uc;

    const levelKey = levelEl.value || Object.keys(countryData.levels)[0];
    const levelData = countryData.levels[levelKey] || Object.values(countryData.levels)[0];

    const majorKey = majorEl.value || Object.keys(countryData.majors)[0];
    const majorData = countryData.majors[majorKey] || Object.values(countryData.majors)[0];

    const schoolKey = schoolEl ? schoolEl.value : "";
    const schoolData = countryData.schools.find((s) => s.id === schoolKey) || countryData.schools[0];

    const scholarshipPercent = scholarshipEl ? parseInt(scholarshipEl.value, 10) || 0 : 0;
    const includePartTime = partTimeEl ? partTimeEl.checked : true;

    // Formulas:
    // 1. Gross Tuition / year
    const schoolCoeff = schoolData ? schoolData.tuitionCoeff : 1.0;
    const majorFactor = majorData ? majorData.factor : 1.0;
    const tuitionGross = Math.round((levelData.baseTuition * majorFactor * schoolCoeff) / 100) * 100;

    // 2. Scholarship deduction
    const scholarshipAmount = Math.round(tuitionGross * (scholarshipPercent / 100));
    const tuitionNet = Math.max(0, tuitionGross - scholarshipAmount);

    // 3. Living Expenses / year
    const livingExpenses = countryData.livingExpensesAnnual;

    // 4. Initial one-off procedure costs (Visa + Insurance + Flight + Medical)
    const initialVisa = countryData.visaFee;
    const initialInsurance = countryData.insuranceAnnual;
    const initialFlight = countryData.flightEstimate;
    const initialMedical = countryData.medicalCheck;
    const initialCostsTotal = initialVisa + initialInsurance + initialFlight + initialMedical;

    // 5. Total year 1 budget required (Số tiền gia đình cần chuẩn bị năm 1)
    const year1TotalOriginal = tuitionNet + livingExpenses + initialCostsTotal;
    const year1TotalVND = year1TotalOriginal * countryData.exchangeRate;

    // Total gross without scholarship (để so sánh tiết kiệm được bao nhiêu)
    const year1GrossWithoutScholarship = tuitionGross + livingExpenses + initialCostsTotal;
    const scholarshipSavingVND = scholarshipAmount * countryData.exchangeRate;

    // 6. Part-time / Co-op Earnings
    const partTimeEarnings = includePartTime ? countryData.partTimeAnnualEstimate : 0;
    const partTimeEarningsVND = partTimeEarnings * countryData.exchangeRate;

    // 7. Net out-of-pocket spend after part-time
    const realSpendAfterWork = Math.max(0, year1TotalOriginal - partTimeEarnings);
    const realSpendAfterWorkVND = realSpendAfterWork * countryData.exchangeRate;

    // Percent shares for progress bar
    const tuitionPct = Math.round((tuitionNet / year1TotalOriginal) * 100) || 0;
    const livingPct = Math.round((livingExpenses / year1TotalOriginal) * 100) || 0;
    const initialPct = 100 - tuitionPct - livingPct;

    const result = {
      country: countryData,
      level: levelData,
      major: majorData,
      school: schoolData,
      scholarshipPercent,
      includePartTime,
      tuitionGross,
      scholarshipAmount,
      tuitionNet,
      livingExpenses,
      initialVisa,
      initialInsurance,
      initialFlight,
      initialMedical,
      initialCostsTotal,
      year1TotalOriginal,
      year1TotalVND,
      year1GrossWithoutScholarship,
      scholarshipSavingVND,
      partTimeEarnings,
      partTimeEarningsVND,
      realSpendAfterWork,
      realSpendAfterWorkVND,
      tuitionPct,
      livingPct,
      initialPct
    };

    // Render into DOM
    renderCostResults(result);
    return result;
  }

  // 5. Render to UI
  function renderCostResults(data) {
    const cur = data.country.currency;

    // --- A. TOP SUMMARY CARD ---
    const netTotalVNDEl = document.getElementById("res-net-total-vnd");
    const netTotalOrigEl = document.getElementById("res-net-total-original");
    const savingNoteEl = document.getElementById("res-saving-note");

    if (netTotalVNDEl) netTotalVNDEl.textContent = formatVND(data.year1TotalVND);
    if (netTotalOrigEl) netTotalOrigEl.textContent = `~ ${formatCurrency(data.year1TotalOriginal, cur)}`;

    if (savingNoteEl) {
      if (data.scholarshipPercent > 0) {
        savingNoteEl.innerHTML = `🎉 Nhờ học bổng <strong>${data.scholarshipPercent}%</strong>, gia đình tiết kiệm được <strong class="text-amber-300">${formatCurrency(data.scholarshipAmount, cur)} (~${formatVND(data.scholarshipSavingVND)})</strong>`;
        savingNoteEl.classList.remove("hidden");
      } else {
        savingNoteEl.innerHTML = `💡 Chưa áp dụng học bổng. <em>Liên hệ Hằng Lương để săn học bổng từ 20% - 100% giảm chi phí!</em>`;
        savingNoteEl.classList.remove("hidden");
      }
    }

    // Part-time real spend card
    const workNetVNDEl = document.getElementById("res-work-net-vnd");
    const workNetOrigEl = document.getElementById("res-work-net-original");
    const workIncomeEl = document.getElementById("res-work-income-note");

    if (workNetVNDEl) workNetVNDEl.textContent = formatVND(data.realSpendAfterWorkVND);
    if (workNetOrigEl) workNetOrigEl.textContent = `~ ${formatCurrency(data.realSpendAfterWork, cur)}`;
    if (workIncomeEl) {
      if (data.partTimeEarnings > 0) {
        workIncomeEl.innerHTML = `Đã trừ thu nhập làm thêm/thực tập hợp pháp dự kiến: <strong class="text-emerald-400">+${formatCurrency(data.partTimeEarnings, cur)} (~${formatVND(data.partTimeEarningsVND)})/năm</strong>`;
      } else {
        workIncomeEl.textContent = "Chưa tính thu nhập làm thêm ngoài giờ.";
      }
    }

    // --- B. DETAILED PERSONALIZED TABLE ROWS ---
    // Row 1: Tuition
    const rowTuitionGross = document.getElementById("tbl-tuition-gross");
    const rowTuitionScholarship = document.getElementById("tbl-tuition-scholarship");
    const rowTuitionNet = document.getElementById("tbl-tuition-net");
    const rowTuitionNetVND = document.getElementById("tbl-tuition-net-vnd");

    if (rowTuitionGross) rowTuitionGross.textContent = formatCurrency(data.tuitionGross, cur);
    if (rowTuitionScholarship) {
      if (data.scholarshipPercent > 0) {
        rowTuitionScholarship.textContent = `- ${formatCurrency(data.scholarshipAmount, cur)} (${data.scholarshipPercent}%)`;
        rowTuitionScholarship.parentElement.classList.remove("hidden");
      } else {
        rowTuitionScholarship.parentElement.classList.add("hidden");
      }
    }
    if (rowTuitionNet) rowTuitionNet.textContent = formatCurrency(data.tuitionNet, cur);
    if (rowTuitionNetVND) rowTuitionNetVND.textContent = `~ ${formatVND(data.tuitionNet * data.country.exchangeRate)}`;

    // Row 2: Living Costs
    const rowLivingTotal = document.getElementById("tbl-living-total");
    const rowLivingVND = document.getElementById("tbl-living-vnd");
    const rowLivingHousing = document.getElementById("tbl-living-housing");
    const rowLivingFood = document.getElementById("tbl-living-food");

    if (rowLivingTotal) rowLivingTotal.textContent = formatCurrency(data.livingExpenses, cur);
    if (rowLivingVND) rowLivingVND.textContent = `~ ${formatVND(data.livingExpenses * data.country.exchangeRate)}`;
    if (rowLivingHousing) rowLivingHousing.textContent = formatCurrency(data.country.housingShare, cur);
    if (rowLivingFood) rowLivingFood.textContent = formatCurrency(data.country.foodShare, cur);

    // Row 3: Initial Procedures
    const rowInitialVisa = document.getElementById("tbl-initial-visa");
    const rowInitialInsurance = document.getElementById("tbl-initial-insurance");
    const rowInitialFlight = document.getElementById("tbl-initial-flight");
    const rowInitialMedical = document.getElementById("tbl-initial-medical");
    const rowInitialTotal = document.getElementById("tbl-initial-total");
    const rowInitialVND = document.getElementById("tbl-initial-vnd");

    if (rowInitialVisa) rowInitialVisa.textContent = formatCurrency(data.initialVisa, cur);
    if (rowInitialInsurance) rowInitialInsurance.textContent = formatCurrency(data.initialInsurance, cur);
    if (rowInitialFlight) rowInitialFlight.textContent = formatCurrency(data.initialFlight, cur);
    if (rowInitialMedical) rowInitialMedical.textContent = formatCurrency(data.initialMedical, cur);
    if (rowInitialTotal) rowInitialTotal.textContent = formatCurrency(data.initialCostsTotal, cur);
    if (rowInitialVND) rowInitialVND.textContent = `~ ${formatVND(data.initialCostsTotal * data.country.exchangeRate)}`;

    // Row 4: Grand Total
    const rowGrandTotalOrig = document.getElementById("tbl-grand-total-orig");
    const rowGrandTotalVND = document.getElementById("tbl-grand-total-vnd");
    if (rowGrandTotalOrig) rowGrandTotalOrig.textContent = formatCurrency(data.year1TotalOriginal, cur);
    if (rowGrandTotalVND) rowGrandTotalVND.textContent = formatVND(data.year1TotalVND);

    // Row 5: Work offset
    const rowWorkOffsetOrig = document.getElementById("tbl-work-offset-orig");
    const rowWorkOffsetVND = document.getElementById("tbl-work-offset-vnd");
    if (rowWorkOffsetOrig) {
      rowWorkOffsetOrig.textContent = data.partTimeEarnings > 0 ? `- ${formatCurrency(data.partTimeEarnings, cur)}` : "0 " + cur;
    }
    if (rowWorkOffsetVND) {
      rowWorkOffsetVND.textContent = data.partTimeEarnings > 0 ? `- ${formatVND(data.partTimeEarningsVND)}` : "0 VNĐ";
    }

    // --- C. PROGRESS BARS ---
    const barTuition = document.getElementById("bar-tuition");
    const barLiving = document.getElementById("bar-living");
    const barInitial = document.getElementById("bar-initial");
    const txtBarTuition = document.getElementById("txt-bar-tuition");
    const txtBarLiving = document.getElementById("txt-bar-living");
    const txtBarInitial = document.getElementById("txt-bar-initial");

    if (barTuition) barTuition.style.width = `${data.tuitionPct}%`;
    if (barLiving) barLiving.style.width = `${data.livingPct}%`;
    if (barInitial) barInitial.style.width = `${data.initialPct}%`;

    if (txtBarTuition) txtBarTuition.textContent = `Học phí (${data.tuitionPct}%)`;
    if (txtBarLiving) txtBarLiving.textContent = `Sinh hoạt phí (${data.livingPct}%)`;
    if (txtBarInitial) txtBarInitial.textContent = `Thủ tục & Visa (${data.initialPct}%)`;

    // --- D. BADGE TARGET SUMMARY ---
    const targetPill = document.getElementById("calc-target-summary-pill");
    if (targetPill) {
      targetPill.textContent = `${data.country.flag} ${data.country.name} • ${data.school ? data.school.name : ""} • Bậc: ${data.level.name}`;
    }
  }

  // 6. Action: Open Pre-filled Consultation Modal
  window.openCostConsultModal = function () {
    const calcResult = calculateStudyCost();
    if (!calcResult) {
      if (typeof window.openConsultModal === 'function') {
        window.openConsultModal("Dự toán chi phí du học", "", false);
      }
      return;
    }

    const schoolTitle = calcResult.school ? calcResult.school.name : calcResult.country.name;
    const courseTitle = `${calcResult.level.name} - ${calcResult.major.name}`;
    const noteText = `[Dự Toán Tài Chính] Quốc gia: ${calcResult.country.name} | Trường: ${schoolTitle} | Học bổng: ${calcResult.scholarshipPercent}% | Dự toán năm 1: ~${formatVND(calcResult.year1TotalVND)} (${formatCurrency(calcResult.year1TotalOriginal, calcResult.country.currency)})`;

    if (typeof window.openConsultModal === 'function') {
      window.openConsultModal(schoolTitle, courseTitle, false);
      const noteInput = document.getElementById("consult-note");
      if (noteInput) {
        noteInput.value = noteText;
      }
    } else {
      alert(`Bản dự toán cá nhân hóa của bạn:\n${noteText}\n\nChuyên viên Hằng Lương sẽ liên hệ hỗ trợ bạn phương án chứng minh tài chính tiết kiệm nhất!`);
    }
  };

  // 7. Event Binding & Initialization
  function initCostCalculator() {
    const countryEl = document.getElementById("calc-country");
    if (!countryEl) return;

    // Listen to Country changes
    countryEl.addEventListener("change", function () {
      updateCountryOptions(this.value);
      calculateStudyCost();
    });

    // Listen to other controls
    const otherControls = [
      "calc-level",
      "calc-major",
      "calc-school",
      "calc-scholarship",
      "calc-parttime"
    ];

    otherControls.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", calculateStudyCost);
        if (el.tagName === "INPUT" && el.type === "range") {
          el.addEventListener("input", function () {
            const valLabel = document.getElementById("calc-scholarship-val");
            if (valLabel) valLabel.textContent = `${this.value}%`;
            calculateStudyCost();
          });
        }
      }
    });

    // Scholarship quick pill buttons
    document.querySelectorAll(".calc-scholarship-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const val = this.getAttribute("data-scholarship-val") || "0";
        const slider = document.getElementById("calc-scholarship");
        if (slider) {
          slider.value = val;
        }
        const valLabel = document.getElementById("calc-scholarship-val");
        if (valLabel) valLabel.textContent = `${val}%`;

        document.querySelectorAll(".calc-scholarship-btn").forEach((b) => {
          b.classList.remove("bg-brand-navy", "text-white", "border-brand-navy");
          b.classList.add("bg-white", "text-slate-700", "border-slate-300");
        });
        this.classList.remove("bg-white", "text-slate-700", "border-slate-300");
        this.classList.add("bg-brand-navy", "text-white", "border-brand-navy");

        calculateStudyCost();
      });
    });

    // Initial setup with default country (Úc)
    updateCountryOptions(countryEl.value || "uc");
    calculateStudyCost();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCostCalculator);
  } else {
    initCostCalculator();
  }

  // Expose global methods
  window.calculateStudyCost = calculateStudyCost;
  window.updateCountryOptions = updateCountryOptions;
  window.STUDY_COST_DATA = STUDY_COST_DATA;
})();
