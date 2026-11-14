$.ajaxSetup({
    beforeSend: function (xhr) {
        console.log("BeforeSend");

        var accessToken = window.localStorage.getItem("access_token");
        if (accessToken != null && accessToken != "")
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    }
});

var quillDefaultSettings = {
    modules: {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike', 'clean'],
                [{ 'color': [] }, { 'background': [] }, 'image'],
                [{ 'font': [] }, { 'align': [] }]
            ]
        }
    },
    theme: 'snow'
}

var defaultSunEditor = {
    buttonList: [
        ['undo', 'redo'],
        [/**'font',*/ 'fontSize'/**, 'formatBlock'*/],
        /** ['paragraphStyle', 'blockquote'], */
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        '/', // Line break
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
        /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
        ['fullScreen', 'showBlocks', 'codeView'],
        /** ['preview', 'print'], */
        /** ['save', 'template'], */
        /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
    ]
};

$(function () {
    dateFlatPickrFormAppjsOld();
});

function changeLanguageSetting(lang) {
    changeLanguageI18n(lang);
    $("body").localize();
}

function onSunEditorImageUploadBefore(files, info, core, uploadHandler) {
    uploadImage(files[0], uploadHandler);
}

function uploadImage(file, callback) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('directory', "sun-editor");

    $.ajax({
        url: '/api/upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.status == 200) {
                callback({
                    "result": [
                        {
                            "url": res.data.url,
                            "name": file.name,
                            "size": file.size
                        },
                    ]
                });
            } else {
                alert('File not uploaded');
            }
        }
    });
}


$(function () {
    $(".logout").click(onBtnLogoutClicked);
    initFormCopyTooltip();
    $(".form-copy i").click(onFormCopyClick);
    $(".select2").select2();
    //onCheckeruserScreen();
});

function initFormCopyTooltip() {
    $(".form-copy i").tooltip()
        .attr("title", "Copy to clipboard")
        .tooltip("_fixTitle");
}

function onCheckeruserScreen() {

    $(".sideMenu").hide();
    $(".sideMenu.nav-item").hide();
    $(".app-menu").hide();
    var userRole = $("#hiddenRole").val();
    if (userRole == 'partner') {
        $.ajax({
            url: "/api/partner/get-screen-partner",
            method: "GET",
            cache: false
        }).done(function (res) {
            if (res.status != 200) {
                alert("พบปัญหาในการแสดงเมนู โปรดรีเฟรชหน้าจออีกครั้ง");
                return
            }
            var screens = res.data.screenPartnerList;

            for (var i = 0; i < screens.length; i++) {
                var screen = screens[i];
                $(".sideMenu." + screen.screen).show();
            }

            const groupCustomer = screens.find(x =>
                x.screen == "customer");
            if (groupCustomer != null) {
                $(".nav-item.groupCustomer").show();
            } else {
                $(".nav-item.groupCustomer").hide();
            }

            const groupDeposit = screens.find(x =>
                x.screen == "deposit");
            if (groupDeposit != null) {
                $(".nav-item.groupDeposit").show();
            }

            const groupWithdraw = screens.find(x =>
                x.screen == "withdraw");
            if (groupWithdraw != null) {
                $(".nav-item.groupWithdraw").show();
            }

            const groupMarket = screens.find(x =>
                x.screen == "partner-list" ||
                x.screen == "partner-refer" ||
                x.screen == "partner-report");
            if (groupMarket != null) {
                $(".sideMenu.groupMarket").show();
            }

        }).fail(function () {
            alert("พบปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
        });
    } else {
        $.ajax({
            url: "/api/staff/get-screen-user",
            method: "GET",
            cache: false
        }).done(function (res) {
            if (res.status != 200) {
                alert("พบปัญหาในการแสดงเมนู โปรดรีเฟรชหน้าจออีกครั้ง");
                return
            }
            var screens = res.data.screenUserList;

            for (var i = 0; i < screens.length; i++) {
                var screen = screens[i];
                $(".sideMenu." + screen.screen).show();
            }

            const groupCustomer = screens.find(x =>
                x.screen == "customer");
            if (groupCustomer != null) {
                $(".nav-item.groupCustomer").show();
            }

            const groupDeposit = screens.find(x =>
                x.screen == "deposit");
            if (groupDeposit != null) {
                $(".nav-item.groupDeposit").show();
            }

            const groupWithdraw = screens.find(x =>
                x.screen == "withdraw");
            if (groupWithdraw != null) {
                $(".nav-item.groupWithdraw").show();
            }

            const groupBankingMove = screens.find(x =>
                x.screen == "bank-transfer");
            if (groupBankingMove != null) {
                $(".nav-item.groupBankingMove").show();
            }

            const groupBankStatement = screens.find(x =>
                x.screen == "bank-statement");
            if (groupBankStatement != null) {
                $(".nav-item.groupBankStatement").show();
            }

            //const groupTrueWalletStatement = screens.find(x =>
            //    x.screen == "true-wallet-statement");
            //if (groupTrueWalletStatement != null) {
            //    $(".nav-item.groupTrueWalletStatement").show();
            //}

            //const groupReduceCredit = screens.find(x =>
            //    x.screen == "credit-deduction");
            //if (groupReduceCredit != null) {
            //    $(".nav-item.groupReduceCredit").show();
            //}

            const groupWallet = screens.find(x =>
                x.screen == "cash-back" ||
                x.screen == "return-loss" ||
                x.screen == "affiliate");
            if (groupWallet != null) {
                $(".sideMenu.groupWallet").show();
            }

            const groupRepost = screens.find(x =>
                x.screen == "report-finance" ||
                x.screen == "report-finance-by-bank-account" ||
                x.screen == "report-cash-back-summary" ||
                x.screen == "report-cash-back-history" ||
                x.screen == "report-return-loss-summary" ||
                x.screen == "report-return-loss-history" ||
                x.screen == "report-affiliate-summary" ||
                x.screen == "report-affiliate-history" ||
                x.screen == "report-refer-summary" ||
                x.screen == "report-refer-history" ||
                x.screen == "report-promotion" ||
                x.screen == "report-history-promotion" ||
                x.screen == "report-bet" ||
                x.screen == "report-customer-change-profile" ||
                x.screen == "report-staff-log");
            if (groupRepost != null) {
                $(".sideMenu.groupRepost").show();
            }

            const groupMarket = screens.find(x =>
                x.screen == "partner-list" ||
                x.screen == "partner-refer" ||
                x.screen == "partner-report");
            if (groupMarket != null) {
                $(".sideMenu.groupMarket").show();
            }

            const groupSendSms = screens.find(x =>
                x.screen == "send-sms");
            if (groupSendSms != null) {
                $(".nav-item.groupSendSms").show();
            }

            const groupStaff = screens.find(x =>
                x.screen == "staff");
            if (groupStaff != null) {
                $(".nav-item.groupStaff").show();
            }

            const groupPromotion = screens.find(x =>
                x.screen == "setting-promotion-lucky-wheel" ||
                x.screen == "setting-promotion-mini-game" ||
                x.screen == "setting-promotion-cash-back" ||
                x.screen == "setting-promotion-return-loss" ||
                x.screen == "setting-promotion-affiliate-turnover" ||
                x.screen == "setting-promotion-affiliate-winloss");
            if (groupPromotion != null) {
                $(".sideMenu.groupPromotion").show();
            }

            const groupPromotionSupplement = screens.find(x =>
                x.screen == "report-lottery-bet" ||
                x.screen == "setting-lottery-bet" ||
                x.screen == "lottery-bet-point");
            if (groupPromotionSupplement != null) {
                $(".sideMenu.groupPromotionSupplement").show();
            }

            const groupSystem = screens.find(x =>
                x.screen == "setting-system-web-site" ||
                x.screen == "setting-system-main-menu" ||
                x.screen == "setting-system-staff" ||
                x.screen == "setting-system-register" ||
                x.screen == "setting-system-deposit-withdraw" ||
                x.screen == "setting-system-customer-group" ||
                x.screen == "setting-system-rank" ||
                x.screen == "setting-system-bank-account" ||
                x.screen == "setting-system-category-game" ||
                x.screen == "setting-system-game-provider" ||
                x.screen == "setting-system-game-list" ||
                x.screen == "setting-system-announce" ||
                x.screen == "setting-system-line" ||
                x.screen == "setting-system-google-analytics" ||
                x.screen == "setting-system-ip-address");
            if (groupSystem != null) {
                $(".sideMenu.groupSystem").show();
            }

            const groupSettingWebSite = screens.find(x =>
                x.screen == "setting-web-site-logo" ||
                x.screen == "setting-web-site-theme" ||
                x.screen == "setting-web-site-theme-landing-page" ||
                x.screen == "setting-web-site-mainmenu" ||
                x.screen == "setting-web-site-page" ||
                x.screen == "setting-web-site-banner" ||
                x.screen == "setting-web-site-article");
            if (groupSettingWebSite != null) {
                $(".sideMenu.groupSettingWebSite").show();
            }

            const groupPromotionRanking = screens.find(x =>
                x.screen == "promotion-ranking-turnover" ||
                x.screen == "promotion-ranking-returned" ||
                x.screen == "promotion-ranking-loss" ||
                x.screen == "promotion-ranking-deposit" ||
                x.screen == "promotion-ranking-income" ||
                x.screen == "promotion-ranking-withdraw");
            if (groupPromotionRanking != null) {
                $(".sideMenu.groupPromotionRanking").show();
            }

            const groupPromotionDeposit = screens.find(x =>
                x.screen == "setting-promotion" ||
                x.screen == "report-promotion-deposit" ||
                x.screen == "promotion-deposit-history");
            if (groupPromotionDeposit != null) {
                $(".sideMenu.groupPromotionDeposit").show();
            }

            const groupStore = screens.find(x =>
                x.screen == "store-sms");
            if (groupStore != null) {
                $(".sideMenu.groupStore").show();
            }

            if (groupStaff == null && groupPromotion == null && groupSystem == null && groupSettingWebSite == null && groupStore == null) {
                $(".titleManage").hide();
            } else {
                $(".titleManage").show();
            }

            if (groupMarket == null && groupSendSms == null) {
                $(".titleMarket").hide();
            } else {
                $(".titleMarket").show();
            }

            if (groupPromotionSupplement == null) {
                $(".titlePromotionSupplement").show();
            } else {
                $(".titlePromotionSupplement").show();
            }

            if (groupCustomer == null && groupDeposit == null && groupWithdraw == null && groupBankingMove == null && groupBankStatement == null /*&& groupReduceCredit == null*/ && groupWallet == null && groupRepost == null) {
                $(".titleService").hide();
            } else {
                $(".titleService").show();
            }

        }).fail(function () {
            alert("พบปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
        });
    }

    $(".app-menu").show();
    
}

function onBtnLogoutClicked() {

    var userRole = $("#hiddenRole").val();

    $.ajax({
        url: "/api/login/logout",
        method: "POST"
    }).done(function (res) {
        if (userRole == "partner") {
            window.location = "/login?type=partner&";
        }
        else
        {
            window.location = "/login";
        }
        
    }).fail(function () {
        alert("พบปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
    });
}

function onFormCopyClick() {
    let $element = $(this);
    let $input = $element.parent().find("input");
    let text = $input.val();
    copyTextToClipboard(text, $element);

}

//function copyClickGetLink() {
//    let $element = $(this);
//    let $input = $element.parent().find("a");
//    let text = $input.val();
//    copyTextToClipboard(text, $element);
//}

function copyTextToClipboard(text, $tooltipElement) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        showTooltipCopyResult($tooltipElement, true);
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
        showTooltipCopyResult($tooltipElement, false);
    });
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);

        showTooltipCopyResult($tooltipElement, successful);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showTooltipCopyResult($tooltipElement, false);
    }

    document.body.removeChild(textArea);
}

function showTooltipCopyResult($tooltipElement) {
    $tooltipElement.attr("title", "Copied!")
        .tooltip("_fixTitle")
        .tooltip("show")
        .attr("title", "Copy to clipboard")
        .tooltip("_fixTitle");
}

function hasSpecialCharacterUser(str) {
    return (/[+!@@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~]/.test(str));
}

function hasThai(str) {
    return (/[\u0E00-\u0E7F]/.test(str));
}

function isValidNumber(id) {
    var inValid = new RegExp('^[0-9]+$');
    return inValid.test(id);
}

function formatMoney(n) {
    n = parseFloat(n).toFixed(2);
    return Number(n).toLocaleString('en', { minimumFractionDigits: 2 });
}

function formatNumber(n) {
    n = parseFloat(n).toFixed(0);
    return Number(n).toLocaleString('en', { minimumFractionDigits: 0 });
}

function dateFlatPickrFormAppjsOld() {
    var m = document.querySelectorAll("[data-provider]");
    Array.from(m).forEach(function (e) {
        var t, a, o;
        "flatpickr" == e.getAttribute("data-provider") ? (o = e.attributes,
            (t = {}).disableMobile = "true",
            o["data-date-format"] && (t.dateFormat = o["data-date-format"].value.toString()),
            o["data-enable-time"] && (t.enableTime = !0,
                t.dateFormat = o["data-date-format"].value.toString() + " H:i"),
            o["data-altFormat"] && (t.altInput = !0,
                t.altFormat = o["data-altFormat"].value.toString()),
            o["data-minDate"] && (t.minDate = o["data-minDate"].value.toString(),
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-maxDate"] && (t.maxDate = o["data-maxDate"].value.toString(),
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-deafult-date"] && (t.defaultDate = o["data-deafult-date"].value.toString(),
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-multiple-date"] && (t.mode = "multiple",
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-range-date"] && (t.mode = "range",
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-inline-date"] && (t.inline = !0,
                t.defaultDate = o["data-deafult-date"].value.toString(),
                t.dateFormat = o["data-date-format"].value.toString()),
            o["data-disable-date"] && ((a = []).push(o["data-disable-date"].value),
                t.disable = a.toString().split(",")),
            o["data-week-number"] && ((a = []).push(o["data-week-number"].value),
                t.weekNumbers = !0),
            flatpickr(e, t)) : "timepickr" == e.getAttribute("data-provider") && (a = {},
                (o = e.attributes)["data-time-basic"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.dateFormat = "H:i"),
                o["data-time-hrs"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.dateFormat = "H:i",
                    a.time_24hr = !0),
                o["data-min-time"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.dateFormat = "H:i",
                    a.minTime = o["data-min-time"].value.toString()),
                o["data-max-time"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.dateFormat = "H:i",
                    a.minTime = o["data-max-time"].value.toString()),
                o["data-default-time"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.dateFormat = "H:i",
                    a.defaultDate = o["data-default-time"].value.toString()),
                o["data-time-inline"] && (a.enableTime = !0,
                    a.noCalendar = !0,
                    a.defaultDate = o["data-time-inline"].value.toString(),
                    a.inline = !0),
                flatpickr(e, a))
    })
}