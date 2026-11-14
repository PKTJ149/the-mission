
class Helper {

    static simpleLoadingIcon = `<i class='icon-loading fa fa-spin fa-spinner me-1' style="display: none;"></i>`;

    static debounce(callback, delay) {
        return (() => {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => callback(), delay);
        })();
    }

    static copyTextToClipboard(text) {
        return navigator.clipboard.writeText(text);
    }

    static htmlEntities() {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    static classNames(...a) {
        const r = [];
        for (const b of a) {
            if (typeof b === 'object') {
                if (b !== null)
                    for (const c in b)
                        if (b[c]) r.push(c);
            }
            else if (b) r.push(b.toString());
        }
        return r.join(' ');
    }

    static numberFormat(number, plus = false, def = '-') {
        const n = parseFloat(number);
        return isNaN(n) ? def : (plus && n > 0 ? '+' : '') + n.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    static formatAccountNo(no, def = '-') {
        if (!no) return def;
        if (no.length === 10) {
            return `${no.slice(0, 3)}-${no.slice(3, 4)}-${no.slice(4, 9)}-${no.slice(9)}`;
        }

        if (no.length === 12) {
            return `${no.slice(0, 3)}-${no.slice(3, 4)}-${no.slice(4, 8)}-${no.slice(8)}`;
        }
    }

    static formatMobileNo(no, def = '-') {
        if (!no) return def;
        return `${no.slice(0, 3)}-${no.slice(3, 6)}-${no.slice(6)}`;
    }

    static async attachLoading(target, callback) {
        const $target = $(target);

        $target.each(function () {
            let icon = this.querySelector('.icon-loading');
            if (!icon) {
                this.insertAdjacentHTML('afterbegin', Helper.simpleLoadingIcon);
                icon = this.querySelector('.icon-loading');
            }

            icon.style.display = 'inline-block';
            this.style.pointerEvents = 'none';
        });

        const result = await callback();

        $target.each(function () {
            const icon = this.querySelector('.icon-loading');

            if (icon) icon.style.display = 'none';
            this.style.pointerEvents = '';
        });

        return result;
    }

    static isScrollable = function (elem) {
        // Compare the height to see if the element has scrollable content
        const hasScrollableContent = elem.scrollHeight > elem.clientHeight;

        // It's not enough because the element's `overflow-y` style can be set as
        // * `hidden`
        // * `hidden !important`
        // In those cases, the scrollbar isn't shown
        const overflowYStyle = window.getComputedStyle(elem).overflowY;
        const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

        return hasScrollableContent && !isOverflowHidden;
    };

    static selectOne(input) {
        if (input instanceof HTMLElement) return input;
        else if (input instanceof CustomDropdown) return input.fakeElem;
        else if (input instanceof window.jQuery) return input.get(0);
        else if (typeof input === 'string') return document.querySelector(input);
        return null;
    }

    static selectMany(inputs) {
        if (inputs instanceof window.jQuery) return Array.from(inputs);
        else if (typeof inputs === 'string') return Array.from(document.querySelectorAll(inputs));
        return [];
    }

    static isDate(d) {
        return (d instanceof Date && !isNaN(d));
    }

    static equalDateBkk(d1, d2) {
        if (!this.isDate(d1) || !this.isDate(d2)) return false;
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    }

    static toDateBkk(d) {
        return (d instanceof Date && !isNaN(d)) ? d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0') : null;
    }

}
const H = Helper;

class Semaphore {
    
    constructor(maxConcurrentRequests = 1, autoRelease = false) {
        this.currentRequests = [];
        this.runningRequests = 0;
        this.completeRequests = 0;
        this.maxConcurrentRequests = maxConcurrentRequests;
        this.autoRelease = autoRelease;
    }

    call(callback, ...args) {
        return new Promise((resolve, reject) => {
            this.currentRequests.push({
                resolve,
                reject,
                callback,
                args,
            });
            this.next();
        });
    }

    next() {
        if (!this.currentRequests.length) {
            return;

        } else if (this.runningRequests < this.maxConcurrentRequests) {
            const { resolve, reject, callback, args } = this.currentRequests.shift();
            this.runningRequests++;

            try {
                callback(...args)
                    .then(resp => resolve(resp))
                    .catch(err => reject(err))
                    .finally(() => {
                        this.completeRequests++;
                        if (this.autoRelease) this.release();
                        else this.next();
                    });
            } catch (exp) {
                reject(exp);
                this.completeRequests++;
                if (this.autoRelease) this.release();
                else this.next();
            }
        }
    }

    cancel(index = -1) {
        if (index > -1) {
            if (index in this.currentRequests) {
                this.currentRequests.splice(index, 1);
            }
        } else this.currentRequests = [];
    }

    release() {
        this.runningRequests -= this.completeRequests;
        this.completeRequests = 0;
        this.next();
    }
}

class YupSchema {
    constructor() {
        this.schema = [];
    }

    validate(value) {
        let result = true, err;
        for (const [_, a, b, c] of this.schema) {
            if (Array.isArray(a)) {
                if (!b(value, ...a)) {
                    result = false;
                    err = String(c);
                    break;
                }
            } else if (!a(value)) {
                result = false;
                err = String(b);
                break;
            }
        }

        return [result, err];
    }

    oneOf(items, err = null) {
        this.schema.push(['oneOf', (v) => items.includes(v), err ?? 'ต้องประกอบไปด้วย ' + items.join('|')]);
        return this;
    }

    notOneOf(items, err = null) {
        this.schema.push(['notOneOf', (v) => !items.includes(v), err ?? 'ต้องไม่ประกอบไปด้วย ' + items.join('|')]);
        return this;
    }
}

class YupString extends YupSchema {
    required(err = 'โปรดกรอกข้อมูล') {
        this.schema.push(['required', (v) => (v !== '' && v != null), err]);
        return this;
    }
    default(def = false) {
        this.schema.push(['default', () => (v !== '' && v != null) ? v : def]);
        return this;
    }
    digit(err = 'ต้องประกอบด้วยตัวเลข 0-9 เท่านั้น') {
        this.schema.push(['digit', (v) => (/\d+/g).test(v), err]);
        return this;
    }
    nullable(err = null) {
        this.schema.push(['nullable', (v) => (v !== ''), err]);
        return this;
    }
}

class YupBoolean extends YupSchema {
    required(err = 'โปรดกรอกข้อมูล') {
        this.schema.push(['required', (v) => (typeof v === "boolean"), err]);
        return this;
    }
    default(def = false) {
        this.schema.push(['default', (v) => (typeof v === "boolean") ? v : def]);
        return this;
    }
    nullable(err = null) {
        this.schema.push(['nullable', (v) => (typeof v === "boolean" || v === null), err]);
        return this;
    }
}

class YupNumber extends YupSchema {
    integer(err = 'ตัองเป็นจำนวนเต็มเท่านั้น') {
        this.schema.push(['integer', (v) => {
            const n = parseInt(v);
            return !isNaN(n)
        }, err]);
        return this;
    }
    positive(err = 'ตัองเป็นจำนวนบวกเท่านั้น') {
        this.schema.push(['positive', (v) => {
            const n = Number(v);
            return !isNaN(n) && n > 0
        }, err]);
        return this;
    }
    negative(err = 'ตัองเป็นจำนวนลบเท่านั้น') {
        this.schema.push(['negative', (v) => {
            const n = Number(v);
            return !isNaN(n) && n < 0
        }, err]);
        return this;
    }
    min(min, err = null) {
        this.schema.push(['min', [min], (v, min) => {
            const n = Number(v);
            return !isNaN(n) && n > min
        }, err ?? 'ต้องเป็นจำนวนที่มีค่ามากกว่า ' + min]);
        return this;
    }
    max(max, err = null) {
        this.schema.push(['max', [max], (v, min) => {
            const n = Number(v);
            return !isNaN(n) && n < max
        }, err ?? 'ต้องเป็นจำนวนที่มีค่าน้อยกว่า ' + max]);
        return this;
    }
    required(err = 'โปรดกรอกข้อมูล') {
        this.schema.push(['required', (v) => {
            const n = Number(v);
            return v !== '' && v != null && !isNaN(n)
        }, err]);
        return this;
    }
}

const yup = {
    string() {
        return new YupString();
    },
    number() {
        return new YupNumber();
    },
    bool() {
        return new YupBoolean();
    }
};



class Form {

    static writableKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter', 'Tab'];
    static commandKeys = ['Shift', 'Control', 'Alt', 'Backspace'];
    static defaultKeys = ['Shift', 'Control', 'Alt', 'Backspace', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter', 'Tab'];
    static thaiKeys = /[\u0E00-\u0E7F]/;
    static englishKeys = /[A-Za-z]/;
    static phone = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static number = ['-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static cleaveOptions = {
        bankAccountNo: { blocks: [3, 1, 5, 1, 2], uppercase: false },
        mobileNo: { blocks: [3, 3, 4], uppercase: false },
        numberFormat: { numeral: true, numeralThousandsGroupStyle: 'thousand' }
    }

    static inputKey = {
        'numberPositive': [...this.defaultKeys, ...this.phone, '.'],
        'numberNegative': [...this.defaultKeys, ...this.phone, '.', '-'],
        'integerPositive': [...this.defaultKeys, ...this.phone],
        'integerNegative': [...this.defaultKeys, ...this.phone, '-'],
        'thai': {
            keys: [...this.defaultKeys],
            regex: [this.thaiKeys]
        },
        'english': {
            keys: [...this.defaultKeys],
            regex: [this.englishKeys]
        }
    }

    static getInputOrInstance(input) {
        if (input instanceof HTMLElement) return input;
        else if (input instanceof CustomDropdown) return input;
        else if (input instanceof window.jQuery) return input.get(0);
        else if (typeof input === 'string') return document.querySelector(input);
        return null;
    }

    static inputAcceptKey(event, keys) {
        if (typeof keys === 'string' && keys in this.inputKey) {
            const key = this.inputKey[keys];
            if (Array.isArray(key)) {
                if (!this.inputKey[keys].includes(event.key) && !event.ctrlKey) {
                    event.preventDefault();
                    return false;
                }
            } else {
                const { keys, regex } = key;
                const prv = regex.some(re => !re.test(event.key));
                if (!keys.includes(event.key) && prv && !event.ctrlKey) {
                    event.preventDefault();
                    return false;
                }
            }
        } else if (Array.isArray(keys) && keys.includes(event.key)) {
            event.preventDefault();
            return false;
        }

        return true;
    }

    static cleanCleave(value) {
        return String(value).replace(/[- ]/g, '');
    }

    static checkSingleFileRequired(files) {
        return (files && files.length > 0 && files[0] instanceof File);
    }

    static checkSingleFileType(files, types) {
        if (!this.checkSingleFileRequired(files)) return;
        return types.includes(files[0].type);
    }

    static checkSingleFileSize(files, size) {
        if (!this.checkSingleFileRequired(files)) return;
        return files[0].size <= size;
    }

    static inputValidation = new Map([
        ['required', (value) => {
            return value !== '' && value != null;
        }],
        ['requiredNumber', (value) => {
            return value !== '' && value != null && !isNaN(Number(value));
        }],
        ['requiredNumberPositive', (value) => {
            const n = Number(value);
            return value !== '' && value != null && !isNaN(n) && n > 0;
        }]
    ]);

    static inputValidationText = new Map([
        ['required', 'โปรดกรอกข้อมูล'],
        ['requiredNumber', 'โปรดกรอกข้อมูล'],
        ['requiredNumberPositive', 'โปรดกรอกข้อมูลตัวเลขและต้องมีค่ามากกว่า 0'],
    ]);

    static checkInput(value, checkType, ...args) {
        return this.inputValidation.has(checkType) ? this.inputValidation.get(checkType)(value, ...args) : false;
    }

    static clearError(input) {
        let _input = null, _root = null;

        if (input instanceof HTMLElement) {
            _input = input;
        } else if (input instanceof window.jQuery && input.length > 0) {
            _input = input.get(0);
        } else if (input instanceof CustomDropdown) {
            _root = input.wrapper;
            _input = input.fakeElem;
        } else if (typeof input === 'string') {
            _input = document.querySelector(input);
        }

        if (!_root) {
            const middle = _input.closest('.custom-input-middle');
            if (middle) {
                _root = middle
            } else if (_input.classList.contains('custom-input')) {
                _root = _input;
            } else {
                _root = _input.closest('.custom-input');
            }
        }

        if (!_root) return false;
        const elInvalid = _root.querySelector('.invalid-feedback');

        if (elInvalid) {
            _root.classList.remove('custom-invalid');
            elInvalid.textContent = '';
        }
    }

    static clearInputWithError(input, value = '', withOption = { invalid: true }) {
        let _input = null, _root = null;

        if (input instanceof HTMLElement) {
            _input = input;
            _input.value = value;
        } else if (input instanceof window.jQuery && input.length > 0) {
            _input = input.get(0);
            _input.value = value;
        } else if (input instanceof CustomDropdown) {
            _root = input.wrapper;
            _input = input.fakeElem;
            if (value === '') input.clearValue();
            else input.setValue(value);
        } else if (typeof input === 'string') {
            _input = document.querySelector(input);
            _input.value = value;
        }

        if (!_root) {
            const middle = _input.closest('.custom-input-middle');
            if (middle) {
                _root = middle
            } else if (_input.classList.contains('custom-input')) {
                _root = _input;
            } else {
                _root = _input.closest('.custom-input');
            }
        }

        if (withOption.invalid) {
            if (!_root) return false;

            const invalid = withOption.invalid;
            let elInvalid = null;

            if (invalid instanceof HTMLElement) elInvalid = invalid;
            else if (typeof invalid === 'string') elInvalid = document.querySelector(invalid);
            else elInvalid = _root.querySelector('.invalid-feedback');

            if (elInvalid) {
                _root.classList.remove('custom-invalid');
                elInvalid.textContent = '';
            }
        }
    }

    static checkInputWithError(input, value, checkType, withOption = {}, ...args) {
        const result = this.checkInput(value, checkType, ...args);

        let _input = null, _root = null;
        if (input instanceof HTMLElement) {
            _input = input;
        } else if (input instanceof CustomDropdown) {
            _input = input.fakeElem;
            _root = input.wrapper;
        } else if (input instanceof window.jQuery && input.length > 0) {
            _input = input.get(0);
        } else if (typeof input === 'string') {
            _input = document.querySelector(input);
        }

        if (!_root) {
            const middle = _input.closest('.custom-input-middle');
            if (middle) {
                _root = middle
            } else if (_input.classList.contains('custom-input')) {
                _root = _input;
            } else {
                _root = _input.closest('.custom-input');
            }
        }

        if (withOption.invalid) {
            if (!_root) return false;

            const invalid = withOption.invalid;
            let elInvalid = null;

            if (invalid instanceof HTMLElement) elInvalid = invalid;
            else if (typeof invalid === 'string') elInvalid = document.querySelector(invalid);
            else elInvalid = _root.querySelector('.invalid-feedback');

            if (elInvalid) {
                if (result) {
                    _root.classList.remove('custom-invalid');
                    elInvalid.textContent = '';
                } else {
                    const _txt = withOption.invalidText || this.inputValidationText.get(checkType) || '';

                    _root.classList.add('custom-invalid');
                    elInvalid.textContent = _txt;
                }
            }
        }

        return result;
    }

    static setInputWithError = (input, error, valid = false) => {
        let _input = null, _root = null;
        if (input instanceof HTMLElement) {
            _input = input;
        } else if (input instanceof CustomDropdown) {
            _input = input.fakeElem;
            _root = input.wrapper;
        } else if (input instanceof window.jQuery && input.length > 0) {
            _input = input.get(0);
        } else if (typeof input === 'string') {
            _input = document.querySelector(input);
        }

        if (!_root) {
            const middle = _input.closest('.custom-input-middle');
            if (middle) {
                _root = middle
            } else if (_input.classList.contains('custom-input')) {
                _root = _input;
            } else {
                _root = _input.closest('.custom-input');
            }
        }

        if (!_root) return;

        const feedback = _root.querySelector('.invalid-feedback');

        if (valid) {
            _root.classList.remove('custom-invalid');
            feedback.textContent = '';
        } else {
            _root.classList.add('custom-invalid');
            feedback.textContent = error;
        }
    }

    static checkRequired(input, text = null) {
        const $input = $(input);
        const wrapper = $input.closest('.custom-input');
        const feedback = wrapper.find('.invalid-feedback');
        const value = $input.val().trim();

        if (!value) {
            wrapper.addClass('custom-invalid');
            feedback.text(text ?? 'โปรดกรอกข้อมูลให้ครบถ้วน');
            return false;
        } else {
            wrapper.removeClass('custom-invalid');
            feedback.text('');
            return true;
        }
    };

    static checkRequired(input, text = null) {
        const $input = $(input);
        const wrapper = $input.closest('.custom-input');
        const feedback = wrapper.find('.invalid-feedback');
        const value = $input.val().trim();

        if (!value) {
            wrapper.addClass('custom-invalid');
            feedback.text(text ?? 'โปรดกรอกข้อมูลให้ครบถ้วน');
            return false;
        } else {
            wrapper.removeClass('custom-invalid');
            feedback.text('');
            return true;
        }
    };

}



class FormValidator {

    constructor(names, schema = {}, options) {
        this.names = names;
        this.schema = schema;
        this.options = Object.assign({
            mode: 'manual',
            autoFocus: true
        }, options);

        this.fhandleValidator = this.handleValidator.bind(this);

        this.updateState();
    }

    handleValidator(field) {
        const { debounce } = this.options;
        if (debounce) Helper.debounce(() => this.validate(field), debounce);
        else this.validate(field);
    }

    updateState() {
        const { mode } = this.options;
        if (mode === 'onChange') {
            for (const name in this.names) {
                const input = Form.getInputOrInstance(this.names[name]);
                if (input instanceof HTMLElement) {
                    const type = input.getAttribute('type');
                    if (type === 'checkbox' || type === 'radio') {
                        input.addEventListener('change', () => this.fhandleValidator(name));
                    } else {
                        input.addEventListener('input', () => this.fhandleValidator(name));
                    }
                } else if (input instanceof CustomDropdown) {
                    const fs = input.getOption('onSelect');
                    input.setOptions({
                        onSelect: (...args) => {
                            this.fhandleValidator(name);
                            if (fs) fs(...args);
                        }
                    });
                }
            }
        }
    }

    validate(field) {
        const { autoFocus, mapValue } = this.options;
        let result = true, focus;

        for (const [name, schema] of Object.entries(this.schema)) {
            if (field && name !== field) continue;

            const input = Form.getInputOrInstance(this.names[name]);

            let value = null;
            if (input instanceof HTMLElement) {
                const type = input.getAttribute('type');

                if (type === 'checkbox') value = input.checked;
                else value = input.value;
            } else if (input instanceof CustomDropdown) {
                value = input.getValue();
            }

            if (mapValue instanceof Object && name in mapValue) {
                value = mapValue[name](value, input);
            }

            const [r, err] = schema.validate(value);

            result = r;

            if (result) {
                Form.clearError(input);
            } else {
                if (autoFocus) focus = input;
                Form.setInputWithError(input, err);
            }
        }

        if (focus) focus?.focus();

        return result;
    }
}



class Random {
    static characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    static numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    static specials = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '_', '-', '+', '=']

    static nextNumber(min = 0, max = 1) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static fillZero(number) {
        return (number < 10 && number >= 0) ? '0' + number : number.toString();
    }

    static nextDate() {
        return `${this.fillZero(this.nextNumber(0, 23))}/${this.fillZero(this.nextNumber(0, 59))}/${this.nextNumber(1970, 2022)}`;
    }

    static nextBool() {
        return Math.random() < 0.5;
    }

    static nextCustom(length, ...chars) {
        const characters = chars.flat();
        let accumulator = '';
        for (let index = 0; index < length; index++) {
            const i = Math.floor(Math.random() * characters.length);
            accumulator += characters[i];
        }
        return accumulator;
    }
}



class CustomInput {

    static clearValue(navigate) {
        const wrapper = navigate.closest('.custom-input');
        if (wrapper) {
            const input = wrapper.querySelector('input');
            if (input) input.value = '';
        }
    }

}



class CustomTooltip {

    static defaultSuggestPlacement = ['top', 'bottom', 'left', 'right'];
    static popperPlacement = [
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end'
    ];
    static tooltipKey = '__initTooltip__';

    static initBootstrap() {
        const tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipInstances = tooltips.map(tooltip => {
            const instance = bootstrap.Tooltip.getOrCreateInstance(tooltip, {
                customClass: 'custom-tooltip',
                animation: false,
                trigger: 'hover',
                offset: '0,4'
            });

            return instance;
        });

        return tooltipInstances;
    }

    static initCustom() {
        const tooltips = Array.from(document.querySelectorAll('[data-tooltip]'));
        for (const tooltip of tooltips) {
            this.updateTooltip(tooltip);
        }
    }

    static updateTooltip(tooltip) {
        const _tooltip = bootstrap.Tooltip.getOrCreateInstance(tooltip);
        const data = tooltip.dataset;
        const html = data.tooltipHtml;
        const text = data.tooltipText;
        let placement = 'bottom', strategy = 'absolute', classes = 'custom-tooltip', offset = '0,4';

        if (data.tooltipArrow === 'false') {
            classes += ' hide-arrow';
        }

        if (data.tooltipPlacement) placement = data.tooltipPlacement;
        if (data.tooltipStrategy) strategy = data.tooltipStrategy;
        if (data.tooltipOffset) offset = data.tooltipOffset;
        if (data.tooltipClass) classes += (' ' + data.tooltipClass);

        Object.assign(_tooltip._config, {
            html: Boolean(html),
            title: html || text,
            customClass: classes,
            trigger: 'hover',
            animation: false,
            offset,
            popperConfig: { placement, strategy }
        });

        if (data.tooltipDisable === 'true') {
            _tooltip.disable();
        } else _tooltip.enable();

        _tooltip.update();
    }

    static getTooltipInstance(tooltip) {
        return bootstrap.Tooltip.getInstance(tooltip);
    }

}



// @ Dropdown Plugins

class ButtonRefreshPlugin {

    static htmlAutoRefreshIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99993 0.333252C7.9729 0.333252 9.56489 0.519944 10.9979 1.53799C10.949 1.36077 10.9173 1.24575 10.9173 1.24575L11.9215 0.968901C11.9215 0.968901 12.5179 3.13212 12.5234 3.15215C12.5903 3.3954 12.4733 3.65162 12.2456 3.76032C12.0179 3.86897 11.7451 3.79889 11.598 3.59386C10.213 1.66319 8.12271 1.37491 6.99993 1.37491C3.8458 1.37491 1.37506 3.84563 1.37506 6.99979C1.37506 8.79311 2.07597 10.3611 3.34869 11.415C3.57026 11.5984 3.60114 11.9267 3.41768 12.1483C3.23424 12.3698 2.90591 12.4007 2.68437 12.2173C1.89742 11.5657 1.29394 10.7554 0.890658 9.80887C0.520894 8.94095 0.333395 7.99585 0.333395 6.99979C0.333421 3.26155 3.26169 0.333252 6.99993 0.333252Z" />
        <path d="M10.6459 6.99982C10.6459 4.98952 9.01037 3.354 7.00007 3.354C4.98976 3.354 3.35425 4.98952 3.35425 6.99982C3.35425 9.01013 4.98976 10.6456 7.00007 10.6456C9.01037 10.6456 10.6459 9.01013 10.6459 6.99982ZM7.00007 9.60398C5.56414 9.60398 4.39591 8.43576 4.39591 6.99982C4.39591 5.56389 5.56414 4.39567 7.00007 4.39567C8.43603 4.39567 9.60422 5.56389 9.60422 6.99982C9.60422 8.43576 8.43603 9.60398 7.00007 9.60398Z" />
        <path d="M5.0016 12.3532C5.33855 12.4786 5.68944 12.5724 6.04452 12.632C6.32822 12.6796 6.51957 12.9481 6.47199 13.2318C6.42441 13.5154 6.15582 13.7069 5.87215 13.6592C5.45212 13.5888 5.03696 13.4778 4.63824 13.3294C4.36866 13.2291 4.23147 12.9292 4.33178 12.6596C4.43209 12.39 4.73194 12.2528 5.0016 12.3532Z" />
        <path d="M7.95551 12.6319C8.31059 12.5724 8.66147 12.4785 8.9984 12.3532C9.26791 12.2528 9.56785 12.39 9.66819 12.6596C9.76853 12.9292 9.63134 13.229 9.36176 13.3294C8.96306 13.4778 8.54793 13.5888 8.12785 13.6592C7.84418 13.7068 7.57561 13.5154 7.52804 13.2318C7.48043 12.9481 7.67181 12.6795 7.95551 12.6319Z" />
        <path d="M10.6514 11.4151C10.9286 11.1855 11.1856 10.9285 11.4152 10.6513C11.5986 10.4298 11.9269 10.3989 12.1485 10.5823C12.37 10.7658 12.4009 11.0941 12.2175 11.3157C11.9464 11.643 11.643 11.9464 11.3157 12.2174C11.0942 12.4009 10.7658 12.37 10.5824 12.1485C10.3989 11.9269 10.4298 11.5985 10.6514 11.4151Z" />
        <path d="M12.3534 8.9981C12.4788 8.66122 12.5726 8.31036 12.6322 7.95526C12.6798 7.67156 12.9482 7.48013 13.232 7.52778C13.5157 7.57539 13.7071 7.84393 13.6595 8.1276C13.589 8.54773 13.478 8.96286 13.3296 9.36148C13.2293 9.63112 12.9294 9.76823 12.6598 9.66792C12.3902 9.56758 12.2531 9.26768 12.3534 8.9981Z" />
        <path d="M13.232 6.47205C12.9483 6.51966 12.6798 6.32825 12.6322 6.04458C12.5726 5.68947 12.4788 5.33861 12.3534 5.00174C12.2531 4.73216 12.3902 4.43229 12.6598 4.33192C12.9294 4.23161 13.2293 4.36874 13.3296 4.63835C13.478 5.03697 13.589 5.45213 13.6595 5.87223C13.7071 6.15591 13.5157 6.42447 13.232 6.47205Z" />
        <path d="M8.04175 6.47917H7.52091V5.95833C7.52091 5.67068 7.28774 5.4375 7.00008 5.4375C6.71242 5.4375 6.47925 5.67068 6.47925 5.95833V7C6.47925 7.28766 6.71242 7.52083 7.00008 7.52083H8.04175C8.3294 7.52083 8.56258 7.28766 8.56258 7C8.56258 6.71234 8.3294 6.47917 8.04175 6.47917Z" />
    </svg>`;

    static htmlNoRefreshIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.00004 13.6666C5.13892 13.6666 3.56253 13.0209 2.27087 11.7295C0.979206 10.4381 0.333374 8.86201 0.333374 7.00127C0.333374 5.14054 0.979206 3.56403 2.27087 2.27173C3.56253 0.97941 5.13892 0.333252 7.00004 0.333252C8.03936 0.333252 9.02284 0.564312 9.95047 1.02643C10.8781 1.48854 11.6496 2.14068 12.265 2.98286V0.333252H13.5983V5.76911H8.16244V4.43582H11.6735C11.2052 3.5777 10.5556 2.90162 9.72483 2.40759C8.89405 1.91358 7.98579 1.66657 7.00004 1.66657C5.51855 1.66657 4.25929 2.18509 3.22225 3.22213C2.18521 4.25917 1.66669 5.51843 1.66669 6.99992C1.66669 8.48141 2.18521 9.74067 3.22225 10.7777C4.25929 11.8147 5.51855 12.3333 7.00004 12.3333C8.14079 12.3333 9.17042 12.0073 10.0889 11.3555C11.0075 10.7036 11.6519 9.84437 12.0223 8.7777H13.4274C13.0239 10.2284 12.2294 11.4059 11.0436 12.3102C9.85786 13.2145 8.51 13.6666 7.00004 13.6666Z" />
    </svg>`;

    constructor(dropdown, wrapper, options = {}) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);
        if (!this.wrapper) throw 'not found element wrapper.';

        this.__updateDisplay = true;

        this.refreshButton = this.wrapper.querySelector('.refresh-btn');
        this.refreshSetting = this.wrapper.querySelector('.refresh-setting');
        this.refreshText = this.refreshButton.querySelector('.refresh-text');
        this.refreshValue = this.refreshButton.querySelector('.refresh-value');
        this.autoRefresh = true;
        this.refreshTime = 60;
        this.options = options;
        this.dropdown = dropdown;
        this.interval = null;
        const value = dropdown.getValue();

        if (value !== null) {
            this.autoRefresh = !(value == 0);
            this.refreshTime = parseInt(value);
        }

        dropdown.setOptions({
            targetRoot: this.refreshSetting,
            onSelect: (value) => {
                const isAuto = !(value == 0);
                this.refreshTime = parseInt(value);

                if (this.autoRefresh !== isAuto) {
                    this.autoRefresh = isAuto;
                    this.__updateDisplay = true;
                }

                this.update();
            }
        });

        this.fcountdownTimer = this.countdownTimer.bind(this);

        this.initialize();
    }

    initialize() {
        const { dropdown, autoRefresh } = this;
        const { onRefresh } = this.options;
        this.refreshSetting.onclick = () => {
            dropdown.toggle();
        };

        this.refreshButton.onclick = () => {
            if (autoRefresh) this.timer = this.refreshTime;
            if (onRefresh) onRefresh();
        };

        this.update();
    }

    countdownTimer() {
        const { onRefresh } = this.options;
        this.refreshValue.textContent = this.timer + ' sec.';

        if (this.timer < 1) {
            this.timer = this.refreshTime;
            if (onRefresh) onRefresh();
        }

        --this.timer;
    }

    update() {
        if (this.__updateDisplay) {
            const firstChild = this.refreshButton.firstChild;
            if (firstChild && firstChild?.tagName === 'svg') {
                firstChild.remove();
            }

            if (this.autoRefresh) {
                this.refreshButton.insertAdjacentHTML('afterbegin', ButtonRefreshPlugin.htmlAutoRefreshIcon);
                this.refreshText.textContent = 'Refresh in';
            } else {
                this.refreshButton.insertAdjacentHTML('afterbegin', ButtonRefreshPlugin.htmlNoRefreshIcon);
                this.refreshText.textContent = '';
                this.refreshValue.textContent = 'Refresh';
            }

            this.__updateDisplay = false;
        }

        if (this.autoRefresh) {
            this.timer = this.refreshTime;
            clearInterval(this.interval);

            this.countdownTimer();
            this.interval = setInterval(this.fcountdownTimer, 1000);
        } else {
            clearInterval(this.interval);
        }
    }

}



class CustomDropdown {
    static plugins = {
        buttonRefresh: ButtonRefreshPlugin
    };

    static placement = ['top', 'left', 'right', 'bottom', 'center'];
    static autoRootMaxDepth = 8;
    static themes = {
        classic: 'Classic',
        google: 'Google'
    };

    static symbols = {
        itemAll: Symbol('CustomDropdown.item.all')
    }

    static checkboxMode = {
        reverse: 'reverse'
    };

    static htmlNotFound = `<div class="dropdown-body-caption">
        <i class="fa fa-search"></i> ไม่พบข้อมูล
    </div>`;

    static htmlLoading = `<div class="dropdown-body-caption">
        <i class="fa fa-spinner fa-spin"></i> กำลังค้นหาข้อมูล
    </div>`;

    static htmlMultipleCloseIcon = `<svg width="9" height="8" viewBox="0 0 9 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.55948 7.74109L4.05434 5.25026L1.5492 7.74109C1.20193 8.0863 0.638934 8.0863 0.29166 7.74109C-0.0555532 7.3958 -0.0555532 6.83604 0.29166 6.49076L2.79686 4L0.29166 1.50924C-0.0555532 1.16396 -0.0555532 0.604196 0.29166 0.258915C0.638934 -0.086305 1.20193 -0.086305 1.5492 0.258915L4.05434 2.74974L6.55948 0.258915C6.90675 -0.086305 7.46974 -0.086305 7.81702 0.258915C8.16423 0.604196 8.16423 1.16396 7.81702 1.50924L5.31182 4L7.81702 6.49076C8.16423 6.83604 8.16423 7.3958 7.81702 7.74109C7.46974 8.0863 6.90675 8.0863 6.55948 7.74109Z" />
    </svg>`;

    static defaultOptions = {

    };

    constructor(wrapper, options = {}) {
        const { multiple, single, theme, placeholder } = options;

        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.__isUpdate = false;
        this.__initData = false;
        this.__fullData = [];
        this.__selfSearchKeyword = null;
        this.__searchDelayed = false;
        this.__closeAfterUpdate = false;
        this.pagination = {
            currentPage: 1
        };

        this.theme = theme || CustomDropdown.themes.classic;
        this.options = options;
        this.selected = multiple ? [] : null;
        this.selectedAll = null;
        this.data = [];
        this.opts = [];
        this.show = false;
        this.uuid = null;
        this.toggler = null;
        this.disabled = this.wrapper.classList.contains('disabled');
        this.validate = null;
        this.plugins = {};

        this.dropdown = this.wrapper.querySelector('.custom-dropdown');
        this.body = this.wrapper.querySelector('.custom-dropdown-body') || this.dropdown;
        this.bodyOuter = this.body;

        this.bodyReadyObserve = false;
        this.bodyObserver = null;
        const toggler = this.wrapper.querySelector('.dropdown-toggler');

        this.scrollRoot = document;
        const scrollRoot = this.options.scrollRoot;
        if (scrollRoot) {
            this.scrollRoot = (scrollRoot instanceof HTMLElement) ? scrollRoot : document.querySelector(scrollRoot)
        }
        /*this.options.root = this.scrollRoot;*/
        this.fakeElem = this.wrapper.querySelector('.input-fake') || null;
        this.searchElem = this.wrapper.querySelector('.input-search') || null;
        this.searchBtn = this.wrapper.querySelector('.btn-search') || null;
        this.searchMore = false;
        this.resetBtn = this.options.buttonReset ? this.wrapper.querySelector('.navigate-reset') : null;
        this.filter = null;
        this.filterElem = this.options.filter ? document.querySelector(this.options.filter) : null;

        if (this.filterElem) {
            this.filter = new CustomFilter(this.filterElem, this);
        }

        if (theme === CustomDropdown.themes.google) {
            this.__googleForceClearValue = false;

            const input = this.wrapper.querySelector('.dropdown-input');

            if (!input) throw 'theme is  require some parameter.';

            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }

            this.wrapper.classList.add('dropdown-google');

            this.searchElem = input;
            this.options.offsetMargin = 0;
            this.options.seamless = true;
        }

        if (toggler) {
            this.toggler = toggler;
        }

        this.fhandleSearch = this.handleSearch.bind(this);
        this.fhandleSelect = this.handleSelect.bind(this);
        this.fhandleScroll = this.handleScroll.bind(this);
        this.fhandleResize = this.handleResize.bind(this);
        this.fhandleDismiss = this.handleDismiss.bind(this);
        this.fhandleRemoveChip = this.handleRemoveChip.bind(this);

        this.initialize();

        return this;
    }

    async initialize() {
        const { dropdown, wrapper, body, searchElem, searchBtn, resetBtn, theme, disabled } = this;
        const { single, multiple, initValue, plugins, lazyScroll, onInit, onIntersectScroll } = this.options;

        // Lazy Scrolling
        if (lazyScroll && onIntersectScroll) {
            const bodyInner = document.createElement('div');
            bodyInner.classList.add('dropdown-body-scrollable');

            this.bodyObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && this.searchMore) {
                        this.searchMore = false;
                        onIntersectScroll(this);
                    }
                }
            }, { root: body });

            const targetObserve = document.createElement('div');
            targetObserve.classList.add('observer-target');

            body.append(bodyInner);
            body.append(targetObserve);

            this.body = bodyInner;
            this.bodyObserver.observe(targetObserve);
            this.bodyReadyObserve = true;
        }

        // On Initialize
        if (onInit) {
            await onInit(this);
        }

        if (initValue) {
            this.selected = initValue;
        } else if (single) {
            const elem = dropdown.querySelector('.custom-dropdown-item.selected');

            if (elem && elem.dataset.value) {
                this.selected = elem.dataset.value;
            }
        }

        // Initialize Plugins
        if (plugins) {
            for (const pluginName in plugins) {
                if (pluginName in CustomDropdown.plugins) {
                    const pluginConfiguration = plugins[pluginName];
                    const instance = new CustomDropdown.plugins[pluginName](
                        this,
                        ...pluginConfiguration
                    );
                    this.plugins[pluginName] = instance;
                }
            }
        }

        if (multiple) {
            wrapper.classList.add('multiple');
        }

        if (searchElem) {
            searchElem.addEventListener('input', () => {
                this.pagination.currentPage = 1;
                this.fhandleSearch();
            });

            if (theme === CustomDropdown.themes.google) {
                searchElem.addEventListener('focus', () => {
                    this.open();
                });

                const bodyInner = document.createElement('div');
                bodyInner.classList.add('dropdown-body-scrollable');

                this.bodyObserver = new IntersectionObserver((entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting && this.searchMore) {
                            ++this.pagination.currentPage;
                            this.handleSearch();
                        }
                    }
                }, { root: body });

                const targetObserve = document.createElement('div');
                targetObserve.classList.add('observer-target');

                body.append(bodyInner);
                body.append(targetObserve);

                this.body = bodyInner;
                this.bodyObserver.observe(targetObserve);
                this.bodyReadyObserve = true;
            }

            if (searchBtn) {
                searchBtn.addEventListener('click', this.fhandleSearch);
            }
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (disabled) return;
                this.clearValue();
            });
        }

        if (this.filter) {
            this.filterElem.addEventListener('click', () => {
                this.toggle();
            });
        }

        if (this.toggler) {
            this.toggler.addEventListener('click', () => {
                this.toggle();
            });
        }

        this.initializeCustomYear();

        this.update();
    }

    initializeCustomYear() {
        const { wrapper } = this;
        const { customYearListData } = this.options;
        if (Array.isArray(customYearListData)) {
            const yearWrapper = wrapper.querySelector('.custom-dropdown-filter-year');
            const that = this;

            this._customYear = {
                wrapper: yearWrapper,
                label: yearWrapper.querySelector('.filter-year-label'),
                next: yearWrapper.querySelector('.navigate-filter-year.next-year'),
                prev: yearWrapper.querySelector('.navigate-filter-year.prev-year'),
                datalist: customYearListData, //! Sorted Data Only
                selected: customYearListData[0] || null,
                init() {
                    this.fnextYear = this.nextYear.bind(this);
                    this.fpreviousYear = this.previousYear.bind(this);

                    this.next.addEventListener('click', this.fnextYear);
                    this.prev.addEventListener('click', this.fpreviousYear);

                    this.update();
                },
                previousYear() {
                    const { datalist } = this;
                    const { Year } = this.selected;
                    const currentIndex = datalist.findIndex(o => o.Year === Year);

                    this.selected = datalist[currentIndex - 1];

                    this.update();
                },
                nextYear() {
                    const { datalist } = this;
                    const { Year } = this.selected;
                    const currentIndex = datalist.findIndex(o => o.Year === Year);

                    this.selected = datalist[currentIndex + 1];

                    this.update();
                },
                update() {
                    if (this.selected) {
                        const { Year, Items } = this.selected;

                        const mappings = Items.map(o => ({
                            value: `${o.DateBkkForm}-${o.DateBkkTo}`,
                            text: `${o.DateBkkForm} - ${o.DateBkkTo}`
                        }));

                        that.updateItems(mappings);
                        this.label.textContent = `ปี ${Year}`;
                    }

                    this.updatePagination();
                },
                updatePagination() {
                    if (this.selected) {
                        const { datalist } = this;
                        const { Year } = this.selected;

                        const index = datalist.findIndex(o => o.Year === Year);

                        if (index === 0) {
                            this.prev.setAttribute('disabled', '');
                        } else {
                            this.prev.removeAttribute('disabled');
                        }

                        if (index === datalist.length - 1) {
                            this.next.setAttribute('disabled', '');
                        } else {
                            this.next.removeAttribute('disabled');
                        }
                    } else {
                        this.next.setAttribute('disabled', '');
                        this.prev.setAttribute('disabled', '');
                    }
                }
            };

            this._customYear.init();

            //console.log(this._customYear);
        }
    }

    async handleSearch() {
        const { searchElem, body, theme, pagination } = this;
        const {
            seamless,
            selfSearch,
            onSearch,
            searchDelay
        } = this.options;
        const page = pagination.currentPage;

        let value = (searchElem.value || '').trim(),
            passed = this.requiredSearch();

        if (selfSearch) {
            this.__selfSearchKeyword = value || null;
        }

        // ⚠️ selfSearch (กรองรายการที่มีอยู่แล้วในหน้า) ไม่ได้ส่ง onSearch มา — เดิมเรียก onSearch ทั้งที่ไม่มี
        // แล้ว throw ทุกครั้งที่พิมพ์ → ไม่ถึง this.update() ที่ซ่อนรายการ = ช่องค้นหาใช้ไม่ได้ (Agent/กลุ่ม/ระดับลูกค้าหน้า SMS · เจอ 2026-10-15)
        if (theme === CustomDropdown.themes.classic && onSearch) {

            const resultSearch = new Promise(async resolve => {
                if (searchDelay > 0) {
                    return Helper.debounce(async () => {
                        resolve(await onSearch(value, page, this));
                    }, searchDelay);
                }

                resolve(await onSearch(value, page, this));
            });

            await resultSearch;

        } else if (theme === CustomDropdown.themes.google) {
            this.__searchDelayed = false;

            // ⚠️ กันคำตอบเก่าทับคำตอบใหม่ (ทีมเทส #127) — ปลายทางบางตัว (ค้นสมาชิกที่ LSM) ตอบช้าไม่เท่ากัน
            // คำค้นสั้นที่ยิงก่อนอาจกลับมาทีหลังคำค้นเต็ม แล้วเอารายชื่อผิดชุดมาแสดง · ตัวที่ไม่ใช่ล่าสุดทิ้งผลไปเลย
            const searchTicket = this.__searchTicket = (this.__searchTicket || 0) + 1;

            if (passed) {
                if (seamless) {
                    const htmls = body.querySelectorAll('.dropdown-body-caption');
                    for (const html of htmls) html.remove();

                    body.insertAdjacentHTML('beforeend', CustomDropdown.htmlLoading);
                    this.open();
                }

                const resultSearch = new Promise(async resolve => {
                    if (searchDelay > 0) {
                        return Helper.debounce(async () => {
                            resolve(await onSearch(value, page));
                        }, searchDelay)
                    }

                    resolve(await onSearch(value, page));
                });

                const result = await resultSearch;

                if (searchTicket !== this.__searchTicket) return;

                if (!this.__searchDelayed) {
                    const itemUpdates = this.resolverSearch(result);

                    const htmls = body.querySelectorAll('.dropdown-body-caption');
                    for (const html of htmls) html.remove();

                    if (page === 1) {
                        this.updateItems(itemUpdates, false);
                    } else {
                        this.appendItems(itemUpdates, false);
                    }

                    this.open();
                }
            } else {
                this.__searchDelayed = true;
                this.close();
                this.updateItems([], false);
            }
        }

        this.update();
    }

    requiredSearch() {
        const { searchElem } = this;
        const {
            minimumCharecterSearch
        } = this.options;
        const value = (searchElem.value || '').trim();

        if (minimumCharecterSearch > 0 && value.length < minimumCharecterSearch) {
            return false;
        }

        return true;
    }

    resolverSearch(result) {
        if (!Array.isArray(result?.results)) return [];

        this.searchMore = result?.pagination?.more || false;

        return result.results.map(o => {
            return {
                ...o,
                value: o.id,
                text: o.text
            };
        });
    }

    handleSelect(e) {
        const { currentTarget, target } = e;
        if (currentTarget.classList.contains('disabled')) return;

        const { dropdown, selected, selectedAll } = this;
        const value = currentTarget.dataset.value;
        const type = currentTarget.dataset.type;
        const { multiple, checkbox, checkboxAll, fixedMultipleData, fullData, onSelect } = this.options;

        if (
            multiple &&
            checkboxAll &&
            type === 'all' &&
            checkbox === CustomDropdown.checkboxMode.reverse
        ) {

            this.selectedAll = !selectedAll;
            this.selected = [];
            this.__fullData = [];
            this.__isUpdate = true;
            this.updateState();

            // Emitting Event & Handle Fake
            if (onSelect) {
                onSelect([], currentTarget, this);
            }

        } else if (multiple && type === 'all') {
            let _value = [];
            const alls = Array.from(dropdown.querySelectorAll('.custom-dropdown-item'));
            const items = alls.filter(o => !o.hasAttribute('data-type'));

            if (selected?.length < items.length || selected.length === 0) {
                if (Array.isArray(fixedMultipleData)) {
                    _value = [...fixedMultipleData];
                } else {
                    for (const item of items) {
                        if (item.dataset.value) {
                            _value.push(item.dataset.value);
                        }
                    }
                }
            }

            this.selected = _value;
            this.__isUpdate = true;
            this.updateState();

            // Emitting Event & Handle Fake
            if (onSelect) {
                onSelect(_value, currentTarget, this);
            }

            // Close Dropdown
            if (!multiple) {
                this.close();
            }
        } else if (value) {
            let _value;
            if (multiple) {
                const find = selected.indexOf(value);
                if (find !== -1) {
                    selected.splice(find, 1);

                    if (fullData) {
                        const index = this.__fullData.findIndex(d => d.value === value);
                        if (index !== -1) this.__fullData.splice(index, 1);
                    }
                } else {
                    selected.push(value);

                    if (fullData) {
                        const data = this.data.find(d => d.value === value);
                        if (data) this.__fullData.push(data);
                    }
                }
                _value = selected;
            } else {
                _value = value;
            }

            this.selected = _value;
            this.__isUpdate = true;
            this.updateState();

            // Emitting Event & Handle Fake
            if (onSelect) {
                onSelect(_value, currentTarget, this);
            }

            // Close Dropdown
            if (!multiple) {
                this.close();
            }
        }
    }

    fakeGoogle() {
        const { wrapper, dropdown, searchElem, selected } = this;
        const { single } = this.options;

        if (!single) return;

        const _selected = String(selected ?? '');
        if (_selected) {
            const item = this.findItemByValue(_selected);

            wrapper.classList.remove('empty');
            searchElem.setAttribute('readonly', '');
            searchElem.value = item?.textContent || '';
        } else {
            wrapper.classList.add('empty');
            searchElem.removeAttribute('readonly');
            if (this.__googleForceClearValue) {
                this.__googleForceClearValue = false;
                this.data = [];
                searchElem.value = '';
            }
        }
    }

    async fake() {
        const { wrapper, dropdown, fakeElem, selected, selectedAll } = this;
        const { fakeValue, placeholder, single, multiple, checkbox, filterAll, fullData } = this.options;

        this.updateFilter();

        if (!fakeElem || !(single || multiple)) {
            return;
        }

        if (single) {
            const _selected = String(selected ?? '');
            let _value = _selected;

            if (typeof fakeValue === 'function') {
                const items = dropdown.getElementsByClassName('custom-dropdown-item');
                let target = null;
                for (const item of items) {
                    if (item.dataset.value === _selected) {
                        target = item;
                        break;
                    }
                }

                _value = await fakeValue(target, _selected, fakeElem);
            }

            if (!_value) {
                wrapper.classList.add('empty');
                wrapper.classList.remove('fill');
                fakeElem.innerHTML = placeholder || '';
            } else {
                wrapper.classList.remove('empty');
                wrapper.classList.add('fill');
                fakeElem.innerHTML = _value || '';
            }
        } else if (multiple) {
            const items = Array.from(dropdown.getElementsByClassName('custom-dropdown-item'));
            //const dictoryItems = new Map(items.map(o => [o.dataset.value, o]));
            const fakeWidth = fakeElem.offsetWidth - 30;

            let usedWidth = 10, isFull = false;
            let numberOfItems = 0;
            const closeItemWidth = 25;
            const padding = 22 + closeItemWidth;
            const showItems = [];

            let first = fakeElem.firstChild;
            while (first) {
                first.remove();
                first = fakeElem.firstChild;
            }
            
            if (checkbox === CustomDropdown.checkboxMode.reverse && selectedAll) {

                const text = filterAll || 'ทั้งหมด';
                const width = this.getTextWidth(text, `normal 12px "Inter", sans-serif`);
                showItems.push({ value: CustomDropdown.symbols.itemAll, text, width: width + padding });
                numberOfItems = (this.pagination.total || 0) - selected.length;

            } else {

                // Loop with main selected
                for (const value of selected) {
                    let text = value;
                    const item = items.find(o => o.dataset.value === value);

                    if (item) text = item.dataset.chip || item.textContent;

                    if (isFull) {
                        ++numberOfItems;
                        continue;
                    }

                    const width = this.getTextWidth(text, `normal 12px "Inter", sans-serif`);

                    if (usedWidth + width + padding > fakeWidth) {
                        isFull = true;
                        ++numberOfItems;
                        continue;
                    }

                    usedWidth += width + padding;
                    showItems.push({ value, text, width: width + padding });
                }

                // Loop with main items
                //for (const item of items) {
                //    const value = item.dataset.value;
                //    if (selected.includes(value)) {
                //        if (isFull) {
                //            ++numberOfItems;
                //            continue;
                //        }

                //        const text = item.dataset.chip || item.textContent;
                //        const width = this.getTextWidth(text, `normal 12px "Inter", sans-serif`);

                //        if (usedWidth + width + padding > fakeWidth) {
                //            isFull = true;
                //            ++numberOfItems;
                //            continue;
                //        }

                //        usedWidth += width + padding;
                //        showItems.push({ value, text, width: width + padding });
                //    }
                //}

                if (showItems.length === 0 && numberOfItems === 0) {
                    wrapper.classList.add('empty');
                    wrapper.classList.remove('fill');
                    fakeElem.innerHTML = placeholder;
                    return;
                }

                wrapper.classList.remove('empty');
                wrapper.classList.add('fill');
            }

            if (numberOfItems > 0) {
                const text = `+${numberOfItems.toLocaleString()}`;
                const width = this.getTextWidth(text) + padding;

                usedWidth += width;

                if (usedWidth < fakeWidth) {
                    showItems.push({ text, width, more: true });
                } else {
                    const clone = showItems.copyWithin();
                    for (const i = clone.length - 1; i >= 0; --i) {
                        const { width } = clone[i];

                        showItems.splice(i, 1);
                        usedWidth -= width;

                        if (usedWidth < fakeWidth) break;
                    }

                    showItems.push({ text, width, more: true });
                }
            }

            for (const { value, text, more = false } of showItems) {
                const item = document.createElement('div');
                const inner = document.createElement('span');

                inner.classList.add('multiple-text');
                inner.textContent = text;

                item.classList.add('multiple-item');

                if (!more) {
                    const close = document.createElement('a');
                    close.classList.add('multiple-close');
                    close.innerHTML = CustomDropdown.htmlMultipleCloseIcon;
                    close.onclick = (e) => this.fhandleRemoveChip(e, value);
                    item.append(close);
                }

                item.append(inner);
                fakeElem.append(item);
            }
        }
    }

    async updateFilter() {
        const { selected, dropdown, fakeElem } = this;
        const { fakeValue, single, multiple, filterDefault, filterAll } = this.options;
        if (!this.filter) return;

        if (single) {
            const _selected = String(selected ?? '');
            let _value = selected ?? (filterDefault || '');

            if (_selected) {
                const item = this.findItemByValue(_selected);
                const data = this.findDataByValue(_selected);

                if (item) {
                    if (fakeValue) _value = await fakeValue(item, data, _selected, fakeElem);
                    else if (item.dataset.chip) _value = item.dataset.chip;
                }
            }

            this.filter.setFill(Boolean(_selected));
            this.filter.setText(_value);
            this.updateFilterSafeWidth();
        } else if (multiple) {
            let _text = filterDefault || '', _badge = false;
            const items = dropdown.querySelectorAll('.custom-dropdown-item:not([data-type])');
            const all = selected.length === items.length;

            if (!all && selected.length > 0) {
                const item = this.findItemByValue(selected[0]);
                const data = this.findDataByValue(selected[0]);

                if (item) {
                    if (fakeValue) _text = await fakeValue(item, data, selected, fakeElem);
                    else if (item.dataset.chip) _text = item.dataset.chip;
                    else _text = selected[0];
                }

                //if (selected.length > 1) {
                //    _text = `${_text}, +${selected.length - 1}`
                //}
            } else if (all) {
                _text = filterAll || _text;
            }

            if (selected.length > 0) {
                this.filter.setFill(true);

                if (selected.length > 1) {
                    _badge = `+${selected.length - 1}`;
                }
            } else {
                this.filter.setFill(false);
            }

            if (this.filter.hasBadge()) {
                this.filter.setBadge(_badge);
            } else if (_badge) _text += ', ' + _badge;

            this.filter.setText(_text);
            this.updateFilterSafeWidth();
        }
    }

    updateFilterSafeWidth() {
        const { dropdown, filter } = this;
        const { safeWidth } = this.options;

        if (!safeWidth) return;

        const safeMax = filter.getMaximumWidth();
        dropdown.style.minWidth = safeMax + 'px';
    }

    handleRemoveChip(e, value) {
        const { selected, disabled } = this;
        const { onSelect } = this.options;
        const chip = e.currentTarget.parentElement;

        if (disabled) return;

        e.preventDefault();
        e.stopPropagation();

        chip.classList.add('animate__bounceOut');

        if (value === CustomDropdown.symbols.itemAll) {
            this.selectedAll = false;
        } else {
            const index = selected.indexOf(value);
            if (index > -1) selected.splice(index, 1);
        }

        if (onSelect) {
            onSelect(selected, chip, this);
        }

        H.debounce(() => {
            this.update();
        }, 750);
    }

    emit() {
        if (this.options.onUpdate) {
            const { selected } = this;

            this.options.onUpdate();
        }
    }

    setValue(value) {
        this.selected = value;
        this.update();
    }

    clearValue() {
        const { theme, filter } = this;
        const { multiple, onSelect } = this.options;
        this.selected = multiple ? [] : null;

        if (theme === CustomDropdown.themes.google) {
            this.__googleForceClearValue = true;
        }

        if ((filter || theme === CustomDropdown.themes.google) && onSelect) {
            onSelect(null, this.selected, this);
        }

        this.update();
    }

    getValue() {
        const { dropdown, selected } = this;
        const { multiple, allowAll, mapValue, fullData } = this.options;
        let _selected = selected;

        if (fullData) return this.__fullData;

        if (multiple && allowAll) {
            const items = dropdown.getElementsByClassName('custom-dropdown-item');
            if (selected.length === 0 || selected.length === items.length) {
                _selected = (typeof allowAll === 'string') ? allowAll : 'all';
            }
        }

        if (mapValue) _selected = mapValue(_selected, this);

        return _selected;
    }

    getData() {
        if (!this.selected) return null;
        return this.findDataByValue(this.selected);
    }

    getAllData() {
        return this.data;
    }

    getSearchValue() {
        const { searchElem } = this;
        if (!searchElem) return null;
        return searchElem.value.trim();
    }

    update() {
        this.__isUpdate = false;

        const { single, multiple, seamless, checkbox, onSelect } = this.options;
        if (single || multiple) {
            const { dropdown, body, selected, selectedAll, theme } = this;
            const items = dropdown.querySelectorAll('.custom-dropdown-item:not([data-type])');

            // Initialize Data
            if (!this.__initData) {
                for (const item of items) {
                    this.data.push({
                        ...item.dataset,
                        text: item.innerHTML
                    });
                }

                this.__initData = true;
            }

            if (seamless && items.length === 0) {
                body.innerHTML = CustomDropdown.htmlNotFound;
            }

            if (single) {
                for (const item of items) {
                    item.style.display = null;

                    if (this.__selfSearchKeyword && !item.textContent.includes(this.__selfSearchKeyword)) {
                        item.style.display = 'none';
                    }

                    item.removeEventListener('click', this.fhandleSelect);
                    item.addEventListener('click', this.fhandleSelect);

                    if (checkbox) {
                        const checkbox = item.querySelector('input[type=checkbox]');
                        checkbox.checked = (item.dataset.value === String(selected));
                    } else {
                        item.classList.remove('selected');
                        if (item.dataset.value === String(selected))
                            item.classList.add('selected');
                    }
                }
            } else if (multiple) {
                const all = dropdown.querySelector('.custom-dropdown-item.whole,.custom-dropdown-item[data-type=all]');
                if (all) {
                    all.removeEventListener('click', this.fhandleSelect);
                    all.addEventListener('click', this.fhandleSelect);

                    if (checkbox === CustomDropdown.checkboxMode.reverse) {
                        const checkbox = all.querySelector('input[type=checkbox]');
                        checkbox.checked = selectedAll;
                    } else {
                        const values = Array.from(items).map(e => e.dataset.value);

                        const isSelected = (
                            selected.length > 0 &&
                            values.every(o => selected.includes(o))
                        );

                        if (checkbox) {
                            const checkbox = all.querySelector('input[type=checkbox]');
                            checkbox.checked = isSelected;
                        } else {
                            all.classList.remove('selected');
                            if (isSelected) all.classList.add('selected');
                        }
                    }
                }

                for (const item of items) {
                    item.style.display = null;

                    if (this.__selfSearchKeyword && !item.textContent.includes(this.__selfSearchKeyword)) {
                        item.style.display = 'none';
                    }

                    item.removeEventListener('click', this.fhandleSelect);
                    item.addEventListener('click', this.fhandleSelect);

                    let isSelected = selected.includes(item.dataset.value);

                    if (checkbox === CustomDropdown.checkboxMode.reverse) {
                        if (selectedAll) isSelected = !isSelected;
                    }

                    if (checkbox) {
                        const checkbox = item.querySelector('input[type=checkbox]');
                        checkbox.checked = (isSelected);
                    } else {
                        item.classList.remove('selected');
                        if (isSelected)
                            item.classList.add('selected');
                    }
                }
            }

            // Google
            if (theme === CustomDropdown.themes.google) {

                if (this.__closeAfterUpdate) {
                    this.__closeAfterUpdate = false;
                    this.close();

                    const item = items[0];
                    if (item && onSelect) {
                        onSelect(item.dataset.value, item, this);
                    }
                }

                this.fakeGoogle();
                return;
            }

            this.fake();
        }
    }

    updateItems(items, isUpdate = true, searchMore = false) {
        const { checkbox, checkboxAll, autoSelect } = this.options;
        const { theme } = this;
        const body = this.body;
        this.data = [];

        // Google
        if (theme === CustomDropdown.themes.google && autoSelect) {
            if (items?.length === 1) {
                this.selected = [items[0].value];
                this.__closeAfterUpdate = true;
            }
        }

        if (body.children.length > 0) {
            let first = body.firstElementChild;
            while (first) {
                first.remove();
                first = body.firstElementChild;
            }
        }

        if (checkbox && checkboxAll) {
            const item = document.createElement('div');
            item.classList.add('custom-dropdown-item');
            item.dataset.type = 'all';
            item.textContent = 'ทั้งหมด';

            const div = document.createElement('div');
            div.classList.add('custom-checkbox', 'form-check', 'd-inline-block', 'align-text-top', 'me-2');

            const inp = document.createElement('input');
            inp.type = 'checkbox';
            inp.classList.add('form-check-input');

            div.append(inp);
            item.prepend(div);
            body.append(item);
        }

        for (const data of items) {
            const item = document.createElement('div');
            item.classList.add('custom-dropdown-item');
            item.dataset.value = data.value;
            item.innerHTML = data.text;

            if (data.chip) item.dataset.chip = data.chip;

            if (data.disabled) item.classList.add('disabled');

            if (checkbox) {
                const div = document.createElement('div');
                div.classList.add('custom-checkbox', 'form-check', 'd-inline-block', 'align-text-top', 'me-2');

                const inp = document.createElement('input');
                inp.type = 'checkbox';
                inp.classList.add('form-check-input');

                div.append(inp);
                item.prepend(div);
            }

            this.searchMore = searchMore;
            this.data.push(data);
            body.append(item);
        }

        this.__initData = true;
        if (isUpdate) this.update();
    }

    appendItems(items, isUpdate = true, searchMore = false) {
        const body = this.body;
        const { checkbox, checkboxAll } = this.options;

        if (checkbox && checkboxAll) {
            const all = body.querySelector('[data-type=all]');
            if (!all) {
                const item = document.createElement('div');
                item.classList.add('custom-dropdown-item');
                item.dataset.type = 'all';
                item.textContent = 'ทั้งหมด';

                const div = document.createElement('div');
                div.classList.add('custom-checkbox', 'form-check', 'd-inline-block', 'align-text-top', 'me-2');

                const inp = document.createElement('input');
                inp.type = 'checkbox';
                inp.classList.add('form-check-input');

                div.append(inp);
                item.prepend(div);
                body.append(item);
            }
        }

        for (const data of items) {
            const item = document.createElement('div');
            item.classList.add('custom-dropdown-item');
            item.dataset.value = data.value;
            item.dataset.value = data.value;
            item.innerHTML = data.text;

            if (data.chip) item.dataset.chip = data.chip;

            if (data.disabled) item.classList.add('disabled');

            if (checkbox) {
                const div = document.createElement('div');
                div.classList.add('custom-checkbox', 'form-check', 'd-inline-block', 'align-text-top', 'me-2');

                const inp = document.createElement('input');
                inp.type = 'checkbox';
                inp.classList.add('form-check-input');

                div.append(inp);
                item.prepend(div);
            }

            this.searchMore = searchMore;
            this.data.push(data);
            body.append(item);
        }

        this.__initData = true;
        if (isUpdate) this.update();
    }

    updateState() {
        const { dropdown, toggler, uuid, show, theme, disabled, searchElem, filter, selected, __isUpdate } = this
        const { single, multiple, targetRoot, safeWidth } = this.options;

        if (theme === CustomDropdown.themes.google) {
            if (disabled) searchElem.setAttribute('disabled', '');
            else searchElem.removeAttribute('disabled');
        }

        if (uuid) {
            dropdown.classList.add(uuid);
        } else {
            const className = dropdown.className.split(' ').filter(x => !x.startsWith('uuid-'));
            dropdown.className = className.join(' ');
        }

        dropdown.classList.toggle('show', show);
        if (toggler) {
            toggler.classList.toggle('toggled', show);
        }

        if (filter) {
            if (show) this.updateFilterSafeWidth();

            filter.toggler.classList.toggle('toggled', show);
            filter.wrapper.classList.toggle('active', show);
            filter.setDisabled(disabled);
        }

        if (targetRoot) {
            targetRoot.classList.toggle('dropdown-show', show);
            if (single) targetRoot.classList.toggle('dropdown-fill', selected);
            else if (multiple) targetRoot.classList.toggle('dropdown-fill', selected.length > 0);
        }

        if (__isUpdate) {
            this.update();
        }
    }

    toggle(option) {
        const dropdown = this.dropdown;
        let __show = this.show;

        if (!this.disabled) {
            if (dropdown.classList.contains('$show')) {
                dropdown.classList.remove('$show');
                __show = dropdown.classList.contains('show');
            }

            if (!__show) {
                this.open(option);
            } else {
                this.close();
            }
            return !__show;
        }
        return __show;
    }

    open() {
        const { wrapper, theme } = this;
        if (wrapper.classList.contains('disabled') || wrapper.hasAttribute('disabled')) {
            return;
        }

        if (theme === CustomDropdown.themes.google && !this.requiredSearch()) {
            return;
        }

        if (this.show) {
            return;
        }

        const { root } = this.options;
        const uuid = 'uuid-' + Random.nextCustom(5, Random.numbers);

        this.uuid = uuid;
        this.show = true;
        this.updateState();

        this.scrollRoot.addEventListener('scroll', this.fhandleScroll);
        window.addEventListener('mousedown', this.fhandleDismiss);
        window.addEventListener('resize', this.fhandleResize);

        this.calculate();
    }

    close() {
        const { root } = this.options;

        this.uuid = null;
        this.show = false;
        this.updateState();

        this.scrollRoot.removeEventListener('scroll', this.fhandleScroll);
        window.removeEventListener('mousedown', this.fhandleDismiss);
        window.removeEventListener('resize', this.fhandleResize);
    }

    clear() {
        const dropdown = this.dropdown;
        dropdown.style.inset = 'auto';
        dropdown.style.width = '';
        dropdown.style.maxHeight = '';
    }

    calculate() {
        const wh = window.innerHeight;
        const ww = window.innerWidth;
        const { dropdown, wrapper, fakeElem } = this;
        const { targetRoot, root, autoRoot, offsetX, offsetY, offsetMargin, stretch, placement, auto, maxHeight, noMaxHeight, lockPlacement, horizontal } = this.options;
        let placementA = placement ? placement[0] : 'bottom',
            placementB = placement ? placement[1] : 'left';

        if (lockPlacement && Array.isArray(lockPlacement)) {
            const [pA, pB] = lockPlacement;
            if (CustomDropdown.placement.includes(pA)) placementA = pA;
            if (CustomDropdown.placement.includes(pB)) placementB = pB;
        }

        this.clear();

        let rect = (targetRoot || fakeElem || wrapper).getBoundingClientRect();
        const box = dropdown.getBoundingClientRect();
        const _offsetMargin = offsetMargin ?? 5;
        let _offsetX = offsetX ?? 0;
        let _offsetY = offsetY ?? 0;

        if (autoRoot) {
            let target = wrapper, dep = 0;
            while (target) {
                if (dep === CustomDropdown.autoRootMaxDepth) {
                    return;
                }

                const style = getComputedStyle(target);
                if (style.position === 'fixed') {
                    const targetRect = target.getBoundingClientRect();
                    _offsetX -= targetRect.x;
                    _offsetY -= targetRect.y;
                }

                target = target.parentElement;
                ++dep;
            }
        }

        if (root) {
            const rectRoot = root.getBoundingClientRect();
            _offsetX = -rectRoot.x;
            _offsetY = -rectRoot.y;
        }

        let { height: bh, width: bw } = box;
        const { x: rx, y: ry, width: rw, height: rh } = rect;

        if (stretch) bw = rw;

        if (auto) {
            const rcx = rx + (rw / 2);
            const rcy = ry + (rh / 2);
            const cx = (ww / 2);
            const cy = (wh / 2);

            if (horizontal || placementA === 'left' || placementA === 'right') {
                placementA = rcx > cx ? 'left' : 'right';
                placementB = rcy <= cy ? 'top' : 'bottom';
            } else if (placementA === 'top' || placementA === 'bottom') {
                placementA = rcy > cy ? 'top' : 'bottom';
                placementB = rcx <= cx ? 'left' : 'right';
            }
        }

        if (!noMaxHeight) {
            let safeMax = null;
            switch (placementA) {
                case 'top': {
                    safeMax = maxHeight || wh - ((wh - ry) + _offsetMargin + 20);
                } break;
                case 'bottom': {
                    safeMax = maxHeight || wh - (ry + rh + _offsetMargin + 20);
                } break;
            }

            if (safeMax !== null) {
                if (bh > safeMax) {
                    bh = safeMax;
                }

                dropdown.style.maxHeight = safeMax + 'px';
            }
        }

        const calculateHorizontal = () => {
            switch (placementB) {
                case 'top': {
                    dropdown.style.top = ry + _offsetY + 'px';
                } break;
                case 'bottom': {
                    dropdown.style.top = ry - (bh - rh) + _offsetY + 'px';
                } break;
                case 'center': {
                    dropdown.style.top = ry - ((bh - rh) / 2) + _offsetY + 'px';
                } break;
            }
        };

        const calculateVertical = () => {
            switch (placementB) {
                case 'left': {
                    dropdown.style.left = rx + _offsetX + 'px';
                    if (stretch) {
                        dropdown.style.width = rw + 'px';
                    }
                } break;
                case 'right': {
                    dropdown.style.left = rx + (rw - bw) + _offsetX + 'px';
                    if (stretch) {
                        dropdown.style.width = rw + 'px';
                    }
                } break;
                case 'center': {
                    dropdown.style.left = rx + ((rw - bw) / 2) + _offsetX + 'px';
                } break;
            }
        };

        switch (placementA) {
            case 'top': {
                dropdown.style.top = ry - bh - _offsetMargin + _offsetY + 'px';
                calculateVertical();
            } break;
            case 'left': {
                dropdown.style.left = rx - bw - _offsetMargin + _offsetX + 'px';
                calculateHorizontal();
            } break;
            case 'right': {
                dropdown.style.left = rx + rw + _offsetMargin + _offsetX + 'px';
                calculateHorizontal();
            } break;
            case 'bottom': {
                dropdown.style.top = ry + rh + _offsetMargin + _offsetY + 'px';
                calculateVertical();
            } break;
        }
    }

    setDisabled(status) {
        const wrapper = this.wrapper;
        if (status) {
            this.disabled = true;
            wrapper.classList.add('disabled');
            wrapper.setAttribute('disabled', '');
        } else {
            this.disabled = false;
            wrapper.classList.remove('disabled');
            wrapper.removeAttribute('disabled');
        }

        this.updateState();
    }

    setDisabledItems(values) {
        const { dropdown } = this;
        const items = dropdown.querySelectorAll('.custom-dropdown-item');
        for (const item of items) {
            const v = item.dataset.value;
            if (v in values) {
                item.classList.toggle('disabled', values[v])
            }
        }
    }

    setOptions(options = {}) {
        Object.assign(this.options, options);
    }

    getOption(key = null) {
        return key ? this.options[key] : this.options;
    }

    getValidate() {
        const { selected, selectedAll } = this;
        const { single, multiple } = this.options;

        if (single) {
            return Boolean(selected);
        } else if (multiple) {
            return (selected.length > 0) || selectedAll;
        }
    }

    setInvalid(status = true) {
        const wrapper = this.wrapper;
        if (status) {
            this.validate = false;
            wrapper.classList.add('custom-invalid');
        } else {
            this.validate = null;
            wrapper.classList.remove('custom-invalid');
        }

        this.updateState();
    }

    handleScroll() {
        this.calculate();
    }

    handleResize() {
        this.calculate();
    }

    handleDismiss(e) {
        const { theme } = this;
        const { targetRoot, multiple, noDismiss, onDismiss } = this.options;
        if (noDismiss) return;

        const dropdown = this.dropdown;
        const uuid = this.uuid;
        const el = e.target;

        let closest = el.closest('.' + uuid);
        if (closest !== null) return;

        const toggler = el.closest('.dropdown-toggler');

        if (theme === CustomDropdown.themes.google) {
            const wrap = el.closest('.dropdown-input-wrapper');
            if (wrap !== null) return;
        }

        if (multiple && el.closest('.multiple-item') !== null) return;

        let et = el;

        if (toggler) {
            et = toggler;
        }

        if (et.classList.contains('dropdown-toggler') && et.parentElement) {
            for (const ch of et.parentElement.children) {
                if (ch === dropdown) {
                    return;
                }
            }
        }

        const fl = el.closest('.custom-filter');
        if (fl !== null && fl === this.filterElem) return;

        if (targetRoot) {
            let ep = e.target, dep = 0;
            while (ep.parentNode != document.body && dep < 8) {
                if (ep === targetRoot) return;
                ep = ep.parentNode;
                ++dep;
            }
        }

        if (onDismiss) {
            onDismiss();
        }

        this.close();
    }

    getTextWidth(text, font = null) {
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement('canvas'));
        var context = canvas.getContext('2d');

        if (font) context.font = font;

        var metrics = context.measureText(text);
        return metrics.width;
    };

    findItemByValue(value) {
        const { dropdown } = this;
        const items = dropdown.getElementsByClassName('custom-dropdown-item');
        for (const item of items) {
            if (item.dataset.value === value) {
                return item;
            }
        }
        return null;
    }

    findDataByValue(value) {
        return this.data.find(o => o.value == value) || null;
    }
}



class FloatingBox {

    static floatingBoxShowKey = '__showFloatingBox__';
    static floatingBoxUUIDKey = '__uuidFloatingBox__';
    static floatingBoxFunctionUtilsKey = '__functionUtilsFloatingBox__';

    static updateState(wrapper, dropdown) {
        const uuid = wrapper[this.floatingBoxUUIDKey];
        const show = wrapper[this.floatingBoxShowKey];

        if (uuid) {
            dropdown.classList.add(uuid);
        } else {
            const className = dropdown.className.split(' ').filter(x => !x.startsWith('uuid-'));
            dropdown.className = className.join(' ');
        }

        dropdown.classList.toggle('show', show);
    }

    static open(target, wrapperSelector, options) {
        const wrapper = (wrapperSelector instanceof HTMLElement) ? wrapperSelector : document.querySelector(wrapperSelector);
        if (!wrapper) throw 'not found element wrapper.';
        const dropdown = wrapper.querySelector('.custom-dropdown');

        if (wrapper.classList.contains('disabled') || wrapper.hasAttribute('disabled')) {
            return;
        }

        const show = wrapper[this.floatingBoxShowKey];
        if (show) {
            return;
        }

        const scrollRoot = document.querySelector('.page-content') || document.documentElement;

        const _options = Object.assign({
            placement: ['bottom', 'right'],
            horizontal: false
        }, options);

        const uuid = 'uuid-' + Random.nextCustom(5, Random.numbers);

        wrapper[this.floatingBoxShowKey] = true;
        wrapper[this.floatingBoxUUIDKey] = uuid;
        this.updateState(wrapper, dropdown);

        const _this = {
            target,
            wrapper,
            dropdown,
            options: _options,
        };

        const fsDismiss = this.onDismiss.bind(_this);
        const fsCalculate = this.onCalulate.bind(_this);

        wrapper[this.floatingBoxFunctionUtilsKey] = {
            dismiss: fsDismiss,
            calculate: fsCalculate
        };

        scrollRoot.addEventListener('scroll', fsCalculate);
        window.addEventListener('mousedown', fsDismiss);
        window.addEventListener('resize', fsCalculate);

        this.calculate(target, wrapper, dropdown, _options);
    }

    static onDismiss(e) {
        const { target, wrapper, options } = this;
        const { noDismiss } = options;

        if (noDismiss) return;

        const uuid = wrapper[FloatingBox.floatingBoxUUIDKey];
        const el = e.target;
        let closest = el.closest('.' + uuid);
        if (closest !== null) return;

        let et = el, dep = 0;
        while (et.parentNode != document.body && dep < 8) {
            if (et === target) return;
            et = et.parentNode;
            ++dep;
        }

        FloatingBox.close(wrapper);
    }

    static onCalulate() {
        const { target, wrapper, dropdown, options } = this;
        FloatingBox.calculate(target, wrapper, dropdown, options);
    }

    static close(wrapperSelector) {
        const wrapper = (wrapperSelector instanceof HTMLElement) ? wrapperSelector : document.querySelector(wrapperSelector);
        if (!wrapper) throw 'not found element wrapper.';
        const dropdown = wrapper.querySelector('.custom-dropdown');
        const scrollRoot = document.querySelector('.page-content') || document.documentElement;

        wrapper[this.floatingBoxUUIDKey] = null;
        wrapper[this.floatingBoxShowKey] = false;
        this.updateState(wrapper, dropdown);

        if (wrapper[this.floatingBoxFunctionUtilsKey]) {
            const fs = wrapper[this.floatingBoxFunctionUtilsKey];

            scrollRoot.removeEventListener('scroll', fs.calculate);
            window.removeEventListener('mousedown', fs.dismiss);
            window.removeEventListener('resize', fs.calculate);

            wrapper[this.floatingBoxFunctionUtilsKey] = null;
        }
    }

    static toggle(target, wrapperSelector, options) {
        const wrapper = (wrapperSelector instanceof HTMLElement) ? wrapperSelector : document.querySelector(wrapperSelector);
        if (!wrapper) throw 'not found element wrapper.';
        const dropdown = wrapper.querySelector('.custom-dropdown');

        let __show = wrapper[this.floatingBoxShowKey];

        if (!wrapper.classList.contains('disabled') || wrapper.hasAttribute('disabled')) {
            if (dropdown.classList.contains('$show')) {
                dropdown.classList.remove('$show');
                __show = dropdown.classList.contains('show');
            }

            if (!__show) {
                this.open(target, wrapper, options);
            } else {
                this.close(wrapper);
            }
            return !__show;
        }
        return __show;
    }

    static calculate(target, wrapper, dropdown, options = {}) {
        const wh = window.innerHeight;
        const ww = window.innerWidth;
        const { root, autoRoot, offsetX, offsetY, offsetMargin, stretch, placement, auto, maxHeight, noMaxHeight, lockPlacement, horizontal } = options;
        let placementA = placement ? placement[0] : 'bottom',
            placementB = placement ? placement[1] : 'left';

        if (lockPlacement && Array.isArray(lockPlacement)) {
            const [pA, pB] = lockPlacement;
            if (CustomDropdown.placement.includes(pA)) placementA = pA;
            if (CustomDropdown.placement.includes(pB)) placementB = pB;
        }

        dropdown.style.inset = 'auto';
        dropdown.style.width = '';
        dropdown.style.maxHeight = '';

        let rect = target.getBoundingClientRect();
        const box = dropdown.getBoundingClientRect();
        const _offsetMargin = offsetMargin ?? 5;
        let _offsetX = offsetX ?? 0;
        let _offsetY = offsetY ?? 0;

        if (autoRoot) {
            let target = wrapper, dep = 0;
            while (target) {
                if (dep === CustomDropdown.autoRootMaxDepth) {
                    return;
                }

                const style = getComputedStyle(target);
                if (style.position === 'fixed') {
                    const targetRect = target.getBoundingClientRect();
                    _offsetX -= targetRect.x;
                    _offsetY -= targetRect.y;
                }

                target = target.parentElement;
                ++dep;
            }
        }
        console.log("root",root)
        if (root) {
            const rectRoot = root.getBoundingClientRect();
            _offsetX = -rectRoot.x;
            _offsetY = -rectRoot.y;
        }

        let { height: bh, width: bw } = box;
        const { x: rx, y: ry, width: rw, height: rh } = rect;

        if (stretch) bw = rw;

        if (auto) {
            const rcx = rx + (rw / 2);
            const rcy = ry + (rh / 2);
            const cx = (ww / 2);
            const cy = (wh / 2);

            if (horizontal || placementA === 'left' || placementA === 'right') {
                placementA = rcx > cx ? 'left' : 'right';
                placementB = rcy <= cy ? 'top' : 'bottom';
            } else if (placementA === 'top' || placementA === 'bottom') {
                placementA = rcy > cy ? 'top' : 'bottom';
                placementB = rcx <= cx ? 'left' : 'right';
            }
        }

        if (!noMaxHeight) {
            let safeMax = null;
            switch (placementA) {
                case 'top': {
                    safeMax = maxHeight || wh - ((wh - ry) + _offsetMargin + 20);
                } break;
                case 'bottom': {
                    safeMax = maxHeight || wh - (ry + rh + _offsetMargin + 20);
                } break;
            }

            if (safeMax !== null) {
                if (bh > safeMax) {
                    bh = safeMax;
                }

                dropdown.style.maxHeight = safeMax + 'px';
            }
        }

        const calculateHorizontal = () => {
            switch (placementB) {
                case 'top': {
                    dropdown.style.top = ry + _offsetY + 'px';
                } break;
                case 'bottom': {
                    dropdown.style.top = ry - (bh - rh) + _offsetY + 'px';
                } break;
                case 'center': {
                    dropdown.style.top = ry - ((bh - rh) / 2) + _offsetY + 'px';
                } break;
            }
        };

        const calculateVertical = () => {
            switch (placementB) {
                case 'left': {
                    dropdown.style.left = rx + _offsetX + 'px';
                    if (stretch) {
                        dropdown.style.width = rw + 'px';
                    }
                } break;
                case 'right': {
                    dropdown.style.left = rx + (rw - bw) + _offsetX + 'px';
                    if (stretch) {
                        dropdown.style.width = rw + 'px';
                    }
                } break;
                case 'center': {
                    dropdown.style.left = rx + ((rw - bw) / 2) + _offsetX + 'px';
                } break;
            }
        };

        switch (placementA) {
            case 'top': {
                dropdown.style.top = ry - bh - _offsetMargin + _offsetY + 'px';
                calculateVertical();
            } break;
            case 'left': {
                dropdown.style.left = rx - bw - _offsetMargin + _offsetX + 'px';
                calculateHorizontal();
            } break;
            case 'right': {
                dropdown.style.left = rx + rw + _offsetMargin + _offsetX + 'px';
                calculateHorizontal();
            } break;
            case 'bottom': {
                dropdown.style.top = ry + rh + _offsetMargin + _offsetY + 'px';
                calculateVertical();
            } break;
        }
    }

    constructor(wrapper, options = {}) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.options = options;
        this.show = false;
        this.uuid = null;
        this.disabled = false;

        this.dropdown = this.wrapper.querySelector('.custom-dropdown');
        this.body = this.wrapper.querySelector('.custom-dropdown-body') || this.dropdown;
        this.toggler = this.wrapper.querySelector('.dropdown-toggler') || null;

        this.scrollRoot = document;
        const scrollRoot = this.options.scrollRoot;
        if (scrollRoot) {
            this.scrollRoot = (scrollRoot instanceof HTMLElement) ? scrollRoot : document.querySelector(scrollRoot)
        }

        this.fhandleScroll = this.handleScroll.bind(this);
        this.fhandleResize = this.handleResize.bind(this);
        this.fhandleDismiss = this.handleDismiss.bind(this);

        this.__initialize();

        return this;
    }

    __initialize() {
        const { toggler } = this;

        if (toggler) {
            toggler.addEventListener('click', () => {
                this.__toggle();
            });
        }

        this.__updateState();
    }

    __updateState() {
        const { dropdown, toggler, uuid, show, disabled } = this;

        if (uuid) {
            dropdown.classList.add(uuid);
        } else {
            const className = dropdown.className.split(' ').filter(x => !x.startsWith('uuid-'));
            dropdown.className = className.join(' ');
        }

        dropdown.classList.toggle('show', show);
        if (toggler) {
            toggler.classList.toggle('toggled', show);
        }
    }

    __clearState() {
        const dropdown = this.dropdown;
        dropdown.style.inset = 'auto';
        dropdown.style.width = '';
        dropdown.style.maxHeight = '';
    }

    __toggle(option) {
        const dropdown = this.dropdown;
        let __show = this.show;

        if (!this.disabled) {
            if (dropdown.classList.contains('$show')) {
                dropdown.classList.remove('$show');
                __show = dropdown.classList.contains('show');
            }

            if (!__show) {
                this.__open(option);
            } else {
                this.__close();
            }
            return !__show;
        }
        return __show;
    }

    __open() {
        const { wrapper } = this;
        if (wrapper.classList.contains('disabled') || wrapper.hasAttribute('disabled')) {
            return;
        }

        if (this.show) {
            return;
        }

        const { root } = this.options;
        const uuid = 'uuid-' + Random.nextCustom(5, Random.numbers);

        this.uuid = uuid;
        this.show = true;
        this.__updateState();

        this.scrollRoot.addEventListener('scroll', this.fhandleScroll);
        window.addEventListener('mousedown', this.fhandleDismiss);
        window.addEventListener('resize', this.fhandleResize);

        this.__calculate();
    }

    __close() {
        const { root } = this.options;

        this.uuid = null;
        this.show = false;
        this.__updateState();

        this.scrollRoot.removeEventListener('scroll', this.fhandleScroll);
        window.removeEventListener('mousedown', this.fhandleDismiss);
        window.removeEventListener('resize', this.fhandleResize);
    }

    __calculate() {
        FloatingBox.calculate(this.dropdown, this.wrapper, this.options);
    }

    __destory() {
        this.__close();
    }

    setDisabled(status) {
        const wrapper = this.wrapper;
        if (status) {
            this.disabled = true;
            wrapper.classList.add('disabled');
            wrapper.setAttribute('disabled', '');
        } else {
            this.disabled = false;
            wrapper.classList.remove('disabled');
            wrapper.removeAttribute('disabled');
        }

        this.__updateState();
    }

    handleScroll() {
        this.__calculate();
    }

    handleResize() {
        this.__calculate();
    }

    handleDismiss(e) {
        const { noDismiss, onDismiss } = this.options;
        if (noDismiss) return;

        const dropdown = this.dropdown;
        const uuid = this.uuid;
        const el = e.target;

        let closest = el.closest('.' + uuid);
        if (closest !== null) return;

        const toggler = el.closest('.dropdown-toggler');

        let et = el;

        if (toggler) {
            et = toggler;
        }

        if (et.classList.contains('dropdown-toggler') && et.parentElement) {
            for (const ch of et.parentElement.children) {
                if (ch === dropdown) {
                    return;
                }
            }
        }

        if (onDismiss) {
            onDismiss();
        }

        this.__close();
    }

}



class CustomDatePicker extends FloatingBox {
    static months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    static weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    static daysInMonth(month, year) {
        return (month + 1 > 11) ? new Date(year + 1, 0, 0).getDate() : new Date(year, month + 1, 0).getDate();
    }

    static isDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    static dateOf(date) {
        if (CustomDatePicker.isDate(date))
            return date;

        const d = new Date(date);

        return CustomDatePicker.isDate(d) ? d : null;
    }

    static isEqualDate(d1, d2) {
        return d2 ? d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear() : true;
    }

    constructor(wrapper, options = {}) {
        super(wrapper, options);

        this.value = [];
        this.selectedMenu = null;
        this.currentDate = new Date();
        this.current = {
            day: this.currentDate.getDay(),
            date: this.currentDate.getDate(),
            month: this.currentDate.getMonth(),
            year: this.currentDate.getFullYear()
        };
        this.showDate = this.currentDate;
        this.created = false;

        this.fhandleSelectMenu = this.handleSelectMenu.bind(this);

        this.initialize();
    }

    initialize() {
        const { wrapper } = this;
        const { single, className, hiddenMenu, creationDate, autoEmitting } = this.options;

        this.dropdown.innerHTML = `
            <div class='${H.classNames('custom-datepicker', className, {
            'datepicker-single': single
        })}'>
                ${!single && !hiddenMenu ? (
                `<ul class="datepicker-menu">
                        <li data-select='current' class='datepicker-item'>วันนี้</li>
                        ${creationDate ? `
                            <li data-select='all' class='datepicker-item'>ทุกวัน</li>
                        ` : ''}
                        <li data-select='7-day' class='datepicker-item'>7 วันล่าสุด</li>
                        <li data-select='30-day' class='datepicker-item'>30 วันล่าสุด</li>
                        <li data-select='3-month' class='datepicker-item'>3 เดือนล่าสุด</li>
                        <li data-select='6-month' class='datepicker-item'>6 เดือนล่าสุด</li>
                        <li data-select='9-month' class='datepicker-item'>9 เดือนล่าสุด</li>
                        <li data-select='custom' class='datepicker-item'>กำหนดเอง</li>
                    </ul>`
            ) : ''}
                <div class="datepicker-content">
                    <div class='previous-datepicker datepicker-panel'>
			            <div class="datepicker-input">
				            <div class='input-date'>
					            <span class='input-append'>
						            <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							            <path d="M4.62435 2.00065H8.37435V0.958984C8.37435 0.613932 8.65299 0.333984 8.99935 0.333984C9.3457 0.333984 9.62435 0.613932 9.62435 0.958984V2.00065H10.666C11.5853 2.00065 12.3327 2.74674 12.3327 3.66732V12.0007C12.3327 12.9199 11.5853 13.6673 10.666 13.6673H2.33268C1.41211 13.6673 0.666016 12.9199 0.666016 12.0007V3.66732C0.666016 2.74674 1.41211 2.00065 2.33268 2.00065H3.37435V0.958984C3.37435 0.613932 3.65299 0.333984 3.99935 0.333984C4.3457 0.333984 4.62435 0.613932 4.62435 0.958984V2.00065ZM1.91602 12.0007C1.91602 12.2298 2.10247 12.4173 2.33268 12.4173H10.666C10.8952 12.4173 11.0827 12.2298 11.0827 12.0007V5.33398H1.91602V12.0007Z" />
						            </svg>
					            </span>
					            <input type="date" class='form-control' min="1970-01-01" />
				            </div>
				            <div class='input-time'>
					            <span class='input-append'>
						            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							            <path d="M6.37565 3.45898C6.37565 3.11263 6.6543 2.83398 7.00065 2.83398C7.34701 2.83398 7.62565 3.11263 7.62565 3.45898V6.66732L9.847 8.14648C10.1335 8.33919 10.2116 8.72721 9.99805 9.01367C9.82878 9.30013 9.44076 9.37826 9.1543 9.16471L6.6543 7.49805C6.47982 7.4043 6.37565 7.20898 6.37565 6.97721V3.45898ZM7.00065 0.333984C10.6829 0.333984 13.6673 3.31836 13.6673 7.00065C13.6673 10.6829 10.6829 13.6673 7.00065 13.6673C3.31836 13.6673 0.333984 10.6829 0.333984 7.00065C0.333984 3.31836 3.31836 0.333984 7.00065 0.333984ZM1.58398 7.00065C1.58398 9.99284 4.00846 12.4173 7.00065 12.4173C9.99284 12.4173 12.4173 9.99284 12.4173 7.00065C12.4173 4.00846 9.99284 1.58398 7.00065 1.58398C4.00846 1.58398 1.58398 4.00846 1.58398 7.00065Z" />
						            </svg>
					            </span>
					            <input type="time" class='form-control input-time' />
				            </div>
			            </div>

                        ${!single ? (
                `<div class='datepicker-nav nav-prev'>
							    <a class='datepicker-prev'>
                                    <i class="fa fa-chevron-left"></i>
                                </a>
							    <div class="datepicker-v">January 2024</div>
						    </div>
						    <table class='dates datepicker-table'>
							    <thead>
								    <tr>
									    <th>Su</th>
									    <th>Mo</th>
									    <th>Tu</th>
									    <th>We</th>
									    <th>Th</th>
									    <th>Fr</th>
									    <th>Sa</th>
								    </tr>
							    </thead>
							    <tbody></tbody>
						    </table>`
            ) : ''}
                    </div>

                    <div class='${H.classNames('current-datepicker datepicker-panel', {
                'single-table': single
            })}'>
                        ${!single ? (
                `<div class='datepicker-input'>
								<div class='input-date'>
									<span class='input-append'>
										<svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
											<path d="M4.62435 2.00065H8.37435V0.958984C8.37435 0.613932 8.65299 0.333984 8.99935 0.333984C9.3457 0.333984 9.62435 0.613932 9.62435 0.958984V2.00065H10.666C11.5853 2.00065 12.3327 2.74674 12.3327 3.66732V12.0007C12.3327 12.9199 11.5853 13.6673 10.666 13.6673H2.33268C1.41211 13.6673 0.666016 12.9199 0.666016 12.0007V3.66732C0.666016 2.74674 1.41211 2.00065 2.33268 2.00065H3.37435V0.958984C3.37435 0.613932 3.65299 0.333984 3.99935 0.333984C4.3457 0.333984 4.62435 0.613932 4.62435 0.958984V2.00065ZM1.91602 12.0007C1.91602 12.2298 2.10247 12.4173 2.33268 12.4173H10.666C10.8952 12.4173 11.0827 12.2298 11.0827 12.0007V5.33398H1.91602V12.0007Z" />
										</svg>
									</span>
									<input type="date" class='form-control' min="1970-01-01" />
								</div>
								<div class='input-time'>
									<span class='input-append'>
										<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
											<path d="M6.37565 3.45898C6.37565 3.11263 6.6543 2.83398 7.00065 2.83398C7.34701 2.83398 7.62565 3.11263 7.62565 3.45898V6.66732L9.847 8.14648C10.1335 8.33919 10.2116 8.72721 9.99805 9.01367C9.82878 9.30013 9.44076 9.37826 9.1543 9.16471L6.6543 7.49805C6.47982 7.4043 6.37565 7.20898 6.37565 6.97721V3.45898ZM7.00065 0.333984C10.6829 0.333984 13.6673 3.31836 13.6673 7.00065C13.6673 10.6829 10.6829 13.6673 7.00065 13.6673C3.31836 13.6673 0.333984 10.6829 0.333984 7.00065C0.333984 3.31836 3.31836 0.333984 7.00065 0.333984ZM1.58398 7.00065C1.58398 9.99284 4.00846 12.4173 7.00065 12.4173C9.99284 12.4173 12.4173 9.99284 12.4173 7.00065C12.4173 4.00846 9.99284 1.58398 7.00065 1.58398C4.00846 1.58398 1.58398 4.00846 1.58398 7.00065Z" />
										</svg>
									</span>
									<input type="time" class='form-control input-time' />
								</div>
							</div>`
            ) : ''}

                        <div class='datepicker-nav nav-next'>
							${single ? (
                `<a class='datepicker-prev'>
                                    <i class="fa fa-chevron-left"></i>
                                </a>`
            ) : ''}
							<div class="datepicker-v">February 2024</div>
							<a class="datepicker-next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
						</div>
						<table class='dates datepicker-table'>
							<thead>
								<tr>
									<th>Su</th>
									<th>Mo</th>
									<th>Tu</th>
									<th>We</th>
									<th>Th</th>
									<th>Fr</th>
									<th>Sa</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
                    </div>

                    ${!autoEmitting ? (
                `<div class="datepicker-footer">
							<a class='datepicker-button'>ยกเลิก</a>
							<a class='datepicker-button'>ยืนยัน</a>
						</div>`
            ) : ''}
                </div>
            </div>
        `;

        this.menu = wrapper.querySelector('.datepicker-menu');
        this.content = wrapper.querySelector('.datepicker-content');
        this.previousDatepicker = wrapper.querySelector('.previous-datepicker');
        this.currentDatepicker = wrapper.querySelector('.current-datepicker');
        this.previousTableBody = this.previousDatepicker.querySelector('.datepicker-table tbody');
        this.currentTableBody = this.currentDatepicker.querySelector('.datepicker-table tbody');

        // @ Datepicker Menu
        const menuItems = this.menu.querySelectorAll('.datepicker-item');
        for (const item of menuItems) {
            item.addEventListener('click', this.fhandleSelectMenu);
        }

        this.update();
    }

    update() {
        const { showDate, previousTableBody, currentTableBody } = this;

        // @ Render Datepicker
        const currentMonth = showDate.getMonth();
        const currentYear = showDate.getFullYear();
        let previousMonth = currentMonth - 1, previousYear = currentYear;
        if (previousMonth < 0) (previousMonth = 11, previousYear -= 1);

        this.renderDate(previousTableBody, previousMonth, previousYear);
        this.renderDate(currentTableBody, currentMonth, currentYear);
    }

    updateInputs() {

    }

    handleSelectMenu(e) {
        const item = e.currentTarget;
        const selected = item.dataset.select;

        console.log('handleSelectMenu', selected);
    }

    handleSelectDate(date) {
        const { created, value: __value } = this;
        const { autoEmitting, emitWithCreation, singleDate } = this.options;

        let value = null, _created = false;
        if (singleDate) {
            value = [date];
        } else {
            const startDate = CustomDatePicker.dateOf(__value[0]);
            const endDate = CustomDatePicker.dateOf(__value[1]);

            if (startDate && date > startDate && !created) {
                date.setHours(23, 59, 59, 0);
                value = [startDate, date];
                _created = true;
            } else if ((startDate && endDate) || !(startDate || endDate)) {
                date.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 0);
                value = [date, endDate];
                _created = false;
            }
        }

        if (value === null) return;

        this.value = value;
        this.selectedMenu = 'custom';
        this.created = _created;

        this.updateInputs();
        this.update();

        if (autoEmitting) {
            this.emit();
        }
    }

    renderDate(target, month, year) {
        const { value, currentDate } = this;
        const { allRange, singleDate, minimumDate } = this.options;

        const days = CustomDatePicker.daysInMonth(month, year);
        const startDay = new Date(year, month, 1).getDay();
        const startDayAt = (startDay - 1 < 0 ? 6 : startDay - 1);

        let startDate = CustomDatePicker.dateOf(value[0]),
            endDate = null;
        if (!singleDate) {
            endDate = CustomDatePicker.dateOf(value[1]);
        }

        const startTime = startDate ? (
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            ).getTime()
        ) : null;
        const endTime = endDate ? (
            new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
            ).getTime()
        ) : null;

        target.replaceChildren();

        for (let i = 0; i < Math.ceil((days + startDayAt + 1) / 7); ++i) {
            const tr = document.createElement('tr');

            for (let j = 0; j < 7; ++j) {
                const td = document.createElement('td');
                const d = j + (7 * i) - startDayAt;
                const date = new Date(year, month, d);
                const time = date.getTime();

                // @ Check out of date
                let outdate = !(allRange || date < currentDate);
                if (minimumDate) {
                    outdate = (date < minimumDate);
                }

                // @ Check Date
                let alone = false, start = false, end = false, selected = false;
                if (startTime === time) {
                    if (startTime === endTime) {
                        alone = true;
                    } else {
                        start = true;
                    }
                } else if (endTime === time) {
                    end = true;
                } else if (time > startTime && time < endTime) {
                    selected = true;
                }

                if (d > 0 && d <= days) {
                    td.className = H.classNames({
                        'current': d === this.current.date && month === this.current.month && year === this.current.year,
                        'outdate': outdate,
                        'alone': alone || (singleDate && start),
                        'start': start && !singleDate,
                        'end': end,
                        'selected': selected
                    });
                    td.textContent = d;

                    td.addEventListener('click', () => {
                        if (!outdate) this.handleSelectDate(date);
                    });
                }

                tr.appendChild(td);
            }

            target.appendChild(tr);
        }
    }

    destory() {
        super.__destory();
    }

    emit() {

    }

}



class Popup {

    static __instance__ = null;

    static getInstance() {
        if (!this.__instance__) this.__instance__ = new this();
        return this.__instance__;
    }

    constructor() {
        this.backdrop = document.querySelector('.swal-backdrop');

        if (!this.backdrop) {
            const bd = document.createElement('div');
            bd.classList.add('swal-backdrop');
            bd.style.display = 'none';
            document.body.appendChild(bd);
            this.backdrop = bd;
        }

        this.$popup = null;
        this.dismiss = null;
        this.popupFrames = new WeakSet();
        this.popupCurrent = [];
        this.options = {
            closeOnBackdrop: true
        };

        this.fs = this.handleAnimationEnd.bind(this);
        this.gs = this.handleCloseBackdrop.bind(this);
    }

    isOpen(item = null) {
        if (item) {
            return this.popupCurrent.some(o => o === item);
        }

        return this.popupCurrent.length > 0;
    }

    openPopup(popup, item, options = {}, force = true) {
        // Add event for closing popup

        if (force) {
            for (const c of this.popupCurrent) {
                c.classList.remove('animate__bounceIn', 'animate__bounceOut');
            }

            this.popupCurrent = [];
        }

        if (this.popupCurrent.some(o => o === item)) {
            return Promise.resolve(false);
        }

        // Clear state from differenct popup
        if (this.$popup && this.$popup !== popup) {
            this.$popup.classList.remove('show');
        }

        this.$popup = popup;
        popup.classList.add('popup-wrapper');

        if (!this.popupFrames.has(item)) {
            this.popupFrames.add(item);

            item.addEventListener('animationend', this.fs);
            item.addEventListener('webkitAnimationEnd', this.fs);
            item.addEventListener('oAnimationEnd', this.fs);
            item.addEventListener('MSAnimationEnd', this.fs);

            popup.addEventListener('mousedown', this.gs);
        }

        Object.assign(this.options, {
            closeOnBackdrop: true,
            ...options
        });

        popup.classList.add('show');
        this.popupCurrent.push(item);

        // Open State
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0';
        this.backdrop.classList.add('show');
        this.backdrop.style.display = '';
        setTimeout(() => {
            this.backdrop.style.display = '';
        }, 1);

        item.classList.add('animate__bounceIn');

        return new Promise(resolve => {
            this.dismiss = resolve;
        });
    }

    closePopup(item) {
        if (this.popupCurrent.some(o => o === item)) {
            item.classList.add('animate__bounceOut');

            // Change resolver
            if (this.dismiss) {
                this.dismiss({ dismiss: 'close' });
            }

            return new Promise(resolve => {
                this.dismiss = resolve;
            });
        }

        return Promise.resolve(false);
    }

    closePopupImmediately(popup, closeWrapper = false) {
        // Clear currents
        this.popupCurrent = [];

        // Close Popup
        if (closeWrapper) {
            popup.classList.remove('show');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Dismiss
        if (this.dismiss) {
            this.dismiss({ dismiss: 'closeImmediately' });
            this.dismiss = null;
        }
    }

    closeBackdrop() {
        if (this.popupCurrent.length > 0) return;

        this.backdrop.classList.remove('show');
        setTimeout(() => {

            if (this.popupCurrent.length > 0) return;

            this.backdrop.style.display = 'none';
        }, 700);
    }

    handleAnimationEnd(event) {
        const item = event.target;

        if (item.classList.contains('animate__bounceOut')) {
            item.classList.remove('show', 'animate__bounceIn', 'animate__bounceOut');

            this.popupCurrent = this.popupCurrent.filter(o => o !== item);

            if (this.popupCurrent.length === 0) {
                this.$popup.classList.remove('show');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }

            this.closeBackdrop();

            if (this.dismiss) {
                this.dismiss({ dismiss: 'close' });
                this.dismiss = null;
            }

            return true;
        }

        item.classList.remove('animate__bounceIn', 'animate__bounceOut');
    }

    // ! support only single popup
    handleCloseBackdrop(event) {
        if (this.options.closeOnBackdrop) {
            if (event.target.classList.contains('popup-wrapper')) {
                this.closePopup(this.popupCurrent[0]).then(() => {
                    if (this.resolver) {
                        this.resolver({ dismiss: 'backdrop' });
                    }

                    this.resolver = null;
                    this.closeBackdrop();
                });
            }
        }
    }

}



class CustomSweetAlert {

    static alertType = ['saving', 'success', 'danger', 'loading'];

    static loadingHtml = `
        <div class='text-center'>
            <lord-icon class='swal-loading' src="/assets/images/swal/save-file.json" trigger="loop"></lord-icon>
            <p class='h4 text-purple-30 mb-2'>เรากำลังทำงานอย่างหนักเพื่อคุณ !</p>
            <p class='text-gray30'>อดใจอีกสักนิดนะคะ...ระบบกำลังบันทึก การเปลี่ยนแปลง,<br />
            ตั้งค่า หรือแก้ไข ข้อมูลต่าง ๆ ตามที่คุณต้องการ ใช้เวลาไม่นานค่ะ</p>
        </div>
    `;

    constructor(swalSelector = '.system-swal', options = {}) {
        const swalHtml = `<div class="system-swal">
            <div class="swal-wrapper">
                <div class="swal-content">
                    <div class="swal-close">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.8965 7.09832C24.6183 6.82026 24.2412 6.66406 23.8479 6.66406C23.4546 6.66406 23.0774 6.82026 22.7993 7.09832L15.9974 13.9002L9.19553 7.09832C8.9174 6.82026 8.54021 6.66406 8.14693 6.66406C7.75364 6.66406 7.37646 6.82026 7.09832 7.09832C6.82026 7.37646 6.66406 7.75364 6.66406 8.14693C6.66406 8.54021 6.82026 8.9174 7.09832 9.19553L13.9002 15.9974L7.09832 22.7993C6.82026 23.0774 6.66406 23.4546 6.66406 23.8479C6.66406 24.2412 6.82026 24.6183 7.09832 24.8965C7.37646 25.1745 7.75364 25.3307 8.14693 25.3307C8.54021 25.3307 8.9174 25.1745 9.19553 24.8965L15.9974 18.0946L22.7993 24.8965C23.0774 25.1745 23.4546 25.3307 23.8479 25.3307C24.2412 25.3307 24.6183 25.1745 24.8965 24.8965C25.1745 24.6183 25.3307 24.2412 25.3307 23.8479C25.3307 23.4546 25.1745 23.0774 24.8965 22.7993L18.0946 15.9974L24.8965 9.19553C25.1745 8.9174 25.3307 8.54021 25.3307 8.14693C25.3307 7.75364 25.1745 7.37646 24.8965 7.09832Z" />
                        </svg>
                    </div>
                    <img draggable="false" class="swal-banner" style="display: none;" />
                    <img draggable="false" class="swal-avatar" style="display: none;" />

                    <div class="swal-inner">
                        <h4 class="swal-title mb-2" style="display: none;"></h4>
                        <p class="swal-text p3 mb-0" style="display: none;"></p>
                        <div class="swal-custom mb-0" style="display: none;"></div>

                        <div class="swal-btns" style="display: none;">
                            <button class="swal-btn-cancel btn system-btn btn-a btn-rounded" style="display: none;"></button>
                            <button class="swal-btn-confirm btn system-btn btn-rounded" style="display: none;"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', swalHtml);

        const swalOuter = document.querySelector(swalSelector);
        if (!swalOuter) throw 'cann\'t find swal element from selector.';

        this.popup = Popup.getInstance();
        this.swalOuter = swalOuter;
        this.swalWrapper = swalOuter.querySelector('.swal-wrapper');
        this.swalContent = swalOuter.querySelector('.swal-content');
        this.swalInner = swalOuter.querySelector('.swal-inner');
        this.swalBanner = swalOuter.querySelector('.swal-banner');
        this.swalAvatar = swalOuter.querySelector('.swal-avatar');
        this.swalClose = swalOuter.querySelector('.swal-close');
        this.swalTitle = this.swalInner.querySelector('.swal-title');
        this.swalText = this.swalInner.querySelector('.swal-text');
        this.swalCustom = this.swalInner.querySelector('.swal-custom');
        this.swalButtonWrapper = this.swalInner.querySelector('.swal-btns');
        this.swalButtonCancel = this.swalInner.querySelector('.swal-btn-cancel');
        this.swalButtonConfirm = this.swalInner.querySelector('.swal-btn-confirm');
        this.resolver = null;
        this.show = false;

        this.options = Object.assign({
            type: null,
            title: null,
            titleColor: null,
            text: null,
            textColor: null,
            bannerType: '',
            iconType: '',
            showConfirmButton: true,
            showCancelButton: true,
            confirmText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            closePopupImmediately: false,
            closeOnBackdrop: true,
            timer: 0,
            customHtml: null
        }, options);

        this.swalButtonConfirm.onclick = this.confirm.bind(this);
        this.swalButtonCancel.onclick = this.cancel.bind(this);
        this.swalClose.onclick = this.close.bind(this);
    }

    setOptions(options) {
        this.options = Object.assign(this.options, options);
    }

    open(options = {}) {
        return new Promise(resolve => {

            //if (this.show) return;

            const { timer } = this.options;
            this.resolver = resolve;

            Object.assign(this.options, {
                type: null,
                title: null,
                titleColor: null,
                text: null,
                textColor: null,
                bannerType: '',
                iconType: '',
                bannerSrc: null,
                avatarSrc: null,
                showConfirmButton: true,
                showCancelButton: true,
                confirmText: 'ยืนยัน',
                cancelText: 'ยกเลิก',
                closePopupImmediately: false,
                closeOnBackdrop: true,
                timer: 0,
                customHtml: null,
                ajaxConfirm: null,
                ajaxCancel: null,
                ajaxLoading: true
            }, options);

            this.render();

            this.popup.openPopup(this.swalOuter, this.swalContent, this.options);

            if (timer > 0) {
                setTimeout(() => {
                    this.close();
                    this.resolver({ dismiss: 'timeout' });
                    this.resolver = null;
                }, timer);
            }
        });
    }

    close(closeWrapper = true) {
        if (this.options.closePopupImmediately) {
            this.popup.closePopupImmediately(this.swalOuter, closeWrapper);

            if (this.resolver) this.resolver({ dismiss: 'close' });

            this.resolver = null;
            /*this.popup.closeBackdrop(); change to call by popup animationEnd */

            return Promise.resolve(true);
        } else {
            this.popup.closePopup(this.swalContent).then(() => {
                return new Promise(resolve => {
                    if (this.resolver) {
                        this.resolver({ dismiss: 'close' });
                    }

                    this.resolver = null;
                    /*this.popup.closeBackdrop(); change to call by popup animationEnd */

                    resolve(true);
                });
            });
        }
    }

    closeImmediately(closeWrapper = true) {
        this.popup.closePopupImmediately(this.swalOuter, closeWrapper);

        if (this.resolver) this.resolver({ dismiss: 'close' });

        this.resolver = null;
    }

    async confirm() {
        const { ajaxConfirm, ajaxLoading } = this.options;

        if (ajaxConfirm) {
            if (ajaxLoading) {
                this.renderLoading();
            }

            const result = await ajaxConfirm(this);
            if (result) return Promise.resolve();
        }

        if (this.options.closePopupImmediately) {
            this.popup.closePopupImmediately(this.swalOuter, closeWrapper);
        } else {
            this.popup.closePopup(this.swalContent);
        }

        if (this.resolver) {
            this.resolver({ dismiss: 'confirm', isConfirmed: true });
        }

        this.resolver = null;
        /*this.popup.closeBackdrop(); change to call by popup animationEnd */
    }

    async cancel() {
        const { ajaxCancel, ajaxLoading } = this.options;

        if (ajaxCancel) {
            if (ajaxLoading) {
                this.renderLoading();
            }

            await ajaxCancel();
        }

        if (this.options.closePopupImmediately) {
            this.popup.closePopupImmediately(this.swalOuter, closeWrapper);
        } else {
            this.popup.closePopup(this.swalContent);
        }

        if (this.resolver) {
            this.resolver({ dismiss: 'cancel' });
        }

        this.resolver = null;
        /*this.popup.closeBackdrop(); change to call by popup animationEnd */
    }

    render() {
        let banner = null, avatar = null;
        const { type, title, titleColor, text, textColor, customHtml, bannerSrc, avatarSrc, showConfirmButton, showCancelButton, confirmText, cancelText } = this.options;

        if (CustomSweetAlert.alertType.includes(type)) {
            banner = `/assets/images/swal/banner-${type}.png`;
            avatar = `/assets/images/swal/icon-${type}.png`;
        }

        if (bannerSrc) banner = bannerSrc;
        if (avatarSrc) avatar = avatarSrc;

        if (banner) {
            this.swalBanner.setAttribute('src', banner);
            this.swalBanner.style.display = '';
        } else {
            this.swalBanner.style.display = 'none';
            this.swalBanner.removeAttribute('src');
        }

        if (avatar) {
            this.swalAvatar.setAttribute('src', avatar);
            this.swalAvatar.style.display = '';
        } else {
            this.swalAvatar.style.display = 'none';
            this.swalAvatar.removeAttribute('src');
        }

        this.swalTitle.innerHTML = title || '';
        this.swalTitle.style.display = title ? '' : 'none';
        this.swalTitle.style.color = '';

        if (titleColor) {
            this.swalTitle.style.color = titleColor;
        } else if (type === 'danger') {
            this.swalTitle.style.color = '#F64646';
        } else if (type === 'success') {
            this.swalTitle.style.color = '#00C17C';
        }

        this.swalText.innerHTML = text || '';
        this.swalText.style.display = text ? '' : 'none';

        if (textColor) {
            this.swalText.style.color = textColor;
        }

        this.swalCustom.innerHTML = customHtml || '';
        this.swalCustom.style.display = customHtml ? '' : 'none';

        if (showConfirmButton || showCancelButton) {
            this.swalButtonWrapper.style.display = '';

            this.swalButtonConfirm.textContent = showConfirmButton ? confirmText : '';
            this.swalButtonConfirm.style.display = showConfirmButton ? '' : 'none';

            this.swalButtonCancel.textContent = showCancelButton ? cancelText : '';
            this.swalButtonCancel.style.display = showCancelButton ? '' : 'none';

            if (showConfirmButton && showCancelButton) {
                this.swalButtonWrapper.style.justifyContent = '';
            } else {
                this.swalButtonWrapper.style.justifyContent = 'center';
            }
        } else {
            this.swalButtonWrapper.style.display = 'none';
        }
    }

    renderLoading() {
        this.swalAvatar.style.display = 'none';
        this.swalTitle.style.display = 'none';
        this.swalText.style.display = 'none';
        this.swalButtonWrapper.style.display = 'none';
        this.swalCustom.innerHTML = CustomSweetAlert.loadingHtml;
        this.swalCustom.style.display = '';
    }

    renderLoading() {
        this.swalAvatar.style.display = 'none';
        this.swalTitle.style.display = 'none';
        this.swalText.style.display = 'none';
        this.swalButtonWrapper.style.display = 'none';
        this.swalCustom.innerHTML = CustomSweetAlert.loadingHtml;
        this.swalCustom.style.display = '';
    }

}



class CustomTabs {

    static bsOpen(tabContent) {
        const tab =
            (tabContent instanceof HTMLElement) ? tabContent :
                (tabContent instanceof window.jQuery) ? tabContent.get(0) :
                    document.querySelector(tabContent);

        if (!tab) throw 'not found element tab.';

        const parent = tab.parentElement;
        const active = Array.from(parent.children).find(e => e.classList.contains('active'));
        if (active && active !== tab) {
            active.classList.remove('show');

            if (active.classList.contains('fade')) {
                setTimeout(() => {
                    active.classList.remove('active');

                    tab.classList.add('active', 'show');
                }, 150);
            } else {
                active.classList.remove('active');
                tab.classList.add('active', 'show');
            }
        }
    }

    constructor(wrapper, options = {}) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.options = options;
        this.selected = null;
        this.navigate = this.wrapper.querySelector('.tabs-navigate');

        if (this.wrapper.dataset.init) {
            this.selected = this.wrapper.dataset.init;
        }

        if (this.options.init) {
            this.selected = this.options.init;
        }

        this.fhandleSelectTab = this.handleSelectTab.bind(this);

        this.update();
    }

    update() {
        const { selected } = this;
        if (selected) {
            const tabs = this.wrapper.querySelectorAll('.tabs-item[data-tab]');

            for (let index = 0; index < tabs.length; ++index) {
                const tab = tabs[index];
                const tabName = tab.dataset.tab;
                const span = tab.querySelector('span');

                span.removeEventListener('click', this.fhandleSelectTab);
                span.addEventListener('click', this.fhandleSelectTab);

                if (tabName === selected) {
                    this.navigate.style.width = `calc(${100 / tabs.length}% - 2px)`;
                    this.navigate.style.transform = `translateX(${index * 100}%)`;

                    tab.classList.toggle('active', tabName === selected);
                } else {
                    tab.classList.remove('active');
                }
            }
        } else {
            this.navigate.style.transform = '';
            this.navigate.style.width = '0px';
        }
    }

    previous() {
        const { selected } = this;
        if (selected) {
            const tabSelected = this.wrapper.querySelector(`.tabs-item[data-tab='${this.selected}']`);
            if (!tabSelected) return;

            const previous = tabSelected.previousElementSibling;
            if (!previous) return;

            if (previous.classList.contains('tabs-item')) {
                this.selected = previous.dataset.tab;
                this.update();
            }
        }
    }

    next() {
        const { selected } = this;
        if (selected) {
            const tabSelected = this.wrapper.querySelector(`.tabs-item[data-tab='${this.selected}']`);
            if (!tabSelected) return;

            const next = tabSelected.nextElementSibling;
            if (!next) return;

            if (next.classList.contains('tabs-item')) {
                this.selected = next.dataset.tab;
                this.update();
            }
        }
    }

    to(nameTab) {
        if (nameTab === this.selected) return;

        const findTab = this.wrapper.querySelector(`.tabs-item[data-tab='${nameTab}']`);
        if (!findTab) return;

        this.selected = findTab.dataset.tab;
        this.update();
    }

    current() {
        return this.selected;
    }

    handleSelectTab(e) {
        const target = e.currentTarget.parentElement;
        this.selected = target.dataset.tab || null;

        if (this.options.onSelect) {
            this.options.onSelect(this.selected, target, this);
        }

        this.update();
    }

}



class CustomFilter {

    constructor(wrapper, instanceLinked = null) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.title = this.wrapper.querySelector('.filter-title');
        this.value = this.wrapper.querySelector('.filter-value');
        this.badge = this.wrapper.querySelector('.filter-badge') || null;
        this.label = this.wrapper.querySelector('.filter-label') || null;
        this.toggler = this.wrapper.querySelector('.filter-toggler') || null;
        this.instanceLinked = instanceLinked;
        const close = document.createElement('span');
        close.className = 'filter-close';
        close.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33716 2.66285C9.23285 2.55858 9.09141 2.5 8.94393 2.5C8.79644 2.5 8.655 2.55858 8.5507 2.66285L6 5.21354L3.4493 2.66285C3.345 2.55858 3.20356 2.5 3.05607 2.5C2.90859 2.5 2.76715 2.55858 2.66285 2.66285C2.55858 2.76715 2.5 2.90859 2.5 3.05607C2.5 3.20356 2.55858 3.345 2.66285 3.4493L5.21354 6L2.66285 8.5507C2.55858 8.655 2.5 8.79644 2.5 8.94393C2.5 9.09141 2.55858 9.23285 2.66285 9.33716C2.76715 9.44143 2.90859 9.5 3.05607 9.5C3.20356 9.5 3.345 9.44143 3.4493 9.33716L6 6.78646L8.5507 9.33716C8.655 9.44143 8.79644 9.5 8.94393 9.5C9.09141 9.5 9.23285 9.44143 9.33716 9.33716C9.44143 9.23285 9.5 9.09141 9.5 8.94393C9.5 8.79644 9.44143 8.655 9.33716 8.5507L6.78646 6L9.33716 3.4493C9.44143 3.345 9.5 3.20356 9.5 3.05607C9.5 2.90859 9.44143 2.76715 9.33716 2.66285Z" />
            </svg>`;

        this.wrapper.appendChild(close);
        this.close = close;

        if (this.instanceLinked) {
            const { safeWidth } = this.instanceLinked.options;
            if (safeWidth) {
                this.value.style.maxWidth = safeWidth + 'px';
                this.value.style.overflow = 'hidden';
                this.value.style.whiteSpace = 'nowrap';
                this.value.style.textOverflow = 'ellipsis';
            }
        }

        this.close.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (this.instanceLinked) {
                this.instanceLinked.clearValue();
            }
        };
    }

    getMaximumWidth() {
        const padding = 8;
        let width = 20 + (2 * padding);

        width += this.title.offsetWidth;

        if (this.instanceLinked) {
            const { safeWidth } = this.instanceLinked.options;

            if (safeWidth === 'auto') {
                width += this.value.offsetWidth;
            } else width += safeWidth;
        }

        if (this.badge) width += 42;
        if (this.toggler) width += 16;

        return width;
    }

    getText() {
        return this.value.innerHTML;
    }

    setText(text) {
        this.value.innerHTML = text || '';
    }

    hasBadge() {
        return Boolean(this.badge);
    }

    setBadge(text) {
        if (this.badge) {
            this.badge.textContent = text || '';
            this.badge.classList.toggle('show', Boolean(text));
        }
    }

    setActive(state) {
        this.wrapper.classList.toggle('active', state);
    }

    setDisabled(state) {
        const { wrapper } = this;
        wrapper.classList.toggle('disabled', state);
        if (state) wrapper.setAttribute('disabled', '');
        wrapper.removeAttribute('disabled');
    }

    setFill(state) {
        this.wrapper.classList.toggle('fill', state);
    }

    clearText() {
        this.value.textContent = '';
        if (this.badge) this.badge.textContent = '';
    }

}



class CustomModal {

    constructor(wrapper) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.modalWrapper = this.wrapper.querySelector('.modal-wrapper');
        this.modalContent = this.wrapper.querySelector('.modal-container');
        this.modalClose = this.wrapper.querySelector('.modal-close');
        this.options = {};

        this.popup = Popup.getInstance();

        if (this.modalClose) {
            this.modalClose.onclick = this.close.bind(this);
        }
    }

    open(options = {}) {
        return new Promise(resolve => {
            const { timer } = this.options;
            this.resolver = resolve;

            Object.assign(this.options, options);

            this.popup.openPopup(this.wrapper, this.modalContent, options);

            if (timer > 0) {
                setTimeout(() => {
                    this.close();
                    this.resolver({ dismiss: 'timeout' });
                    this.resolver = null;
                }, timer);
            }
        });
    }

    close(closeWrapper = true) {
        if (this.options.closePopupImmediately) {
            this.popup.closePopupImmediately(this.wrapper, closeWrapper);

            if (this.resolver) this.resolver({ dismiss: 'close' });

            this.resolver = null;
            /*this.popup.closeBackdrop(); change to call by popup animationEnd */

            return Promise.resolve(true);
        } else {
            return new Promise(resolve => {
                this.popup.closePopup(this.modalContent).then(() => {
                    if (this.resolver) {
                        this.resolver({ dismiss: 'close' });
                    }

                    this.resolver = null;
                    /*this.popup.closeBackdrop(); change to call by popup animationEnd */

                    resolve(true);
                });
            });
        }
    }

    closeImmediately(closeWrapper = true) {
        this.popup.closePopupImmediately(this.wrapper, closeWrapper);

        if (this.resolver) this.resolver({ dismiss: 'close' });

        this.resolver = null;
    }

}



class CustomBreadcrumb {

    constructor(wrapper, options = {}) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.options = options;
        this.breadItems = Array.from(this.wrapper.getElementsByClassName('bread-item'));

        this.fhandleSelect = this.handleSelect.bind(this);

        this.update();
    }

    update() {
        const last = String(this.breadItems.length - 1);
        for (const index in this.breadItems) {
            const item = this.breadItems[index];
            const value = item.dataset.id || item.textContent;

            if (index === last) {
                item.classList.add('active');
                item.onclick = null;
            } else {
                item.classList.remove('active');
                item.onclick = () => {
                    this.fhandleSelect(item, value, index);
                };
            }
        }
    }

    handleSelect(item, value, index) {
        this.clear(index);

        if (this.options.onSelect) {
            this.options.onSelect(value, item, index);
        }
    }

    add(value, text = null) {
        if (this.breadItems.some(o => {
            return (o.dataset.id || o.textContent) === value;
        })) return;

        const item = document.createElement('a');
        item.classList.add('bread-item');
        item.dataset.id = value;
        item.textContent = text ? text : value;

        this.wrapper.appendChild(item);
        this.breadItems.push(item);

        this.update();
    }

    remove(value) {
        const index = this.breadItems.findIndex(o => {
            return (o.dataset.id || o.textContent) === value;
        });

        if (index === -1) return;

        this.breadItems[index].remove();
        this.breadItems.splice(index, 1);

        this.update();
    }

    removeIndex(index) {
        if (index > -1 && index < this.breadItems.length) {
            this.breadItems[index].remove();
            this.breadItems.splice(index, 1);
        }
    }

    clear(index = -1) {
        const newItems = [];
        for (const i in this.breadItems) {
            const item = this.breadItems[i];
            if (i > index) item.remove();
            else newItems.push(item);
        }

        this.breadItems = newItems;
        this.update();
    }

    pop() {
        if (this.breadItems.length > 0) {
            this.removeIndex(this.breadItems.length - 1);
        }
    }

    unshift() {
        if (this.breadItems.length > 0) {
            this.removeIndex(0);
        }
    }

}



class CustomDraggable {

    constructor(wrapper, options = {}) {
        this.wrapper = (wrapper instanceof HTMLElement) ? wrapper : document.querySelector(wrapper);

        if (!this.wrapper) throw 'not found element wrapper.';

        this.options = options;

        const { handle } = this.options;

        this.fhandleDragStart = this.handleDragStart.bind(this);
        this.fhandleDragOver = this.handleDragOver.bind(this);
        this.fhandleDragEnd = this.handleDragEnd.bind(this);

        this.update();
    }

    update() {
        this.dragItems = Array.from(this.wrapper.getElementsByClassName('menu-item'));
        this.wrapper.ondragover = this.fhandleDragOver;

        for (const item of this.dragItems) {
            item.draggable = true;
            item.ondragstart = this.fhandleDragStart;
            item.ondragend = this.fhandleDragEnd;
        }
    }

    handleDragStart(e) {
        const el = e.currentTarget;
        this.wrapper.classList.add('dragging');
        setTimeout(() => el.classList.add('dragging'), 0);
    }

    handleDragEnd(e) {
        const el = e.currentTarget;
        this.wrapper.classList.remove('dragging');
        el.classList.remove('dragging');

        if (this.options.onSort) {
            const siblings = Array.from(this.wrapper.getElementsByClassName('menu-item'));
            const rearrange = siblings.map((sibling, index) => ({
                id: sibling.dataset.draggableId,
                order: index + 1
            }));

            this.options.onSort(rearrange, el);
        }
    }

    handleDragOver(e) {
        const el = e.currentTarget;
        const dragging = el.querySelector('.dragging');
        const siblings = Array.from(el.querySelectorAll('.menu-item:not(.dragging)'));
        const nextSibling = siblings.find(sibling => {
            const r = sibling.getBoundingClientRect();
            return e.clientY <= r.top + (r.height / 2);
        });

        const prevSibling = siblings.reverse().find(sibling => {
            const r = sibling.getBoundingClientRect();
            return e.clientY > r.top + (r.height / 2);
        });

        //console.log(nextSibling)
        if (nextSibling) {
            // Animation
            //console.log(dragging.dataset.draggableId, nextSibling.dataset.draggableId);
            //nextSibling.style.transform = 'translate3d(0, -100%, 0)';

            //setTimeout(() => {
            //    nextSibling.style.transform = '';
            //    el.insertBefore(dragging, nextSibling)
            //}, 250);

            el.insertBefore(dragging, nextSibling);
        }

        if (prevSibling) {
            //console.log('prev :', prevSibling);

            el.insertBefore(prevSibling, dragging);
        }
    }

}



class AnimateEnvironments {

    static measureBox(_box) {
        const styled = window.getComputedStyle(_box);
        const usedUnseen = _box.classList.contains('unseen');
        if (styled.display === 'none' || styled.display === 'contents') {
            if (usedUnseen) _box.classList.remove('unseen');
            _box.style.position = 'relative';
            _box.style.visibility = 'hidden';
            _box.style.zIndex = '-9999';
        }

        const rect = _box.getBoundingClientRect();
        rect.mt = parseInt(styled.marginTop) || 0;
        rect.ms = parseInt(styled.marginLeft) || 0;
        rect.me = parseInt(styled.marginRight) || 0;
        rect.mb = parseInt(styled.marginBottom) || 0;
        _box.style.position = '';
        _box.style.visibility = '';
        _box.style.zIndex = '';
        if (usedUnseen) _box.classList.add('unseen');

        return rect;
    }

    static growBox(_box, rect) {
        return new Promise(resolver => {
            const div = document.createElement('div');
            _box.parentNode.insertBefore(div, _box.nextSibling);
            div.style.transition = 'all .2s ease';
            div.style.width = '0px';
            div.style.height = '0px';

            setTimeout(() => {
                div.style.width = `${rect.width + rect.ms + rect.me}px`;
                div.style.height = `${rect.height + rect.mt + rect.mb}px`;
            }, 1);

            setTimeout(() => {
                resolver();
                div.remove();
            }, 200);
        });
    }

    static ingrowBox(_box, rect) {
        const div = document.createElement('div');
        div.style.transition = 'all .2s ease';
        div.style.width = `${rect.width + rect.ms + rect.me}px`;
        div.style.height = `${rect.height + rect.mt + rect.mb}px`;
        _box.parentNode.insertBefore(div, _box.nextSibling);

        setTimeout(() => {
            div.style.width = '0px';
            div.style.height = '0px';
        }, 1);

        setTimeout(() => div.remove(), 200);
    }

}



class CustomSnackBar {

    static open(snackBarSelector) {
        const snackBar = (snackBarSelector instanceof HTMLElement) ? snackBarSelector : document.querySelector(snackBarSelector);
        if (!snackBar) throw 'not found element wrapper.';

        if (!snackBar.classList.contains('unseen')) return;
        const collape = this.getCollape(snackBar);

        const rectBox = AnimateEnvironments.measureBox(snackBar);
        AnimateEnvironments.growBox(snackBar, rectBox).then(() => {
            snackBar.classList.remove('unseen');
            snackBar.classList.add('animate__flipInX');
        });

        if (collape) {
            const fs = () => {
                collape.removeEventListener('animationend', fs);
                collape.removeEventListener('webkitAnimationEnd', fs);
                collape.removeEventListener('oAnimationEnd', fs);
                collape.removeEventListener('MSAnimationEnd', fs);

                collape.classList.add('unseen');
                collape.classList.remove('animate__flipOutX');
            };

            collape.addEventListener('animationend', fs);
            collape.addEventListener('webkitAnimationEnd', fs);
            collape.addEventListener('oAnimationEnd', fs);
            collape.addEventListener('MSAnimationEnd', fs);
            collape.classList.add('animate__flipOutX');
        }
    }

    static close(snackBarSelector) {
        const snackBar = (snackBarSelector instanceof HTMLElement) ? snackBarSelector : document.querySelector(snackBarSelector);
        if (!snackBar) throw 'not found element wrapper.';

        if (snackBar.classList.contains('unseen')) return;

        const collape = this.getCollape(snackBar);
        const rectBox = AnimateEnvironments.measureBox(snackBar);
        snackBar.classList.remove('animate__flipInX');

        const fs = () => {
            snackBar.removeEventListener('animationend', fs);
            snackBar.removeEventListener('webkitAnimationEnd', fs);
            snackBar.removeEventListener('oAnimationEnd', fs);
            snackBar.removeEventListener('MSAnimationEnd', fs);

            snackBar.classList.add('unseen');
            snackBar.classList.remove('animate__flipOutX');

            AnimateEnvironments.ingrowBox(snackBar, rectBox);
        };

        snackBar.addEventListener('animationend', fs);
        snackBar.addEventListener('webkitAnimationEnd', fs);
        snackBar.addEventListener('oAnimationEnd', fs);
        snackBar.addEventListener('MSAnimationEnd', fs);
        snackBar.classList.add('animate__flipOutX');
        if (collape) {
            collape.classList.remove('unseen');
            collape.classList.add('animate__flipInX');
        }
    }

    static toggle(snackBarSelector) {
        const snackBar = (snackBarSelector instanceof HTMLElement) ? snackBarSelector : document.querySelector(snackBarSelector);
        if (!snackBar) throw 'not found element wrapper.';

        if (snackBar.classList.contains('unseen')) {
            return this.show(snackBar);
        }

        return this.close(snackBar);
    }

    static hide(snackBarSelector) {
        const snackBar = (snackBarSelector instanceof HTMLElement) ? snackBarSelector : document.querySelector(snackBarSelector);
        if (!snackBar) throw 'not found element wrapper.';
        const collape = this.getCollape(snackBar);

        snackBar.classList.add('d-none');
        if (collape) {
            collape.classList.add('d-none');
        }
    }

    static show(snackBarSelector) {
        const snackBar = (snackBarSelector instanceof HTMLElement) ? snackBarSelector : document.querySelector(snackBarSelector);
        if (!snackBar) throw 'not found element wrapper.';
        const collape = this.getCollape(snackBar);

        snackBar.classList.remove('d-none');
        if (collape) {
            collape.classList.remove('d-none');
        }
    }

    static getCollape(snackBar) {
        return document.querySelector(`[data-snackbar-collape='${snackBar.id}']`);
    }

}



class CustomBankCollapes {

    static expand(selector) {
        const wrapper = (selector instanceof HTMLElement) ? selector : document.querySelector(selector);
        if (!wrapper) return;

        const actions = wrapper.querySelector('.bank-actions');
        const tooltip = CustomTooltip.getTooltipInstance(wrapper);

        if (tooltip) {
            tooltip.hide();
            tooltip.disable();
        }

        wrapper.classList.remove('collape');
    }

    static collape(selector) {
        const wrapper = (selector instanceof HTMLElement) ? selector : document.querySelector(selector);
        if (!wrapper) return;

        const actions = wrapper.querySelector('.bank-actions');
        const tooltip = CustomTooltip.getTooltipInstance(wrapper);

        if (tooltip) tooltip.enable();

        actions.style.display = 'none';
        wrapper.classList.add('collape');

        setTimeout(() => actions.style.display = '', 200);
    }

    static toggle(selector) {
        const wrapper = (selector instanceof HTMLElement) ? selector : document.querySelector(selector);
        if (!wrapper) return;

        if (wrapper.classList.contains('collape')) {
            this.expand(wrapper);
        } else {
            this.collape(wrapper);
        }
    }

}



class Aria {

    constructor() {
        this.storeService = new Map;
        this.cacheService = new Map;
    }

    registerCache() {

    }

    registerStore() {

    }

    createComponent() { //! Deprecated

    }

}
