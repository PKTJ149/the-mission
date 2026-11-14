
let $dropdownLanguageSidebar = null;
$(function () {
    initPartialAnnouncementSlide();
    //$("#page-header-user-dropdown").on('show.bs.dropdown', function () {
    //    $(".agentCredit").html('<i class="fa fa-spin fa-spinner"></i>');
    //    $(".smsCredit").html('<i class="fa fa-spin fa-spinner"></i>');

    //    GetAgentCredit();

    //    CheckSmsCredit();
    //});

    $(".agentCredit").html('<i class="fa fa-spin fa-spinner"></i>');
    $(".smsCredit").html('<i class="fa fa-spin fa-spinner"></i>');

    GetAgentCredit();

    CheckSmsCredit();

    // showExpiryDate();

    if ($(".alert-sms").length > 0) {
        CheckSmsCredit();
    }

    $(".close-partial-announce-header-div").click(onClosePartialAnnouncementSlide);

    $initilaizeLanguage();
});

const $initilaizeLanguage = () => {
    $dropdownLanguageSidebar = new CustomDropdown('#dropdownLanguageSidebar', {
        initValue: i18nData.currentLanguage,
        single: true,
        stretch: true,
        auto: true,
        horizontal: false,
        targetRoot: Helper.selectOne('#toggleLanguageSidebar'),
        onSelect: (value) => {
            changeLanguageI18n(value);
        }
    });

    i18nData.selector = {
        toggler: $('#toggleLanguageSidebar'),
        int: $dropdownLanguageSidebar
    };
};

const $toggleLanguage = () => {
    if ($dropdownLanguageSidebar) $dropdownLanguageSidebar.toggle();
};

function ChangeStatusAgent() {
    $(".agent-change").addClass("text-danger");

}

function GetAgentCredit() {
    $.ajax({
        url: "/api/agent/get-credit-agent",
        method: "GET"
    }).done(function (res) {
        if (res.status == 200) {
            var data = res.data;
            console.log(data);
            var classAddToolTip = "";

            if (data.balance < 100000) {
                $("#headerAgentCredit").addClass("text-danger");
                classAddToolTip = "text-danger";
            }

            var toolTipAgentCredit = document.querySelector("#toolTipAgentCredit");
            $(toolTipAgentCredit).attr("data-tooltip-html", (`<span class='${classAddToolTip}'>${formatMoney(data.balance)}</span>`));
            CustomTooltip.updateTooltip(toolTipAgentCredit);

            $(".agentCredit").html(formatMoney(data.balance));
        }
    });
}

function CheckSmsCredit() {
    $.ajax({
        url: "/sms/get-credit",
        method: "GET"
    }).done(function (res) {
        if (res.status == 200) {
            var data = res.data;
            var htmlToolTip = "";
            $(".smsCredit").html(formatNumber(data.credit));
            if ($('.send-register-otp-message').length) {
                $(".send-register-otp-message").html(formatNumber(data.credit));
            }
            if ($('.send-register-welcome-message').length) {
                $(".send-register-welcome-message").html(formatNumber(data.credit));
            }

            if (data.enableRegisterOtp && data.credit < 100) {
                var message = "<strong>ยอด SMS คงเหลือของคุณใกล้หมด</strong> โปรดติดต่อทีมขายเพื่อเติม SMS (คงเหลือ " + formatNumber(data.credit) + " เครดิต)";
                var alertHtml = '<div class="alert alert-danger shadow mb-3" role="alert">' + message + '</div>'
                $(".alert-sms").html(alertHtml);

                htmlToolTip = message;
            } else {
                htmlToolTip = formatNumber(data.credit);
            }

            var toolTipSmsCredit = document.querySelector("#toolTipSmsCredit");
            $(toolTipSmsCredit).attr("data-tooltip-html", (htmlToolTip));
            CustomTooltip.updateTooltip(toolTipSmsCredit);

        }
    });
}

function showExpiryDate() {
    $.ajax({
        url: "/api/setting/get-tenant",
        method: "GET"
    }).done(function (res) {
        if (res.status == 200) {
            var data = res.data;
            var expiryDate = data.expiryDate;
            var remainingDays = data.remainingDays;

            $(".spanExpiryDate").html(expiryDate + " (เหลือ " + remainingDays + " วัน)<br/>หากต้องการเติมวันโปรดติดต่อกลุ่ม Support ใน Telegram");

            var divIconExpiryDateWrapper = document.querySelector("#divIconExpiryDateWrapper");
            $(divIconExpiryDateWrapper).attr("data-tooltip-html", ("ระบบ Auto สามารถใช้ได้ถึงวันที่ : " + expiryDate + " (เหลือ " + remainingDays + " วัน)<br/>หากต้องการเติมวันโปรดติดต่อกลุ่ม Support ใน Telegram"));
            CustomTooltip.updateTooltip(divIconExpiryDateWrapper);

            if (remainingDays != null && remainingDays <= 5) {
                $(".spanExpiryDate").addClass("text-danger fw-bold");
            }
        }
    });
}

function initPartialAnnouncementSlide() {
    var cookieValue = getCookieValue("annoucementSlide");
    if (cookieValue == "true") {
        $.ajax({
            url: "/api/announce/get-announcement-slide-page",
            method: "GET",
        }).done(function (res) {
            if (res.status !== 200) {
                $('.partial-announce-header-div').hide();
            }

            var dataLength = res.data.length;
            if (dataLength == 0) {
                $('.partial-announce-header-div').hide();
            } else {
                $(".page-content").css('margin-top', '70px');
                for (var i = 0; i < dataLength; i++) {
                    $(".announce-slide-header-item-list").append("<img width='20' height ='20' alt='...' src='/assets/images/announce/megaphone.png' class='me-3'><span>" + res.data[i].description + '</span>' +
                        "<img width='20' height ='20' alt='...' src='/assets/images/announce/megaphone.png' class='ms-3' style='margin-right: 3rem'>");
                }
                $('.partial-announce-header-div').show();
            }
        });
    } else {
        $('.partial-announce-header-div').hide();
    }
}

function onClosePartialAnnouncementSlide() {
    $(".page-content").css('margin-top', '0px');
    document.cookie = "annoucementSlide=false;";
    $('.partial-announce-header-div').hide();
}

function getCookieValue(name) {
    cookieList = document.cookie.split('; ');
    cookies = {};
    for (i = cookieList.length - 1; i >= 0; i--) {
        cookie = cookieList[i].split('=');
        cookies[cookie[0]] = cookie[1];
    }
    return cookies[name];
}
