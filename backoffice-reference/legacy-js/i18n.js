"use strict";

const i18nData = {
    currentLanguage: null,
    selector: null,
    allowLanuages: { 'th-TH': 'th', 'en-EN': 'en' }
};

const initializeI18n = async (options = {}) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const i18nextOptions = {
        debug: false,
        fallbackLng: false,
        load: 'languageOnly',
        ...options
    }

    if (options.path) {
        i18nextOptions.initImmediate = false;
        i18nextOptions.backend = {
            loadPath: options.path
        }
    }

    if (urlParams.has('lang')) {
        const lang = urlParams.get('lang');
        if (Object.values(i18nData.allowLanuages).includes(lang)) {
            i18nextOptions.lng = Object.keys(i18nData.allowLanuages).find(k => i18nData.allowLanuages[k] === lang);
        };
    }

    const i18n = await i18next
        .use(window.i18nextBrowserLanguageDetector)
        .use(window.i18nextHttpBackend)
        .init(i18nextOptions);

    const selfLang = localStorage.getItem('self-language');

    if (selfLang && Object.values(i18nData.allowLanuages).includes(selfLang)) {
        await i18next.changeLanguage(selfLang);
    } else if (!(i18next.language in i18nData.allowLanuages)) {
        await i18next.changeLanguage('th');
    }

    i18nData.currentLanguage = i18nData.allowLanuages[i18next.language] || 'th';

    jqueryI18next.init(i18next, $, { useOptionsAttr: true });

    updateI18n();

    return i18n;
};

const updateI18n = () => {
    // ⚠️ table.js เรียกทุกครั้งที่ตารางโหลดเสร็จ — ถ้าเร็วกว่าไฟล์ภาษาจะยังไม่มี localize (เดิม throw แล้วข้าม tooltip)
    // ไม่เป็นไร: initializeI18n เรียกซ้ำเองหลังโหลดเสร็จ
    if (!$.fn.localize) return;


    i18nData.currentLanguage = i18next.language;

    $(document).localize();

    // ⚠️ select2 จำข้อความของ option ที่เลือกไว้ตั้งแต่ตอนสร้าง (ก่อนไฟล์ภาษาโหลดเสร็จ) — trigger change ไม่พอ
    // สร้างใหม่เฉพาะตัวที่ข้อความที่แสดงไม่ตรงกับ option แล้ว (ปกติเกิดครั้งเดียวหลังโหลดภาษา) · event ที่ผูกกับ <select> ยังอยู่
    if ($.fn.select2) {
        $('select.select2-hidden-accessible').each(function () {
            const $select = $(this);
            const instance = $select.data('select2');
            const option = this.options[this.selectedIndex];
            if (!instance || this.multiple || !option) return;

            const shown = $select.next('.select2').find('.select2-selection__rendered').text().trim();
            if (shown === option.text.trim()) return;

            const options = instance.options.options;
            $select.select2('destroy').select2(options);
        });
    }

    if (i18nData.selector) {
        const { int, toggler } = i18nData.selector;
        const data = int.getData();

        if (data) toggler.html(data.text);
    }

    //if (!i18next.language) return;

    //const translation = i18next.getDataByLanguage(i18next.language);
    //if (!translation) return;

    //const els = document.querySelectorAll('[data-i18n-const]');
    //for (const el of els) {
    //    const v = el.dataset.i18nConst;
    //    const _v = v.split(/[\[\]]/);
    //    const [key, name] = _v;

    //    const localization = i18next.t(key, { returnObjects: true });
    //    if (!localization) continue;

    //    console.log(localization);
    //}
}

const changeLanguageI18n = async lang => {
    await i18next.changeLanguage(lang);

    localStorage.setItem('self-language', lang);

    updateI18n();

    // ⚠️ หน้าที่สร้างข้อความด้วย JS ตอนโหลด (placeholder ของ select2, ชื่อเดือน ฯลฯ) — localize() ไม่ได้แตะ
    // โหลดหน้าใหม่ให้สคริปต์สร้างข้อความตามภาษาใหม่ (หน้า SMS ตั้งค่านี้)
    if (window.i18nReloadOnChange) window.location.reload();
}

/**
 * ข้อความใน JS ตามภาษาที่เลือก — ยังโหลดไฟล์ภาษาไม่เสร็จ/ไม่มีคีย์ = ใช้ข้อความไทยเดิม (fallback)
 * ⚠️ ข้อความที่สร้างตอนโหลดหน้า ต้องเรียกหลัง whenI18nReady ไม่งั้นได้ภาษาไทยเสมอ
 */
const i18nText = (key, fallback) =>
    (window.i18next && i18next.isInitialized && i18next.exists(key)) ? i18next.t(key) : fallback;

/** รอไฟล์ภาษาโหลดเสร็จก่อน แล้วค่อยรันสคริปต์ที่สร้างข้อความ (ไม่มี i18n = รันเลย) */
const whenI18nReady = fn => (window.i18nReady || Promise.resolve()).then(fn, fn);
