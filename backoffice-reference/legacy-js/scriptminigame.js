// ต้น URL รูปตั้งต้นของระบบเดิม — layout ตั้ง window.lsmLegacyAssetBase จาก config Media:AssetBaseUrl (Views/Shared/_PartialLegacyAssets.cshtml)
// ⚠️ ห้ามฝังโดเมนรูปตรง ๆ ในไฟล์นี้อีก — ย้ายที่เก็บรูปแล้วต้องเปลี่ยนแค่ config
var LEGACY_ASSET_BASE = window.lsmLegacyAssetBase || "";

var tableMinigame;
let customMinigameDraggable;

var activeCustomAllDayMiniGame = $(".btn-active-all-day-custom-mini-game");

var conditionHtml = null;
var conditionHtmlEn = null;
var conditionHtmlTl = null;

let Imgluckywheeldefault = {};
Imgluckywheeldefault.six = {};
Imgluckywheeldefault.six.luckywheelSpinBtn = LEGACY_ASSET_BASE + "/images/minigame/wheel-spin-6.png";
Imgluckywheeldefault.six.luckywheelFrame = LEGACY_ASSET_BASE + "/images/minigame/wheel-frame-6.png";
Imgluckywheeldefault.six.luckywheelGetReward = LEGACY_ASSET_BASE + "/images/minigame/wheel-display-reward-6.png";
Imgluckywheeldefault.six.wheel = {};
Imgluckywheeldefault.six.wheel.wheel1 = LEGACY_ASSET_BASE + "/images/minigame/wheel-6-6.png";

Imgluckywheeldefault.eight = {};
Imgluckywheeldefault.eight.luckywheelSpinBtn = "";
Imgluckywheeldefault.eight.luckywheelFrame = "";
Imgluckywheeldefault.eight.luckywheelGetReward = "";

Imgluckywheeldefault.ten = {};
Imgluckywheeldefault.ten.luckywheelSpinBtn = "";
Imgluckywheeldefault.ten.luckywheelFrame = "";
Imgluckywheeldefault.ten.luckywheelGetReward = "";

let ImgMinigamedefault = {};
ImgMinigamedefault.imgMinigameReward = LEGACY_ASSET_BASE + "/images/minigame/minigame-reward.png";
ImgMinigamedefault.imgMinigamePopup = LEGACY_ASSET_BASE + "/images/minigame/minigame-popup.png";
var startDatePicker; var endDatePicker;

var selectCountMiniGame = $(".box-select-quantity");
var btnDropHeaderMiniGame = $(".btn-on-drop-header-mini-game");

var isCheckDisplayImgBeforeAll = $("#isCheckDisplayImgBeforeAll");
var isCheckDisplayImgBeforeDifferent = $("#isCheckDisplayImgBeforeDifferent");

var isCheckDisplayImgAfterAll = $("#isCheckDisplayImgAfterAll");
var isCheckDisplayImgAfterDifferent = $("#isCheckDisplayImgAfterDifferent");

var isCheckDisplayImgResultsAll = $("#isCheckDisplayImgResultsAll");
var isCheckDisplayImgResultsDifferent = $("#isCheckDisplayImgResultsDifferent");

var hiddenCountImgMiniGame = $("#hiddenCountImgMiniGame");

var btnCLoseImgMiniGameStep1 = $(".btn-close-img-mini-game-step-1");
var btnCLoseImgMiniGameStep2 = $(".btn-close-img-mini-game-step-2");
var btnCLoseImgMiniGameStep3 = $(".btn-close-img-mini-game-step-3");

var btnCLoseImgMiniGameStep1Box1 = $(".btn-close-img-mini-game-step-1-box-1");
var btnCLoseImgMiniGameStep1Box2 = $(".btn-close-img-mini-game-step-1-box-2");
var btnCLoseImgMiniGameStep1Box3 = $(".btn-close-img-mini-game-step-1-box-3");
var btnCLoseImgMiniGameStep1Box4 = $(".btn-close-img-mini-game-step-1-box-4");
var btnCLoseImgMiniGameStep1Box5 = $(".btn-close-img-mini-game-step-1-box-5");
var btnCLoseImgMiniGameStep1Box6 = $(".btn-close-img-mini-game-step-1-box-6");
var btnCLoseImgMiniGameStep1Box7 = $(".btn-close-img-mini-game-step-1-box-7");
var btnCLoseImgMiniGameStep1Box8 = $(".btn-close-img-mini-game-step-1-box-8");
var btnCLoseImgMiniGameStep1Box9 = $(".btn-close-img-mini-game-step-1-box-9");


var btnCLoseImgMiniGameStep2Box1 = $(".btn-close-img-mini-game-step-2-box-1");
var btnCLoseImgMiniGameStep2Box2 = $(".btn-close-img-mini-game-step-2-box-2");
var btnCLoseImgMiniGameStep2Box3 = $(".btn-close-img-mini-game-step-2-box-3");
var btnCLoseImgMiniGameStep2Box4 = $(".btn-close-img-mini-game-step-2-box-4");
var btnCLoseImgMiniGameStep2Box5 = $(".btn-close-img-mini-game-step-2-box-5");
var btnCLoseImgMiniGameStep2Box6 = $(".btn-close-img-mini-game-step-2-box-6");
var btnCLoseImgMiniGameStep2Box7 = $(".btn-close-img-mini-game-step-2-box-7");
var btnCLoseImgMiniGameStep2Box8 = $(".btn-close-img-mini-game-step-2-box-8");
var btnCLoseImgMiniGameStep2Box9 = $(".btn-close-img-mini-game-step-2-box-9");


var btnCLoseImgMiniGameStep3Box1 = $(".btn-close-img-mini-game-step-3-box-1");
var btnCLoseImgMiniGameStep3Box2 = $(".btn-close-img-mini-game-step-3-box-2");
var btnCLoseImgMiniGameStep3Box3 = $(".btn-close-img-mini-game-step-3-box-3");
var btnCLoseImgMiniGameStep3Box4 = $(".btn-close-img-mini-game-step-3-box-4");
var btnCLoseImgMiniGameStep3Box5 = $(".btn-close-img-mini-game-step-3-box-5");
var btnCLoseImgMiniGameStep3Box6 = $(".btn-close-img-mini-game-step-3-box-6");
var btnCLoseImgMiniGameStep3Box7 = $(".btn-close-img-mini-game-step-3-box-7");
var btnCLoseImgMiniGameStep3Box8 = $(".btn-close-img-mini-game-step-3-box-8");
var btnCLoseImgMiniGameStep3Box9 = $(".btn-close-img-mini-game-step-3-box-9");


var btnCLoseImgBgMobileMiniGame = $(".btn-close-img-bg-mobile-mini-game");
var btnCLoseImgBgPcMiniGame = $(".btn-close-img-bg-pc-mini-game");

var btnCLoseImgBgMobileDisplayMiniGame = $(".btn-close-img-bg-mb-display-mini-game");
var btnCLoseImgBgPcDisplayMiniGame = $(".btn-close-img-bg-pc-display-mini-game");

var onSetDefaultColor = $(".set-default-color");
var isErrorImgStep1 = $(".session-error-img-require");
var textErrorImgStep1 = $(".txt-error-img-require");

//Default Color Bg
var colorDefaultBgMainColor = "rgba(0, 0, 0, 0.36)";
var colorDefaultBgInBoxMiniGameColor = "rgba(0, 0, 0, 0.36)";

//Default Color Font And Number Group 1
var colorDefaultFontHeaderMainGroup1 = "#FFFFFF";
var colorDefaultFontHeaderSecondaryGroup1 = "#FFE666";
var colorDefaultFontMessageMainGroup1 = "#E9E9E9";
var colorDefaultFontMessageSecondaryGroup1 = "#AB8B4D";
var colorDefaultFontHighlightsGroup1 = "linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)";
var colorDefaultFontCountDownGroup1 = "#EB3333";

//Default Color Border And Btn Group 2
var colorDefaultBtnBgGroup2 = "linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)";
var colorDefaultBtnMessageGroup2 = "#1E1E1E";
var colorDefaultBtnBorderGroup2 = "#000000";
var colorDefaultDisplayBgGroup2 = "#151515";
var colorDefaultDisplayBorderGroup2 = "linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)";

//Default Color Table Group 3
var colorDefaultTableThBgGroup3 = "linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)";
var colorDefaultTableThFontGroup3 = "#202020";
var colorDefaultTableThBorderGroup3 = "linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)";

var colorDefaultPaginationFontActiveGroup3 = "#000000";
var colorDefaultPaginationFontInActiveGroup3 = "#E9E9E9";
var colorDefaultPaginationBgActiveGroup3 = "#FFE666";
var colorDefaultPaginationBgInActiveGroup3 = "transparent";
var colorDefaultPaginationArrowActiveGroup3 = "#FFE666";
var colorDefaultPaginationArrowInActiveGroup3 = "#A8A8A8";

var colorDefaultTableTdBg1Group3 = "#000000";
var colorDefaultTableTdBg2Group3 = "#232121";
var colorDefaultTableTdFontGroup3 = "#E9E9E9";
var colorDefaultTableTdFontHighlights1Group3 = "#F10000";
var colorDefaultTableTdFontHighlights2Group3 = "#72DCD9";
var colorDefaultTableTdBorderGroup3 = "#E9E9E9";


const MiniGameType = {
    DepositOnce: "deposit-once",
    AccumulatedDeposit: "accumulated-deposit",
    ContinuousDeposit: "continuous-deposit",
}

const MiniGameAmountType = {
    MinDeposit: "min-deposit",
    MaxDeposit: "max-deposit",
    EqualDeposit: "equal-deposit",
    DepositPeriod: "deposit-period",
}

const MiniGameBonusType = {
    Credit: "credit_fix",
    Percentage: "credit_percentage",
    LuckyWheel: "lucky-wheel",
    MiniGame: "mini-game",
    Lotto: "lotto",
    Point: "point",
    Reward: "reward",
}

$(function () {
    var tmp = new Table("#divMinigameTable", "/api/promotion/mini-game-v2");
    tmp.setSearchInput("#minigameSearch");
    tmp.addFilterDateRange("#datepickerPromotionDateTime", "dateBkk");
    tmp.useFilterMultiple(filterStatus, "status");
    tmp.useFilterMultiple(filterType, "type");
    tmp.useFilterMultiple(filterCreatedBy, "createdBy");
    tmp.useFilterMultiple(filterAgent, "agentId");

    tmp.requestData();
    tableMinigame = tmp;
    resetSettingPromotion();

    activeCustomAllDayMiniGame.click(onActiveCustomAllDayMiniGame);

    setDefaultImg();

    getPromotionDepositMiniGame();
    $(`.switch-2-2-1 input,#changeMinigameEnableCountDown,#SettingMinigameStep2-3 input,#SettingMinigameStep3 input,#SettingMinigameStep4 input`).on('input', function () {
        validateStep();
    });

    startDatePicker = flatpickr("#startDateSettingMinigameFromInput", {
        dateFormat: "d/m/Y",
        onChange: function (selectedDates, dateStr, instance) {
            endDatePicker.set("minDate", dateStr);
        }
    });

    endDatePicker = flatpickr("#endDateSettingMinigameFromInput", {
        dateFormat: "d/m/Y",
    });

    selectCountMiniGame.click(updateCountMiniGame);

    btnDropHeaderMiniGame.click(dropMenuMinGame);

    btnCLoseImgMiniGameStep1.click(onCloseImgMiniGameStep1);

    btnCLoseImgMiniGameStep2.click(onCloseImgMiniGameStep2);

    btnCLoseImgMiniGameStep3.click(onCloseImgMiniGameStep3);

    btnCLoseImgBgMobileMiniGame.click(onCloseImgBgMobileMiniGame);

    btnCLoseImgBgPcMiniGame.click(onCloseImgBgPcMiniGame);

    btnCLoseImgBgMobileDisplayMiniGame.click(onCloseImgBgMbDisplayMiniGame);

    btnCLoseImgBgPcDisplayMiniGame.click(onCloseImgBgPcDisplayMiniGame);

    onSetDefaultColor.click(onSetColorDefaultColorFunction);

    isCheckDisplayImgBeforeAll.change(function () {
        hideImgBeforeDisplayTypeStep1();
    });
    isCheckDisplayImgBeforeDifferent.change(function () {
        hideImgBeforeDisplayTypeStep1();
    });

    isCheckDisplayImgAfterAll.change(function () {
        hideImgBeforeDisplayTypeStep2();
    });
    isCheckDisplayImgAfterDifferent.change(function () {
        hideImgBeforeDisplayTypeStep2();
    });

    isCheckDisplayImgResultsAll.change(function () {
        hideImgBeforeDisplayTypeStep3();
    });
    isCheckDisplayImgResultsDifferent.change(function () {
        hideImgBeforeDisplayTypeStep3();
    });

});
$(function () {
    $("#fileImageIconImage").change(onUploadImageIconImage);

    $("#fileImageUploadBeforeMiniGame1").change(onUploadImageBeforeMiniGame1);
    $("#fileImageUploadBeforeMiniGame2").change(onUploadImageBeforeMiniGame2);
    $("#fileImageUploadBeforeMiniGame3").change(onUploadImageBeforeMiniGame3);
    $("#fileImageUploadBeforeMiniGame4").change(onUploadImageBeforeMiniGame4);
    $("#fileImageUploadBeforeMiniGame5").change(onUploadImageBeforeMiniGame5);
    $("#fileImageUploadBeforeMiniGame6").change(onUploadImageBeforeMiniGame6);
    $("#fileImageUploadBeforeMiniGame7").change(onUploadImageBeforeMiniGame7);
    $("#fileImageUploadBeforeMiniGame8").change(onUploadImageBeforeMiniGame8);
    $("#fileImageUploadBeforeMiniGame9").change(onUploadImageBeforeMiniGame9);


    $("#fileImageUploadAfterMiniGame1").change(onUploadImageAfterMiniGame1);
    $("#fileImageUploadAfterMiniGame2").change(onUploadImageAfterMiniGame2);
    $("#fileImageUploadAfterMiniGame3").change(onUploadImageAfterMiniGame3);
    $("#fileImageUploadAfterMiniGame4").change(onUploadImageAfterMiniGame4);
    $("#fileImageUploadAfterMiniGame5").change(onUploadImageAfterMiniGame5);
    $("#fileImageUploadAfterMiniGame6").change(onUploadImageAfterMiniGame6);
    $("#fileImageUploadAfterMiniGame7").change(onUploadImageAfterMiniGame7);
    $("#fileImageUploadAfterMiniGame8").change(onUploadImageAfterMiniGame8);
    $("#fileImageUploadAfterMiniGame9").change(onUploadImageAfterMiniGame9);


    $("#fileImageUploadResultsMiniGame1").change(onUploadImageResultsMiniGame1);
    $("#fileImageUploadResultsMiniGame2").change(onUploadImageResultsMiniGame2);
    $("#fileImageUploadResultsMiniGame3").change(onUploadImageResultsMiniGame3);
    $("#fileImageUploadResultsMiniGame4").change(onUploadImageResultsMiniGame4);
    $("#fileImageUploadResultsMiniGame5").change(onUploadImageResultsMiniGame5);
    $("#fileImageUploadResultsMiniGame6").change(onUploadImageResultsMiniGame6);
    $("#fileImageUploadResultsMiniGame7").change(onUploadImageResultsMiniGame7);
    $("#fileImageUploadResultsMiniGame8").change(onUploadImageResultsMiniGame8);
    $("#fileImageUploadResultsMiniGame9").change(onUploadImageResultsMiniGame9);

    $("#fileImageUploadBgMobileMiniGame").change(onUploadImageBgMobileMiniGame);
    $("#fileImageUploadBgPcMiniGame").change(onUploadImageBgPcMiniGame);

    $("#fileImageUploadBgMobileDisplayMiniGame").change(onUploadImageBgMobileDisplayMiniGame);
    $("#fileImageUploadBgPcDisplayMiniGame").change(onUploadImageBgPcDisplayMiniGame);
    
    $("input[name='minigameTurnoverPeriodSettingRadio']").change(function () {
        var buttonVal = $('input[name="minigameTurnoverPeriodSettingRadio"]').prop('checked') ? true : false;
        if (buttonVal) {
            $("#inputMinigameTurnOverHours").val();
        }
    })

    $(".game-provider-checker-input").change(function () {
        countingGameProviderSelected();
    });
    $("#selectAllDisplayGameProvider").change(function () {
        countingGameProviderSelected();
    });
    $(".ck-restricted-editing_mode_standard").keyup(function () {
        checkMultiSetting();
    });

    hideImgBeforeDisplayTypeStep1();
    hideImgBeforeDisplayTypeStep2();
    hideImgBeforeDisplayTypeStep3();

});

function updateCountMiniGame() {

    selectCountMiniGame.removeClass("active");
    $(this).addClass("active");

    var count = $(this).attr("data-count-mini-game");
    clearTemplateMinigameWheel();
    changeMinigame(count);

    for (let i = 0; i < count; i++) {

        addtemplateMinigameWheel();
    }

    validateStep();

    hiddenCountImgMiniGame.val(count);

    hideImgBeforeDisplayTypeStep1();
    hideImgBeforeDisplayTypeStep2();
    hideImgBeforeDisplayTypeStep3();

}

function hideImgBeforeDisplayTypeStep1() {

    console.log('1');

    var count = hiddenCountImgMiniGame.val();

    if (isCheckDisplayImgBeforeAll.is(':checked')) {

        $("#boxUpLoadImgBefore" + "2").hide();
        $("#boxUpLoadImgBefore" + "3").hide();
        $("#boxUpLoadImgBefore" + "4").hide();
        $("#boxUpLoadImgBefore" + "5").hide();
        $("#boxUpLoadImgBefore" + "6").hide();
        $("#boxUpLoadImgBefore" + "7").hide();
        $("#boxUpLoadImgBefore" + "8").hide();
        $("#boxUpLoadImgBefore" + "9").hide();

        $("#boxUpLoadImgBefore" + "1").show();

    } else {

        if (count === "3") {

            $("#boxUpLoadImgBefore" + "1").show();
            $("#boxUpLoadImgBefore" + "2").show();
            $("#boxUpLoadImgBefore" + "3").show();

            $("#boxUpLoadImgBefore" + "4").hide();
            $("#boxUpLoadImgBefore" + "5").hide();
            $("#boxUpLoadImgBefore" + "6").hide();
            $("#boxUpLoadImgBefore" + "7").hide();
            $("#boxUpLoadImgBefore" + "8").hide();
            $("#boxUpLoadImgBefore" + "9").hide();

        } else if (count === "6") {

            $("#boxUpLoadImgBefore" + "1").show();
            $("#boxUpLoadImgBefore" + "2").show();
            $("#boxUpLoadImgBefore" + "3").show();
            $("#boxUpLoadImgBefore" + "4").show();
            $("#boxUpLoadImgBefore" + "5").show();
            $("#boxUpLoadImgBefore" + "6").show();


            $("#boxUpLoadImgBefore" + "7").hide();
            $("#boxUpLoadImgBefore" + "8").hide();
            $("#boxUpLoadImgBefore" + "9").hide();

        } else {

            $("#boxUpLoadImgBefore" + "1").show();
            $("#boxUpLoadImgBefore" + "2").show();
            $("#boxUpLoadImgBefore" + "3").show();
            $("#boxUpLoadImgBefore" + "4").show();
            $("#boxUpLoadImgBefore" + "5").show();
            $("#boxUpLoadImgBefore" + "6").show();
            $("#boxUpLoadImgBefore" + "7").show();
            $("#boxUpLoadImgBefore" + "8").show();
            $("#boxUpLoadImgBefore" + "9").show();

        }
    }

}


function hideImgBeforeDisplayTypeStep2() {

    console.log('2');

    var count = hiddenCountImgMiniGame.val();

    if (isCheckDisplayImgAfterAll.is(':checked')) {

        $("#boxUpLoadImgAfter" + "2").hide();
        $("#boxUpLoadImgAfter" + "3").hide();
        $("#boxUpLoadImgAfter" + "4").hide();
        $("#boxUpLoadImgAfter" + "5").hide();
        $("#boxUpLoadImgAfter" + "6").hide();
        $("#boxUpLoadImgAfter" + "7").hide();
        $("#boxUpLoadImgAfter" + "8").hide();
        $("#boxUpLoadImgAfter" + "9").hide();

        $("#boxUpLoadImgAfter" + "1").show();

    } else {

        if (count === "3") {

            $("#boxUpLoadImgAfter" + "1").show();
            $("#boxUpLoadImgAfter" + "2").show();
            $("#boxUpLoadImgAfter" + "3").show();

            $("#boxUpLoadImgAfter" + "4").hide();
            $("#boxUpLoadImgAfter" + "5").hide();
            $("#boxUpLoadImgAfter" + "6").hide();
            $("#boxUpLoadImgAfter" + "7").hide();
            $("#boxUpLoadImgAfter" + "8").hide();
            $("#boxUpLoadImgAfter" + "9").hide();

        } else if (count === "6") {

            $("#boxUpLoadImgAfter" + "1").show();
            $("#boxUpLoadImgAfter" + "2").show();
            $("#boxUpLoadImgAfter" + "3").show();
            $("#boxUpLoadImgAfter" + "4").show();
            $("#boxUpLoadImgAfter" + "5").show();
            $("#boxUpLoadImgAfter" + "6").show();


            $("#boxUpLoadImgAfter" + "7").hide();
            $("#boxUpLoadImgAfter" + "8").hide();
            $("#boxUpLoadImgAfter" + "9").hide();

        } else {

            $("#boxUpLoadImgAfter" + "1").show();
            $("#boxUpLoadImgAfter" + "2").show();
            $("#boxUpLoadImgAfter" + "3").show();
            $("#boxUpLoadImgAfter" + "4").show();
            $("#boxUpLoadImgAfter" + "5").show();
            $("#boxUpLoadImgAfter" + "6").show();
            $("#boxUpLoadImgAfter" + "7").show();
            $("#boxUpLoadImgAfter" + "8").show();
            $("#boxUpLoadImgAfter" + "9").show();

        }

    }
}


function hideImgBeforeDisplayTypeStep3() {

    console.log('3');

    var count = hiddenCountImgMiniGame.val();

    if (isCheckDisplayImgResultsAll.is(':checked')) {

        $("#boxUploadImgResults" + "2").hide();
        $("#boxUploadImgResults" + "3").hide();
        $("#boxUploadImgResults" + "4").hide();
        $("#boxUploadImgResults" + "5").hide();
        $("#boxUploadImgResults" + "6").hide();
        $("#boxUploadImgResults" + "7").hide();
        $("#boxUploadImgResults" + "8").hide();
        $("#boxUploadImgResults" + "9").hide();

        $("#boxUploadImgResults" + "1").show();

    } else {

        if (count === "3") {

            $("#boxUploadImgResults" + "1").show();
            $("#boxUploadImgResults" + "2").show();
            $("#boxUploadImgResults" + "3").show();

            $("#boxUploadImgResults" + "4").hide();
            $("#boxUploadImgResults" + "5").hide();
            $("#boxUploadImgResults" + "6").hide();
            $("#boxUploadImgResults" + "7").hide();
            $("#boxUploadImgResults" + "8").hide();
            $("#boxUploadImgResults" + "9").hide();

        } else if (count === "6") {

            $("#boxUploadImgResults" + "1").show();
            $("#boxUploadImgResults" + "2").show();
            $("#boxUploadImgResults" + "3").show();
            $("#boxUploadImgResults" + "4").show();
            $("#boxUploadImgResults" + "5").show();
            $("#boxUploadImgResults" + "6").show();


            $("#boxUploadImgResults" + "7").hide();
            $("#boxUploadImgResults" + "8").hide();
            $("#boxUploadImgResults" + "9").hide();

        } else {

            $("#boxUploadImgResults" + "1").show();
            $("#boxUploadImgResults" + "2").show();
            $("#boxUploadImgResults" + "3").show();
            $("#boxUploadImgResults" + "4").show();
            $("#boxUploadImgResults" + "5").show();
            $("#boxUploadImgResults" + "6").show();
            $("#boxUploadImgResults" + "7").show();
            $("#boxUploadImgResults" + "8").show();
            $("#boxUploadImgResults" + "9").show();

        }

    }
}

function onCloseImgMiniGameStep1() {

    var boxNo = $(this).attr('data-box-no');

    $("#imgBeforeMiniGame" + boxNo).val("");
    $(".img-show-upload-mini-game-before-" + boxNo).attr("src", "");
    $(".img-show-upload-mini-game-before-" + boxNo).hide();
    $(".btn-close-img-mini-game-step-1-box-" + boxNo).hide();

    $(".default-img-mini-game-before-" + boxNo).show();
}

function onCloseImgMiniGameStep2() {

    var boxNo = $(this).attr('data-box-no');

    $("#imgAfterMiniGame" + boxNo).val("");
    $(".img-show-upload-mini-game-after-" + boxNo).attr("src", "");
    $(".img-show-upload-mini-game-after-" + boxNo).hide();
    $(".btn-close-img-mini-game-step-2-box-" + boxNo).hide();

    $(".default-img-mini-game-after-" + boxNo).show();
}

function onCloseImgMiniGameStep3() {

    var boxNo = $(this).attr('data-box-no');

    $("#imgResultsMiniGame" + boxNo).val("");
    $(".img-show-upload-mini-game-results-" + boxNo).attr("src", "");
    $(".img-show-upload-mini-game-results-" + boxNo).hide();
    $(".btn-close-img-mini-game-step-3-box-" + boxNo).hide();

    $(".default-img-mini-game-results-" + boxNo).show();
}


function onCloseImgBgMobileMiniGame() {

    $("#imgBgMobileMiniGame").val("");
    $(".img-bg-mb-show-in-box-upload").attr("src", "");
    $(".img-bg-mb-show-in-box-upload").hide();
    btnCLoseImgBgMobileMiniGame.hide();

    $(".img-default-bg-mb-mini-game").show();
}

function onCloseImgBgPcMiniGame() {

    $("#imgBgPcMiniGame").val("");
    $(".img-bg-pc-show-in-box-upload").attr("src", "");
    $(".img-bg-pc-show-in-box-upload").hide();
    btnCLoseImgBgPcMiniGame.hide();

    $(".img-default-bg-pc-mini-game").show();
}

function onCloseImgBgMbDisplayMiniGame() {

    $("#imgBgMbDisplayMiniGame").val("");
    $(".img-bg-mb-display-show-in-box-upload").attr("src", "");
    $(".img-bg-mb-display-show-in-box-upload").hide();
    btnCLoseImgBgMobileDisplayMiniGame.hide();

    $(".img-default-bg-mb-display-mini-game").show();
}

function onCloseImgBgPcDisplayMiniGame() {

    $("#imgBgPcDisplayMiniGame").val("");
    $(".img-bg-pc-display-show-in-box-upload").attr("src", "");
    $(".img-bg-pc-display-show-in-box-upload").hide();
    btnCLoseImgBgPcDisplayMiniGame.hide();

    $(".img-default-bg-pc-display-mini-game").show();
}

function dropMenuMinGame() {

    var isDrop = $(this).attr("data-drop");

    if (isDrop === "drop") {
        $(this).attr("data-drop", "not-drop");
        $(this).removeClass("drop");
    } else {
        $(this).attr("data-drop", "drop");
        $(this).addClass("drop");
    }
}

function onUploadImageIconImage() {
    var fd = new FormData();
    var files = $('#fileImageIconImage')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "icon-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $(".showImagePreviewImageIcon").attr("src", imgUrl);
                    $("#imageIconUrl").val(imgUrl);

                    $("#openConfirmSaveIconImageSwal").show();
                    $("#openConfirmSaveIconImageSwalDisabled").hide();
                } else {
                    alert('File not uploaded');

                    $("#openConfirmSaveIconImageSwal").hide();
                    $("#openConfirmSaveIconImageSwalDisabled").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame1() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame1')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgBeforeMiniGame1").val(imgUrl);
                    $(".img-show-upload-mini-game-before-1").attr("src", imgUrl);
                    $(".default-img-mini-game-before-1").hide();
                    btnCLoseImgMiniGameStep1Box1.show();
                    $(".img-show-upload-mini-game-before-1").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep1Box1.hide();
                    $(".img-show-upload-mini-game-before-1").hide();
                    $(".default-img-mini-game-before-1").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame2() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame2')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame2").val(imgUrl);
                    $(".img-show-upload-mini-game-before-2").attr("src", imgUrl);
                    $(".default-img-mini-game-before-2").hide();
                    btnCLoseImgMiniGameStep1Box2.show();
                    $(".img-show-upload-mini-game-before-2").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-2").hide();
                    btnCLoseImgMiniGameStep1Box2.hide();
                    $(".default-img-mini-game-before-2").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame3() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame3')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame3").val(imgUrl);
                    $(".img-show-upload-mini-game-before-3").attr("src", imgUrl);
                    $(".default-img-mini-game-before-3").hide();
                    btnCLoseImgMiniGameStep1Box3.show();
                    $(".img-show-upload-mini-game-before-3").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-3").hide();
                    btnCLoseImgMiniGameStep1Box3.hide();
                    $(".default-img-mini-game-before-3").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame4() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame4')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame4").val(imgUrl);
                    $(".img-show-upload-mini-game-before-4").attr("src", imgUrl);
                    $(".default-img-mini-game-before-4").hide();
                    btnCLoseImgMiniGameStep1Box4.show();
                    $(".img-show-upload-mini-game-before-4").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-4").hide();
                    btnCLoseImgMiniGameStep1Box4.hide();
                    $(".default-img-mini-game-before-4").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame5() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame5')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame5").val(imgUrl);
                    $(".img-show-upload-mini-game-before-5").attr("src", imgUrl);
                    $(".default-img-mini-game-before-5").hide();
                    btnCLoseImgMiniGameStep1Box5.show();
                    $(".img-show-upload-mini-game-before-5").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-5").hide();
                    btnCLoseImgMiniGameStep1Box5.hide();
                    $(".default-img-mini-game-before-5").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame6() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame6')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame6").val(imgUrl);
                    $(".img-show-upload-mini-game-before-6").attr("src", imgUrl);
                    $(".default-img-mini-game-before-6").hide();
                    btnCLoseImgMiniGameStep1Box6.show();
                    $(".img-show-upload-mini-game-before-6").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-6").hide();
                    btnCLoseImgMiniGameStep1Box6.hide();
                    $(".default-img-mini-game-before-6").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame7() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame7')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame7").val(imgUrl);
                    $(".img-show-upload-mini-game-before-7").attr("src", imgUrl);
                    $(".default-img-mini-game-before-7").hide();
                    btnCLoseImgMiniGameStep1Box7.show();
                    $(".img-show-upload-mini-game-before-7").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-7").hide();
                    btnCLoseImgMiniGameStep1Box7.hide();
                    $(".default-img-mini-game-before-7").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame8() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame8')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame8").val(imgUrl);
                    $(".img-show-upload-mini-game-before-8").attr("src", imgUrl);
                    $(".default-img-mini-game-before-8").hide();
                    btnCLoseImgMiniGameStep1Box8.show();
                    $(".img-show-upload-mini-game-before-8").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-8").hide();
                    btnCLoseImgMiniGameStep1Box8.hide();
                    $(".default-img-mini-game-before-8").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBeforeMiniGame9() {
    var fd = new FormData();
    var files = $('#fileImageUploadBeforeMiniGame9')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;

                    $("#imgBeforeMiniGame9").val(imgUrl);
                    $(".img-show-upload-mini-game-before-9").attr("src", imgUrl);
                    $(".default-img-mini-game-before-9").hide();
                    btnCLoseImgMiniGameStep1Box9.show();
                    $(".img-show-upload-mini-game-before-9").show();
                } else {
                    alert('File not uploaded');

                    $(".img-show-upload-mini-game-before-9").hide();
                    btnCLoseImgMiniGameStep1Box9.hide();
                    $(".default-img-mini-game-before-9").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}




function onUploadImageAfterMiniGame1() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame1')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame1").val(imgUrl);
                    $(".img-show-upload-mini-game-after-1").attr("src", imgUrl);
                    $(".default-img-mini-game-after-1").hide();
                    btnCLoseImgMiniGameStep2Box1.show();
                    $(".img-show-upload-mini-game-after-1").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box1.hide();
                    $(".img-show-upload-mini-game-after-1").hide();
                    $(".default-img-mini-game-after-1").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame2() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame2')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame2").val(imgUrl);
                    $(".img-show-upload-mini-game-after-2").attr("src", imgUrl);
                    $(".default-img-mini-game-after-2").hide();
                    btnCLoseImgMiniGameStep2Box2.show();
                    $(".img-show-upload-mini-game-after-2").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box2.hide();
                    $(".img-show-upload-mini-game-after-2").hide();
                    $(".default-img-mini-game-after-2").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame3() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame3')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame3").val(imgUrl);
                    $(".img-show-upload-mini-game-after-3").attr("src", imgUrl);
                    $(".default-img-mini-game-after-3").hide();
                    btnCLoseImgMiniGameStep2Box3.show();
                    $(".img-show-upload-mini-game-after-3").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box3.hide();
                    $(".img-show-upload-mini-game-after-3").hide();
                    $(".default-img-mini-game-after-3").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame4() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame4')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame4").val(imgUrl);
                    $(".img-show-upload-mini-game-after-4").attr("src", imgUrl);
                    $(".default-img-mini-game-after-4").hide();
                    btnCLoseImgMiniGameStep2Box4.show();
                    $(".img-show-upload-mini-game-after-4").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box4.hide();
                    $(".img-show-upload-mini-game-after-4").hide();
                    $(".default-img-mini-game-after-4").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame5() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame5')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame5").val(imgUrl);
                    $(".img-show-upload-mini-game-after-5").attr("src", imgUrl);
                    $(".default-img-mini-game-after-5").hide();
                    btnCLoseImgMiniGameStep2Box5.show();
                    $(".img-show-upload-mini-game-after-5").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box5.hide();
                    $(".img-show-upload-mini-game-after-5").hide();
                    $(".default-img-mini-game-after-5").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame6() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame6')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame6").val(imgUrl);
                    $(".img-show-upload-mini-game-after-6").attr("src", imgUrl);
                    $(".default-img-mini-game-after-6").hide();
                    btnCLoseImgMiniGameStep2Box6.show();
                    $(".img-show-upload-mini-game-after-6").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box6.hide();
                    $(".img-show-upload-mini-game-after-6").hide();
                    $(".default-img-mini-game-after-6").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame7() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame7')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame7").val(imgUrl);
                    $(".img-show-upload-mini-game-after-7").attr("src", imgUrl);
                    $(".default-img-mini-game-after-7").hide();
                    btnCLoseImgMiniGameStep2Box7.show();
                    $(".img-show-upload-mini-game-after-7").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box7.hide();
                    $(".img-show-upload-mini-game-after-7").hide();
                    $(".default-img-mini-game-after-7").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame8() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame8')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame8").val(imgUrl);
                    $(".img-show-upload-mini-game-after-8").attr("src", imgUrl);
                    $(".default-img-mini-game-after-8").hide();
                    btnCLoseImgMiniGameStep2Box8.show();
                    $(".img-show-upload-mini-game-after-8").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box8.hide();
                    $(".img-show-upload-mini-game-after-8").hide();
                    $(".default-img-mini-game-after-8").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageAfterMiniGame9() {
    var fd = new FormData();
    var files = $('#fileImageUploadAfterMiniGame9')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgAfterMiniGame9").val(imgUrl);
                    $(".img-show-upload-mini-game-after-9").attr("src", imgUrl);
                    $(".default-img-mini-game-after-9").hide();
                    btnCLoseImgMiniGameStep2Box9.show();
                    $(".img-show-upload-mini-game-after-9").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep2Box9.hide();
                    $(".img-show-upload-mini-game-after-9").hide();
                    $(".default-img-mini-game-after-9").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}




function onUploadImageResultsMiniGame1() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame1')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame1").val(imgUrl);
                    $(".img-show-upload-mini-game-results-1").attr("src", imgUrl);
                    $(".default-img-mini-game-results-1").hide();
                    btnCLoseImgMiniGameStep3Box1.show();
                    $(".img-show-upload-mini-game-results-1").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box1.hide();
                    $(".img-show-upload-mini-game-results-1").hide();
                    $(".default-img-mini-game-results-1").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame2() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame2')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame2").val(imgUrl);
                    $(".img-show-upload-mini-game-results-2").attr("src", imgUrl);
                    $(".default-img-mini-game-results-2").hide();
                    btnCLoseImgMiniGameStep3Box2.show();
                    $(".img-show-upload-mini-game-results-2").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box2.hide();
                    $(".img-show-upload-mini-game-results-2").hide();
                    $(".default-img-mini-game-results-2").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame3() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame3')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame3").val(imgUrl);
                    $(".img-show-upload-mini-game-results-3").attr("src", imgUrl);
                    $(".default-img-mini-game-results-3").hide();
                    btnCLoseImgMiniGameStep3Box3.show();
                    $(".img-show-upload-mini-game-results-3").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box3.hide();
                    $(".img-show-upload-mini-game-results-3").hide();
                    $(".default-img-mini-game-results-3").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame4() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame4')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame4").val(imgUrl);
                    $(".img-show-upload-mini-game-results-4").attr("src", imgUrl);
                    $(".default-img-mini-game-results-4").hide();
                    btnCLoseImgMiniGameStep3Box4.show();
                    $(".img-show-upload-mini-game-results-4").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box4.hide();
                    $(".img-show-upload-mini-game-results-4").hide();
                    $(".default-img-mini-game-results-4").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame5() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame5')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame5").val(imgUrl);
                    $(".img-show-upload-mini-game-results-5").attr("src", imgUrl);
                    $(".default-img-mini-game-results-5").hide();
                    btnCLoseImgMiniGameStep3Box5.show();
                    $(".img-show-upload-mini-game-results-5").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box5.hide();
                    $(".img-show-upload-mini-game-results-5").hide();
                    $(".default-img-mini-game-results-5").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame6() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame6')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame6").val(imgUrl);
                    $(".img-show-upload-mini-game-results-6").attr("src", imgUrl);
                    $(".default-img-mini-game-results-6").hide();
                    btnCLoseImgMiniGameStep3Box6.show();
                    $(".img-show-upload-mini-game-results-6").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box6.hide();
                    $(".img-show-upload-mini-game-results-6").hide();
                    $(".default-img-mini-game-results-6").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame7() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame7')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame7").val(imgUrl);
                    $(".img-show-upload-mini-game-results-7").attr("src", imgUrl);
                    $(".default-img-mini-game-results-7").hide();
                    btnCLoseImgMiniGameStep3Box7.show();
                    $(".img-show-upload-mini-game-results-7").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box7.hide();
                    $(".img-show-upload-mini-game-results-7").hide();
                    $(".default-img-mini-game-results-7").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame8() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame8')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame8").val(imgUrl);
                    $(".img-show-upload-mini-game-results-8").attr("src", imgUrl);
                    $(".default-img-mini-game-results-8").hide();
                    btnCLoseImgMiniGameStep3Box8.show();
                    $(".img-show-upload-mini-game-results-8").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box8.hide();
                    $(".img-show-upload-mini-game-results-8").hide();
                    $(".default-img-mini-game-results-8").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageResultsMiniGame9() {
    var fd = new FormData();
    var files = $('#fileImageUploadResultsMiniGame9')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgResultsMiniGame9").val(imgUrl);
                    $(".img-show-upload-mini-game-results-9").attr("src", imgUrl);
                    $(".default-img-mini-game-results-9").hide();
                    btnCLoseImgMiniGameStep3Box9.show();
                    $(".img-show-upload-mini-game-results-9").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgMiniGameStep3Box9.hide();
                    $(".img-show-upload-mini-game-results-9").hide();
                    $(".default-img-mini-game-results-9").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}





function onUploadImageBgMobileMiniGame() {
    var fd = new FormData();
    var files = $('#fileImageUploadBgMobileMiniGame')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgBgMobileMiniGame").val(imgUrl);
                    $(".img-bg-mb-show-in-box-upload").attr("src", imgUrl);
                    $(".img-default-bg-mb-mini-game").hide();
                    btnCLoseImgBgMobileMiniGame.show();
                    $(".img-bg-mb-show-in-box-upload").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-show-in-box-upload").hide();
                    $(".img-default-bg-mb-mini-game").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBgPcMiniGame() {
    var fd = new FormData();
    var files = $('#fileImageUploadBgPcMiniGame')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgBgPcMiniGame").val(imgUrl);
                    $(".img-bg-pc-show-in-box-upload").attr("src", imgUrl);
                    $(".img-default-bg-pc-mini-game").hide();
                    btnCLoseImgBgPcMiniGame.show();
                    $(".img-bg-pc-show-in-box-upload").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgBgPcMiniGame.hide();
                    $(".img-bg-pc-show-in-box-upload").hide();
                    $(".img-default-bg-pc-mini-game").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}


function onUploadImageBgMobileDisplayMiniGame() {
    var fd = new FormData();
    var files = $('#fileImageUploadBgMobileDisplayMiniGame')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgBgMbDisplayMiniGame").val(imgUrl);
                    $(".img-bg-mb-display-show-in-box-upload").attr("src", imgUrl);
                    $(".img-default-bg-mb-display-mini-game").hide();
                    btnCLoseImgBgMobileDisplayMiniGame.show();
                    $(".img-bg-mb-display-show-in-box-upload").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-display-show-in-box-upload").hide();
                    $(".img-default-bg-mb-display-mini-game").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}

function onUploadImageBgPcDisplayMiniGame() {
    var fd = new FormData();
    var files = $('#fileImageUploadBgPcDisplayMiniGame')[0].files;

    if (files.length > 0) {

        fd.append('file', files[0]);
        fd.append('directory', "mini-game-image");

        $.ajax({
            url: uploadUrl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != 0) {
                    var imgUrl = response.data.url;
                    $("#imgBgPcDisplayMiniGame").val(imgUrl);
                    $(".img-bg-pc-display-show-in-box-upload").attr("src", imgUrl);
                    $(".img-default-bg-pc-display-mini-game").hide();
                    btnCLoseImgBgPcDisplayMiniGame.show();
                    $(".img-bg-pc-display-show-in-box-upload").show();
                } else {
                    alert('File not uploaded');

                    btnCLoseImgBgPcDisplayMiniGame.hide();
                    $(".img-bg-pc-display-show-in-box-upload").hide();
                    $(".img-default-bg-pc-display-mini-game").show();
                }
            }
        });
    } else {
        alert("Please select a file.");
    }
}


const imageIconSrc = $(".img-upload-image-icon-show");
const imageIconPlaceholder = $(".img-mock-image-icon");
let imageIconBlob = null;

const handleUploadBankLogo = (e) => {
    const files = e.currentTarget.files;
    if (Form.checkSingleFileRequired(files)) {
        const file = files[0];

        if (imageIconBlob !== null) {
            URL.revokeObjectURL(imageIconBlob);
            imageIconBlob = null;
        }

        imageIconBlob = URL.createObjectURL(file);
        imageIconSrc.attr('src', imageIconBlob);
        imageIconSrc.show();
        imageIconPlaceholder.hide();
    } else {
        imageIconSrc.removeAttr('src');
        imageIconSrc.hide();
        imageIconPlaceholder.show();
    }
}

var actionNow;
var typeNow;
var settingstepNow;
var luckyWheelIdNow;

const customSwal = new CustomSweetAlert();
const confirmSavePromotionSwal = new CustomSweetAlert();

function onActiveCustomAllDayMiniGame() {

    activeCustomAllDayMiniGame.removeClass("active-all-day");
    $(this).addClass("active-all-day");

}

function setDefaultImg() {
    let urlimg;
    var NumberPartsMinigame;
    if (typeNow == 'mini-game') {
        NumberPartsMinigame = customNumberPartsMinigame.getValue();
    } else {
        NumberPartsMinigame = customNumberPartsLuckywheel.getValue();
    }
    if (typeNow == 'mini-game') {
        urlimg = `${LEGACY_ASSET_BASE}/images/minigame/`;
        $(`.imgMinigameRewardMainSrc`).attr("src", urlimg + 'minigame-reward.png');
        $(`.imgMinigameRewardMainSrc`).show();
        $(`.imgMinigameRewardSrc`).attr("src", urlimg + 'minigame-reward.png');
        $(`.imgMinigameRewardSrc`).show();
        $(`.imgMinigamePopupSrc`).attr("src", urlimg + 'minigame-popup.png');
        $(`.imgMinigamePopupSrc`).show();
    }
    else {
        urlimg = `${LEGACY_ASSET_BASE}/images/minigame/wheel-${NumberPartsMinigame}/`;
        $(`.luckywheelSpinBtnSrc`).attr("src", urlimg + 'button.png');
        $(`.luckywheelSpinBtnSrc`).show();
        $(`.luckywheelFrameSrc`).attr("src", urlimg + 'frame.png');
        $(`.luckywheelFrameSrc`).show();
        $(`.luckywheelGetRewardSrc`).attr("src", urlimg + 'popup.png');
        $(`.luckywheelGetRewardSrc`).show();
        for (let i = 0; i < NumberPartsMinigame; i++) {
            $(`.luckywheelWheel${i + 1}Src`).attr("src", `${urlimg}pie-${i + 1}.png`);
        }
    }

    $(`#luckywheelSpinBtnPlaceholder`).hide();
    $(`#luckywheelFramePlaceholder`).hide();
    $(`#luckywheelGetRewardPlaceholder`).hide();
    $(`#imgMinigameRewardPlaceholder`).hide();
    $(`#imgMinigamePopupPlaceholder`).hide();

    $(".btnSetDefault").addClass("disabled");
}
// แปลง format วัน/เดือน/ปี
function changeDateFormat(dateString) {
    if (dateString == "" || dateString == null) {
        return;
    } else {
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        return day + "/" + month + "/" + year;
    }
}

// แปลง format วัน/เดือน/ปี ไปเป็น Int
function changeDateFormatToInt(dateString) {
    if (dateString == "" || dateString == null) {
        return;
    } else {
        var parts = dateString.split('/');

        var formattedDate = parts[2] + parts[1] + parts[0];

        return parseInt(formattedDate);
    }
}

const initializeDetailHtml = async () => {
    if (conditionHtml === null) {
        conditionHtml = await CKSource.Editor.create(document.getElementById('minigameConditionHtml'), {
            removePlugins: ['Title'],
            placeholder: 'ระบุเงื่อนไขมินิเกมส์',
            style: {
                definitions: [
                    {
                        name: 'เงาตัวอักษร',
                        element: 'p',
                        classes: ['custom-text-shadow-style']
                    },
                ]
            }
        });
    }
    return conditionHtml;
};
const initializeDetailHtmlEn = async () => {
    if (conditionHtmlEn === null) {
        conditionHtmlEn = await CKSource.Editor.create(document.getElementById('minigameConditionHtml-en'), {
            removePlugins: ['Title'],
            placeholder: 'ระบุเงื่อนไขมินิเกมส์',
            style: {
                definitions: [
                    {
                        name: 'เงาตัวอักษร',
                        element: 'p',
                        classes: ['custom-text-shadow-style']
                    },
                ]
            }
        });
    }
    return conditionHtmlEn;
};
const initializeDetailHtmlTl = async () => {
    if (conditionHtmlTl === null) {
        conditionHtmlTl = await CKSource.Editor.create(document.getElementById('minigameConditionHtml-tl'), {
            removePlugins: ['Title'],
            placeholder: 'ระบุเงื่อนไขมินิเกมส์',
            style: {
                definitions: [
                    {
                        name: 'เงาตัวอักษร',
                        element: 'p',
                        classes: ['custom-text-shadow-style']
                    },
                ]
            }
        });
    }
    return conditionHtmlTl;
};

function updateDisplay(element, value) {
    const [tens, units] = String(value).padStart(2, '0');
    element.querySelectorAll('div')[0].textContent = tens;
    element.querySelectorAll('div')[1].textContent = units;
}

function CountdownMinigame(divminigame) {
    const displayDay = divminigame.querySelector('.days');
    const displayHours = divminigame.querySelector('.hours');
    const displayMinutes = divminigame.querySelector('.minutes');
    var expiryDate = divminigame.getAttribute("data-expiry-date");

    const countToDate = new Date(expiryDate);

    function Timeloop() {
        let currentDate = new Date()
        let timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000)

        if (timeBetweenDates < 0 || expiryDate == null || expiryDate == "") {
            clearInterval(intervalCountdown);
            return;
        }

        let minutes = Math.floor(timeBetweenDates / 60) % 60
        let hours = Math.floor(timeBetweenDates / 3600) % 24
        let days = Math.floor(timeBetweenDates / (3600 * 24))

        if (displayDay) {
            updateDisplay(displayDay, days);
        }

        if (displayHours) {
            updateDisplay(displayHours, hours);
        }

        if (displayMinutes) {
            updateDisplay(displayMinutes, minutes);
        }
    }

    const intervalCountdown = setInterval(Timeloop, 1000 * 30);
    Timeloop();
}

// filter วันที่สร้าง
const filterPromotionDateTime = new CustomFilter('#filterPromotionDateTime');
const datepickerPromotionDateTime = flatpickr('#datepickerPromotionDateTime', {
    enableTime: false,
    mode: 'range',
    dateFormat: 'd/m/Y',
    onChange: (_, text) => {
        filterPromotionDateTime.setText(text);
    }
});

const filterStatus = new CustomDropdown('#dropdownStatus', {
    single: true,
    stretch: true,
    filter: '#filterStatus',
    filterDefault: 'All',
    fakeValue: item => item?.textContent
});

const filterType = new CustomDropdown('#dropdownType', {
    single: true,
    filter: '#filterType',
    filterDefault: 'All',
    fakeValue: item => item?.textContent
});

const filterCreatedBy = new CustomDropdown('#dropdownCreatedBy', {
    single: true,
    filter: '#filterCreatedBy',
    filterDefault: 'All',
    fakeValue: item => item?.textContent,
    onInit: async (filter) => {
        const response = await $.ajax({
            url: "/api/staff/select2",
            method: "post"
        });

        const result = filter.resolverSearch(response);
        if (result && result.length > 0) {
            for (const r of result)
                r.value = r.text;

            filter.appendItems(result);
        }
    }
});

const filterAgent = new CustomDropdown('#dropdownAgent', {
    single: true,
    stretch: true,
    filter: '#filterAgent',
    filterDefault: 'All',
    fakeValue: item => item?.textContent
});

// get การจำกัดการรับสิทธิ์ของกลุ่มลูกค้า
const getShowLimitCustomerGroupActiveHtml = (dataLists) => {

    $("#showLimitCustomerGroupActiveHtml").html("");
    let customerGroupHtml = "";

    for (const dataList of dataLists) {
        console.log('datalist', dataList);
        customerGroupHtml += `<div class='px-3' style='background: #50A198;color:#fff;border-radius: 12px;'>${dataList}</div>`
    }

    $("#showLimitCustomerGroupActiveHtml").html(customerGroupHtml);
};

// Dropdown กลุ่มลูกค้าที่มีสิทธิ์ได้รับ
const customLimitCustomerGroupDropdown = new CustomDropdown('#customLimitCustomerGroupDropdown', {
    multiple: true,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกกลุ่มลูกค้าที่มีสิทธิ์ได้รับ',
    placeholder: 'เลือกเลือกกลุ่มลูกค้าที่มีสิทธิ์ได้รับ',
    selfSearch: true,
    stretch: true,
    onSelect: (value, select, list) => {
        var data = customLimitCustomerGroupDropdown.getValue();

        var a = list?.data;
        var b = list?.selected;
        var c = [];

        let d = {};
        for (let obj of a) {
            d[obj.value] = { chip: obj.chip, text: obj.text };
        }

        for (let id of b) {
            if (d[id]) {
                c.push(d[id].text);
            }
        }

        getShowLimitCustomerGroupActiveHtml(c);

        if (data.length != 0) {
            $('#showLimitCustomerGroupActive').show();
            $('#showLimitCustomerGroupInactive').hide();
            $('#customLimitCustomerGroupDropdown').removeClass("custom-invalid");
            $('#error-limitCustomerGroupDropdown').hide();
        } else {
            $('#showLimitCustomerGroupActive').hide();
            $('#showLimitCustomerGroupInactive').show();
            $('#customLimitCustomerGroupDropdown').addClass("custom-invalid");
            $('#error-limitCustomerGroupDropdown').show();
        }

        validateStep();
    }
});

// Dropdown เสียงประกอบวงล้อ
const customLuckywheelSoundEffectDropdown = new CustomDropdown('#customLuckywheelSoundEffectDropdown', {
    single: true,
    initValue: '/audios/spin-tick.mp3',
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกเสียงประกอบวงล้อ',
    placeholder: 'เลือกเสียงประกอบวงล้อ',
    selfSearch: true,
    stretch: true,
    onSelect: (value) => {
        var data = customLuckywheelSoundEffectDropdown.getValue();

        //console.log("check value", data);
    }
});
const customMinigameSoundEffectDropdown = new CustomDropdown('#customMinigameSoundEffectDropdown', {
    single: true,
    initValue: '1',
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกเสียงประกอบมินิเกมส์',
    placeholder: 'เลือกเสียงประกอบมินิเกมส์',
    stretch: true,
    onSelect: (value) => {
        var data = customMinigameSoundEffectDropdown.getValue();

        //console.log("check value", data);
    }
});

// Dropdown PartsLuckywheel
const customNumberPartsLuckywheel = new CustomDropdown('#customNumberPartsLuckywheel', {
    single: true,
    initValue: '8',
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกมินิเกมส์',
    placeholder: 'เลือกมินิเกมส์',
    selfSearch: true,
    stretch: true,
    onSelect: (value) => {
        var data = customNumberPartsLuckywheel.getValue();
        clearTemplateMinigameWheel();
        changeWheel(data);
        for (let i = 0; i < data; i++) {

            addtemplateMinigameWheel();
        }
        showLabalLuckywheelImagePixel(data);
        validateStep();
    }
});
// Dropdown PartsLuckywheel
const customNumberPartsMinigame = new CustomDropdown('#customNumberPartsMinigame', {
    single: true,
    initValue: '6',
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกมินิเกมส์',
    placeholder: 'เลือกมินิเกมส์',
    selfSearch: true,
    stretch: true,
    onSelect: (value) => {
        var data = customNumberPartsMinigame.getValue();
        clearTemplateMinigameWheel();
        changeMinigame(data);
        for (let i = 0; i < data; i++) {

            addtemplateMinigameWheel();
        }

        validateStep();
    }
});
// Dropdown ประเภทการฝาก
const customMinigameDepositTypeDropdown = new CustomDropdown('#customMinigameDepositTypeDropdown', {
    single: true,
    initValue: '@PromotionDepositType.DepositOnce',
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกประเภทการฝาก',
    placeholder: 'เลือกประเภทการฝาก',
    selfSearch: true,
    stretch: true,
    onSelect: (value) => {
        var data = customMinigameDepositTypeDropdown.getValue();

        $('#depositType').val(data);
        $('#depositAmountType').val("");
        $('#amountAutoDeposit').val("");
        $('#minAmountAutoDeposit').val("");
        $('#maxAmountAutoDepsoit').val("");
        $('#amountAutoDepositFrom').val("");
        $('#amountAutoDepositTo').val("");
        $('#depositCount').val("");
        $('#period').val("");

        customMinigameDepositAmountTypeDropdown.setValue([]);

        if (data == MiniGameType.DepositOnce) {
            $("#showBoxDepositOnceAndContinue").show();
            $("#showBoxDepositCollectAndContinue").hide();

            $("#showBoxDepositCollect").hide();
            $("#showBoxDepositContinue").hide();

            $(".showOnlyBoxDepositOnce").show();

            $("#showBoxDepositTypeEqualAndCollect").show();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").hide();

            $("#amountAutoDeposit").addClass("border-custom-left8px");
        } else if (data == MiniGameType.AccumulatedDeposit) {
            $("#showBoxDepositOnceAndContinue").hide();
            $("#showBoxDepositCollectAndContinue").show();

            $("#showBoxDepositCollect").show();
            $("#showBoxDepositContinue").hide();

            $(".showOnlyBoxDepositOnce").hide();

            $("#showBoxDepositTypeEqualAndCollect").show();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").hide();

            $("#amountAutoDeposit").removeClass("border-custom-left8px");
        } else {
            $("#showBoxDepositOnceAndContinue").show();
            $("#showBoxDepositCollectAndContinue").show();

            $("#showBoxDepositCollect").hide();
            $("#showBoxDepositContinue").show();

            $(".showOnlyBoxDepositOnce").hide();

            $("#showBoxDepositTypeEqualAndCollect").show();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").hide();

            $("#amountAutoDeposit").addClass("border-custom-left8px");
        }
    }
});

// Dropdown ประเภทยอดฝาก
const customMinigameDepositAmountTypeDropdown = new CustomDropdown('#customMinigameDepositAmountTypeDropdown', {
    single: true,
    auto: true,
    horizontal: false,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือกประเภทยอดฝาก',
    placeholder: 'เลือกประเภทยอดฝาก',
    selfSearch: true,
    stretch: true,
    onSelect: (value) => {
        var data = customMinigameDepositAmountTypeDropdown.getValue();

        var depositType = $("#depositType").val();

        if (depositType == MiniGameType.ContinuousDeposit) {
            $(".showOnlyBoxDepositOnce").hide();
        } else {
            $(".showOnlyBoxDepositOnce").show();
        }

        $('#depositAmountType').val(data);
        $('#amountAutoDeposit').val("");
        $('#minAmountAutoDeposit').val("");
        $('#maxAmountAutoDepsoit').val("");
        $('#amountAutoDepositFrom').val("");
        $('#amountAutoDepositTo').val("");
        $('#depositCount').val("");
        $('#period').val("");

        if (data == MiniGameAmountType.EqualDeposit) {
            $("#showBoxDepositTypeEqualAndCollect").show();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").hide();
        } else if (data == MiniGameAmountType.MinDeposit) {
            $("#showBoxDepositTypeEqualAndCollect").hide();
            $("#showBoxDepositTypeMin").show();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").hide();
        } else if (data == MiniGameAmountType.MaxDeposit) {
            $("#showBoxDepositTypeEqualAndCollect").hide();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").show();
            $("#showBoxDepositTypeRange").hide();
        } else {
            $("#showBoxDepositTypeEqualAndCollect").hide();
            $("#showBoxDepositTypeMin").hide();
            $("#showBoxDepositTypeMax").hide();
            $("#showBoxDepositTypeRange").show();
        }
        validateStep();

    }
});

const resetSettingPromotion = () => {
    $(".ck-file-dialog-button").addClass('d-none');

    setTimeout(() => {
        $(".ck-splitbutton__action").removeClass('d-none');
    }, 200);

    luckyWheelIdNow = null;
    $("#minigameCustomStartTime").val("00:00");
    $("#minigameCustomEndTime").val("23:59");

    var minigameCustomStartTime = $("#minigameCustomStartTime").val('');
    var minigameCustomEndTime = $("#minigameCustomEndTime").val('');

    $("#showStartDateEndDateSelect").html('-');

    if (minigameCustomStartTime == "00:00" && minigameCustomEndTime == "23:59") {
        $("#checkAddTemplateMinigameDatetime").addClass("disabled");
        $("#checkAddTemplateMinigameDatetime").removeClass("disabled");
    } else {
        $("#checkAddTemplateMinigameDatetime").removeClass("disabled");
        $("#checkAddTemplateMinigameDatetime").addClass("disabled");
    }
    $("#boxMinigameSelectSunday").removeClass("no-select");
    $("#boxMinigameSelectMonday").removeClass("no-select");
    $("#boxMinigameSelectTuesday").removeClass("no-select");
    $("#boxMinigameSelectWednesday").removeClass("no-select");
    $("#boxMinigameSelectThursday").removeClass("no-select");
    $("#boxMinigameSelectFriday").removeClass("no-select");
    $("#boxMinigameSelectSaturday").removeClass("no-select");

    $(".btn-custom-day-1").addClass("no-select");
    $(".btn-custom-day-2").removeClass("no-select");
    $(".btn-custom-day-3").removeClass("no-select");

    //$("#boxMinigameSelectWeekday").addClass("no-select");
    //$("#boxMinigameSelectWeekend").addClass("no-select");
    //$("#boxMinigameSelectEveryday").removeClass("no-select");

    $("#boxMinigameCountdownRadioDays").addClass('disabled');
    $("#boxMinigameCountdownRadioDaterange").addClass('disabled');

    $(".minigame-reset").addClass('disabled');
    $(".minigame-reset").addClass('fistempty');
    $(".minigame-box-reset").addClass('disabled');
    $(".minigame-checkbox-reset").addClass('disabled');
    $(".minigame-box-reset").removeClass('active');
    $("#inputResetGetPromotionRadioRange").addClass('disabled');

    // reset
    $('[id^=SettingMinigameTabsStep]').removeClass('active');
    $('[id^=SettingMinigameTabsStep]').eq(0).addClass('active')
    // Step 1
    $('#minigameName').val('');
    $('#minigameName-en').val('');
    $('#minigameName-tl').val('');
    miniGameNameOld = '';
    $('#minigameStatus').prop('checked', false);
    $('#minigameConditionHtml').val('');
    $('#minigameConditionHtml-en').val('');
    $('#minigameConditionHtml-tl').val('');

    initializeDetailHtml().then(editor => {
        editor.setData("");
    });
    initializeDetailHtmlEn().then(editor => {
        editor.setData("");
    });
    initializeDetailHtmlTl().then(editor => {
        editor.setData("");
    });    

    $('#showStartDateEndDateSelect').val('');
    $('#enableIfNotHaveLuckyWheel').prop('checked', false);

    $('input[name=turnOverBeforeOrAfterLuckyWheel][value="true"]').prop('checked', true);
    $('input[name=turnOverBeforeOrAfterMiniGame][value="true"]').prop('checked', true);

    $('#enableStartEndDate').val(false);
    $('#minigameEnableStartEndDate').prop('checked', false);

    $('#startDateSettingMinigameFromInput').val(null);
    $('#endDateSettingMinigameFromInput').val(null);
    $('#startTimeSettingMinigameInput').val(null);
    $('#endTimeSettingMinigameInput').val(null);

    $('#startDateSettingMinigameFromInput').prop('disabled', true);
    $('#startTimeSettingMinigameInput').prop('disabled', true);
    $('#endDateSettingMinigameFromInput').prop('disabled', true);
    $('#endTimeSettingMinigameInput').prop('disabled', true);

    $('#showEnableSunday').hide();
    hiddenActiveEnableSunday = false;
    $("#enableSunday").addClass("no-select");

    $('#showEnableMonday').hide();
    hiddenActiveEnableMonday = false;
    $("#enableMonday").addClass("no-select");
    $('#showEnableTuesday').hide();
    hiddenActiveEnableTuesday = false;
    $("#enableTuesday").addClass("no-select");

    $('#showEnableWednesday').hide();
    hiddenActiveEnableWednesday = false;
    $("#enableWednesday").addClass("no-select");
    $('#showEnablThursday').hide();
    hiddenActiveEnableThursday = false;
    $("#enableThursday").addClass("no-select");
    $('#showEnableFriday').hide();
    hiddenActiveEnableFriday = false;
    $("#enableFriday").addClass("no-select");

    $('#showEnableSaturday').hide();
    hiddenActiveEnableSaturday = false;
    $("#enableSaturday").addClass("no-select");

    hiddenActivePromotionSelectWeekday = false;
    hiddenActivePromotionSelectWeekend = false;
    hiddenActivePromotionSelectEveryday = true;
    changePromotionSelectEveryday();

    $('#showEnableEveryday').show();
    $('#showEnableSunday').hide();
    $('#showEnableMonday').hide();
    $('#showEnableTuesday').hide();
    $('#showEnableWednesday').hide();
    $('#showEnableThursday').hide();
    $('#showEnableFriday').hide();
    $('#showEnableSaturday').hide();

    $('#enableHiddenTime').val(false);
    $('#enableHiddenTime').prop('checked', false);

    $('#changeMinigameEnableCountDown').prop('checked', false);
    $('#minigameEnableCountDownCreated').prop('checked', true);
    $('#minigameEnableCountDownSetTime').prop('checked', false);
    $('#minigameEnableRemainingDay').prop('checked', false);
    $('#minigameCountdownRemainingDay').val('');
    $('#minigameEnableRemainingDateTime').prop('checked', false);
    $('#minigameCountdownRemainingDateBkk').val('');
    $('#minigameCountdownRemainingTimeBkk').val('');
    $(`input[name="minigameCountDownColorCodeRadio"][value="1"]`).prop('checked', true);

    $('#minigameEnableMaxPromotion').prop('checked', false);
    $('#minigameEnableMaxCountPerDay').prop('checked', false);
    $('#minigameMaxCountPerDay').val('');
    $('#minigameEnableMaxCountPerWeek').prop('checked', false);
    $('#minigameMaxCountPerWeek').val('');
    $('#minigameEnableMaxCountPerMonth').prop('checked', false);

    $('#minigameMaxCountPerMonth').val('');
    $('#minigameEnableMaxCountPerPromotion').prop('checked', false);
    $('#minigameMaxCountPerPromotion').val('');
    $('#minigameEnableMaxPromotionPerPerson').prop('checked', false);
    $('#minigameEnableMaxCountPerDayPerPerson').prop('checked', false);
    $('#minigameMaxCountPerDayPerPerson').val('');
    $('#minigameEnableMaxCountPerTimePerPerson').prop('checked', false);
    $('#minigameMaxCountPerTimePerPerson').val('');
    $('#minigameEnableMaxCountPerWeekPerPerson').prop('checked', false);
    $('#minigameMaxCountPerWeekPerPerson').val('');
    $('#minigameEnableMaxCountPerMonthPerPerson').prop('checked', false);
    $('#minigameMaxCountPerMonthPerPerson').val('');
    $('#minigameEnableMaxCountPerPerson').prop('checked', false);
    $('#minigameMaxCountPerPerson').val('');

    $("#enableCreditBalance").val('');
    $("#enableCreditBalance").prop('checked', false);
    $("#inputCreditBalance").addClass("disabled");

    $('#minigameEnableReset').prop('checked', false);
    $('#minigameEnableResetExpired').prop('checked', true);
    $('#minigameEnableResetTime').prop('checked', false);
    $('#minigameResetTimeBkk').val('');
    $('#minigameEnableResetDateTime').prop('checked', false);
    $('#minigameResetDay').val('');
    $('#minigameResetHour').val('');
    $('#minigameResetMinute').val('');

    $('#minigameEnableRemoveChance').prop('checked', false);
    $('#minigameEnableGameProvider').prop('checked', false);
    onSelectGameProvider('1', 'inactive');
    onSelectGameProvider('2', 'inactive');
    onSelectGameProvider('3', 'inactive');
    onSelectGameProvider('4', 'inactive');

    $('#minigameEnableFixChance').prop('checked', false);
    $('#minigameEnableLimitPerGamePerDay').prop('checked', false);
    $('#limitPerGamePerDay').val('');
    $('#minigameEnableLimitPerPerson').prop('checked', false);
    $('#minigameEnableLimitBalance').val('');
    $('#minigameEnableLimitBalance').prop('checked', false);
    $('#minigameLimitBalance').val('');

    customMinigameDepositTypeDropdown.setValue("deposit-once");
    customMinigameDepositTypeDropdown.update();
    customMinigameDepositTypeDropdown.options.onSelect()
    customMinigameDepositAmountTypeDropdown.setValue("min-deposit");
    customMinigameDepositAmountTypeDropdown.update();
    customMinigameDepositAmountTypeDropdown.options.onSelect()
    $('#minigameMinAmountAutoDeposit').val('');
    $('#minigameMaxAmountAutoDeposit').val('');
    $('#minigameAmountAutoDeposit').val('');
    $('#minigameAmountAutoDepositFrom').val('');
    $('#minigameAmountAutoDepositTo').val('');
    $('#minigameDepositCount').val('');
    $('#minigameDepositPeriod').val('');

    $('#minigameMinAmountAutoDeposit').addClass('fistempty');
    $('#minigameMaxAmountAutoDeposit').addClass('fistempty');
    $('#minigameAmountAutoDeposit').addClass('fistempty');
    $('#minigameAmountAutoDepositFrom').addClass('fistempty');
    $('#minigameAmountAutoDepositTo').addClass('fistempty');
    $('#minigameDepositCount').addClass('fistempty');
    $('#minigameDepositPeriod').addClass('fistempty');

    $('#minigameEnableConditionTurnover').prop('checked', false);
    $('#minigameEnableWithdrawConditionMinTurnover').prop('checked', false);
    $('#minigameWithdrawConditionMinTurnover').val('');
    $('#minigameEnableWithdrawConditionMinTurnoverCredit').prop('checked', false);
    $('#minigameWithdrawConditionMinTurnoverCredit').val('');
    $('#minigameEnableCreditToClearTurnover').prop('checked', false);
    $('#minigameEnableMaxRemainCreditToClearTurnover').prop('checked', false);
    $('#minigameMaxRemainCreditToClearTurnover').val('');
    $('#minigameEnableMaxRemainCreditToClearTurnoverPercentage').prop('checked', false);
    $('#minigameMaxRemainCreditToClearTurnoverPercentage').val('');
    $('#minigameEnableIncreaseTurnOver').prop('checked', false);
    $('#minigameEnableTurnOverDeposit').prop('checked', false);
    $('#minigameEnableMinTurnover').prop('checked', false);
    $('#minigameMinTurnover').val('');
    $('#minigameEnableMinTurnoverCredit').prop('checked', false);
    $('#minigameminTurnoverCredit').val('');
    $('#minigameWithdrawConditionMinTurnoverMinCredit').val('');
    $('#disableMinTurnOverMinCredit').prop('checked', false);

    $('#minigameEnableWithdrawCondition').prop('checked', false);
    $('#minigameEnableCreditRemain').prop('checked', false);
    $('#minigameCreditRemain').val('');
    $('#minigameEnableMaxWithdraw').prop('checked', false);
    $('#minigameMaxWithdraw').val('');
    $('#minigameEnableDeductCreditAll').prop('checked', false);
    $('#minigameDisableAutoWithdraw').prop('checked', false);

    let urlimg = `${LEGACY_ASSET_BASE}/images/minigame/wheel-8/`;
    $(`.luckywheelSpinBtnSrc`).attr("src", urlimg + 'button.png');
    $(`.luckywheelSpinBtnSrc`).show();
    $(`.luckywheelFrameSrc`).attr("src", urlimg + 'frame.png');
    $(`.luckywheelFrameSrc`).show();

    $(`.luckywheelGetRewardSrc`).attr("src", urlimg + 'popup.png');
    $(`.luckywheelGetRewardSrc`).show();
    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/`;
    $(`.imgMinigameRewardMainSrc`).attr("src", urlimg + 'minigame-reward.png');
    $(`.imgMinigameRewardMainSrc`).show();
    $(`.imgMinigameRewardSrc`).attr("src", urlimg + 'minigame-reward.png');
    $(`.imgMinigameRewardSrc`).show();
    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/`;
    $(`.imgMinigamePopupSrc`).attr("src", urlimg + 'minigame-popup.png');
    $(`.imgMinigamePopupSrc`).show();

    customNumberPartsLuckywheel.setValue(8);
    customNumberPartsLuckywheel.update();
    showLabalLuckywheelImagePixel(8);
    customNumberPartsMinigame.setValue(6);
    customNumberPartsMinigame.update();
    iframeShowCountDownPreview(1);

    customLimitCustomerGroupDropdown.setValue([]);
    customLimitCustomerGroupDropdown.update();

    customSelectAgentDropdown.setValue([]);
    customSelectAgentDropdown.update();

    $('#enableLimitCustomerGroup').prop('checked', false);

    //$(`#minigameEnableMinTurnover`).prop('checked',true);
    setValueCheckBox("minigameEnableMinTurnover", true);
    setValueRadio("minigameEnableTurnOverDepositOn", false);
    setValueSwitch("minigameEnableIncreaseTurnOver", false);
    //$(`#minigameEnableTurnOverDepositOff`).prop('checked', true);


    // ตั้งค่าตรวจสอบยอด Balance และ ยอดถอน เมื่อสมาชิกทำการถอนเงิน
    $('#enableCustomerCreditBalance').prop('checked', false);
    $('#customerCreditBalance').val('');
    $('#reduceQuota').val('');
    $('#enableReduceAllQuota').prop('checked', false);

    $('#enableCustomerCreditWithdraw').prop('checked', false);
    $('#customerCreditWithdraw').val('');
    $('#reduceQuotaWithdraw').val('');
    $('#enableReduceAllQuotaWithdraw').prop('checked', false);

    $('#inputMinigameTurnOverHours').val('');
    $('input[name="minigameTurnoverPeriodSettingRadio"]').prop('checked', false);

    $('#isMemberPromotionSuccess').prop('checked', false);
    $('#isMemberCanCancel').prop('checked', false);
    $('#minigameTurnoverPeriodSettingOffRadio').prop('checked', true);

    $(".btnSetDefault").addClass("disabled");

    selectMultiLanguage("th");
    checkMultiSetting();
};

function showLabalLuckywheelImagePixel(count) {
    switch (parseInt(count)) {
        case 6:
            $('#showLabalLuckywheelImagePixel').html('ขนากรูป 220px x 220px สกุลไฟล์ .png. .jpg ');
            break;
        case 10:
            $('#showLabalLuckywheelImagePixel').html('ขนากรูป 132px x 218px สกุลไฟล์ .png. .jpg');
            break;
        default:
            $('#showLabalLuckywheelImagePixel').html('ขนากรูป 150px x 196px สกุลไฟล์ .png. .jpg');
    }
}

// toggle เปิด/ปิด Countdown โปรโมชั่น
let hiddenActivePromotionCountdown = true;
let hiddenActivePromotionCountdownType = null;

function changePromotionCountdownStatus(id) {
    hiddenActivePromotionCountdownStatus = $(`#promotionCountdownStatus-${id}`).prop('checked');

    if (hiddenActivePromotionCountdown) {
        hiddenActivePromotionCountdown = false;
        $("#promotionCountdownRadioAfter").removeClass('active');
        $("#promotionCountdownRadioNow").removeClass('active');

        $("#boxPromotionCountdownRadioAfter").removeClass('disabled');
        $("#boxPromotionCountdownRadioNow").removeClass('disabled');
    } else {
        hiddenActivePromotionCountdown = true;
        $("#promotionCountdownRadioAfter").addClass('active');
        $("#promotionCountdownRadioNow").addClass('active');

        $("#boxPromotionCountdownRadioAfter").addClass('disabled');
        $("#boxPromotionCountdownRadioNow").addClass('disabled');
    }

    if (hiddenActivePromotionCountdown == false && hiddenActivePromotionCountdownType == true) {
        $("#boxPromotionCountdownRadioDays").removeClass('disabled');
        $("#boxPromotionCountdownRadioDaterange").removeClass('disabled');
    } else if (hiddenActivePromotionCountdown == true && hiddenActivePromotionCountdownType == true) {
        $("#boxPromotionCountdownRadioDays").addClass('disabled');
        $("#boxPromotionCountdownRadioDaterange").addClass('disabled');
    }
}

var imgBlob = {
    "luckywheelFrame": null,
    "luckywheelSpinBtn": null,
    "luckywheelGetReward": null,
    "imgMinigameReward": null,
    "imgMinigamePopup": null,
};

const handleUploadBlob = (e) => {
    const id = $(`#${e.currentTarget.id}`);
    const src = $(`.${e.currentTarget.id}Src`);
    const placeholder = $(`#${e.currentTarget.id}Placeholder`);
    const error = $(`#${e.currentTarget.id}Error`);
    const files = e.currentTarget.files;
    $(`.btnSetDefault`).removeClass('disabled');
    if (Form.checkSingleFileRequired(files)) {
        const file = files[0];

        if (imgBlob[id] !== null) {
            URL.revokeObjectURL(imgBlob[id]);
            imgBlob[id] = null;
        }

        imgBlob[id] = URL.createObjectURL(file);
        src.attr('src', imgBlob[id]);
        src.show();
        placeholder.hide();
        Form.clearInputWithError(src);

        if (e.currentTarget.id == "imgMinigameReward") {
            let showStepEndHtml = "";

            showStepEndHtml += `<img src="${imgBlob[id]}" class="box-img3 showImagePreviewPromotionDetail imgMinigameRewardMainSrc" />`;

            $(`.imgMinigameRewardMainSrc`).attr('src', imgBlob[id]);
            $(`.imgMinigameRewardSrc`).attr('src', imgBlob[id]);

            $('#showStepEnd').addClass('preview-minigame');
            $('#showStepEnd').html(showStepEndHtml);
        }
    } else {
        src.removeAttr('src');
        src.hide();
        placeholder.show();
        Form.setInputWithError(src, $(`#${e.currentTarget.id}`).attr("data-error"));
    }
};

// toggle เปิด/ปิด กำหนดวันทำงานของโปรโมชั่น
let hiddenActivePromotionSelectDay = false;
let hiddenActiveEnableSunday = true;
let hiddenActiveEnableMonday = true;
let hiddenActiveEnableTuesday = true;
let hiddenActiveEnableWednesday = true;
let hiddenActiveEnableThursday = true;
let hiddenActiveEnableFriday = true;
let hiddenActiveEnableSaturday = true;
let hiddenActivePromotionSelectWeekday = false;
let hiddenActivePromotionSelectWeekend = false;
let hiddenActivePromotionSelectEveryday = true;

// toggle เปิด/ปิด กำหนดวันทำงานของโปรโมชั่น Weekday
function changePromotionSelectWeekday() {
    if (hiddenActivePromotionSelectWeekday) {
        hiddenActivePromotionSelectWeekday = false;
        hiddenActivePromotionSelectWeekend = true;
        hiddenActivePromotionSelectEveryday = true;

        $(".btn-custom-day-1").removeClass("no-select");
        $(".btn-custom-day-2").removeClass("no-select");
        $(".btn-custom-day-3").removeClass("no-select");

        hiddenActiveEnableSunday = false;
        hiddenActiveEnableMonday = true;
        hiddenActiveEnableTuesday = true;
        hiddenActiveEnableWednesday = true;
        hiddenActiveEnableThursday = true;
        hiddenActiveEnableFriday = true;
        hiddenActiveEnableSaturday = false;

        $("#enableSunday").addClass("no-select");
        $("#enableMonday").removeClass("no-select");
        $("#enableTuesday").removeClass("no-select");
        $("#enableWednesday").removeClass("no-select");
        $("#enableThursday").removeClass("no-select");
        $("#enableFriday").removeClass("no-select");
        $("#enableSaturday").addClass("no-select");

        $(".btn-custom-day-1").removeClass("no-select");
        $(".btn-custom-day-2").addClass("no-select");
        $(".btn-custom-day-3").addClass("no-select");

        //$("#boxPromotionSelectWeekday").removeClass("no-select");
        //$("#boxPromotionSelectWeekend").addClass("no-select");
        //$("#boxPromotionSelectEveryday").addClass("no-select");
    } else {
        hiddenActivePromotionSelectWeekday = true;

        hiddenActiveEnableSunday = true;
        hiddenActiveEnableMonday = true;
        hiddenActiveEnableTuesday = true;
        hiddenActiveEnableWednesday = true;
        hiddenActiveEnableThursday = true;
        hiddenActiveEnableFriday = true;
        hiddenActiveEnableSaturday = true;

        $("#enableSunday").removeClass("no-select");
        $("#enableMonday").removeClass("no-select");
        $("#enableTuesday").removeClass("no-select");
        $("#enableWednesday").removeClass("no-select");
        $("#enableThursday").removeClass("no-select");
        $("#enableFriday").removeClass("no-select");
        $("#enableSaturday").removeClass("no-select");
        $("#boxPromotionSelectWeekday").addClass("no-select");
        $("#boxPromotionSelectWeekend").addClass("no-select");
        $("#boxPromotionSelectEveryday").removeClass("no-select");
    }
}

// toggle เปิด/ปิด กำหนดวันทำงานของโปรโมชั่น Weekend
function changePromotionSelectWeekend() {
    if (hiddenActivePromotionSelectWeekend) {
        hiddenActivePromotionSelectWeekday = true;
        hiddenActivePromotionSelectWeekend = false;
        hiddenActivePromotionSelectEveryday = true;

        $(".btn-custom-day-1").removeClass("no-select");
        $(".btn-custom-day-2").removeClass("no-select");
        $(".btn-custom-day-3").removeClass("no-select");

        hiddenActiveEnableSunday = true;
        hiddenActiveEnableMonday = false;
        hiddenActiveEnableTuesday = false;
        hiddenActiveEnableWednesday = false;
        hiddenActiveEnableThursday = false;
        hiddenActiveEnableFriday = false;
        hiddenActiveEnableSaturday = true;

        $("#enableSunday").removeClass("no-select");
        $("#enableMonday").addClass("no-select");
        $("#enableTuesday").addClass("no-select");
        $("#enableWednesday").addClass("no-select");
        $("#enableThursday").addClass("no-select");
        $("#enableFriday").addClass("no-select");
        $("#enableSaturday").removeClass("no-select");

        $(".btn-custom-day-1").addClass("no-select");
        $(".btn-custom-day-2").removeClass("no-select");
        $(".btn-custom-day-3").addClass("no-select");

        //$("#boxPromotionSelectWeekday").addClass("no-select");
        //$("#boxPromotionSelectWeekend").removeClass("no-select");
        //$("#boxPromotionSelectEveryday").addClass("no-select");
    } else {
        hiddenActivePromotionSelectWeekend = true;

        hiddenActiveEnableSunday = true;
        hiddenActiveEnableMonday = true;
        hiddenActiveEnableTuesday = true;
        hiddenActiveEnableWednesday = true;
        hiddenActiveEnableThursday = true;
        hiddenActiveEnableFriday = true;
        hiddenActiveEnableSaturday = true;

        $("#enableSunday").removeClass("no-select");
        $("#enableMonday").removeClass("no-select");
        $("#enableTuesday").removeClass("no-select");
        $("#enableWednesday").removeClass("no-select");
        $("#enableThursday").removeClass("no-select");
        $("#enableFriday").removeClass("no-select");
        $("#enableSaturday").removeClass("no-select");
        $("#boxPromotionSelectWeekday").addClass("no-select");
        $("#boxPromotionSelectWeekend").addClass("no-select");
        $("#boxPromotionSelectEveryday").removeClass("no-select");
    }
}

// toggle เปิด/ปิด กำหนดวันทำงานของโปรโมชั่น Every day
function changePromotionSelectEveryday() {
    if (hiddenActivePromotionSelectEveryday) {
        hiddenActivePromotionSelectWeekday = true;
        hiddenActivePromotionSelectWeekend = true;
        hiddenActivePromotionSelectEveryday = false;

        hiddenActiveEnableSunday = true;
        hiddenActiveEnableMonday = true;
        hiddenActiveEnableTuesday = true;
        hiddenActiveEnableWednesday = true;
        hiddenActiveEnableThursday = true;
        hiddenActiveEnableFriday = true;
        hiddenActiveEnableSaturday = true;

        $(".btn-custom-day-1").removeClass("no-select");
        $(".btn-custom-day-2").removeClass("no-select");
        $(".btn-custom-day-3").removeClass("no-select");

        $("#enableSunday").removeClass("no-select");
        $("#enableMonday").removeClass("no-select");
        $("#enableTuesday").removeClass("no-select");
        $("#enableWednesday").removeClass("no-select");
        $("#enableThursday").removeClass("no-select");
        $("#enableFriday").removeClass("no-select");
        $("#enableSaturday").removeClass("no-select");

        $(".btn-custom-day-1").addClass("no-select");
        $(".btn-custom-day-2").addClass("no-select");
        $(".btn-custom-day-3").removeClass("no-select");

        //$("#boxPromotionSelectWeekday").addClass("no-select");
        //$("#boxPromotionSelectWeekend").addClass("no-select");
        //$("#boxPromotionSelectEveryday").removeClass("no-select");
    } else {
        hiddenActivePromotionSelectEveryday = true;

        hiddenActiveEnableSunday = false;
        hiddenActiveEnableMonday = false;
        hiddenActiveEnableTuesday = false;
        hiddenActiveEnableWednesday = false;
        hiddenActiveEnableThursday = false;
        hiddenActiveEnableFriday = false;
        hiddenActiveEnableSaturday = false;

        $("#enableSunday").addClass("no-select");
        $("#enableMonday").addClass("no-select");
        $("#enableTuesday").addClass("no-select");
        $("#enableWednesday").addClass("no-select");
        $("#enableThursday").addClass("no-select");
        $("#enableFriday").addClass("no-select");
        $("#enableSaturday").addClass("no-select");
        $("#boxPromotionSelectWeekday").addClass("no-select");
        $("#boxPromotionSelectWeekend").addClass("no-select");
        $("#boxPromotionSelectEveryday").addClass("no-select");
    }
}

// toggle เปิด/ปิด กำหนดวันทำงานของโปรโมชั่น Day
function changePromotionSelectDay(day) {
    if (hiddenActiveEnableMonday &&
        hiddenActiveEnableTuesday &&
        hiddenActiveEnableWednesday &&
        hiddenActiveEnableThursday &&
        hiddenActiveEnableFriday &&
        !hiddenActiveEnableSaturday &&
        !hiddenActiveEnableSunday) {
        hiddenActivePromotionSelectWeekday = true;
        hiddenActivePromotionSelectWeekend = false;
        hiddenActivePromotionSelectEveryday = false;
        changePromotionSelectWeekday();
    } else if (!hiddenActiveEnableMonday &&
        !hiddenActiveEnableTuesday &&
        !hiddenActiveEnableWednesday &&
        !hiddenActiveEnableThursday &&
        !hiddenActiveEnableFriday &&
        hiddenActiveEnableSaturday &&
        hiddenActiveEnableSunday) {
        hiddenActivePromotionSelectWeekday = false;
        hiddenActivePromotionSelectWeekend = true;
        hiddenActivePromotionSelectEveryday = false;
        changePromotionSelectWeekend();
    } else if (hiddenActiveEnableMonday &&
        hiddenActiveEnableTuesday &&
        hiddenActiveEnableWednesday &&
        hiddenActiveEnableThursday &&
        hiddenActiveEnableFriday &&
        hiddenActiveEnableSaturday &&
        hiddenActiveEnableSunday) {
        hiddenActivePromotionSelectWeekday = false;
        hiddenActivePromotionSelectWeekend = false;
        hiddenActivePromotionSelectEveryday = true;
        changePromotionSelectEveryday();
    } else {
        hiddenActivePromotionSelectWeekday = true;
        hiddenActivePromotionSelectWeekend = true;
        hiddenActivePromotionSelectEveryday = true;

        $("#boxPromotionSelectWeekday").addClass("no-select");
        $("#boxPromotionSelectWeekend").addClass("no-select");
        $("#boxPromotionSelectEveryday").addClass("no-select");
    }

    if (day == "sunday") {
        if (hiddenActiveEnableSunday) {
            hiddenActiveEnableSunday = false;
            $("#enableSunday").addClass("no-select");
        } else {
            hiddenActiveEnableSunday = true;
            $("#enableSunday").removeClass("no-select");
        }
    } else if (day == "monday") {
        if (hiddenActiveEnableMonday) {
            hiddenActiveEnableMonday = false;
            $("#enableMonday").addClass("no-select");
        } else {
            hiddenActiveEnableMonday = true;
            $("#enableMonday").removeClass("no-select");
        }
    } else if (day == "tuesday") {
        if (hiddenActiveEnableTuesday) {
            hiddenActiveEnableTuesday = false;
            $("#enableTuesday").addClass("no-select");
        } else {
            hiddenActiveEnableTuesday = true;
            $("#enableTuesday").removeClass("no-select");
        }
    } else if (day == "wednesday") {
        if (hiddenActiveEnableWednesday) {
            hiddenActiveEnableWednesday = false;
            $("#enableWednesday").addClass("no-select");
        } else {
            hiddenActiveEnableWednesday = true;
            $("#enableWednesday").removeClass("no-select");
        }
    } else if (day == "thursday") {
        if (hiddenActiveEnableThursday) {
            hiddenActiveEnableThursday = false;
            $("#enableThursday").addClass("no-select");
        } else {
            hiddenActiveEnableThursday = true;
            $("#enableThursday").removeClass("no-select");
        }
    } else if (day == "friday") {
        if (hiddenActiveEnableFriday) {
            hiddenActiveEnableFriday = false;
            $("#enableFriday").addClass("no-select");
        } else {
            hiddenActiveEnableFriday = true;
            $("#enableFriday").removeClass("no-select");
        }
    } else if (day == "saturday") {
        if (hiddenActiveEnableSaturday) {
            hiddenActiveEnableSaturday = false;
            $("#enableSaturday").addClass("no-select");
        } else {
            hiddenActiveEnableSaturday = true;
            $("#enableSaturday").removeClass("no-select");
        }
    }
}

// เพิ่ม template กำหนดวันทำงานของ Minigame
const templateMinigameDatetimeMap = new Map;

function addTemplateMinigameDatetime(dataList = null) {
    var dataTimeMinigame = document.querySelectorAll("[data-time-minigame]");
    var number = dataTimeMinigame.length;

    number = number + 1;

    let cloneMinigameDatetimetemplate = $('#templateMinigameDatetime').clone();

    let cloneMinigameDatetimeMain = cloneMinigameDatetimetemplate.html();
    cloneMinigameDatetimeMain = $(cloneMinigameDatetimeMain);
    cloneMinigameDatetimeMain.attr('data-time-minigame', `${number}`);
    let minigameDatetimeText = cloneMinigameDatetimeMain.find('#minigameDatetimeText-template');
    minigameDatetimeText.attr('id', `minigameDatetimeText-${number}`);
    minigameDatetimeText.text(`เวลาที่ ${number}`);
    cloneMinigameDatetimeMain.find('#minigameCustomStartTime-template').attr('id', `minigameCustomStartTime-${number}`);
    cloneMinigameDatetimeMain.find('#minigameCustomEndTime-template').attr('id', `minigameCustomEndTime-${number}`);
    let minigameDeleteMinigameDatetime = cloneMinigameDatetimeMain.find('#minigameDeleteMinigameDatetime-template');
    minigameDeleteMinigameDatetime.attr('id', `minigameDeleteMinigameDatetime-${number}`);
    minigameDeleteMinigameDatetime.attr('onclick', `deleteTemplateMinigameDatetime(${number})`);
    let boxMinigameSelectAllDay = cloneMinigameDatetimeMain.find('#boxMinigameSelectAllDay-template');
    boxMinigameSelectAllDay.attr('id', `boxMinigameSelectAllDay-${number}`);
    boxMinigameSelectAllDay.attr('onclick', `changeMinigameSelectTimeAllDay(${number})`);
    cloneMinigameDatetimeMain.find(`#minigameCustomStartTime-${number}`).attr('oninput', `handleTimeBkkFrom(event,'${number}')`);
    cloneMinigameDatetimeMain.find(`#minigameCustomEndTime-${number}`).attr('oninput', `handleTimeBkkTo(event,'${number}')`);
    $('#time-set-add').append(cloneMinigameDatetimeMain);
    $(`#minigameCustomStartTime-${number}`).flatpickr();
    $(`#minigameCustomEndTime-${number}`).flatpickr();

    const data = {
        number,
        minigameCustomStartTime: $(`#minigameCustomStartTime-${number}`),
        minigameCustomEndTime: $(`#minigameCustomEndTime-${number}`)
    };

    templateMinigameDatetimeMap.set(number, data);

    if (number > 1) {
        $(".checkShowDeleteMinigameDatetime").show();
    } else {
        $(".checkShowDeleteMinigameDatetime").hide();
    }

    if (dataList) {
        $(`#minigameCustomStartTime-${number}`).val(dataList.timeBkkFrom);
        $(`#minigameCustomEndTime-${number}`).val(dataList.timeBkkTo);

    }
}
// get template กำหนดวันทำงานของ Minigame
const getTemplateMinigameDatetime = () => {
    const result = [];

    for (const [key, values] of templateMinigameDatetimeMap.entries()) {

        result.push({
            timeBkkFrom: values.minigameCustomStartTime.val() || null,
            timeBkkTo: values.minigameCustomEndTime.val() || null,

        });
    }

    return result;
};

function clearTemplateMinigameDatetime() {
    $("#time-set-add").empty();
    templateMinigameDatetimeMap.clear();
}

function deleteTemplateMinigamePrivilege(id) {

    var minigamesPrivilege = document.querySelectorAll(`[data-minigame-remove-chance]`);
    var number = minigamesPrivilege.length;

    number = number - 1;

    if (number > 1) {
        $(".btn-remove-chance-privilege").show();
    } else {
        $(".btn-remove-chance-privilege").hide();
    }

    $("#minigame-remove-chance-" + id).remove();

    //for (let i = 0; i < minigamesPrivilege.length; i++) {

    //    if (i + 1 == id) {
    //        $(minigamesPrivilege[i]).remove();
    //        let keysArray = Array.from(customMinigameRemoveChanceDropdownMap.keys());
    //        let keyToDelete = keysArray[i];
    //        customMinigameRemoveChanceDropdownMap.delete(keyToDelete);
    //    } else if (i + 1 > id) {
    //        let numbernew = i;
    //        $(minigamesPrivilege[i]).attr('data-minigame-remove-chance', i);
    //        let minigameDeleteMinigamePrivilege = $(minigamesPrivilege[i]).find(`#btnRemoveChancePriviege` + (i + 1));
    //        minigameDeleteMinigamePrivilege.attr('id', `btnRemoveChancePriviege${i}`);
    //        minigameDeleteMinigamePrivilege.attr('onclick', `deleteTemplateMinigamePrivilege(${i})`);
    //        $(minigamesPrivilege[i]).find(`#minigameCustomStartTime-` + (i + 1)).attr('id', `minigameCustomStartTime-${i}`);
    //        $(minigamesPrivilege[i]).find(`#minigameCustomEndTime-` + (i + 1)).attr('id', `minigameCustomEndTime-${i}`);
    //    }

    //}

}

// ลบ template กำหนดวันทำงานของ Minigame
function deleteTemplateMinigameDatetime(id) {
    var minigames = document.querySelectorAll(`[data-time-minigame]`);
    var number = minigames.length;

    number = number - 1;

    if (number > 1) {
        $(".checkShowDeletePromotionDatetime").show();
    } else {
        $(".checkShowDeletePromotionDatetime").hide();
    }
    for (let i = 0; i < minigames.length; i++) {
        if (i + 1 == id) {
            $(minigames[i]).remove();
            let keysArray = Array.from(templateMinigameDatetimeMap.keys());
            let keyToDelete = keysArray[i];
            templateMinigameDatetimeMap.delete(keyToDelete);
        } else if (i + 1 > id) {
            let numbernew = i;
            $(minigames[i]).attr('data-time-minigame', i);
            let minigameDatetimeText = $(minigames[i]).find(`#minigameDatetimeText-` + (i + 1));
            minigameDatetimeText.attr('id', `minigameDatetimeText-${i}`);
            minigameDatetimeText.text(`เวลาที่ ${i}`);
            let minigameDeleteMinigameDatetime = $(minigames[i]).find(`#minigameDeleteMinigameDatetime-` + (i + 1));
            minigameDeleteMinigameDatetime.attr('id', `minigameDeleteMinigameDatetime-${i}`);
            minigameDeleteMinigameDatetime.attr('onclick', `deleteTemplateMinigameDatetime(${i})`);
            let boxMinigameSelectAllDay = $(minigames[i]).find(`#boxMinigameSelectAllDay-` + (i + 1));
            boxMinigameSelectAllDay.attr('id', `boxMinigameSelectAllDay-${i}`);
            boxMinigameSelectAllDay.attr('onclick', `changeMinigameSelectTimeAllDay(${i})`);
            $(minigames[i]).find(`#minigameCustomStartTime-` + (i + 1)).attr('id', `minigameCustomStartTime-${i}`);
            $(minigames[i]).find(`#minigameCustomEndTime-` + (i + 1)).attr('id', `minigameCustomEndTime-${i}`);
        }
    }
}
function changeMinigameSelectTimeAllDay(id) {
    $(`#minigameCustomStartTime-${id}`).val("00:00");
    $(`#minigameCustomEndTime-${id}`).val("23:59");
}
// toggle เปิด/ปิด Minigame
function changeEnableStartEndDateStatus() {
    let hiddenActiveEnableStartEndDate = $("#enableStartEndDate").val();

    if (hiddenActiveEnableStartEndDate == "true") {
        $("#enableStartEndDate").val(false);

        $('#startDateSettingMinigameFromInput').prop('disabled', true);
        $('#startTimeSettingMinigameInput').prop('disabled', true);
        $('#endDateSettingMinigameFromInput').prop('disabled', true);
        $('#endTimeSettingMinigameInput').prop('disabled', true);

        $('#enableHiddenTime').prop('disabled', true);
    } else {
        $("#enableStartEndDate").val(true);

        $('#startDateSettingMinigameFromInput').prop('disabled', false);
        $('#startTimeSettingMinigameInput').prop('disabled', false);
        $('#endDateSettingMinigameFromInput').prop('disabled', false);
        $('#endTimeSettingMinigameInput').prop('disabled', false);

        $('#enableHiddenTime').prop('disabled', false);
    }
}

function changeStatusSwitch(elementSwitch, step) {
    if (step == '2-2-1-1') {
        changeEnableStartEndDateStatus();
    }

    let inputColElement = document.querySelector(`.switch-${step}`);
    let inputAll = inputColElement.querySelectorAll(`input`);
    let formCheckAll = inputColElement.querySelectorAll(`.minigame-reset`);
    let dropdownCheckAll = inputColElement.querySelectorAll(`.dropdown-wrapper`); //aaa

    let statusSwitch = $(elementSwitch).prop('checked');
    if (statusSwitch && actionNow != 'create') {                // && step != "2-3-9"
        $(inputColElement).find(`div > .box-radio:checked`).parent().addClass('active');
    }
    for (let input of inputAll) {
        if (statusSwitch) {
            $(input).removeClass('active');

            if ($(input).prop('checked')) {
                if (input.dataset.valueId && input.dataset.valueId1 && input.dataset.valueId2) {
                    let id = [input.dataset.valueId1, input.dataset.valueId2];
                    $("#" + id[0]).removeClass('disabled');
                    $("#" + id[1]).removeClass('disabled');
                } else {
                    $("#" + input.dataset.value).removeClass('disabled');
                }
            }

        } else {
            if (input.dataset.valueId1 && input.dataset.valueId2) {
                let id = [input.dataset.valueId1, input.dataset.valueId2];
                $("#" + id[0]).addClass('disabled');
                $("#" + id[1]).addClass('disabled');
                $("#" + id[0]).removeClass('active');
                $("#" + id[1]).removeClass('active');
            } else {
                $("#" + input.dataset.value).addClass('disabled');
                if (input && input.id.length > 0) {
                    $("#" + input.id).closest(".box-minigame-click-select.minigame-box-reset").removeClass('active');
                }
            }
            $(input).addClass('active');

        }
    }
    for (let formCheck of formCheckAll) {
        if (statusSwitch) {
            $(formCheck).removeClass('disabled');
        } else {
            $(formCheck).addClass('disabled');
        }
    }
    for (let input of dropdownCheckAll) {
        if (statusSwitch) {
            if (!$(input).hasClass("empty")) {
                if (input.dataset.value) {
                    $("#" + input.dataset.value).removeClass('disabled');
                }
            } else {
                if (input.dataset.value) {
                    $("#" + input.dataset.value).addClass('disabled');
                }
            }

        } else {
            if (input.dataset.value) {
                $("#" + input.dataset.value).addClass('disabled');
            }
        }
    }

}

// toggle แสดงผล Minigame
function changeMinigameCountdownRadio(elementRadio) {
    if (elementRadio.checked) {
        if (elementRadio.dataset.valueId == "2") {
            let e1 = $("#" + elementRadio.dataset.valueId1);
            let e2 = $("#" + elementRadio.dataset.valueId2);
            e1.removeClass('disabled');
            e2.removeClass('disabled');
            if (!e1.prop('checked') && !e2.prop('checked')) {
                if (e1.parent().attr("onclick")?.length > 0) {
                    e1.parent()[0].onclick();
                } else if (e1.parent().attr("onchange")?.length > 0) {
                    e1.parent()[0].onchange();
                }
            } else {
                if (e1.parent().attr("onclick")?.length > 0) {
                    e1.parent()[0].onclick();
                } else if (e1.parent().attr("onchange")?.length > 0) {
                    e1.parent()[0].onchange();
                }
            }
        } else {
            $("#" + elementRadio.dataset.valueId1).addClass('disabled');
            $("#" + elementRadio.dataset.valueId2).addClass('disabled');
            $("#" + elementRadio.dataset.valueId1).removeClass('active');
            $("#" + elementRadio.dataset.valueId2).removeClass('active');
        }
    }
}


// toggle แสดงผล checkbox Minigame
function changeMinigamecheckbox(elementRadio) {
    if (elementRadio.checked) {
        $("#" + elementRadio.dataset.value).removeClass('disabled');

    } else {
        $("#" + elementRadio.dataset.value).addClass('disabled');
    }
}

// toggle แสดงผล radio input
function changeMinigameradioinput(elementRadio) {
    if (elementRadio.checked) {
        $("#" + elementRadio.dataset.value1).removeClass('disabled');
        $("#" + elementRadio.dataset.value2).addClass('disabled');

    } else {
        $("#" + elementRadio.dataset.value2).removeClass('disabled');
        $("#" + elementRadio.dataset.value1).addClass('disabled');
    }
}

// toggle แสดงผล MinigameRadio
function getMinigameRadio(elementRadio, condition) {
    if (condition) {
        for (let id of JSON.parse(decodeURIComponent(elementRadio.dataset.value))) {
            $("#" + id).removeClass('disabled');
        }
    } else {
        for (let id of JSON.parse(decodeURIComponent(elementRadio.dataset.value))) {
            $("#" + id).addClass('disabled');
        }
        if (elementRadio.dataset.disable) {
            $("#" + elementRadio.dataset.disable).prop('checked', true);
            if ($("#" + elementRadio.dataset.disable).attr("onchange")?.length > 0) {
                $("#" + elementRadio.dataset.disable)[0].onchange();
            }
        }
    }
}
// toggle แสดงผล resetMinigameRadio
function resetGetMinigameRadio(elementRadio) {
    if (elementRadio.checked && (elementRadio.value == "minigameEnableResetTime")) {
        $("#" + elementRadio.dataset.value).removeClass('disabled');
        $("#inputResetGetMinigameRangeResetRadio").addClass('disabled');
    } else if (elementRadio.checked && elementRadio.value == "minigameEnableResetDateTime") {
        $("#" + elementRadio.dataset.value).removeClass('disabled');
        $("#inputMinigameResetTimeBkk").addClass('disabled');
    } else {
        $("#inputResetGetMinigameRangeResetRadio").addClass('disabled');
        $("#inputMinigameResetTimeBkk").addClass('disabled');
    }
    validateStep();
}
// select Box
function selectChangeMinigameBoxRadio(elementBox) {
    if (elementBox.dataset.valueId == "1") {
        if (!$("#" + elementBox.dataset.valueId1).hasClass("disabled")) {
            $("#" + elementBox.dataset.valueId1).addClass('active');
            $("#" + elementBox.dataset.valueId1 + " .box-radio").prop('checked', true);
        }
        if (!$("#" + elementBox.dataset.valueId2).hasClass("disabled")) {
            $("#" + elementBox.dataset.valueId2).removeClass('active');
            $("#" + elementBox.dataset.valueId2 + " .box-radio").prop('checked', false);
        }
    } else {
        if (!$("#" + elementBox.dataset.valueId1).hasClass("disabled")) {
            $("#" + elementBox.dataset.valueId1).removeClass('active');
            $("#" + elementBox.dataset.valueId1 + " .box-radio").prop('checked', false);
        }
        if (!$("#" + elementBox.dataset.valueId2).hasClass("disabled")) {
            $("#" + elementBox.dataset.valueId2).addClass('active');
            $("#" + elementBox.dataset.valueId2 + " .box-radio").prop('checked', true);
        }
    }
    validateStep();
}

// toggle เปิด/ปิด Minigame
function changeStatusSwitchMinigameTurnover(elementSwitch, step) {
    let inputColElement = document.querySelector(`.switch-${step}`);
    let inputAll = inputColElement.querySelectorAll(`input`);
    let formCheckAll = inputColElement.querySelectorAll(`.minigame-reset`);

    let statusSwitch = $(elementSwitch).prop('checked');

    if (statusSwitch) {
        if (elementSwitch.dataset.valueId && elementSwitch.dataset.valueId1 && elementSwitch.dataset.valueId2) {
            let id = [elementSwitch.dataset.valueId1, elementSwitch.dataset.valueId2];
            $("#" + id[0]).removeClass('disabled');
            $("#" + id[1]).removeClass('disabled');
            if (!$("#" + id[0]).prop('checked') && !$("#" + id[1]).prop('checked')) {
                if ($("#" + id[0]).parent().attr("onclick")?.length > 0) {
                    $("#" + id[0]).parent()[0].onclick();
                } else if (e1.parent().attr("onchange")?.length > 0) {
                    $("#" + id[0]).parent()[0].onchange();
                }
            }
        } else {
            $("#" + input.dataset.value).removeClass('disabled');
        }

    } else {
        if (elementSwitch.dataset.valueId1 && elementSwitch.dataset.valueId2) {
            let id = [elementSwitch.dataset.valueId1, elementSwitch.dataset.valueId2];
            $("#" + id[0]).addClass('disabled');
            $("#" + id[1]).addClass('disabled');
            $("#" + id[0]).removeClass('active');
            $("#" + id[1]).removeClass('active');
        } else {
            $("#" + input.dataset.value).addClass('disabled');
        }
        //$(input).addClass('active');

    }
    for (let formCheck of formCheckAll) {
        if (statusSwitch) {
            $(formCheck).removeClass('disabled');
        } else {
            $(formCheck).addClass('disabled');
        }
    }
}

var wheelInterval = null; // ประกาศตัวแปร wheelInterval ให้มีค่าเป็น null ที่ระดับของฟังก์ชัน spinWheel()
var wheelDeg = 0;
function spinWheel() {
    var predefinedDegrees = wheelDeg + (calculatePredefinedDegrees() + 360 * 10); // คำนวณมุมที่ต้องการหยุดที่

    wheelDeg = predefinedDegrees;
    var wheel = document.querySelector('.wheel-wrapper .custom-wheel.test-spin');
    wheel.style.transition = 'all 6s ease-out'; // กำหนดเวลาของการหมุน
    wheel.style.transform = `rotate(${predefinedDegrees}deg)`;
    // เริ่มหมุนวงล้อ
    wheelInterval = setInterval(() => {
        wheel.style.transform = `rotate(${predefinedDegrees}deg)`; // หมุนวงล้อ
    }, 100); // กำหนดความเร็วในการหมุนของวงล้อ

    // หลังจากเวลาหมด ให้หยุดการหมุนและตรวจสอบของรางวัลที่เลือก
    setTimeout(() => {
        clearInterval(wheelInterval); // หยุดการหมุนวงล้อ
        checkSelectedPrize(predefinedDegrees); // ตรวจสอบของรางวัลที่เลือก
        $("#wheelDisplayRewardMain").offcanvas('show');
    }, 6000); // รอเวลา 6 วินาที หลังจากที่ล้อหมุนเสร็จสิ้น
}

function calculatePredefinedDegrees() {
    var maxItems = parseInt(getComputedStyle(document.querySelector('.wheel-wrapper .custom-wheel.test-spin')).getPropertyValue('--max-item'));
    var predefinedIndex = 1; // นี่คือตัวอย่าง คุณสามารถเปลี่ยนเป็นหมายเลขของรางวัลที่ต้องการ

    // คำนวณมุมที่ต้องการหยุดที่เพื่อให้หยุดที่ของรางวัลที่ต้องการ
    var predefinedDegrees = (360 / maxItems) * (predefinedIndex - 1);
    return predefinedDegrees;
}

function checkSelectedPrize(degrees) {
    var maxItems = parseInt(getComputedStyle(document.querySelector('.wheel-wrapper .custom-wheel.test-spin')).getPropertyValue('--max-item'));
    var selectedItem = Math.floor(((degrees % 360) / 360) * maxItems) + 1;

    clearInterval(wheelInterval);
}
$("#btnWindowTestLuckywheelSpin").on("click", function () {
    $("#minigameTestLayout").offcanvas('show');
});
$("#btnWindowTestMinigame").on("click", function () {
    $("#minigameTestLayout2").offcanvas('show');
});

function testMinigame() {
    setTimeout(() => {
        $("#minigameDisplayRewardMain").offcanvas('show');
    }, 1000);
}
var stepSettingMinigameNow = "1";
function btnPreviousStepSettingMinigame(current, previous) {
    $("#SettingMinigameStep" + current).hide();
}

function btnStepSettingMinigame(element, current, next, action = '') {
    // if (!validateStep()) return;
    //element.dataset.type
    hidePromotionMiniGameStepfinal(); // ซ้อนปุ่ม สรุปและบันทึก
    settingstepNow = next;
    //console.log('element', element)
    validateStep();

    // ใช้สำหรับสรุปและบันทึก
    window.localStorage.setItem("step", current);
    window.localStorage.setItem("next", next);

    if (typeNow == 'mini-game') {
        $(".custom-type-lucky-wheel").hide();
        $(".custom-type-mini-game").show();
    } else {
        $(".custom-type-mini-game").hide();
        $(".custom-type-lucky-wheel").show();
    }

    if (settingstepNow === "5") {

        var count = hiddenCountImgMiniGame.val();

        if (typeNow == 'mini-game') {

            if (isCheckDisplayImgBeforeAll.is(':checked')) {

                var imgRequire = $("#imgBeforeMiniGame1").val();

                if (imgRequire === "") {

                    //console.log('in come 1')

                    isErrorImgStep1.show();
                    textErrorImgStep1.html("รบกวนอัพโหลดรูป ให้ครบถ้วน");

                    $("#offcanvasMinigameSetting .offcanvas-body")[0].scrollTo({ top: 0, behavior: 'smooth' });

                    return;
                } else {
                    isErrorImgStep1.hide();
                    textErrorImgStep1.html("");
                }

            } else {

                if (count === "3") {

                    for (let i = 0; i < 3; i++) {

                        var imgRequire = $("#imgBeforeMiniGame" + [i + 1]).val();

                        if (imgRequire === "") {

                            //console.log('in come 3')

                            isErrorImgStep1.show();
                            textErrorImgStep1.html("รบกวนอัพโหลดรูป ให้ครบถ้วน");

                            $("#offcanvasMinigameSetting .offcanvas-body")[0].scrollTo({ top: 0, behavior: 'smooth' });

                            return;
                        } else {
                            isErrorImgStep1.hide();
                            textErrorImgStep1.html("");
                        }
                    }

                } else if (count === "6") {

                    for (let i = 0; i < 6; i++) {

                        console.log('in come 6', [i])

                        var imgRequire = $("#imgBeforeMiniGame" + [i + 1]).val();

                        if (imgRequire === "") {

                            isErrorImgStep1.show();
                            textErrorImgStep1.html("รบกวนอัพโหลดรูป ให้ครบถ้วน");

                            $("#offcanvasMinigameSetting .offcanvas-body")[0].scrollTo({ top: 0, behavior: 'smooth' });

                            return;
                        } else {
                            isErrorImgStep1.hide();
                            textErrorImgStep1.html("");
                        }
                    }

                } else if (count === "9") {

                    for (let i = 0; i < 9; i++) {

                        var imgRequire = $("#imgBeforeMiniGame" + [i + 1]).val();

                        if (imgRequire === "") {

                            //console.log('in come 9')

                            isErrorImgStep1.show();
                            textErrorImgStep1.html("รบกวนอัพโหลดรูป ให้ครบถ้วน");

                            $("#offcanvasMinigameSetting .offcanvas-body")[0].scrollTo({ top: 0, behavior: 'smooth' });

                            return;
                        } else {
                            isErrorImgStep1.hide();
                            textErrorImgStep1.html("");
                        }
                    }

                }

            }
        } 

    }

    if (action == '') {
        $("#textTitleStepSettingMinigame").text("Step " + next.replace("-", '.'));
        switch (next) {
            case "1":
                if (typeNow == 'mini-game') {
                    // มินิเกมส์
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameTypeOther'>ระบุรายละเอียดมินิเกมส์ : เกมส์อื่น ๆ</span>");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSubTextSetting'>ระบุชื่อเกมส์ของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");
                    $("#textHeadTap").html("<span data-i18n='minigameSetting.minigameDetailText'>รายละเอียดเกมส์</span>");
                    $(".textLabelName").html("<span data-i18n='minigameSetting.minigameName'>ชื่อมินิเกมส์</span>");
                    $('#minigameName').attr("placeholder", "ระบุชื่อมินิเกมส์");
                    $("#textSwitch1").html("<span data-i18n='minigameSetting.minigameOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองเล่นมินิเกมส์ได้ เมื่อไม่มีสิทธิ์</span>");
                    $("#textSwitchTab1").html("<span data-i18n='minigameSetting.minigameOpenSetting'>เปิด / ปิด การใช้งานมินิเกมส์</span>");

                    $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.minigameDateRangeActive'>ระยะเวลามินิเกมส์และวันทำงาน</span>");
                    $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.minigameCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
                    $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.minigameDateTimeAccess'>กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)</span>");
                    $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.minigameDateActive'>กำหนดวันทำงานของมินิเกมส์</span>");

                    $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.minigameCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุมินิเกมส์</span>");
                    $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.minigameCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างมินิเกมส์สำเร็จ</span>");
                    $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.minigameCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างมินิเกมส์สำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
                    $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.minigameCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของมินิเกมส์นั้น</span>");

                    $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.minigameRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์</span>");
                    $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.minigameHowToGetMinigame'>การได้รับสิทธิ์มินิเกมส์</span>");
                    $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.minigameEditAndSetting'>การปรับแต่งและตั้งค่ามินิเกมส์</span>");

                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                    $("#textHeadTap").localize();
                    $(".textLabelName").localize();
                    $("#textSwitch1").localize();
                    $("#textSwitchTab1").localize();

                    $("#textTabsStep2-1-1").localize();
                    $("#textTabsStep2-1-2").localize();
                    $("#textTabsStep2-1-3").localize();
                    $("#textTabsStep2-1-4").localize();

                    $("#textTabsStep2-2-1").localize();
                    $("#textTabsStep2-2-2").localize();
                    $("#textTabsStep2-2-3").localize();
                    $("#textTabsStep2-2-4").localize();

                    $("#textTabsStep2-3-1").localize();
                    $("#textTabsStep2-3-2").localize();
                    $("#textTabsStep2-3-3").localize();

                } else {

                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelTypeOther'>ระบุรายละเอียดมินิเกมส์ : วงล้อนำโชค</span>");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelSubTextSetting'>ระบุชื่อวงล้อนำโชคของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");

                    $("#textHeadTap").html("<span data-i18n='minigameSetting.luckyWheelDetailText'>รายละเอียดวงล้อนำโชค</span>");
                    $(".textLabelName").html("<span data-i18n='minigameSetting.luckyWheelName'>ชื่อวงล้อนำโชค</span>");
                    $('#minigameName').attr("placeholder", "ระบุชื่อวงล้อนำโชค");
                    $("#textSwitch1").html("<span data-i18n='minigameSetting.luckyWheelOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองหมุนวงล้อนำโชคได้ เมื่อไม่มีสิทธิ์</span>");
                    $("#textSwitchTab1").html("<span data-i18n='minigameSetting.luckyWheelOpenSetting'>เปิด / ปิด การใช้งานวงล้อนำโชค</span>");

                    $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.luckyWheelDateRangeActive'>ระยะเวลาวงล้อนำโชคและวันทำงาน</span>");
                    $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.luckyWheelCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
                    $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.luckyWheelDateTimeAccess'>กำหนดระยะเวลาวงล้อนำโชค (อายุวงล้อ)</span>");
                    $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.luckyWheelDateActive'>กำหนดวันทำงานของวงล้อนำโชค</span>");

                    $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.luckyWheelCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุวงล้อ</span>");
                    $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.luckyWheelCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ</span>");
                    $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.luckyWheelCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างวงล้อนำโชคสำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
                    $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.luckyWheelCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของวงล้อนั้น</span>");

                    $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.luckyWheelRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค</span>");
                    $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.luckyWheelHowToGetluckyWheel'>การได้รับสิทธิ์มินิเกมส์วงล้อนำโชค</span>");
                    $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.luckyWheelEditAndSetting'>การปรับแต่งและตั้งค่าวงล้อนำโชค</span>");

                    $("#textDetailStepSettingMinigame").html();
                    $("#textdescriptionStepSettingMinigame").html();

                    $("#textHeadTap").localize();
                    $(".textLabelName").localize();
                    $("#textSwitch1").localize();
                    $("#textSwitchTab1").localize();

                    $("#textTabsStep2-1-1").localize();
                    $("#textTabsStep2-1-2").localize();
                    $("#textTabsStep2-1-3").localize();
                    $("#textTabsStep2-1-4").localize();

                    $("#textTabsStep2-2-1").localize();
                    $("#textTabsStep2-2-2").localize();
                    $("#textTabsStep2-2-3").localize();
                    $("#textTabsStep2-2-4").localize();

                    $("#textTabsStep2-3-1").localize();
                    $("#textTabsStep2-3-2").localize();
                    $("#textTabsStep2-3-3").localize();
                }

                $("#textTitleStepSettingMinigame").html("Step 1");
                $("#textStepAllSettingMinigame").html("Step 1/5");
                $("#progressStepSettingMinigame").width("20%");
                break;
            case "2-1":
                if (typeNow == 'mini-game') {
                    $("#textTitleStepSettingMinigame").html("Step 2.1");
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameChooseActiveDay'>กำหนดระยะเวลาของเกมส์และวันทำงาน</span>");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.createDateRangeActive'>สร้างวันเริ่ม - วันสิ้นสุด พร้อมทั้งกำหนดให้ทำงานตามวันและเวลาที่ต้องการได้ดั่งใจ</span>");
                    $("#textDetailStepSettingMinigame").localize("");
                    $("#textdescriptionStepSettingMinigame").localize("");
                } else {
                    $("#textTitleStepSettingMinigame").html("Step 2.1");
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameChooseActiveDay'>กำหนดระยะเวลาของเกมส์และวันทำงาน</span>");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.createDateRangeActive'>สร้างวันเริ่ม - วันสิ้นสุด พร้อมทั้งกำหนดให้ทำงานตามวันและเวลาที่ต้องการได้ดั่งใจ</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                }

                $("#textStepAllSettingMinigame").html("Step 2/5");
                $("#progressStepSettingMinigame").width("40%");
                $("#SettingMinigameStep2").show();
                break;
            case "2-2":
                if (typeNow == 'mini-game') {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSettingCountdown'>ตั้งเวลานับถอยหลังวันหมดอายุมินิเกมส์ พร้อมการปรับแต่ง</span>");
                    $("#textTitleStepSettingMinigame").html("Step 2.2");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameStepSettingText'>กระตุ้นให้สมาชิกอยากฝากเพื่อที่จะรีบมาเล่นมินิเกมส์ที่พวกเขารักกันก่อนจะหมดอายุ</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                } else {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSettingCountdown2'>ตั้งเวลานับถอยหลังวันหมดอายุวงล้อนำโชค พร้อมการปรับแต่ง</span>");
                    $("#textTitleStepSettingMinigame").html("Step 2.2");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameStepSettingText'>กระตุ้นให้สมาชิกอยากฝากเพื่อที่จะรีบมาเล่นมินิเกมส์ที่พวกเขารักกันก่อนจะหมดอายุ</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                }

                $("#textStepAllSettingMinigame").html("Step 2/5");
                $("#progressStepSettingMinigame").width("40%");
                $("#SettingMinigameStep2").show();
                break
            case "2-3":
                setTimeout(() => {
                    customLimitCustomerGroupDropdown.update();
                }, 200);

                if (typeNow == 'mini-game') {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameLimitRights'>จำกัดการรับสิทธิ์มินิเกมส์ และการ Reset สิทธิ์</span>");
                    $("#textTitleStepSettingMinigame").html("Step 2.3");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameLimitText'>ป้องกันสิทธิ์เฟ้อ จัดการสิทธิ์ลำบาก ตั้งค่าเรื่องเหล่านี้เพียงครั้งเดียว จัดการให้คุณตลอดไป</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                } else {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.luckWheelLimitRights'>จำกัดการรับสิทธิ์วงล้อ และการ Reset สิทธิ์</span>");
                    $("#textTitleStepSettingMinigame").html("Step 2.3");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameLimitText'>ป้องกันสิทธิ์เฟ้อ จัดการสิทธิ์ลำบาก ตั้งค่าเรื่องเหล่านี้เพียงครั้งเดียว จัดการให้คุณตลอดไป</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                }

                $("#textStepAllSettingMinigame").html("Step 2/5");
                $("#progressStepSettingMinigame").width("40%");
                $("#SettingMinigameStep2").show();
                break;
            case "3":
                if (typeNow == 'mini-game') {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์</span>");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameRightsSettingText'>สร้างสรรมินิเกมส์ในแบบของคุณ​และรังสรรค์ของรางวัลที่หลากหลายได้ในคราวเดียวกัน</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();

                } else {
                    $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค");
                    $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelRightsSettingText'>สร้างสรรวงล้อนำโชคในแบบของคุณ​และรังสรรค์ของรางวัลที่หลากหลายได้ในคราวเดียวกัน</span>");
                    $("#textDetailStepSettingMinigame").localize();
                    $("#textdescriptionStepSettingMinigame").localize();
                }

                $("#textTitleStepSettingMinigame").text("Step 3");
                $("#textStepAllSettingMinigame").text("Step 3/5");
                $("#progressStepSettingMinigame").width("60%");
                break;
            case "4":

                if (typeNow == 'mini-game') {
                    $(".settingImgMiniGameCustom").show();
                } else {
                    $(".settingImgMiniGameCustom").hide();
                }

                $("#textTitleStepSettingMinigame").text("Step 4");
                $("#textDetailStepSettingMinigame").html("กำหนดรูปแบบการแสดงผลมินิเกมส์");
                $("#textdescriptionStepSettingMinigame").html("กำหนดรูปแบบการแสดงผล และของรางวัลสำหรับมินิเกมส์");

                $("#textStepAllSettingMinigame").text("Step 4/5");
                $("#progressStepSettingMinigame").width("80%");
                break;
            case "5":

                $("#textTitleStepSettingMinigame").text("Step 5");
                $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameTurnoverSetting'>กำหนดเงื่อนไขติดเทิร์น การถอน การปลดเทิร์น และเงื่อนไขพิเศษอื่น ๆ</span>");
                $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameTurnoverSettingText'>เพื่อให้มินิเกมส์ของคุณนั้นไม่ได้มากันง่ายเกินไปนัก ลองท้าทายความสามารถของสมาชิกกันหน่อย</span>");
                $("#textDetailStepSettingMinigame").localize();
                $("#textdescriptionStepSettingMinigame").localize();

                $("#textStepAllSettingMinigame").text("Step 5/5");
                $("#progressStepSettingMinigame").width("100%");
                break;
            case "6":

                $("#textTitleStepSettingMinigame").text("Done");
                $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSummarySetting'>สรุปข้อมูลการตั้งค่ามินิเกมส์ของคุณ</span>");
                $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSummarySettingText'>ตรวจทานกันก่อนจะสร้างจริง ๆ จะได้ไม่เสียเวลากันทีหลัง</span>");
                $("#textDetailStepSettingMinigame").localize();
                $("#textdescriptionStepSettingMinigame").localize();
                $("#textStepAllSettingMinigame").text("Complete");
                $("#progressStepSettingMinigame").width("100%");
                if (actionNow == 'edit') {
                    getMinigameDetail();
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').html("<span data-i18n='minigameSetting.minigameConfirmButton'>ยืนยันการแก้ไข</span>");
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').localize();
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').attr('onclick', `openConfirmUpdatePromotionSwal('saving')`);
                } else if (actionNow == 'create') {
                    getMinigameDetail();
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').html("<span data-i18n='minigameSetting.minigameConfirmCreate'>ยืนยันการสร้าง</span>");
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').localize();
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').attr('onclick', `openConfirmUpdatePromotionSwal('create')`);

                    if (typeNow == "mini-game") {
                        $(`.imgMinigameRewardMainSrc`).attr('src', $("#imgBeforeMiniGame1").val());
                        $(`.imgMinigameRewardMainSrc`).show();
                        $(`.imgMinigameRewardSrc`).attr('src', $("#imgBeforeMiniGame1").val());
                        $(`.imgMinigameRewardSrc`).show();

                        let cloneWheelMain;
                        let cloneTemplate = $('#eleMinigameReward').clone();
                        cloneWheelMain = $(cloneTemplate.html());
                        $('#showStepEnd').addClass('preview-minigame');
                        $('#showStepEnd').html(cloneWheelMain);
                    }

                } else {
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').html("<span data-i18n='minigameSetting.minigameConfirmCreate'>ยืนยันการสร้าง</span>");
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').localize();
                    $('#groupBtnSettingMinigame6 button[data-type="end"]').attr('onclick', `openConfirmUpdatePromotionSwal('create')`);
                }
                break;
            default:
                break;
        }
        $("#SettingMinigameTabsStep" + current).removeClass('active');
        $("#SettingMinigameTabsStep" + next).addClass('active');

        $("#groupBtnSettingMinigame" + current).hide();
        $("#SettingMinigameStep" + current).hide();
        $("#SettingMinigameStep" + next).show();
        $("#groupBtnSettingMinigame" + next).show();
        if ((current == "2-3" && next == "3") || (current == "2-1" && next == "1")) {
            $("#SettingMinigameStep" + 2).hide();
        } else if (current == "3" && next == "2-3") {
            $("#SettingMinigameStep" + 2).show();
        }
    } else {

        $('[id^=SettingMinigameTabsStep]').removeClass('active');
        $('[id^=SettingMinigameTabsStep]').eq(0).addClass('active')
        $('[id^=groupBtnSettingMinigame]').hide();
        $('[id^=SettingMinigameStep]').hide();
        $('[id^=SettingMinigameStep]:last').show();
    }

    $("#offcanvasMinigameSetting .offcanvas-body")[0].scrollTo({ top: 0, behavior: 'smooth' });

    validateStep();
}

const validateStep = (f, d = false) => {
    if (f && d) return H.debounce(() => validateStep(f), 500);
    let validateName = validateradio = validatetext = false, returned = true, focus;
    let arrayvalidate = [];
    let idElement = f;
    let inputs; let element;
    const vd = !f;
    if (f) {
        stepSettingMinigameNow = $("#" + f)[0].dataset.stepNow;

        //console.log('stepSettingMinigameNow', stepSettingMinigameNow)

        switch (stepSettingMinigameNow) {
            case "1":

                validateName = true;

                var name = $('#' + f).val();
                if (name != "" && name != null) {
                    $("#" + f).parent().find('.invalid-feedback').hide();
                    $("#" + f).parent().find('.invalid-feedback').text('');
                } else {
                    validateName = false;
                    $("#" + f).parent().find('.invalid-feedback').show();
                    $("#" + f).parent().find('.invalid-feedback').text('กรุณากรอกชื่อมินิเกมส์');
                }
                
                var data = customSelectAgentDropdown.getValue();

                if (data === '' || data.length == 0) {
                    validateName = false;
                    $("#error-selectAgentDropdown").show();
                    $("#error-selectAgentDropdown").text('กรุณากรอกชื่อเลือก Agent');
                } else {
                    $("#error-selectAgentDropdown").hide();
                    $("#error-selectAgentDropdown").text('');
                }

                arrayvalidate.push(validateName);

                break;
            case "2-2":
                let inputAll = $(`.switch-2-2-1 input:checked:not(.active)[data-value-id1]`);
                if (inputAll.prop('checked') == true) {
                    validateradio = true;
                    if (inputAll.attr("data-value-id")) {
                        validateradio = true;
                        let id1 = inputAll.attr("data-value-id1");
                        let id2 = inputAll.attr("data-value-id2");
                        if ($(`#${id1} input.box-radio`).prop('checked') == true) {
                            if ($(`#${id1} input[type="text"]`).val()) {
                                validateradio = true;
                                $(`#${id1} .invalid-feedback`).hide();
                            } else {
                                $(`#${id1} .invalid-feedback`).show();
                            }
                        } else if ($(`#${id2} input.box-radio`).prop('checked') == true) {
                            let inputs = $(`#${id2} input[type="text"]`);
                            for (var i = 0; i < inputs.length; i++) {
                                if (inputs.eq(i).val()) {
                                    validateradio = true;
                                    $(`#${id2} .invalid-feedback`).eq(i).hide();
                                } else {
                                    validateradio = false;
                                    $(`#${id2} .invalid-feedback`).eq(i).show();
                                }
                            }

                        }
                    }
                }

                arrayvalidate.push(validateradio);

                break;

            default:
                validate = false;
                focus = $('#' + f)[0];
                break;
        }
    } else {

        stepSettingMinigameNow = settingstepNow;
        inputs = $(`#SettingMinigameStep${settingstepNow} input:visible`);

        switch (stepSettingMinigameNow) {
            case "2-2":

                if ($(`#changeMinigameEnableCountDown`).prop('checked') == true) {

                    let inputAll = $(`.switch-2-2-1 input:checked:not(.active)[data-value-id1]`);
                    if (inputAll.prop('checked') == true) {
                        if (inputAll.attr("data-value-id")) {
                            let id1 = inputAll.attr("data-value-id1");
                            let id2 = inputAll.attr("data-value-id2");
                            if ($(`#${id1} input.box-radio`).prop('checked') == true) {
                                if ($(`#${id1} input[type="text"]`).val()) {
                                    validateradio = true;
                                    $(`#${id1} .invalid-feedback`).hide();
                                }
                            } else if ($(`#${id2} input.box-radio`).prop('checked') == true) {
                                let inputs = $(`#${id2} input[type="text"]`);
                                for (var i = 0; i < inputs.length; i++) {
                                    if (inputs.eq(i).val()) {
                                        validateradio = true;
                                        $(`#${id2} .invalid-feedback`).eq(i).hide();
                                    } else {
                                        validateradio = false;
                                        break;
                                    }
                                }

                            }
                        }
                    }
                    if ($(`#minigameEnableCountDownCreated`).prop('checked') == true) {
                        validateradio = true;
                    }
                    arrayvalidate.push(validateradio);


                }
                break;
            case "2-3":
                let _dropdown = $(`#customLimitCustomerGroupDropdown.require.empty`);
                var data = customLimitCustomerGroupDropdown.getValue();
                var minigameMaxCountPerTimePerPerson = parseInt($('#minigameMaxCountPerTimePerPerson').val());

                if ($(`#minigameEnableMaxPromotionPerPerson`).prop('checked') == true) {
                    if ($(`#minigameEnableMaxCountPerTimePerPerson`).prop('checked') == true) {
                        if (isNaN(minigameMaxCountPerTimePerPerson) || minigameMaxCountPerTimePerPerson == 0) {
                            $(`.checkBtn2-3`).addClass('disabled');
                            $('#inputMinigameMaxCountPerTimePerPerson').addClass('custom-invalid');
                            $('#minigameMaxCountPerTimePerPerson').addClass('is-invalid');
                            $('#error-getPromotionPerUserTime').show();
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                        } else {
                            $(`.checkBtn2-3`).removeClass('disabled');
                            $('#inputMinigameMaxCountPerTimePerPerson').removeClass('custom-invalid');
                            $('#minigameMaxCountPerTimePerPerson').removeClass('is-invalid');
                            $('#error-getPromotionPerUserTime').hide();
                            validatetext = true;
                        }
                    } else {
                        $(`.checkBtn2-3`).removeClass('disabled');
                        $('#inputMinigameMaxCountPerTimePerPerson').removeClass('custom-invalid');
                        $('#minigameMaxCountPerTimePerPerson').removeClass('is-invalid');
                        $('#error-getPromotionPerUserTime').hide();
                    }
                } else {
                    $(`.checkBtn2-3`).removeClass('disabled');
                    $('#inputMinigameMaxCountPerTimePerPerson').removeClass('custom-invalid');
                    $('#minigameMaxCountPerTimePerPerson').removeClass('is-invalid');
                    $('#error-getPromotionPerUserTime').hide();
                }

                if ($(`#enableLimitCustomerGroup`).prop('checked') == true) {
                    if (_dropdown.length > 0) {
                        if (data.length <= 0) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                        }
                    } else if (_dropdown.length == 0 && data.length == 0) {
                        validatetext = false;
                        arrayvalidate.push(validatetext);
                    } else {
                        validatetext = true;
                    }
                } else {
                    $('#customLimitCustomerGroupDropdown').removeClass("custom-invalid");
                    $('#error-limitCustomerGroupDropdown').hide();
                }

                break;
            case "3":
                let dropdown = $(`.require.empty:visible`);
                if (dropdown.length > 0) {
                    validatetext = false;
                    arrayvalidate.push(validatetext);
                } else {
                    validatetext = true;
                }
                //let inputs = $(`.custom-minigame-wheel-section input[type="text"]:visible`);
                //for (let i = 0; i < inputs.length; i++) {
                //    if (!inputs.eq(i).hasClass("input-search")) {
                //        if (!inputs.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && !inputs.eq(i).closest('.custom-input').hasClass("fistempty")) {
                //            if (inputs.eq(i).val() == "" || inputs.eq(i).val() == null) {
                //                validatetext = false;
                //                arrayvalidate.push(validatetext);
                //                inputs.eq(i).closest('.custom-input').find('.invalid-feedback').show();
                //            } else {
                //                validatetext = true;
                //                inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();

                //            }
                //        } else {
                //            if (inputs.eq(i).val() != "" && inputs.eq(i).val() != null) {
                //                inputs.eq(i).closest('.custom-input.fistempty').removeClass('fistempty');
                //            } else if (!inputs.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && inputs.eq(i).closest('.custom-input.fistempty').hasClass("fistempty")) {
                //                validatetext = false;
                //                arrayvalidate.push(validatetext);
                //            } else {
                //                validatetext = true;
                //                inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                //            }
                //        }
                //    }
                //}

                //inputs = $(`.setting-minigame-step-3-row-1 input[type="text"]:visible`);
                //for (let i = 0; i < inputs.length; i++) {
                //    if (!inputs.eq(i).closest('.custom-input').hasClass("fistempty")) {
                //        if (inputs.eq(i).val() == "" || inputs.eq(i).val() == null) {
                //            validatetext = false;
                //            arrayvalidate.push(validatetext);
                //            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').show();
                //        } else {
                //            validatetext = true
                //            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                //        }
                //    } else {
                //        if (inputs.eq(i).val() != "" && inputs.eq(i).val() != null) {
                //            inputs.eq(i).closest('.custom-input.fistempty').removeClass('fistempty');
                //        } else if (inputs.eq(i).closest('.custom-input.fistempty').hasClass("fistempty")) {
                //            validatetext = false;
                //            arrayvalidate.push(validatetext);
                //        } else {
                //            validatetext = true;
                //            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                //        }
                //    }
                //}

                // inputs = $(`.setting-minigame-step-3-row-1 input[type="text"].validatezero:visible`);
                // for (let i = 0; i < inputs.length; i++) {
                //     if (!inputs.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled")) {
                //         if (inputs.eq(i).val() == "" || inputs.eq(i).val() == null || parseInt(inputs.eq(i).val()) <= 0) {
                //             validatetext = false;
                //             arrayvalidate.push(validatetext);
                //             inputs.eq(i).closest('.custom-input').find('.invalid-feedback').show();
                //         } else {
                //             validatetext = true;
                //             inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                //         }
                //     }
                // }
                let inputs = $(`input[type="text"].validatezero:visible`);
                for (let i = 0; i < inputs.length; i++) {
                    if (!inputs.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && !inputs.eq(i).closest('.custom-input').hasClass("fistempty")) {
                        if (inputs.eq(i).val() == "" || inputs.eq(i).val() == null || parseInt(inputs.eq(i).val()) <= 0) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').show();
                        } else {
                            validatetext = true;
                            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                        }
                    } else {
                        if (inputs.eq(i).val() != "" && inputs.eq(i).val() != null && parseInt(inputs.eq(i).val()) > 0) {
                            inputs.eq(i).closest('.custom-input.fistempty').removeClass('fistempty');
                        } else if (!inputs.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && inputs.eq(i).closest('.custom-input.fistempty').hasClass("fistempty")) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                        } else {
                            validatetext = true;
                            inputs.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                        }
                    }
                }
                break;
            case "4":

                let inputsMiniGame = $(`.custom-minigame-wheel-section input[type="text"]:visible`);
                for (let i = 0; i < inputsMiniGame.length; i++) {
                    if (!inputsMiniGame.eq(i).hasClass("input-search")) {
                        if (!inputsMiniGame.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && !inputsMiniGame.eq(i).closest('.custom-input').hasClass("fistempty")) {
                            if (inputsMiniGame.eq(i).val() == "" || inputsMiniGame.eq(i).val() == null) {
                                validatetext = false;
                                arrayvalidate.push(validatetext);
                                inputsMiniGame.eq(i).closest('.custom-input').find('.invalid-feedback').show();
                            } else {
                                validatetext = true;
                                inputsMiniGame.eq(i).closest('.custom-input').find('.invalid-feedback').hide();

                            }
                        } else {
                            if (inputsMiniGame.eq(i).val() != "" && inputsMiniGame.eq(i).val() != null) {
                                inputsMiniGame.eq(i).closest('.custom-input.fistempty').removeClass('fistempty');
                            } else if (!inputsMiniGame.eq(i).closest('.custom-input.minigame-reset').hasClass("disabled") && inputsMiniGame.eq(i).closest('.custom-input.fistempty').hasClass("fistempty")) {
                                validatetext = false;
                                arrayvalidate.push(validatetext);
                            } else {
                                validatetext = true;
                                inputsMiniGame.eq(i).closest('.custom-input').find('.invalid-feedback').hide();
                            }
                        }
                    }
                }

                break;
            case "5":
                if ($(`#minigameEnableIncreaseTurnOver`).prop('checked') == true) {
                    if ($(`#minigameEnableTurnOverDepositOff`).prop('checked') == true || $(`#minigameEnableTurnOverDepositOn`).prop('checked') == true) {
                        if ($(`#minigameEnableMinTurnover`).prop('checked') == true) {
                            let input = $(`#minigameMinTurnover`);
                            if (input.closest('.box-minigame-click-select.minigame-box-reset').hasClass("active")) {
                                if (input.val() == "" || input.val() == null) {
                                    validatetext = false;
                                    arrayvalidate.push(validatetext);
                                } else {
                                    validatetext = true;
                                }
                            }
                        }
                        else if ($(`#minigameEnableMinTurnoverCredit`).prop('checked') == true) {
                            let input = $(`#minigameminTurnoverCredit`);
                            if (input.closest('.box-minigame-click-select.minigame-box-reset').hasClass("active")) {
                                if (input.val() == "" || input.val() == null) {
                                    validatetext = false;
                                    arrayvalidate.push(validatetext);
                                } else {
                                    validatetext = true;
                                }
                            }
                        }

                    } else {
                        validatetext = false; arrayvalidate.push(validatetext);
                    }
                }

                let inputsValidateZero = $(`input[type="text"].validatezero:visible`);
                for (let i = 0; i < inputsValidateZero.length; i++) {
                    if (!inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("disabled") && inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("active") && !inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("fistempty")) {
                        if (inputsValidateZero.eq(i).val() == "" || inputsValidateZero.eq(i).val() == null || parseInt(inputsValidateZero.eq(i).val()) <= 0) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                            inputsValidateZero.eq(i).closest('.box-minigame-click-select').find('.invalid-feedback').show();
                        } else {
                            validatetext = true;
                            inputsValidateZero.eq(i).closest('.box-minigame-click-select').find('.invalid-feedback').hide();
                        }
                    } else {
                        if (inputsValidateZero.eq(i).val() != "" && inputsValidateZero.eq(i).val() != null && parseInt(inputsValidateZero.eq(i).val()) > 0) {
                            inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset.fistempty').removeClass('fistempty');
                        } else if (!inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("disabled") && inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("active") && inputsValidateZero.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("fistempty")) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                        } else {
                            validatetext = true;
                            inputsValidateZero.eq(i).closest('.box-minigame-click-select').find('.invalid-feedback').hide();
                        }
                    }
                }

                let inputsSwitch = $(`.switch-2-3-6 input[type="text"]:visible`);
                for (let i = 0; i < inputsSwitch.length; i++) {
                    if (!inputsSwitch.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("disabled") && !inputsSwitch.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("fistempty") && inputsSwitch.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("active")) {
                        if (inputsSwitch.eq(i).val() == "" || inputsSwitch.eq(i).val() == null) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                            inputsSwitch.eq(i).closest('.box-promotion-item-checkbox-radio').find('.invalid-feedback').show();
                        } else {
                            validatetext = true;
                            inputsSwitch.eq(i).closest('.box-promotion-item-checkbox-radio').find('.invalid-feedback').hide();
                        }
                    } else {
                        if (inputsSwitch.eq(i).val() != "" && inputsSwitch.eq(i).val() != null) {
                            inputsSwitch.eq(i).closest('.box-minigame-click-select.fistempty').removeClass('fistempty');
                        } else if (!inputsSwitch.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("disabled") && inputsSwitch.eq(i).closest('.box-minigame-click-select.fistempty').hasClass("fistempty") && inputsSwitch.eq(i).closest('.box-minigame-click-select.minigame-box-reset').hasClass("active")) {
                            validatetext = false;
                            arrayvalidate.push(validatetext);
                        } else {
                            validatetext = true;
                            inputsSwitch.eq(i).closest('.box-minigame-click-select').find('.invalid-feedback').hide();
                        }
                    }

                }


                if ($(`#minigameEnableWithdrawConditionMinTurnover`).prop('checked') == true) {
                    let input = $(`#minigameWithdrawConditionMinTurnover`);

                    if (input.val() == "" || input.val() == null) {
                        validatetext = false;
                        arrayvalidate.push(validatetext);
                    } else {
                        validatetext = true;
                    }

                    let input2 = $(`#minigameWithdrawConditionMinTurnoverMinCredit`);
                    if (input2.val() == "" || input2.val() == null) {
                        validatetext = false;
                        arrayvalidate.push(validatetext);
                        $("#error-minigameWithdrawConditionMinTurnoverMinCredit").show();
                    } else {
                        validatetext = true;
                        $("#error-minigameWithdrawConditionMinTurnoverMinCredit").hide();
                    }

                } else if ($(`#minigameEnableWithdrawConditionMinTurnoverCredit`).prop('checked') == true) {
                    let input = $(`#minigameWithdrawConditionMinTurnoverCredit`);
                    if (input.val() == "" || input.val() == null) {
                        validatetext = false;
                        arrayvalidate.push(validatetext);
                    } else {
                        validatetext = true;
                    }
                }

                break;
            default:
                validate = false;
                focus = $('#' + f)[0];
                break;
        }
    }

    if (inputs && !f) {
        for (let i = 0; i < inputs.length; i++) {
            if ($(inputs[i]).attr('id') == "minigameName") {
                var name = $(inputs[i]).val();
                if (name != "" && name != null) {
                    validateName = true;
                } else {
                    validateName = false;
                }
                arrayvalidate.push(validateName);
            } else {

                let textinput = $(inputs[i]).closest('.minigame-reset:not(.disabled,.box-minigame-click-select), .minigame-box-reset:not(.disabled ,.box-minigame-click-select), .minigame-checkbox-reset:not(.disabled ,.box-minigame-click-select)').find('[type="text"]');
                if (textinput.length > 0) {
                    if ($(inputs[i]).val() == "" || $(inputs[i]).val() == null) {
                        validatetext = false;
                        arrayvalidate.push(validatetext);
                    }
                } else {
                    validatetext = true;
                }
                textinput = $(inputs[i]).closest('.minigame-reset.empty:not(.disabled)');
                if (textinput.length > 0) {
                    validatetext = false;
                    arrayvalidate.push(validatetext);
                } else {
                    validatetext = true;
                }
                textinput = $(inputs[i]).closest('.require.empty:visible');
                if (textinput.length > 0) {
                    validatetext = false;
                    arrayvalidate.push(validatetext);
                } else {
                    validatetext = true;
                }
            }
        }
    }


    let checker = arrayvalidate.every(val => val === true);


    if (vd && focus) focus?.focus();
    if (!checker) {
        $(`#groupBtnSettingMinigame${stepSettingMinigameNow} [data-type="next"]`).addClass('disabled');
    } else {
        $(`#groupBtnSettingMinigame${stepSettingMinigameNow} [data-type="next"]`).removeClass('disabled');
    }

    return f ? returned : checker;
};

const checkMiniGameNameAvialable = async (f, d = false) => {
    if (f && d) return H.debounce(() => checkMiniGameNameAvialable(f), 500);

    const nameMinigame = $(f).val();

    if (nameMinigame.length <= 0) {
        validateStep(f.id, true);
        return;
    }

    if (nameMinigame == miniGameNameOld) {
        $('.invalid-feedback-minigame-name').hide();
        validateStep(f.id, true);
        return;
    }

    var payload = {
        name: nameMinigame
    };

    const response = await $.ajax({
        url: '/api/promotion/check-mini-game-name',
        type: 'POST',
        data: payload
    });

    if (!response || response.message !== 'Success') {
        validateStep(f.id, true);
        return;
    }

    if (response.data || response.data == "true") {
        $('.invalid-feedback-minigame-name').hide();
        validateStep(f.id, true);
    } else {
        $('.invalid-feedback-minigame-name').html('กรุณาเปลี่ยนชื่อเนื่องจากมีชื่อนี้ในระบบอยู่แล้ว');
        $('.invalid-feedback-minigame-name').show();
        $(`#groupBtnSettingMinigame${stepSettingMinigameNow} [data-type="next"]`).addClass('disabled');
    }

}

// เพิ่ม template กำหนดโบนัสที่ลูกค้าจะได้รับ
const customPromotionBonusTypeDropdownMap = new Map;

function addTemplatePromotionConditionType(id, dataList = null) {
    var dataTimePromotionConditionType = document.querySelectorAll(`[data-time-promotion-condition-type-${id}]`);
    var number = dataTimePromotionConditionType.length;

    number = number + 1;
    var textNumber = `${id}-` + number;

    let clonePromotionConditionTypetemplate = $('#templatePromotionConditionType').clone();

    let clonePromotionConditionTypeMain = clonePromotionConditionTypetemplate.html();
    clonePromotionConditionTypeMain = $(clonePromotionConditionTypeMain);

    const inputCustomPromotionDepositBonusDropdown = clonePromotionConditionTypeMain.find('.customPromotionDepositBonusDropdown');

    // Dropdown สิทธิ์มินิเกมส์
    const customPromotionDepositBonusDropdown = new CustomDropdown(inputCustomPromotionDepositBonusDropdown[0], {
        single: true,
        auto: true,
        horizontal: false,
        fakeValue: (item) => (item?.textContent || ''),
        required: 'กรุณาเลือกมินิเกมส์',
        placeholder: 'เลือกมินิเกมส์',
        selfSearch: true,
        stretch: true,
        scrollRoot: '#rootScrollMinigame',
        offsetY: 72,
        offsetMargin: 72,
        onSelect: (value) => {
            var data = customPromotionDepositBonusDropdown.getValue();
            let obj = getPromotionDepositMiniGameData.find(o => o.bonusId === data);
            let bonusId = obj.bonusId;
            let bonusName = obj.name;
            let bonusType = obj.type;
            $(`#minigameBonuseAnyGameId-${textNumber}`).val(null);
            $(`#minigameBonuseName-${textNumber}`).val(null);
            $(`#minigameBonuseType-${textNumber}`).val(null);

            $(`#minigameBonuseAnyGameId-${textNumber}`).val(data);
            $(`#minigameBonuseName-${textNumber}`).val(bonusName);
            $(`#minigameBonuseType-${textNumber}`).val(bonusType);
            validateStep();
        }
    });
    const inputCustomPromotionBonusTypeDropdown = clonePromotionConditionTypeMain.find('.customPromotionBonusTypeDropdown-template');

    // Dropdown ประเภทโบนัส
    const customPromotionBonusTypeDropdown = new CustomDropdown(inputCustomPromotionBonusTypeDropdown[0], {
        single: true,
        auto: true,
        horizontal: false,
        fakeValue: (item) => (item?.textContent || ''),
        required: 'กรุณาเลือกประเภทโบนัส',
        placeholder: 'เลือกประเภทโบนัส',
        selfSearch: true,
        stretch: true,
        onSelect: (value) => {
            var data = customPromotionBonusTypeDropdown.getValue();

            $(`#credit-${textNumber}`).val(null);
            $(`#percent-${textNumber}`).val(null);
            $(`#percentMax-${textNumber}`).val(null);
            $(`#point-${textNumber}`).val(null);
            $(`#quota-${textNumber}`).val(null);
            $(`#rewardName-${textNumber}`).val(null);

            $(`#showBoxPromotionDepositBonusDropdownSub-${textNumber}`).addClass('d-none');
            $(`#showBoxPromotionDepositBonusDropdown-${textNumber}`).addClass('d-none');

            if (data == MiniGameBonusType.Credit) {
                $(`#showBoxPromotionBonusFixed-${textNumber}`).show();
                $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
                $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
                $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
            } else if (data == MiniGameBonusType.Percentage) {
                $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPercentage-${textNumber}`).show();
                $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
                $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
                $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
            } else if (data == MiniGameBonusType.Point) {
                $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPoint-${textNumber}`).show();
                $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
                $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
            } else if (data == MiniGameBonusType.MiniGame || data == MiniGameBonusType.Lotto || data == MiniGameBonusType.LuckyWheel) {
                $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
                $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).show();
                $(`#showBoxPromotionBonusReward-${textNumber}`).hide();

                if (data == MiniGameBonusType.MiniGame || data == MiniGameBonusType.LuckyWheel) {
                    $(`#showBoxPromotionDepositBonusDropdownSub-${textNumber}`).removeClass('d-none');
                    $(`#showBoxPromotionDepositBonusDropdown-${textNumber}`).removeClass('d-none');

                    let htmlLoop = "";

                    for (const lists of getPromotionDepositMiniGameData) {
                        htmlLoop += `<div data-value="${lists.bonusId}" data-chip="${lists.bonusId}" class="custom-dropdown-item">${lists.name}</div>`;
                    }

                    $(`#showBoxPromotionDepositBonusDropdown-${textNumber} .boxPromotionDepositBonusDropdown`).html(htmlLoop);
                    customPromotionDepositBonusDropdown.update();

                }
            } else {
                $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
                $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
                $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
                $(`#showBoxPromotionBonusLottery-${textNumber}`).hide();
                $(`#showBoxPromotionBonusReward-${textNumber}`).show();
            }
            validateStep();
        }
    });

    const data = {
        textNumber,
        type: customPromotionBonusTypeDropdown
    };
    var data2 = templatMinigameWheelMap.get(id);
    data2.set(number, data);

    templatMinigameWheelMap.set(id, data2);


    $('#templatePromotionConditionType').before(clonePromotionConditionTypeMain);
    $('#customPromotionConditionTypeSection-' + id).append(clonePromotionConditionTypeMain);

    clonePromotionConditionTypeMain.attr(`data-time-promotion-condition-type-${id}`, `${number}`);
    clonePromotionConditionTypeMain.attr(`data-time-promotion-condition-type`, `${id}`);

    $('#promotion-condition-type-template').attr('id', `promotion-condition-type-${textNumber}`);


    clonePromotionConditionTypeMain.find('#promotionDepositBonusId-template').attr('id', `promotionDepositBonusId-${textNumber}`);
    clonePromotionConditionTypeMain.find('#minigameBonuseAnyGameId-template').attr('name', `minigameBonuseAnyGameId-${textNumber}`);
    clonePromotionConditionTypeMain.find('#minigameBonuseAnyGameId-template').attr('id', `minigameBonuseAnyGameId-${textNumber}`);

    clonePromotionConditionTypeMain.find('#minigameBonuseName-template').attr('name', `minigameBonuseName-${textNumber}`);
    clonePromotionConditionTypeMain.find('#minigameBonuseName-template').attr('id', `minigameBonuseName-${textNumber}`);

    clonePromotionConditionTypeMain.find('#minigameBonuseType-template').attr('name', `minigameBonuseType-${textNumber}`);
    clonePromotionConditionTypeMain.find('#minigameBonuseType-template').attr('id', `minigameBonuseType-${textNumber}`);

    clonePromotionConditionTypeMain.find('#showBoxPromotionDepositBonusDropdownSub-template').attr('id', `showBoxPromotionDepositBonusDropdownSub-${textNumber}`);
    clonePromotionConditionTypeMain.find('#showBoxPromotionDepositBonusDropdown-template').attr('id', `showBoxPromotionDepositBonusDropdown-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputPromotionDepositBonusDropdown-template').attr('id', `inputPromotionDepositBonusDropdown-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-promotionDepositBonusDropdown-template').attr('id', `error-promotionDepositBonusDropdown-${textNumber}`);

    clonePromotionConditionTypeMain.find('#promotionConditionTypeText-template').attr('id', `promotionConditionTypeText-${textNumber}`);
    clonePromotionConditionTypeMain.find(`#promotionConditionTypeText-${textNumber}`).html(`<span class="bonus-type-text" data-i18n="minigameSetting.bonusType">ประเภทโบนัส</span> ${number}<span class="text-red-50">*</span>`);

    // กรณีเลือกประเภทโบนัส เลือกเครดิต แบบ fixed rate
    clonePromotionConditionTypeMain.find('#showBoxPromotionBonusFixed-template').attr('id', `showBoxPromotionBonusFixed-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputCredit-template').attr('id', `inputCredit-${textNumber}`);
    clonePromotionConditionTypeMain.find('#credit-template').attr('id', `credit-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-credit-template').attr('id', `error-credit-${textNumber}`);

    // กรณีเลือกประเภทโบนัส เลือกเครดิต แบบ %
    clonePromotionConditionTypeMain.find('#showBoxPromotionBonusPercentage-template').attr('id', `showBoxPromotionBonusPercentage-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputPercent-template').attr('id', `inputPercent-${textNumber}`);
    clonePromotionConditionTypeMain.find('#percent-template').attr('id', `percent-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-percent-template').attr('id', `error-percent-${textNumber}`);

    clonePromotionConditionTypeMain.find('#inputPercentMax-template').attr('id', `inputPercentMax-${textNumber}`);
    clonePromotionConditionTypeMain.find('#percentMax-template').attr('id', `percentMax-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-percentMax-template').attr('id', `error-percentMax-${textNumber}`);

    // กรณีเลือกประเภทโบนัส เลือกแต้มสะสม
    clonePromotionConditionTypeMain.find('#showBoxPromotionBonusPoint-template').attr('id', `showBoxPromotionBonusPoint-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputPoint-template').attr('id', `inputPoint-${textNumber}`);
    clonePromotionConditionTypeMain.find('#point-template').attr('id', `point-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-point-template').attr('id', `error-point-${textNumber}`);

    // กรณีเลือกประเภทโบนัส เลือกสิทธิ์มินิเกมส์ และ เลือกสิทธิ์แทงหวย
    clonePromotionConditionTypeMain.find('#showBoxPromotionBonusMiniGameAndLottery-template').attr('id', `showBoxPromotionBonusMiniGameAndLottery-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputQuota-template').attr('id', `inputQuota-${textNumber}`);
    clonePromotionConditionTypeMain.find('#quota-template').attr('id', `quota-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-quota-template').attr('id', `error-quota-${textNumber}`);
    //clonePromotionConditionTypeMain.find(`#rewardName-${textNumber}`).attr('oninput', `validateStep()`);

    // กรณีเลือกประเภทโบนัส เลือกของรางวัล
    clonePromotionConditionTypeMain.find('#showBoxPromotionBonusReward-template').attr('id', `showBoxPromotionBonusReward-${textNumber}`);
    clonePromotionConditionTypeMain.find('#inputRewardName-template').attr('id', `inputRewardName-${textNumber}`);
    clonePromotionConditionTypeMain.find('#rewardName-template').attr('id', `rewardName-${textNumber}`);
    clonePromotionConditionTypeMain.find('#error-rewardName-template').attr('id', `error-rewardName-${textNumber}`);
    clonePromotionConditionTypeMain.find(`#rewardName-${textNumber}`).attr('oninput', `validateStep()`);

    clonePromotionConditionTypeMain.find('.deleteTemplatePromotionConditionType-template').attr('class', `cursor-pointer checkShowDeletePromotionConditionType-${id} deleteTemplatePromotionConditionType-${textNumber} order-3 ps-3 m-auto`);
    clonePromotionConditionTypeMain.find(`.deleteTemplatePromotionConditionType-${textNumber}`).attr('onclick', `deleteTemplatePromotionConditionType('${textNumber}')`);

    $("#hiddenPromotionConditionTypeId").val("");
    $("#hiddenImagePromotionConditionType").val("");

    if (number > 1) {
        $(`.checkShowDeletePromotionConditionType-${id}`).show();
    } else {
        $(`.checkShowDeletePromotionConditionType-${id}`).hide();
    }

    if (dataList) {

        $(`#minigameBonuseAnyGameId-${textNumber}`).val(dataList.anyGameId);
        customPromotionBonusTypeDropdown.setValue(dataList.type);
        customPromotionDepositBonusDropdown.setValue(dataList.anyGameId);
        $(`#minigameBonuseType-${textNumber}`).val(dataList.gameType);

        let obj = getPromotionDepositMiniGameData.find(o => o.bonusId === dataList.anyGameId);
        if (obj) {
            $(`#minigameBonuseName-${textNumber}`).val(obj.name);
        } else {
            $(`#minigameBonuseName-${textNumber}`).val(null);
        }


        $(`#credit-${textNumber}`).val(dataList.credit);
        $(`#percent-${textNumber}`).val(dataList.percent);
        $(`#percentMax-${textNumber}`).val(dataList.maxRewardPercentage);
        $(`#point-${textNumber}`).val(dataList.point);
        $(`#quota-${textNumber}`).val(dataList.quota);
        $(`#rewardName-${textNumber}`).val(dataList.rewardName);

        if (dataList.type == MiniGameBonusType.Credit) {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).show();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
            $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
        } else if (dataList.type == MiniGameBonusType.Percentage) {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).show();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
            $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
        } else if (dataList.type == MiniGameBonusType.Point) {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).show();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
            $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
        } else if (dataList.type == MiniGameBonusType.MiniGame || dataList.type == MiniGameBonusType.Lotto) {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).show();
            $(`#showBoxPromotionBonusReward-${textNumber}`).hide();
        } else if (dataList.type == MiniGameBonusType.MiniGame || dataList.type == MiniGameBonusType.LuckyWheel) {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).show();
            $(`#showBoxPromotionBonusReward-${textNumber}`).hide();

            $(`#showBoxPromotionDepositBonusDropdownSub-${textNumber}`).removeClass('d-none');
            $(`#showBoxPromotionDepositBonusDropdown-${textNumber}`).removeClass('d-none');
        } else {
            $(`#showBoxPromotionBonusFixed-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPercentage-${textNumber}`).hide();
            $(`#showBoxPromotionBonusPoint-${textNumber}`).hide();
            $(`#showBoxPromotionBonusMiniGameAndLottery-${textNumber}`).hide();
            $(`#showBoxPromotionBonusLottery-${textNumber}`).hide();
            $(`#showBoxPromotionBonusReward-${textNumber}`).show();
        }

        let promotionDepositBonusTypeText = "";
        let promotionDepositBonusTypeValue = "";
        let promotionDepositBonusTypeCheckShow = "";
        let promotionDepositMiniGameName = "";
        var promotionDepositMiniGame = getPromotionDepositMiniGameData.find((i) => {
            if (i.bonusId == dataList.anyGameId) {
                promotionDepositMiniGameName = i.name;
            }
        });

        if (dataList.type == MiniGameBonusType.Credit) {
            promotionDepositBonusTypeText = "เครดิต Fixed Rate";
            promotionDepositBonusTypeValue = `${dataList.credit} บาท`;
        } else if (dataList.type == MiniGameBonusType.Percentage) {
            promotionDepositBonusTypeText = "เครดิต เป็น Percentage (%)";
            promotionDepositBonusTypeValue = `${dataList.percent} % จากยอดฝาก สูงสุดไม่เกิน ${dataList.maxRewardPercentage} บาท`;
        } else if (dataList.type == MiniGameBonusType.Point) {
            promotionDepositBonusTypeText = "แต้มสะสม";
            promotionDepositBonusTypeValue = `${dataList.point} แต้ม`;
        } else if (dataList.type == MiniGameBonusType.MiniGame) {
            promotionDepositBonusTypeText = "สิทธิ์มินิเกมส์";
            promotionDepositBonusTypeValue = `${dataList.quota} สิทธิ์`;
        } else if (dataList.type == MiniGameBonusType.Lotto) {
            promotionDepositBonusTypeText = "สิทธิ์แทงหวย";
            promotionDepositBonusTypeValue = `${dataList.quota} สิทธิ์`;
        } else if (dataList.type == MiniGameBonusType.Reward) {
            promotionDepositBonusTypeText = "ของรางวัล";
            promotionDepositBonusTypeValue = `${dataList.rewardName}`;
        }
        let htmlshowConditionGetBonusList = "";

        htmlshowConditionGetBonusList += `<div class="d-flex flex-wrap justify-content-between align-items-center mb-2">
                                                                                        <div class="p2">
                                                                                            ${promotionDepositBonusTypeText}
                                                                                        </div>
                                                                                        <div class="p2" style="color: #50A198;">
                                                                                            ${promotionDepositBonusTypeValue}
                                                                                        </div>
                                                                                    </div>`;

        $("#showConditionGetBonusList").append(htmlshowConditionGetBonusList);

        if (dataList.type == MiniGameBonusType.MiniGame || dataList.type == MiniGameBonusType.LuckyWheel) {
            $(`#showBoxPromotionDepositBonusDropdownSub-${textNumber}`).removeClass('d-none');
            $(`#showBoxPromotionDepositBonusDropdown-${textNumber}`).removeClass('d-none');

            customPromotionBonusTypeDropdown.setValue(MiniGameBonusType.MiniGame);

            let htmlLoop = "";

            for (const lists of getPromotionDepositMiniGameData) {
                htmlLoop += `<div data-value="${lists.bonusId}" data-chip="${lists.bonusId}" class="custom-dropdown-item">${lists.name}</div>`;
            }

            $(`#showBoxPromotionDepositBonusDropdown-${textNumber} .boxPromotionDepositBonusDropdown`).html(htmlLoop);
            customPromotionDepositBonusDropdown.update();
        }
    }

    $(".mini-game-bonus-type").localize();
    $(".error-mini-game-bonus-type").localize();

    number.toString();
    $("#numberPromotionConditionTypeTemplate").val(number);
    validateStep();
}
// get ข้อมูล สิทธิ์มินิเกมส์
let getPromotionDepositMiniGameData = null;

const getPromotionDepositMiniGame = () => {
    $.ajax({
        url: `/api/promotion/get-promotion-deposit-mini-game`,
        method: "GET"
    }).done(function (res) {

        if (res.status == 200) {
            var data = res.data;

            getPromotionDepositMiniGameData = data;
        }
    }).fail(function () {
    });
}
// ลบ template กำหนดโบนัสที่ลูกค้าจะได้รับ
function deleteTemplatePromotionConditionType(text) {
    var idmain = parseInt(text.split('-')[0]);
    var id = parseInt(text.split('-')[1]);
    var promotions = document.querySelectorAll(`[data-time-promotion-condition-type-${idmain}]`);
    var number = promotions.length;

    number = number - 1;

    for (let i = 0; i < promotions.length; i++) {
        if (i < id - 1) {
        } else if (i == id - 1) {
            $(promotions[id - 1]).remove();
            //customPromotionBonusTypeDropdownMap.delete(text);
            templatMinigameWheelMap.get(idmain).delete(id)
        } else {
            $(promotions[i]).attr(`data-time-promotion-condition-type-${id}`, i);

            $(`#promotion-condition-type-${idmain}-${i + 1}`).attr('id', `promotion-condition-type-${idmain}-${i}`);

            // กรณีเลือกประเภทโบนัส เลือกเครดิต แบบ fixed rate
            $(promotions[i]).find(`#showBoxPromotionBonusFixed-${idmain}-${i + 1}`).attr('id', `showBoxPromotionBonusFixed-${idmain}-${i}`);
            $(promotions[i]).find(`#inputCredit-${idmain}-${i + 1}`).attr('id', `inputCredit-${idmain}-${i}`);
            $(promotions[i]).find(`#credit-${idmain}-${i + 1}`).attr('id', `credit-${idmain}-${i}`);
            $(promotions[i]).find(`#error-credit-${idmain}-${i + 1}`).attr('id', `error-credit-${idmain}-${i}`);

            // กรณีเลือกประเภทโบนัส เลือกเครดิต แบบ %
            $(promotions[i]).find(`#showBoxPromotionBonusPercentage-${idmain}-${i + 1}`).attr('id', `showBoxPromotionBonusPercentage-${idmain}-${i}`);
            $(promotions[i]).find(`#inputPercent-${idmain}-${i + 1}`).attr('id', `inputPercent-${idmain}-${i}`);
            $(promotions[i]).find(`#percent-${idmain}-${i + 1}`).attr('id', `percent-${idmain}-${i}`);
            $(promotions[i]).find(`#error-percent-${idmain}-${i + 1}`).attr('id', `error-percent-${idmain}-${i}`);

            $(promotions[i]).find(`#inputPercentMax-${idmain}-${i + 1}`).attr('id', `inputPercentMax-${idmain}-${i}`);
            $(promotions[i]).find(`#percentMax-${idmain}-${i + 1}`).attr('id', `percentMax-${idmain}-${i}`);
            $(promotions[i]).find(`#error-percentMax-${idmain}-${i + 1}`).attr('id', `error-percentMax-${idmain}-${i}`);

            // กรณีเลือกประเภทโบนัส เลือกแต้มสะสม
            $(promotions[i]).find(`#showBoxPromotionBonusPoint-${idmain}-${i + 1}`).attr('id', `showBoxPromotionBonusPoint-${idmain}-${i}`);
            $(promotions[i]).find(`#inputPoint-${idmain}-${i + 1}`).attr('id', `inputPoint-${idmain}-${i}`);
            $(promotions[i]).find(`#point-${idmain}-${i + 1}`).attr('id', `point-${idmain}-${i}`);
            $(promotions[i]).find(`#error-point-${idmain}-${i + 1}`).attr('id', `error-point-${idmain}-${i}`);

            // กรณีเลือกประเภทโบนัส เลือกสิทธิ์มินิเกมส์ และ เลือกสิทธิ์แทงหวย
            $(promotions[i]).find(`#showBoxPromotionBonusMiniGameAndLottery-${idmain}-${i + 1}`).attr('id', `showBoxPromotionBonusMiniGameAndLottery-${idmain}-${i}`);
            $(promotions[i]).find(`#inputQuota-${idmain}-${i + 1}`).attr('id', `inputQuota-${idmain}-${i}`);
            $(promotions[i]).find(`#quota-${idmain}-${i + 1}`).attr('id', `quota-${idmain}-${i}`);
            $(promotions[i]).find(`#error-quota-${idmain}-${i + 1}`).attr('id', `error-quota-${idmain}-${i}`);

            // กรณีเลือกประเภทโบนัส เลือกของรางวัล
            $(promotions[i]).find(`#showBoxPromotionBonusReward-${idmain}-${i + 1}`).attr('id', `showBoxPromotionBonusReward-${idmain}-${i}`);
            $(promotions[i]).find(`#inputRewardName-${idmain}-${i + 1}`).attr('id', `inputRewardName-${idmain}-${i}`);
            $(promotions[i]).find(`#rewardName-${idmain}-${i + 1}`).attr('id', `rewardName-${idmain}-${i}`);
            $(promotions[i]).find(`#error-rewardName-${idmain}-${i + 1}`).attr('id', `error-rewardName-${idmain}-${i}`);

            let promotionConditionTypeText = $(promotions[i]).find(`#promotionConditionTypeText-${idmain}-${i + 1}`);
            promotionConditionTypeText.attr('id', `promotionConditionTypeText-${idmain}-${i}`);
            promotionConditionTypeText.html(`ประเภทโบนัส ${i}<span class="text-red-50">*</span>`);

            let promotionDeletePromotionDatetime = $(promotions[i]).find(`.deleteTemplatePromotionConditionType-${idmain}-${i + 1}`);

            promotionDeletePromotionDatetime.attr('class', `cursor-pointer checkShowDeletePromotionConditionType-${idmain} deleteTemplatePromotionConditionType-${idmain}-${i} order-3 ps-3 m-auto`);
            promotionDeletePromotionDatetime.attr('onclick', `deleteTemplatePromotionConditionType('${idmain}-${i}')`);
            templatMinigameWheelMap.get(idmain).get(i + 1).textNumber = `${idmain}-${i}`;
        }
    }

    if (number > 1) {
        $(`.checkShowDeletePromotionConditionType-${idmain}`).show();
    } else {
        $(`.checkShowDeletePromotionConditionType-${idmain}`).hide();
    }

    number.toString();
    $("#numberPromotionConditionTypeTemplate").val(number);
    validateStep();
}

// เคลีย template กำหนดโบนัสที่ลูกค้าจะได้รับ
function clearTemplatePromotionConditionType() {
    $("#customPromotionConditionTypeSection").empty();
    customPromotionBonusTypeDropdownMap.clear();
}

// get template กำหนดโบนัสที่ลูกค้าจะได้รับ
const getPromotionConditionType = (id) => {
    const result = [];

    for (const [key, values] of templatMinigameWheelMap.get(id).entries()) {
        result.push({
            anyGameId: $(`#minigameBonuseAnyGameId-${values.textNumber}`).val() || null,
            gameType: $(`#minigameBonuseType-${values.textNumber}`).val() || null,
            type: values.type.getValue(),
            credit: $(`#credit-${values.textNumber}`).val() || 0,
            percent: $(`#percent-${values.textNumber}`).val() || 0,
            maxRewardPercentage: $(`#percentMax-${values.textNumber}`).val() || 0,
            point: $(`#point-${values.textNumber}`).val() || 0,
            quota: $(`#quota-${values.textNumber}`).val() || 0,
            rewardName: $(`#rewardName-${values.textNumber}`).val() || null,
        });
    }

    return result;
};

// เพิ่ม template กำหนดการหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ
const customMinigameRemoveChanceDropdownMap = new Map;

function addTemplateMinigameRemoveChance(dataList = null) {
    var dataMinigameRemoveChance = document.querySelectorAll("[data-minigame-remove-chance]");
    var number = dataMinigameRemoveChance.length;

    number = number + 1;

    let cloneTemplate = $('#templateMinigameRemoveChance').clone();

    let cloneMain = cloneTemplate.html();
    cloneMain = $(cloneMain);
    cloneMain.find('.customMinigameRemoveChanceDropdown').attr('data-value', `inputMinigameChanceAmount-${number}`);
    const inputCustomMinigameRemoveChanceDropdown = cloneMain.find('.customMinigameRemoveChanceDropdown');

    // Dropdown มินิเกมส์
    const customCustomMinigameRemoveChanceDropdown = new CustomDropdown(inputCustomMinigameRemoveChanceDropdown[0], {
        single: true,
        auto: true,
        horizontal: false,
        fakeValue: (item) => (item?.textContent || ''),
        required: 'กรุณาเลือกมินิเกมส์',
        placeholder: 'เลือกมินิเกมส์',
        selfSearch: true,
        stretch: true,
        scrollRoot: '#rootScrollMinigame',
        offsetY: 72,
        offsetMargin: 72,
        onInit: async (filter) => {
            let minigames = [];
            $.ajax({
                url: `/api/promotion/get-promotion-deposit-mini-game`,
                method: "GET"
            }).done(function (res) {
                let htmlLoop = "";

                if (res.status == 200) {
                    var data = res.data;

                    const selectedBonusIds = [];
                    
                    luckyWheelIdNow ? selectedBonusIds.push(luckyWheelIdNow) : null;
                    for (const [key, values] of customMinigameRemoveChanceDropdownMap.entries()) {
                        if (key !== number) {
                            const selectedValue = values.minigameremovechances.getValue();
                            if (selectedValue) {
                                selectedBonusIds.push(selectedValue);
                            }
                        }
                    }

                    for (const lists of data) {
                        minigames.push({
                            value: `${lists.bonusId}`,
                            text: lists.name,
                            type: lists.type,
                            disabled: selectedBonusIds.includes(lists.bonusId)
                        });

                    }
                    filter.appendItems(minigames);
                }
            }).fail(function () {
            });
        },
        onSelect: (value) => {
            var data = customCustomMinigameRemoveChanceDropdown.getValue();
            let obj = customCustomMinigameRemoveChanceDropdown.data.find(o => o.value === data);
            let bonusId = obj.value;
            let bonusName = obj.text;
            let bonusType = obj.type;
            if (bonusType == 'mini-game') {
                $(`#minigameIsLuckyWheel-${number}`).val(false);
                $(`#minigameIsMiniGame-${number}`).val(true);
            } else {
                $(`#minigameIsLuckyWheel-${number}`).val(true);
                $(`#minigameIsMiniGame-${number}`).val(false);
            }

            $(`#minigameAnyGameId-${number}`).val(bonusId);
            $(`#minigameGameName-${number}`).val(bonusName);

            $("#" + inputCustomMinigameRemoveChanceDropdown[0].dataset.value).removeClass('disabled');

            updateAllMinigameDropdowns();
            validateStep();
        }
    });

    const data = {
        number,
        minigameremovechances: customCustomMinigameRemoveChanceDropdown
    };

    customMinigameRemoveChanceDropdownMap.set(number, data);

    $('#templateMinigameRemoveChance').before(cloneMain);
    $('#customMinigameRemoveChanceSection').append(cloneMain);

    cloneMain.attr('data-minigame-remove-chance', `${number}`);
    $('#minigame-remove-chance-template').attr('id', `minigame-remove-chance-${number}`);

    cloneMain.find('#minigameIsLuckyWheel-template').attr('id', `minigameIsLuckyWheel-${number}`);
    cloneMain.find('#minigameRemoveChance-template').attr('name', `minigameRemoveChance-${number}`);

    cloneMain.find('#minigameIsMiniGame-template').attr('id', `minigameIsMiniGame-${number}`);
    cloneMain.find('#minigameAnyGameId-template').attr('id', `minigameAnyGameId-${number}`);
    cloneMain.find('#minigameGameName-template').attr('id', `minigameGameName-${number}`);
    cloneMain.find('#error-MinigameRemoveChance-template').attr('id', `error-MinigameRemoveChance-${number}`);
    cloneMain.find('#minigameChanceAmount-template').attr('id', `minigameChanceAmount-${number}`);
    cloneMain.find('#inputMinigameChanceAmount-template').attr('id', `inputMinigameChanceAmount-${number}`);
    cloneMain.find('#error-minigameChanceAmount-template').attr('id', `error-minigameChanceAmount-${number}`);
    cloneMain.find('#btnRemoveChancePriviegeTemplate').attr('id', `btnRemoveChancePriviege-${number}`);
    cloneMain.find(`#btnRemoveChancePriviege-${number}`).attr('data-remove-number', number);
    cloneMain.find(`#btnRemoveChancePriviege-${number}`).attr('onclick', `deleteTemplateMinigamePrivilege(${number})`);

    $(`#minigameChanceAmount-${number}`).on('input', function () {
        validateStep();
    });

    $("#hiddenPromotionConditionTypeId").val("");
    $("#hiddenImagePromotionConditionType").val("");

    if (number > 1) {
        $(".checkShowDeletePromotionConditionType").show();
    } else {
        $(".checkShowDeletePromotionConditionType").hide();
    }

    if (number > 1) {
        $(".btn-remove-chance-privilege").show();
    } else {
        $(".btn-remove-chance-privilege").hide();
    }

    if (dataList) {
        if (dataList.anyGameId != null && dataList.anyGameId != '') {
            $(`#minigameIsLuckyWheel-${number}`).val(dataList.isLuckyWheel);
            $(`#minigameIsMiniGame-${number}`).val(dataList.isMiniGame);
            customCustomMinigameRemoveChanceDropdown.setValue(dataList.anyGameId);
            $(`#minigameAnyGameId-${number}`).val(dataList.anyGameId);
            $(`#minigameGameName-${number}`).val(dataList.gameName);
            $(`#minigameChanceAmount-${number}`).val(dataList.chanceAmount);
        } else {
            $(`#minigameIsLuckyWheel-${number}`).val(dataList.isLuckyWheel);
            $(`#minigameIsMiniGame-${number}`).val(dataList.isMiniGame);
            customCustomMinigameRemoveChanceDropdown.setValue(dataList.anyGameId);
            $(`#minigameAnyGameId-${number}`).val(dataList.anyGameId);
            $(`#minigameGameName-${number}`).val(dataList.gameName);
            $(`#minigameChanceAmount-${number}`).val(dataList.chanceAmount);
            $(`#minigameChanceAmount-${number}`).closest('.minigame-checkbox-reset').addClass('disabled');
        }
    }

    number.toString();
    $("#numberMinigameRemoveChanceTemplate").val(number);
    validateStep();

}

function updateAllMinigameDropdowns() {
    for (const [key, values] of customMinigameRemoveChanceDropdownMap.entries()) {
        const dropdown = values.minigameremovechances;
        const selectedValue = dropdown.getValue();
        
        const selectedBonusIds = [];
        luckyWheelIdNow ? selectedBonusIds.push(luckyWheelIdNow) : null;
        for (const [otherKey, otherValues] of customMinigameRemoveChanceDropdownMap.entries()) {
            if (otherKey !== key) {
                const otherSelectedValue = otherValues.minigameremovechances.getValue();
                if (otherSelectedValue) {
                    selectedBonusIds.push(otherSelectedValue);
                }
            }
        }

        dropdown.data.forEach(item => {
            item.disabled = selectedBonusIds.includes(item.value);
            dropdown.dropdown.querySelectorAll('.custom-dropdown-item').forEach(item => {
                item.classList.remove('disabled');
                if (selectedBonusIds.includes(item.dataset.value)) {
                    item.classList.add('disabled');
                }
            });
        });
        
        dropdown.update();
    }
}

// get template กำหนดการหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ
const getTemplateMinigameRemoveChance = () => {
    const result = [];

    for (const [key, values] of customMinigameRemoveChanceDropdownMap.entries()) {

        result.push({
            isLuckyWheel: $(`#minigameIsLuckyWheel-${key}`).val() || null,
            isMiniGame: $(`#minigameIsMiniGame-${key}`).val() || null,
            anyGameId: $(`#minigameAnyGameId-${key}`).val() || null,
            gameName: $(`#minigameGameName-${key}`).val() || null,
            chanceAmount: $(`#minigameChanceAmount-${key}`).val() || null,
        });
    }

    return result;
};
function clearTemplateMinigameRemoveChance() {
    $("#customMinigameRemoveChanceSection").empty();
    customMinigameRemoveChanceDropdownMap.clear();
}

// กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)
// แปลง format กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)
function changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime) {
    let showStartDateEndDate = "";

    if (startDateBkk == "" ||
        startDateBkk == null ||
        endDateBkk == "" ||
        endDateBkk == null ||
        startTime == "" ||
        startTime == null ||
        endTime == "" ||
        endTime == null) {
        showStartDateEndDate = "-";
    } else {
        showStartDateEndDate = `${startDateBkk} ${startTime || ""} - ${endDateBkk} ${endTime || ""}`;
    }

    $('#showStartDateEndDateSelect').text(showStartDateEndDate);
}

// เลือกวันที่เริ่มต้น
function handleStartDateBkk(event) {
    var startDateBkk = $('#startDateSettingMinigameFromInput').val();
    var endDateBkk = $('#endDateSettingMinigameFromInput').val();
    var startTime = $('#startTimeSettingMinigameInput').val();
    var endTime = $('#endTimeSettingMinigameInput').val();

    $('#startTimeSettingMinigameInput').val("");
    $('#endDateSettingMinigameFromInput').val("");
    $('#endTimeSettingMinigameInput').val("");

    if (startDateBkk == endDateBkk) {
        var endTimePicker = flatpickr("#endTimeSettingMinigameInput", {
            minTime: checkTimeFromBefore(startTime),
        });

        $('#endTimeSettingMinigameInput').val(checkTimeFromBefore(startTime));
    } else {
        var endTimePicker = flatpickr("#endTimeSettingMinigameInput", {
            minTime: "00:00",
        });
        $('#endTimeSettingMinigameInput').val("");
    }

    changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime);
}
function checkTimeFromBefore(timeBkkToBefore) {
    const endTimeBefore = timeBkkToBefore.split(":");
    let hour = endTimeBefore[0];
    let minute = endTimeBefore[1];

    minute = parseInt(minute) + 1;

    if (minute < 10) {
        endTimeBefore[1] = `0${minute}`
    } else if (minute == 60) {
        hour = parseInt(hour) + 1;
        endTimeBefore[1] = "00"

        if (hour < 10) {
            endTimeBefore[0] = `0${hour}`
        } else if (hour == 24) {
            endTimeBefore[0] = "00";
        }
    }

    var startTimeNew = endTimeBefore.join(':');

    return startTimeNew;
}
// เลือกวันที่เริ่มต้น
function handleEndDateBkk(event) {
    var startDateBkk = $('#startDateSettingMinigameFromInput').val();
    var endDateBkk = $('#endDateSettingMinigameFromInput').val();
    var startTime = $('#startTimeSettingMinigameInput').val();
    var endTime = $('#endTimeSettingMinigameInput').val();

    endDatePicker = flatpickr("#endTimeSettingMinigameInput", {
        dateFormat: "d/m/Y",
        minDate: endDateBkk
    });

    if (startDateBkk == endDateBkk) {
        var endTimePicker = flatpickr("#endTimeSettingMinigameInput", {
            minTime: checkTimeFromBefore(startTime),
        });

        $('#endTimeSettingMinigameInput').val(checkTimeFromBefore(startTime));
    } else {
        var endTimePicker = flatpickr("#endTimeSettingMinigameInput", {
            minTime: "00:00",
        });
        $('#endTimeSettingMinigameInput').val("");
    }

    changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime);
}

// เลือกวันที่สิ้นสุด
function handleStartTime(event) {
    var startDateBkk = $('#startDateSettingMinigameFromInput').val();
    var endDateBkk = $('#endDateSettingMinigameFromInput').val();
    var startTime = event.target.value;
    var endTime = $('#endTimeSettingMinigameInput').val();

    changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime);
}

// เลือกเวลาสิ้นสุด
function handleEndTime(event) {
    var startDateBkk = $('#startDateSettingMinigameFromInput').val();
    var endDateBkk = $('#endDateSettingMinigameFromInput').val();
    var startTime = $('#startTimeSettingMinigameInput').val();
    var endTime = event.target.value;

    changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime);
}

// เพิ่ม template Wheel Minigame
const templatMinigameWheelMap = new Map;

function addtemplateMinigameWheel(dataList = null) {
    var dataMinigameWheel = document.querySelectorAll("[data-minigame-wheel]");
    var number = dataMinigameWheel.length;

    number = number + 1;

    let cloneTemplate = $('#templateMinigameWheel').clone();

    let cloneMain = cloneTemplate.html().replaceAll("template", number);
    cloneMain = $(cloneMain);
    resetDisabled(cloneMain);

    templatMinigameWheelMap.set(number, new Map);

    $('#templateMinigameWheel').before(cloneMain);
    $('#customMinigameWheelSection').append(cloneMain);

    cloneMain.attr('data-minigame-wheel', `${number}`);
    if (typeNow == 'mini-game') {
        cloneMain.find('#minigameSequence-' + number).html(`<span class="reward-set-list-config" data-i18n="minigameSetting.settingRewardNo">ตั้งค่ารางวัลตัวเลือกที่</span> ${number}`);
    } else {
        cloneMain.find('#minigameSequence-' + number).html(`Wheel ${number}`);
    }
    if (actionNow != 'detail' && actionNow != 'edit') {
        addTemplatePromotionConditionType(number);
    }
    //cloneMain.find('#minigameRemoveChance-template').attr('name', `minigameRemoveChance-${number}`);
    if (dataList) {
        let RewardPercentage;
        let RewardImageUrl;
        if (typeNow == 'mini-game') {
            RewardPercentage = dataList.miniGameRewardPercentage;
            RewardImageUrl = dataList.miniGameRewardImageUrl;
        } else {
            RewardPercentage = dataList.luckyWheelRewardPercentage;
            RewardImageUrl = dataList.luckyWheelRewardImageUrl;
        }
        $(`#minigameLuckyWheelRewardPercentage-${number}`).val(RewardPercentage);
        $(`#minigameLuckyWheelRewardImageUrl-${number}`).val(RewardImageUrl);
        $(`#minigameWheelMain-${number}`).attr('data-minigame-wheel', dataList.sequence);
        $(`#minigameRewardDescription-${number}`).val(dataList.rewardDescription);
        if (dataList.isUnlimited) {
            $(`#minigameNoLimitAmountBonus-${number}`).prop('checked', true);
            getMinigameRadio($(`#minigameNoLimitAmountBonus-${number}`)[0], false);
        } else {
            $(`#minigameLimitAmountBonus-${number}`).prop('checked', true);
            getMinigameRadio($(`#minigameLimitAmountBonus-${number}`)[0], true);
        }

        $(`#minigameLimitAmount-${number}`).val(dataList.limitAmount);
        if (dataList.isAlert) {
            $(`#minigameIsAlertOn-${number}`).prop('checked', true);
        }
        if (dataList.isAlert) {
            $(`#minigameIsAlertOn-${number}`).prop('checked', true);
            getMinigameRadio($(`#minigameIsAlertOn-${number}`)[0], true);
        } else {
            $(`#minigameIsAlertOff-${number}`).prop('checked', true);
            getMinigameRadio($(`#minigameIsAlertOff-${number}`)[0], false);
        }
        $(`#minigameAlertAmount-${number}`).val(dataList.alertAmount);

        let BonusesArray;
        if (typeNow == 'mini-game') {
            BonusesArray = dataList.miniGameBonuses;
        } else {
            BonusesArray = dataList.luckyWheelBonuses;
        }
        var dataList2 = BonusesArray;

        for (const lists2 of dataList2) {
            addTemplatePromotionConditionType(number, lists2);
        }

        $(`.luckywheelWheel${number}Src`).attr('src', dataList.luckyWheelRewardImageUrl);
    }
    validateStep();
    $(".reward-set-list-config").localize();
    $(".reward-description-text").localize();
    $(".reward-chance-text").localize();
    $(".bonus-rate-text").localize();
    $(".bonus-rate-unlimited-text").localize();
    $(".bonus-rate-limited-text").localize();
    $(".bonus-notification-send").localize();
    $(".bonus-no-notification").localize();
    $(".bonus-notification").localize();
    $(".bonus-setting-given-text").localize();
    $(".bonus-setting-given-when-text").localize();
    $(".text-count").localize();
    $(".add-bonus-btn-text").localize();
    $(".error-reward-description-text").localize();
    $(".error-reward-chance-text").localize();
    $(".error-bonus-setting-given-text").localize();
    $(".error-bonus-setting-given-when-text").localize();
}

// เคลีย template Wheel Minigame
function clearTemplateMinigameWheel() {
    $("#customMinigameWheelSection").empty();
    templatMinigameWheelMap.clear();
    clearTemplatePromotionConditionType()
}

// get template กำหนดการหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ
const getTemplatMinigameWheelMap = () => {
    const result = [];

    for (const [key, values] of templatMinigameWheelMap.entries()) {

        result.push({
            luckyWheelRewardPercentage: $(`#minigameLuckyWheelRewardPercentage-${key}`).val() || 0,
            sequence: $(`#minigameWheelMain-${key}`).attr('data-minigame-wheel') || 0,
            rewardDescription: $(`#minigameRewardDescription-${key}`).val() || null,
            isUnlimited: $(`#minigameNoLimitAmountBonus-${key}`).prop('checked'),
            limitAmount: $(`#minigameLimitAmount-${key}`).val() || 0,
            isAlert: $(`#minigameIsAlertOn-${key}`).prop('checked') || null,
            alertAmount: $(`#minigameAlertAmount-${key}`).val() || 0,
            luckyWheelBonuses: getPromotionConditionType(key) || null,
        });
    }

    return result;
};

const getTemplatMinigameMap = () => {
    const result = [];

    for (const [key, values] of templatMinigameWheelMap.entries()) {

        result.push({
            miniGameRewardPercentage: $(`#minigameLuckyWheelRewardPercentage-${key}`).val() || 0,
            sequence: $(`#minigameWheelMain-${key}`).attr('data-minigame-wheel') || 0,
            rewardDescription: $(`#minigameRewardDescription-${key}`).val() || null,
            isUnlimited: $(`#minigameNoLimitAmountBonus-${key}`).prop('checked') || null,
            limitAmount: $(`#minigameLimitAmount-${key}`).val() || 0,
            isAlert: $(`#minigameIsAlertOn-${key}`).prop('checked') || null,
            alertAmount: $(`#minigameAlertAmount-${key}`).val() || 0,
            miniGameBonuses: getPromotionConditionType(key) || null,
        });
    }

    return result;
};

function allAddTemplat(datalist = null) {
    var NumberPartsMinigame;
    if (typeNow == 'mini-game') {
        NumberPartsMinigame = customNumberPartsMinigame.getValue();
    } else {
        NumberPartsMinigame = customNumberPartsLuckywheel.getValue();
    }
    clearTemplateMinigameDatetime();
    addTemplateMinigameDatetime();

    clearTemplateMinigameWheel();
    changeWheel(NumberPartsMinigame);
    for (let i = 0; i < NumberPartsMinigame; i++) {
        addtemplateMinigameWheel();
    }
    clearTemplateMinigameRemoveChance();
    addTemplateMinigameRemoveChance();

    validateStep();
}

function clearAllAddTemplat(datalist = null) {
    clearTemplateMinigameDatetime();
    clearTemplateMinigameWheel();
    clearTemplateMinigameRemoveChance();
    validateStep();
}

function resetDisabled(ele) {
    ele.find('.minigame-reset').addClass('disabled');
    ele.find('.minigame-box-reset').addClass('disabled');
    ele.find('.minigame-checkbox-reset').addClass('disabled');
}

// set ข้อมูล ก่อน กด Create / Edit
async function getMinigameDetail(sequencePie) {

    // Step 1 เอาไปแสดง Step 5
    if ($('#minigameStatus').prop('checked')) {
        $('#showStatusDetail1').show();
        $('#showStatusDetail2').hide();
    } else {
        $('#showStatusDetail1').hide();
        $('#showStatusDetail2').show();
    }
    $('#showName').text($('#minigameName').val());

    $('#showconditionHtml').html(conditionHtml.getData());

    if ($('#enableIfNotHaveLuckyWheel').prop('checked')) {
        $('#showenableIfNotHaveLuckyWheel1').show();
        $('#showenableIfNotHaveLuckyWheel2').hide();
    } else {
        $('#showenableIfNotHaveLuckyWheel1').hide();
        $('#showenableIfNotHaveLuckyWheel2').show();
    }

    // Step 2.1
    var enableStartEndDate = $('#minigameEnableStartEndDate').prop('checked');
    var startDateBkk = $('#startDateSettingMinigameFromInput').val();
    var endDateBkk = $('#endDateSettingMinigameFromInput').val();
    var startTime = $('#startTimeSettingMinigameInput').val();
    var endTime = $('#endTimeSettingMinigameInput').val();

    // Step 2.1 เอาไปแสดง Step 5
    let showStartDateEndDate = "";

    if (startDateBkk == "" ||
        startDateBkk == null ||
        endDateBkk == "" ||
        endDateBkk == null) {
        showStartDateEndDate = "-";
    } else {
        showStartDateEndDate = `${startDateBkk} ${startTime || ""} - ${endDateBkk} ${endTime || ""}`;
        changeFormatStartDateEndDateSelect(startDateBkk, endDateBkk, startTime, endTime);
    }

    $('#showStartDateEndDate').text(showStartDateEndDate);

    $('#showEnableEveryday').hide();

    if (hiddenActiveEnableSunday) {
        $('#showEnableSunday').show();
    } else {
        $('#showEnableSunday').hide();
    }

    if (hiddenActiveEnableMonday) {
        $('#showEnableMonday').show();
    } else {
        $('#showEnableMonday').hide();
    }

    if (hiddenActiveEnableTuesday) {
        $('#showEnableTuesday').show();
    } else {
        $('#showEnableTuesday').hide();
    }

    if (hiddenActiveEnableWednesday) {
        $('#showEnableWednesday').show();
    } else {
        $('#showEnableWednesday').hide();
    }

    if (hiddenActiveEnableThursday) {
        $('#showEnableThursday').show();
    } else {
        $('#showEnableThursday').hide();
    }

    if (hiddenActiveEnableFriday) {
        $('#showEnableFriday').show();
    } else {
        $('#showEnableFriday').hide();
    }

    if (hiddenActiveEnableSaturday) {
        $('#showEnableSaturday').show();
    } else {
        $('#showEnableSaturday').hide();
    }

    if (hiddenActiveEnableSunday &&
        hiddenActiveEnableMonday &&
        hiddenActiveEnableTuesday &&
        hiddenActiveEnableWednesday &&
        hiddenActiveEnableThursday &&
        hiddenActiveEnableFriday &&
        hiddenActiveEnableSaturday) {
        $('#showEnableEveryday').show();
        $('#showEnableSunday').hide();
        $('#showEnableMonday').hide();
        $('#showEnableTuesday').hide();
        $('#showEnableWednesday').hide();
        $('#showEnableThursday').hide();
        $('#showEnableFriday').hide();
        $('#showEnableSaturday').hide();
    }

    let htmlShowMinigameTime = "";

    var minigameTimeArrayLists = getTemplateMinigameDatetime();

    for (let i = 0; i < minigameTimeArrayLists.length; i++) {
        var timeBkkFrom = minigameTimeArrayLists[i].timeBkkFrom;
        var timeBkkTo = minigameTimeArrayLists[i].timeBkkTo;
        htmlShowMinigameTime += `<div class="col-12 col-lg-3">
                                                                                    <div class="p2" style="width: 120px;">
                                                                                        <span class="minigame-date-no" data-i18n="minigameSetting.minigameDateNo">เวลาทำงานที่</span> <span>${i + 1}</span> :
                                                                                    </div>
                                                                                </div>
                                                                                        <div class="col-12 col-lg-9">
                                                                                    <div class="p2">
                                                                                    ${timeBkkFrom} - ${timeBkkTo}
                                                                                </div>
                                                                                </div>`
    }

    $('#showMinigameTime').html(htmlShowMinigameTime);
    $(".minigame-date-no").localize();

    if ($('#changeMinigameEnableCountDown').prop('checked')) {
        $('#showEnableCountDown1').show();
        $('#showEnableCountDown2').hide();
    } else {
        $('#showEnableCountDown1').hide();
        $('#showEnableCountDown2').show();
    }

    if ($('#minigameEnableCountDownCreated').prop('checked')) {
        $('#showEnableCountDownCreated').show();
        $('#showEnableCountDownSetTime').hide();
    } else {
        $('#showEnableCountDownCreated').hide();
        $('#showEnableCountDownSetTime').show();
    }

    let showRemainingDateBkk = "";
    let minigameCountdownRemainingDateBkk = $('#minigameCountdownRemainingDateBkk').val() || null;
    let remainingTimeBkk = $('#minigameCountdownRemainingTimeBkk').val() || null;
    let remainingDay = $('#minigameCountdownRemainingDay').val() || null;
    if (minigameCountdownRemainingDateBkk != "" && minigameCountdownRemainingDateBkk != null) {
        showRemainingDateBkk = minigameCountdownRemainingDateBkk?.toString();
    } else {
        showRemainingDateBkk = "";
    }

    let showRemainingDateTime = "";

    if (showRemainingDateBkk == "" ||
        showRemainingDateBkk == null) {
        showRemainingDateTime = "-";
    } else {
        showRemainingDateTime = `${showRemainingDateBkk} ${remainingTimeBkk || ""}`;
    }

    if ($('#minigameEnableRemainingDay').prop('checked')) {
        $('#showEnableRemainingDay').show();
        $('#showEnableRemainingDateTime').hide();

        $('#showEnableRemainingDay').text(`${remainingDay}`);
    } else {
        $('#showEnableRemainingDay').hide();
        $('#showEnableRemainingDateTime').show();

        $('#showEnableRemainingDateTime').text(`${showRemainingDateTime}`);
    }
    let countDownColorCode = $('input[name="minigameCountDownColorCodeRadio"]:checked').val() || null;

    if (countDownColorCode == "" || countDownColorCode == null) {
        countDownColorCode = "1";
    } else {
        countDownColorCode = countDownColorCode;
    }

    var htmlShowCountDownColorCode = `<div class="countdown-minigame style-${countDownColorCode}" style="width: fit-content;">
                                                                        <div class="time">
                                                                            <div class="card-unit days">
                                                                                <div><span>0</span></div>
                                                                                <div><span>0</span></div>
                                                                            </div>
                                                                            :
                                                                            <div class="card-unit hours">
                                                                                <div><span>0</span></div>
                                                                                <div><span>0</span></div>
                                                                            </div>
                                                                            :
                                                                            <div class="card-unit minutes">
                                                                                <div><span>0</span></div>
                                                                                <div><span>0</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="text">
                                                                            <span>Days</span><span></span><span>Hours</span><span></span><span>Minutes</span>
                                                                        </div>
                                                                     </div>`

    $('#showCountDownColorCode').html(htmlShowCountDownColorCode);


    // Step 2.3
    var enableMaxPromotion = $('#minigameEnableMaxPromotion').prop('checked');
    var enableMaxCountPerDay = $('#minigameEnableMaxCountPerDay').prop('checked');
    var maxCountPerDay = $('#minigameMaxCountPerDay').val();
    var enableMaxCountPerWeek = $('#minigameEnableMaxCountPerWeek').prop('checked');
    var maxCountPerWeek = $('#minigameMaxCountPerWeek').val();
    var enableMaxCountPerMonth = $('#minigameEnableMaxCountPerMonth').prop('checked');
    var maxCountPerMonth = $('#minigameMaxCountPerMonth').val();
    var enableMaxCountPerPromotion = $('#minigameEnableMaxCountPerPromotion').prop('checked');
    var maxCountPerPromotion = $('#minigameMaxCountPerPromotion').val();

    var enableMaxPromotionPerPerson = $('#minigameEnableMaxPromotionPerPerson').prop('checked');
    var enableMaxCountPerDayPerPerson = $('#minigameEnableMaxCountPerDayPerPerson').prop('checked');
    var maxCountPerDayPerPerson = $('#minigameMaxCountPerDayPerPerson').val();
    var enableMaxCountPerTimePerPerson = $('#minigameEnableMaxCountPerTimePerPerson').prop('checked');
    var maxCountPerTimePerPerson = $('#minigameMaxCountPerTimePerPerson').val();
    var enableMaxCountPerWeekPerPerson = $('#minigameEnableMaxCountPerWeekPerPerson').prop('checked');
    var maxCountPerWeekPerPerson = $('#minigameMaxCountPerWeekPerPerson').val();
    var enableMaxCountPerMonthPerPerson = $('#minigameEnableMaxCountPerMonthPerPerson').prop('checked');
    var maxCountPerMonthPerPerson = $('#minigameMaxCountPerMonthPerPerson').val();
    var enableMaxCountPerPerson = $('#minigameEnableMaxCountPerPerson').prop('checked');
    var maxCountPerPerson = $('#minigameMaxCountPerPerson').val();

    var enableReset = $('#minigameEnableReset').prop('checked');
    var enableResetExpired = $('#minigameEnableResetExpired').prop('checked');
    var enableResetTime = $('#minigameEnableResetTime').prop('checked');
    var resetTimeBkk = $('#minigameResetTimeBkk').val();
    var enableResetDateTime = $('#minigameEnableResetDateTime').prop('checked');
    var day = $('#minigameResetDay').val();
    var hour = $('#minigameResetHour').val();
    var minute = $('#minigameResetMinute').val();

    var minigameEnableRemoveChance = $('#minigameEnableRemoveChance').prop('checked');
    var minigameEnableFixChance = $('#minigameEnableFixChance').prop('checked');
    var minigameEnableLimitPerGamePerDay = $('#minigameEnableLimitPerGamePerDay').prop('checked');
    var minigameLimitPerGamePerDay = $('#minigameLimitPerGamePerDay').val();
    var minigameEnableLimitPerPerson = $('#minigameEnableLimitPerPerson').prop('checked');
    var minigameLimitPerPerson = $('#minigameLimitPerPerson').val();
    var minigameEnableLimitBalance = $('#minigameEnableLimitBalance').prop('checked');
    var minigameLimitBalance = $('#minigameLimitBalance').val();

    //การจำกัดสิทธิ์อื่น ๆ ของสมาชิก
    if (minigameEnableFixChance) {
        $('#showminigameEnableFixChance11').show();
        $('#showminigameEnableFixChance12').hide();
    } else {
        $('#showminigameEnableFixChance11').hide();
        $('#showminigameEnableFixChance12').show();
    }
    //การจำกัดการใช้สิทธิ์ของสมาชิกต่อมินิเกมส์ ต่อวัน
    if (minigameEnableLimitPerGamePerDay) {
        $('#showEnableLimitPerGamePerDayActive').show();
        $('#showEnableLimitPerGamePerDayInactive').hide();
    } else {
        $('#showEnableLimitPerGamePerDayActive').hide();
        $('#showEnableLimitPerGamePerDayInactive').show();
    }
    if (minigameLimitPerGamePerDay != "" && minigameLimitPerGamePerDay != null) {
        $('#showLimitPerGamePerDayActive').show();
        $('#showLimitPerGamePerDayInactive').hide();

        $('#showLimitPerGamePerDayActive').text(`${minigameLimitPerGamePerDay}`);
    } else {
        $('#showLimitPerGamePerDayActive').hide();
        $('#showLimitPerGamePerDayInactive').show();
    }
    //การจำกัดการใช้สิทธิ์ของสมาชิกต่อมินิเกมส์ ต่อวัน
    if (minigameEnableLimitPerGamePerDay) {
        $('#showEnableLimitPerGamePerDayActive').show();
        $('#showEnableLimitPerGamePerDayInactive').hide();
    } else {
        $('#showEnableLimitPerGamePerDayActive').hide();
        $('#showEnableLimitPerGamePerDayInactive').show();
    }
    if (minigameLimitPerGamePerDay != "" && minigameLimitPerGamePerDay != null) {
        $('#showLimitPerGamePerDayActive').show();
        $('#showLimitPerGamePerDayInactive').hide();

        $('#showLimitPerGamePerDayActive').text(`${minigameLimitPerGamePerDay}`);
    } else {
        $('#showLimitPerGamePerDayActive').hide();
        $('#showLimitPerGamePerDayInactive').show();
    }
    //การจำกัดการรับสิทธิ์สมาชิก หากมีสิทธิ์อยู่แล้ว x สิทธิ์
    if (minigameEnableLimitPerPerson) {
        $('#showEnableLimitPerPersonActive').show();
        $('#showEnableLimitPerPersonInactive').hide();
    } else {
        $('#showEnableLimitPerPersonActive').hide();
        $('#showEnableLimitPerPersonInactive').show();
    }
    if (minigameLimitPerPerson != "" && minigameLimitPerPerson != null) {
        $('#showLimitPerPersonActive').show();
        $('#showLimitPerPersonInactive').hide();

        $('#showLimitPerPersonActive').text(`${minigameLimitPerPerson}`);
    } else {
        $('#showLimitPerPersonActive').hide();
        $('#showLimitPerPersonInactive').show();
    }
    //การจำกัดการรับสิทธิ์สมาชิกหากมียอดเครดิตที่ยอดคงเหลือ
    if (minigameEnableLimitBalance) {
        $('#showEnableLimitBalanceActive').show();
        $('#showEnableLimitBalanceInactive').hide();
    } else {
        $('#showEnableLimitBalanceActive').hide();
        $('#showEnableLimitBalanceInactive').show();
    }
    if (minigameLimitBalance != "" && minigameLimitBalance != null) {
        $('#showLimitBalanceActive').show();
        $('#showLimitBalanceInactive').hide();

        $('#showLimitBalanceActive').text(`${minigameLimitBalance} บาท`);
    } else {
        $('#showLimitBalanceActive').hide();
        $('#showLimitBalanceInactive').show();
    }

    // การหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ
    if (minigameEnableRemoveChance) {
        $('#showMinigameEnableRemoveChance1').show();
        $('#showMinigameEnableRemoveChance2').hide();
    } else {
        $('#showMinigameEnableRemoveChance1').hide();
        $('#showMinigameEnableRemoveChance2').show();
    }
    let htmlShowMinigameEnableRemoveChance = "";

    var minigameRemoveChanceLists = getTemplateMinigameRemoveChance();

    for (let i = 0; i < minigameRemoveChanceLists.length; i++) {
        let isLuckyWheel = minigameRemoveChanceLists[i].isLuckyWheel;
        let isMiniGame = minigameRemoveChanceLists[i].isMiniGame;
        let anyGameId = minigameRemoveChanceLists[i].anyGameId;
        let gameName = minigameRemoveChanceLists[i].gameName || "";
        let chanceAmount = minigameRemoveChanceLists[i].chanceAmount || "-";
        let type = "";

        if (isLuckyWheel == "true") {
            type = 'Lucky wheel';
        } else {
            type = 'Mini Game';
        }

        let text1 = `${type} - ${gameName}`;
        htmlShowMinigameEnableRemoveChance += `<div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div class="p2">
                                                                    ${text1}
                                                                </div>
                                                                <div class="p2">
                                                                     ${chanceAmount} Coupon
                                                                </div>
                                                            </div>`
    }

    $('#showMinigameEnableRemoveChance').html(htmlShowMinigameEnableRemoveChance);

    // Step 2.3 เอาไปแสดง Step 5
    // การจำกัดการรับสิทธิ์ของสมาชิก ระดับโปรโมชั่น
    if (enableMaxPromotion) {
        $('#showEnableMaxPromotion1').show();
        $('#showEnableMaxPromotion2').hide();
    } else {
        $('#showEnableMaxPromotion1').hide();
        $('#showEnableMaxPromotion2').show();
    }
    // ระดับโปรโมชั่น จำกัดสิทธิ์การรับ “ต่อวัน”
    if (enableMaxCountPerDay) {
        $('#showEnableMaxCountPerDayActive').show();
        $('#showEnableMaxCountPerDayInactive').hide();
    } else {
        $('#showEnableMaxCountPerDayActive').hide();
        $('#showEnableMaxCountPerDayInactive').show();
    }

    if (maxCountPerDay != "" && maxCountPerDay != null) {
        $('#showMaxCountPerDayActive').show();
        $('#showMaxCountPerDayInactive').hide();

        $('#showMaxCountPerDayActive').text(`${maxCountPerDay}`);
    } else {
        $('#showMaxCountPerDayActive').hide();
        $('#showMaxCountPerDayInactive').show();
    }

    // ระดับโปรโมชั่น จำกัดสิทธิ์การรับ “ต่อสัปดาห์”
    if (enableMaxCountPerWeek) {
        $('#showEnableMaxCountPerWeekActive').show();
        $('#showEnableMaxCountPerWeekInactive').hide();
    } else {
        $('#showEnableMaxCountPerWeekActive').hide();
        $('#showEnableMaxCountPerWeekInactive').show();
    }

    if (maxCountPerWeek != "" && maxCountPerWeek != null) {
        $('#showMaxCountPerWeekActive').show();
        $('#showMaxCountPerWeekInactive').hide();

        $('#showMaxCountPerWeekActive').text(`${maxCountPerWeek}`);
    } else {
        $('#showMaxCountPerWeekActive').hide();
        $('#showMaxCountPerWeekInactive').show();
    }

    // ระดับโปรโมชั่น จำกัดสิทธิ์การรับ “ต่อเดือน”
    if (enableMaxCountPerMonth) {
        $('#showEnableMaxCountPerMonthActive').show();
        $('#showEnableMaxCountPerMonthInactive').hide();
    } else {
        $('#showEnableMaxCountPerMonthActive').hide();
        $('#showEnableMaxCountPerMonthInactive').show();
    }

    if (maxCountPerMonth != "" && maxCountPerMonth != null) {
        $('#showMaxCountPerMonthActive').show();
        $('#showMaxCountPerMonthInactive').hide();

        $('#showMaxCountPerMonthActive').text(`${maxCountPerMonth}`);
    } else {
        $('#showMaxCountPerMonthActive').hide();
        $('#showMaxCountPerMonthInactive').show();
    }

    // จำกัดสิทธิ์การรับ “ตลอดอายุโปรโมชั่น”
    if (enableMaxCountPerPromotion) {
        $('#showEnableMaxCountPerPromotionActive').show();
        $('#showEnableMaxCountPerPromotionInactive').hide();
    } else {
        $('#showEnableMaxCountPerPromotionActive').hide();
        $('#showEnableMaxCountPerPromotionInactive').show();
    }

    if (maxCountPerPromotion != "" && maxCountPerPromotion != null) {
        $('#showMaxCountPerPromotionActive').show();
        $('#showMaxCountPerPromotionInactive').hide();

        $('#showMaxCountPerPromotionActive').text(`${maxCountPerPromotion}`);
    } else {
        $('#showMaxCountPerPromotionActive').hide();
        $('#showMaxCountPerPromotionInactive').show();
    }
    // การจำกัดการรับสิทธิ์ของสมาชิก รายคน
    if (enableMaxPromotionPerPerson) {
        $('#showEnableMaxPromotionPerPersonActive').show();
        $('#showEnableMaxPromotionPerPersonInactive').hide();
    } else {
        $('#showEnableMaxPromotionPerPersonActive').hide();
        $('#showEnableMaxPromotionPerPersonInactive').show();
    }

    // รายคน จำกัดสิทธิ์การรับ “ต่อครั้ง”
    if (enableMaxCountPerTimePerPerson) {
        $('#showEnableMaxCountPerTimePerPersonActive').show();
        $('#showEnableMaxCountPerTimePerPersonInactive').hide();
    } else {
        $('#showEnableMaxCountPerTimePerPersonActive').hide();
        $('#showEnableMaxCountPerTimePerPersonInactive').show();
    }

    if (maxCountPerTimePerPerson != "" && maxCountPerTimePerPerson != null) {
        $('#showMaxCountPerTimePerPersonActive').show();
        $('#showMaxCountPerTimePerPersonInactive').hide();

        $('#showMaxCountPerTimePerPersonActive').text(`${maxCountPerTimePerPerson}`);
    } else {
        $('#showMaxCountPerTimePerPersonActive').hide();
        $('#showMaxCountPerTimePerPersonInactive').show();
    }

    // รายคน จำกัดสิทธิ์การรับ “ต่อวัน”
    if (enableMaxCountPerDayPerPerson) {
        $('#showEnableMaxCountPerDayPerPersonActive').show();
        $('#showEnableMaxCountPerDayPerPersonInactive').hide();
    } else {
        $('#showEnableMaxCountPerDayPerPersonActive').hide();
        $('#showEnableMaxCountPerDayPerPersonInactive').show();
    }

    if (maxCountPerDayPerPerson != "" && maxCountPerDayPerPerson != null) {
        $('#showMaxCountPerDayPerPersonActive').show();
        $('#showMaxCountPerDayPerPersonInactive').hide();

        $('#showMaxCountPerDayPerPersonActive').text(`${maxCountPerDayPerPerson}`);
    } else {
        $('#showMaxCountPerDayPerPersonActive').hide();
        $('#showMaxCountPerDayPerPersonInactive').show();
    }

    // รายคน จำกัดสิทธิ์การรับ “ต่อสัปดาห์”
    if (enableMaxCountPerWeekPerPerson) {
        $('#showEnableMaxCountPerWeekPerPersonActive').show();
        $('#showEnableMaxCountPerWeekPerPersonInactive').hide();
    } else {
        $('#showEnableMaxCountPerWeekPerPersonActive').hide();
        $('#showEnableMaxCountPerWeekPerPersonInactive').show();
    }

    if (maxCountPerWeekPerPerson != "" && maxCountPerWeekPerPerson != null) {
        $('#showMaxCountPerWeekPerPersonActive').show();
        $('#showMaxCountPerWeekPerPersonInactive').hide();

        $('#showMaxCountPerWeekPerPersonActive').text(`${maxCountPerWeekPerPerson}`);
    } else {
        $('#showMaxCountPerWeekPerPersonActive').hide();
        $('#showMaxCountPerWeekPerPersonInactive').show();
    }

    // รายคน จำกัดสิทธิ์การรับ “ต่อเดือน”
    if (enableMaxCountPerMonthPerPerson) {
        $('#showEnableMaxCountPerMonthPerPersonActive').show();
        $('#showEnableMaxCountPerMonthPerPersonInactive').hide();
    } else {
        $('#showEnableMaxCountPerMonthPerPersonActive').hide();
        $('#showEnableMaxCountPerMonthPerPersonInactive').show();
    }

    if (maxCountPerMonthPerPerson != "" && maxCountPerMonthPerPerson != null) {
        $('#showMaxCountPerMonthPerPersonActive').show();
        $('#showMaxCountPerMonthPerPersonInactive').hide();

        $('#showMaxCountPerMonthPerPersonActive').text(`${maxCountPerMonthPerPerson}`);
    } else {
        $('#showMaxCountPerMonthPerPersonActive').hide();
        $('#showMaxCountPerMonthPerPersonInactive').show();
    }

    // รายคน “ตลอดอายุโปรโมชั่น”
    if (enableMaxCountPerPerson) {
        $('#showEnableMaxCountPerPersonActive').show();
        $('#showEnableMaxCountPerPersonInactive').hide();
    } else {
        $('#showEnableMaxCountPerPersonActive').hide();
        $('#showEnableMaxCountPerPersonInactive').show();
    }

    if (maxCountPerPerson != "" && maxCountPerPerson != null) {
        $('#showMaxCountPerPersonActive').show();
        $('#showMaxCountPerPersonInactive').hide();

        $('#showMaxCountPerPersonActive').text(`${maxCountPerPerson}`);
    } else {
        $('#showMaxCountPerPersonActive').hide();
        $('#showMaxCountPerPersonInactive').show();
    }

    // การจำกัดการรับสิทธิ์ของกลุ่มลูกค้า
    var enableLimitCustomerGroup = $('#enableLimitCustomerGroup').prop('checked');

    if (enableLimitCustomerGroup) {
        $('#showEnableLimitCustomerGroupActive').show();
        $('#showEnableLimitCustomerGroupInactive').hide();
    } else {
        $('#showEnableLimitCustomerGroupActive').hide();
        $('#showEnableLimitCustomerGroupInactive').show();
    }

    // การ Reset สิทธิ์การรับโปรโมชั่นของสมาชิก
    if (enableReset) {
        $('#showEnableResetActive').show();
        $('#showEnableResetInactive').hide();
    } else {
        $('#showEnableResetActive').hide();
        $('#showEnableResetInactive').show();
    }

    if (enableResetExpired) {
        $('#showEnableResetExpired').show();
        $('#showEnableResetTime').hide();
        $('#showEnableResetDateTime').hide();

        $('#showResetTimeBkk').hide();
        $('#showResetDayHourMinute').hide();
        $('#showResetTimeBkk').text(resetTimeBkk);
    } else if (enableResetTime) {
        $('#showEnableResetExpired').hide();
        $('#showEnableResetTime').show();
        $('#showEnableResetDateTime').hide();

        $('#showResetTimeBkk').show();
        $('#showResetDayHourMinute').hide();
        $('#showResetTimeBkk').text(resetTimeBkk);
    } else {
        $('#showEnableResetExpired').hide();
        $('#showEnableResetTime').hide();
        $('#showEnableResetDateTime').show();

        $('#showResetTimeBkk').hide();
        $('#showResetDayHourMinute').show();
        $('#showResetDayHourMinute').text(`${day} Day ${hour} Hours ${minute} Minutes`);
    }


    // Step 3
    var depositType = customMinigameDepositTypeDropdown.getValue();
    var depositAmountType = customMinigameDepositAmountTypeDropdown.getValue();
    var amountAutoDeposit = $('#minigameAmountAutoDeposit').val();
    var minAmountAutoDeposit = $('#minigameMinAmountAutoDeposit').val();
    var maxAmountAutoDepsoit = $('#minigameMaxAmountAutoDeposit').val();
    var amountAutoDepositFrom = $('#minigameAmountAutoDepositFrom').val();
    var amountAutoDepositTo = $('#minigameAmountAutoDepositTo').val();
    var depositCount = $('#minigameDepositCount').val();
    var period = $('#minigameDepositPeriod').val();

    let depositTypeText = "";
    let depositAmountTypeText = "";
    let amountAutoDepositText = "";
    let minAmountAutoDepositText = "";
    let maxAmountAutoDepsoitText = "";
    let amountAutoDepositFromText = "";
    let amountAutoDepositToText = "";
    let showConditionGetBonus = "";

    if (depositType == MiniGameType.DepositOnce) {
        depositTypeText = "ฝากครั้งเดียว";
    } else if (depositType == MiniGameType.AccumulatedDeposit) {
        depositTypeText = "ฝากสะสม";
    } else if (depositType == MiniGameType.ContinuousDeposit) {
        depositTypeText = "ฝากติดต่อกัน";
    }

    if (depositAmountType == MiniGameAmountType.EqualDeposit) {
        depositAmountTypeText = "ฝากเท่ากับ";
    } else if (depositAmountType == MiniGameAmountType.MinDeposit) {
        depositAmountTypeText = "ฝากขั้นต่ำ";
    } else if (depositAmountType == MiniGameAmountType.MaxDeposit) {
        depositAmountTypeText = "ฝากสูงสุด";
    } else if (depositAmountType == MiniGameAmountType.DepositPeriod) {
        depositAmountTypeText = "ช่วงยอดฝาก";
    }

    if (depositType == MiniGameType.DepositOnce && depositAmountType == MiniGameAmountType.EqualDeposit) {
        // ฝากครั้งเดียว ฝากเท่ากับ
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${amountAutoDeposit} บาท`;
    } else if (depositType == MiniGameType.DepositOnce && depositAmountType == MiniGameAmountType.MinDeposit) {
        // ฝากครั้งเดียว ฝากขั้นต่ำ
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${minAmountAutoDeposit} บาท`;
    } else if (depositType == MiniGameType.DepositOnce && depositAmountType == MiniGameAmountType.MaxDeposit) {
        // ฝากครั้งเดียว ฝากสูงสุด
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${maxAmountAutoDepsoit} บาท`;
    } else if (depositType == MiniGameType.DepositOnce && depositAmountType == MiniGameAmountType.DepositPeriod) {
        // ฝากครั้งเดียว ช่วงยอดฝาก
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${amountAutoDepositFrom} - ${amountAutoDepositTo} บาท`;
    } else if (depositType == MiniGameType.AccumulatedDeposit) {
        // ฝากสะสม
        showConditionGetBonus = `${depositTypeText} ครบ ${amountAutoDeposit} ภายใน ${period} วัน`;
    } else if (depositType == MiniGameType.ContinuousDeposit && depositAmountType == MiniGameAmountType.MinDeposit) {
        // ฝากติดต่อกัน ฝากขั้นต่ำ
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${minAmountAutoDeposit} บาท จำนวนครบ ${depositCount} ครั้ง ภายใน ${period} วัน`;
    } else if (depositType == MiniGameType.ContinuousDeposit && depositAmountType == MiniGameAmountType.DepositPeriod) {
        // ฝากติดต่อกัน ช่วงยอดฝาก
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${amountAutoDepositFrom} - ${amountAutoDepositTo} บาท จำนวนครบ ${depositCount} ครั้ง ภายใน ${period} วัน`;
    } else if (depositType == MiniGameType.ContinuousDeposit && depositAmountType == MiniGameAmountType.EqualDeposit) {
        // ฝากติดต่อกัน ฝากเท่ากับ
        showConditionGetBonus = `${depositTypeText} ${depositAmountTypeText} ${amountAutoDeposit} บาท จำนวนครบ ${depositCount} ครั้ง ภายใน ${period} วัน`;
    } else {
        showConditionGetBonus = "-"
    }

    $('#showConditionGetBonus').text(showConditionGetBonus);
    if (typeNow == 'mini-game') {
        $('#showNumberPartsLuckywheelType').text("Mini Game ");
        $('#showNumberPartsLuckywheel').text(customNumberPartsMinigame.getValue());
    } else {
        $('#showNumberPartsLuckywheelType').text("Lucky Wheel ");
        $('#showNumberPartsLuckywheel').text(customNumberPartsLuckywheel.getValue());
    }

    var dataluckyWheelRewardsLists = getTemplatMinigameWheelMap();
    var htmlPartsLuckywheelluckyWheelRewards = "";

    $('#showModalShowWheelDetail').html("");

    let _luckyWheelBonuses = [];
    let _sequencePie = null;

    if (sequencePie != "" || sequencePie != null) {
        _sequencePie = parseInt(sequencePie - 1);
    }

    for (let i = 0; i < dataluckyWheelRewardsLists.length; i++) {
        let collapse = "";
        let collapse2 = "";
        let luckyWheelRewardPercentage = dataluckyWheelRewardsLists[i].luckyWheelRewardPercentage;
        let sequence = dataluckyWheelRewardsLists[i].sequence;
        let rewardDescription = dataluckyWheelRewardsLists[i].rewardDescription || "";
        let isUnlimited = dataluckyWheelRewardsLists[i].isUnlimited;
        let limitAmount = dataluckyWheelRewardsLists[i].limitAmount;
        let isAlert = dataluckyWheelRewardsLists[i].isAlert;
        let alertAmount = dataluckyWheelRewardsLists[i].alertAmount;
        let luckyWheelBonuses = dataluckyWheelRewardsLists[i].luckyWheelBonuses;

        if (_sequencePie != "" || _sequencePie != null) {
            _luckyWheelBonuses = dataluckyWheelRewardsLists[_sequencePie]?.luckyWheelBonuses;
        }

        let textLimited = "";

        if (isUnlimited) {
            textLimited = `ไม่จำกัด (Infinite)`;
        } else {
            textLimited = `${limitAmount} <span class="times-tr" data-i18n='minigameSetting.count'>ครั้ง</span>`;
        }

        let textAlert = "";

        if (isAlert) {
            textAlert = "แจ้งเตือน (Alert)";
        } else {
            textAlert = "ไม่แจ้งเตือน (No Alert)";
        }
        if (i == 0) {
            collapse = "show";
        } else {
            collapse2 = "collapsed";
        }

        let textTileSeq;

        if (typeNow == 'mini-game') {
            textTileSeq = "Minigame";
        } else {
            textTileSeq = "Wheel";
        }

        htmlPartsLuckywheelluckyWheelRewards += `
                                                        <div class="row dropdown-wheel-detail ${collapse2}" type="button" data-bs-toggle="collapse" data-bs-target="#openDropdownWheelDetail${i}" aria-expanded="true" aria-controls="openDropdownWheelDetail${i}">
                                                    <div class="col-4 mb-1">
                                                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                            <div class="p2 color-emerald-title-1 fw-700">
                                                                                ${textTileSeq} ${i + 1} :
                                                            </div>
                                                            <div>
                                                                <svg width="16" height="8" viewBox="0 0 16 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2.37427 2.12485C2.37427 1.88497 2.46582 1.64497 2.64893 1.46216C3.01514 1.09595 3.6084 1.09595 3.97461 1.46216L7.99927 5.48813L12.0247 1.46216C12.3909 1.09595 12.9841 1.09595 13.3503 1.46216C13.7166 1.82837 13.7166 2.42163 13.3503 2.78784L8.66284 7.47534C8.29663 7.84155 7.70337 7.84155 7.33716 7.47534L2.64966 2.78784C2.46509 2.60474 2.37427 2.36479 2.37427 2.12485Z"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col mb-1">
                                                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                            <div class="p2 color-emerald-title-1">
                                                                <span class="bonus-description-minigame-tr" data-i18n="minigameSetting.bonusDescriptionMinigame">คำอธิบายโบนัส</span>
                                                            </div>
                                                            <div class="p2 color-emerald-title-1">
                                                                ${rewardDescription}
                                                            </div>
                                                        </div>
                                                        <div class="col collapse ${collapse}" id="openDropdownWheelDetail${i}">
                                                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div class="p2 color-emerald-title-1">
                                                                    <span class="bonus-given-to-member-tr" data-i18n="minigameSetting.bonusGivenToMember">จำนวนแจกโบนัส</span>
                                                                </div>
                                                                <div class="p2 color-emerald-title-1">
                                                                    ${textLimited}
                                                                </div>
                                                            </div>
                                                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div class="p2 color-emerald-title-1">
                                                                    <span class="bonus-noti-when-expire-tr" data-i18n="minigameSetting.bonusNotiWhenExpire">แจ้งเตือนเมื่อใกล้หมด</span>
                                                                </div>
                                                                <div class="p2 color-emerald-title-1">
                                                                    ${textAlert}
                                                                </div>
                                                            </div>
                                                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div class="p2 color-emerald-title-1">
                                                                    <span class="bonus-chance-number-tr" data-i18n="minigameSetting.bonusChanceNumber">โอกาสออก</span>
                                                                </div>
                                                                <div class="p2 color-emerald-title-1">
                                                                    ${luckyWheelRewardPercentage}%
                                                                </div>
                                                            </div>
                                                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div class="p2 color-emerald-title-1 fw-700">
                                                                    <span class="bonus-reward-tr" data-i18n="minigameSetting.bonusReward">โบนัสที่แจก</span>
                                                                </div>
                                                            </div>
                                                            `;

        if (luckyWheelBonuses.length > 0) {
            for (let x = 0; x < luckyWheelBonuses.length; x++) {
                let textIndex = `${i + 1}-${x + 1}`;
                let minigameBonuseName = $(`#minigameBonuseName-${textIndex}`).val();

                let text1 = "";
                let text2 = "";

                if (luckyWheelBonuses[x].type == "credit_fix") {
                    text1 = "Credit Fixed Rate";
                    text2 = `${luckyWheelBonuses[x].credit} baht`;
                } else if (luckyWheelBonuses[x].type == "credit_percentage") {
                    text1 = "Credit Percentage (%)";
                    text2 = `${luckyWheelBonuses[x].percent} % from deposit, Maximum ${luckyWheelBonuses[x].maxRewardPercentage} baht`;
                } else if (luckyWheelBonuses[x].type == "point") {
                    text1 = "Point";
                    text2 = `${luckyWheelBonuses[x].point} point`;
                } else if (luckyWheelBonuses[x].type == "mini-game") {
                    text1 = "Mini game coupon";
                    text2 = `${minigameBonuseName} ${luckyWheelBonuses[x].quota}`;
                } else if (luckyWheelBonuses[x].type == "lotto") {
                    text1 = "Lotto coupon"
                    text2 = `${luckyWheelBonuses[x].quota}`;
                } else if (luckyWheelBonuses[x].type == "reward") {
                    text1 = "Prize";
                    text2 = `${luckyWheelBonuses[x].rewardName}`;
                }

                htmlPartsLuckywheelluckyWheelRewards += `<div class="d-flex flex-wrap justify-content-between align-items-center">
                                                                                        <div class="p2 ms-3" style="color: #919191;">
                                                                                            ${text1}
                                                                                        </div>
                                                                                        <div class="p2" style="color: #FFFFFF;">
                                                                                            ${text2}
                                                                                        </div>
                                                                                    </div>`;
            }

            htmlPartsLuckywheelluckyWheelRewards += `</div>

                                                            </div>
                                                        </div>

                                                        <hr style="margin: 0px -28px 8px -28px;"/>
                                                `;
        }
    }

    $('#showPartsLuckywheelluckyWheelRewards').html(htmlPartsLuckywheelluckyWheelRewards);
    $(".bonus-description-minigame-tr").localize();
    $(".bonus-given-to-member-tr").localize();
    $(".times-tr").localize();
    $(".bonus-noti-when-expire-tr").localize();
    $(".bonus-chance-number-tr").localize();
    $(".bonus-reward-tr").localize();

    var htmlShowWheelDetail = "";

    if (_luckyWheelBonuses) {
        for (let x = 0; x < _luckyWheelBonuses.length; x++) {
            let textIndex = `${sequencePie}-${x + 1}`;

            let minigameBonuseName = $(`#minigameBonuseName-${textIndex}`).val();

            let _text1 = "";
            let _text2 = "";

            if (_luckyWheelBonuses[x].type == "credit_fix") {
                _text1 = "Credit Fixed Rate";
                _text2 = `${_luckyWheelBonuses[x].credit} baht`;
            } else if (_luckyWheelBonuses[x].type == "credit_percentage") {
                _text1 = "Credit Percentage";
                _text2 = `${_luckyWheelBonuses[x].percent} % from deposit, Maximum ${_luckyWheelBonuses[x].maxRewardPercentage} baht`;
            } else if (_luckyWheelBonuses[x].type == "point") {
                _text1 = "Point";
                _text2 = `${_luckyWheelBonuses[x].point} points`;
            } else if (_luckyWheelBonuses[x].type == "mini-game") {
                _text1 = `Mini game coupon - ${minigameBonuseName}`;
                _text2 = `${_luckyWheelBonuses[x].quota}`;
            } else if (_luckyWheelBonuses[x].type == "lotto") {
                _text1 = "Lotto coupon";
                _text2 = `${_luckyWheelBonuses[x].quota}`;
            } else if (_luckyWheelBonuses[x].type == "reward") {
                _text1 = "Prize";
                _text2 = `${_luckyWheelBonuses[x].rewardName}`;
            }

            let _text3 = "";

            if (x == 0) {
                _text3 = `<div class="col-12 col-lg-4 order-1 order-lg-0">
                                                    <div class="d-flex justify-content-between justify-content-lg-end gap-0 gap-md-5">
                                                        <span style="color: #ADADAD">
                                                            Get Amount
                                                        </span>
                                                        <span style="color: #6F60C2">
                                                            <div class="wheelCheckLimit"></div>
                                                        </span>
                                                    </div>
                                                </div>`
            } else {
                _text3 = `<div class="col-12 col-lg-4"></div>`
            }

            htmlShowWheelDetail += `<div class="col-12 col-lg-7">
                                                                <div class="d-flex justify-content-between">
                                                                    <span style="color: #ADADAD">
                                                                        <span>${_text1}</span>
                                                                    </span>
                                                                    <span style="width: 50%;text-align: end;color: #6F60C2">
                                                                        <span>${_text2}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            ${_text3}`;
        }
    }

    $('#showModalShowWheelDetail').html(htmlShowWheelDetail);

    //เงื่อนไขการติด Turnover
    var minigameEnableConditionTurnover = $('#minigameEnableConditionTurnover').prop('checked');
    var enableResetTime = $('#minigameEnableResetTime').prop('checked');
    var resetTimeBkk = $('#minigameResetTimeBkk').val();
    // กำหนดเงื่อนไขการติด Turnover
    var enableConditionTurnover = $('#minigameEnableConditionTurnover').prop('checked');
    var enableWithdrawConditionMinTurnover = $('#minigameEnableWithdrawConditionMinTurnover').prop('checked');
    var withdrawConditionMinTurnover = $('#minigameWithdrawConditionMinTurnover').val();
    var enableWithdrawConditionMinTurnoverCredit = $('#minigameEnableWithdrawConditionMinTurnoverCredit').prop('checked');
    var withdrawConditionMinTurnoverCredit = $('#minigameWithdrawConditionMinTurnoverCredit').val();

    var minigameWithdrawConditionMinTurnoverMinCredit = $('#minigameWithdrawConditionMinTurnoverMinCredit').val();
    var disableMinTurnOverMinCredit = $('#disableMinTurnOverMinCredit').prop('checked');

    // เงื่อนไขการติด Turnover
    if (enableConditionTurnover) {
        $('#showEnableConditionTurnoverActive').show();
        $('#showEnableConditionTurnoverInactive').hide();
    } else {
        $('#showEnableConditionTurnoverActive').hide();
        $('#showEnableConditionTurnoverInactive').show();
    }

    if (enableWithdrawConditionMinTurnover) {
        $('#showEnableWithdrawConditionMinTurnover').show();
        $('#showEnableWithdrawConditionMinTurnoverCredit').hide();

        $('#showWithdrawConditionMinTurnover').show();
        $('#showEnableWithdrawConditionMinTurnoverCredit').hide();
        $('#showWithdrawConditionMinTurnoverText').text(`${withdrawConditionMinTurnover}`);
    } else {
        $('#showEnableWithdrawConditionMinTurnover').hide();
        $('#showEnableWithdrawConditionMinTurnoverCredit').show();

        $('#showWithdrawConditionMinTurnover').hide();
        $('#showEnableWithdrawConditionMinTurnoverCredit').show();
        $('#showEnableWithdrawConditionMinTurnoverCreditText').text(`${withdrawConditionMinTurnoverCredit}`);
    }
    // กำหนดเงื่อนไขการถอนเงิน
    var enableWithdrawCondition = $('#minigameEnableWithdrawCondition').prop('checked');
    var enableWithdrawConditionMinRemainCredit = $('#minigameEnableCreditRemain').prop('checked');
    var withdrawConditionMinRemainCredit = $('#minigameCreditRemain').val();
    var enableWithdrawConditionMaxWithdraw = $('#minigameEnableMaxWithdraw').prop('checked');
    var withdrawConditionMaxWithdraw = $('#minigameMaxWithdraw').val();
    var enableSetZeroCreditAfterWithdraw = $('#minigameEnableDeductCreditAll').prop('checked');
    var enableCloseAutoWithdraw = $('#minigameDisableAutoWithdraw').prop('checked');
    // เงื่อนไขการถอน
    if (enableWithdrawCondition) {
        $('#showEnableWithdrawConditionActive').show();
        $('#showEnableWithdrawConditionInactive').hide();
    } else {
        $('#showEnableWithdrawConditionActive').hide();
        $('#showEnableWithdrawConditionInactive').show();
    }
    // ยอดเครดิตคงเหลือขั้นต่ำ x บาท
    if (enableWithdrawConditionMinRemainCredit) {
        $('#showEnableWithdrawConditionMinRemainCreditActive').show();
        $('#showEnableWithdrawConditionMinRemainCreditInactive').hide();
    } else {
        $('#showEnableWithdrawConditionMinRemainCreditActive').hide();
        $('#showEnableWithdrawConditionMinRemainCreditInactive').show();
    }

    if (withdrawConditionMinRemainCredit != "" && withdrawConditionMinRemainCredit != null) {
        $('#showWithdrawConditionMinRemainCreditActive').show();
        $('#showWithdrawConditionMinRemainCreditInactive').hide();
        $('#showWithdrawConditionMinRemainCreditActive').text(`${withdrawConditionMinRemainCredit} บาท`);
    } else {
        $('#showWithdrawConditionMinRemainCreditActive').hide();
        $('#showWithdrawConditionMinRemainCreditInactive').show();
    }

    // ถอนสูงสุดไม่เกินจำนวนที่กำหนด
    if (enableWithdrawConditionMaxWithdraw) {
        $('#showEnableWithdrawConditionMaxWithdrawActive').show();
        $('#showEnableWithdrawConditionMaxWithdrawInactive').hide();
    } else {
        $('#showEnableWithdrawConditionMaxWithdrawActive').hide();
        $('#showEnableWithdrawConditionMaxWithdrawInactive').show();
    }

    if (withdrawConditionMaxWithdraw != "" && withdrawConditionMaxWithdraw != null) {
        $('#showWithdrawConditionMaxWithdrawActive').show();
        $('#showWithdrawConditionMaxWithdrawInactive').hide();
        $('#showWithdrawConditionMaxWithdrawActive').text(`${withdrawConditionMaxWithdraw} บาท`);
    } else {
        $('#showWithdrawConditionMaxWithdrawActive').hide();
        $('#showWithdrawConditionMaxWithdrawInactive').show();
    }

    // หักเครดิตที่เหลือทั้งหมดเมื่อทำการถอน
    if (enableSetZeroCreditAfterWithdraw) {
        $('#showEnableSetZeroCreditAfterWithdrawActive').show();
        $('#showEnableSetZeroCreditAfterWithdrawInactive').hide();
    } else {
        $('#showEnableSetZeroCreditAfterWithdrawActive').hide();
        $('#showEnableSetZeroCreditAfterWithdrawInactive').show();
    }

    // ไม่อนุญาตให้ถอนอัตโนมัติ เมื่อสมาชิกรับโปรโมชั่น
    if (enableCloseAutoWithdraw) {
        $('#showEnableCloseAutoWithdrawActive').show();
        $('#showEnableCloseAutoWithdrawInactive').hide();
    } else {
        $('#showEnableCloseAutoWithdrawActive').hide();
        $('#showEnableCloseAutoWithdrawInactive').show();
    }
    // กำหนดเงื่อนไขการปลดเทิร์น (หลุดโปร)
    var enableCreditToClearTurnover = $('#minigameEnableCreditToClearTurnover').prop('checked');
    var enableMaxRemainCreditToClearTurnover = $('#minigameEnableMaxRemainCreditToClearTurnover').prop('checked');
    var maxRemainCreditToClearTurnover = $('#minigameMaxRemainCreditToClearTurnover').val();
    var enableMaxRemainCreditToClearTurnoverPercentage = $('#minigameEnableMaxRemainCreditToClearTurnoverPercentage').prop('checked');
    var maxRemainCreditToClearTurnoverPercentage = $('#minigameMaxRemainCreditToClearTurnoverPercentage').val();

    // กำหนดเงื่อนไขการเพิ่มทุน
    var enableIncreaseTurnOver = $('#minigameEnableIncreaseTurnOver').prop('checked');
    var enableTurnOverDeposit = $('#minigameEnableTurnOverDeposit').prop('checked');
    var enableMinTurnover = $('#minigameEnableMinTurnover').prop('checked');
    var minTurnover = $('#minigameMinTurnover').val();
    var enableMinTurnoverCredit = $('#minigameEnableMinTurnoverCredit').prop('checked');
    var minTurnoverCredit = $('#minigameminTurnoverCredit').val();
    // เงื่อนไขการหลุดโปร
    if (enableCreditToClearTurnover) {
        $('#showEnableCreditToClearTurnoverActive').show();
        $('#showEnableCreditToClearTurnoverInactive').hide();
    } else {
        $('#showEnableCreditToClearTurnoverActive').hide();
        $('#showEnableCreditToClearTurnoverInactive').show();
    }

    // รูปแบบการหลุดโปร
    if (enableMaxRemainCreditToClearTurnover) {
        $('#showEnableMaxRemainCreditToClearTurnover').show();
        $('#showEnableMaxRemainCreditToClearTurnoverPercentage').hide();

        $('#showMaxRemainCreditToClearTurnover').show();
        $('#showMaxRemainCreditToClearTurnoverPercentage').hide();
        $('#showMaxRemainCreditToClearTurnover').text(`${maxRemainCreditToClearTurnover}`);
    } else {
        $('#showEnableMaxRemainCreditToClearTurnover').hide();
        $('#showEnableMaxRemainCreditToClearTurnoverPercentage').show();

        $('#showMaxRemainCreditToClearTurnover').hide();
        $('#showMaxRemainCreditToClearTurnoverPercentage').show();
        $('#showMaxRemainCreditToClearTurnoverPercentage').text(`${maxRemainCreditToClearTurnoverPercentage} %`);
    }

    // เงื่อนไขการเพิ่มทุน
    if (enableIncreaseTurnOver) {
        $('#showEnableIncreaseTurnOverActive').show();
        $('#showEnableIncreaseTurnOverInactive').hide();
    } else {
        $('#showEnableIncreaseTurnOverActive').hide();
        $('#showEnableIncreaseTurnOverInactive').show();
    }

    // รูปแบบการเพิ่มทุน
    if ($('#minigameEnableTurnOverDepositOn').prop('checked')) {
        $('#showEnableIncreaseTurnOver').hide();

        if ($('#minigameEnableMinTurnover').prop('checked')) {
            $('#showEnableMinTurnover').show();
            $('#showEnableMinTurnoverCredit').hide();

            $('#showMinTurnover').show();
            $('#showMinTurnoverCredit').hide();
            $('#showMinTurnover').text(`${minTurnover}`);
        } else {
            $('#showEnableMinTurnover').hide();
            $('#showEnableMinTurnoverCredit').show();

            $('#showMinTurnover').hide();
            $('#showMinTurnoverCredit').show();
            $('#showMinTurnoverCredit').text(`${minTurnoverCredit}`);
        }
    } else {
        $('#showEnableIncreaseTurnOver').show();
        $('#showEnableMinTurnover').hide();
        $('#showMinTurnover').hide();
        $('#showEnableMinTurnoverCredit').hide();
        $('#showMinTurnoverCredit').hide();
    }


    if (typeNow != 'mini-game' && actionNow === 'detail') {
        let cloneTemplate = $('#wheelShow1').clone();

        cloneWheelMain = cloneTemplate.html();
        cloneWheelMain = $(cloneWheelMain);
        $('#showStepEnd').removeClass('preview-minigame');
        $('#showStepEnd').html(cloneWheelMain);
    }
}

// Swal ยันยัน โปรโมชั่น
async function openConfirmUpdatePromotionSwal(type) {
    const fs = async (swal) => {
        try {
            swal.closeImmediately(false);
            await createPromotion(type);
        } catch (e) {
        }

        return true;
    };
    if (type == "create") {
        confirmSavePromotionSwal.open({
            type: 'saving',
            title: 'ยืนยันการสร้างข้อมูลมินิเกมส์หรือไม่ ?',
            text: `ระบบจะทำการบันทึกข้อมูลที่คุณได้ทำการสร้างใหม่ทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ สร้างนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา`,
            ajaxConfirm: fs
        });
    } else {
        confirmSavePromotionSwal.open({
            type: 'saving',
            title: 'ยืนยันการแก้ไขข้อมูลมินิเกมส์หรือไม่?',
            text: `ระบบจะทำการเปลี่ยนแปลงข้อมูลที่คุณได้ทำการแก้ไขไว้ล่าสุดทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ แก้ไขนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา`,
            ajaxConfirm: fs
        });
    }
}

const createPromotion = async (action) => {
    $("#openConfirmUpdatePromotionSwal").hide();
    let payload = {};
    let payloadImg = {}; let payloadImgRewards = {};
    var uploadImg = []; var uploadImgRewards = [];
    if (typeNow == 'mini-game') {
        uploadImg.push(
            ["imgMinigamePopup", null],
            ["imgMinigameReward", null]
        );
    } else {
        uploadImg.push(
            ["luckywheelSpinBtn", null],
            ["luckywheelFrame", null],
            ["luckywheelGetReward", null]
        );
        for (let i = 0; i < templatMinigameWheelMap.size; i++) {
            uploadImgRewards.push([`luckywheelWheel${i + 1}`, null]);
        }
    }

    let uploadSuccess = true;

    for (let i = 0; i < uploadImg.length; i++) {
        if (element = $('#' + uploadImg[i][0])) {
            const input = element.get(0);
            const formData = new FormData();
            if (input.files.length != 0) {
                formData.append('file', input.files[0]);
                formData.append('directory', "setting-minigame");
                const responseUpload = await $.ajax({
                    url: uploadUrl,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false
                });

                if (responseUpload.message !== 'Success') {
                    uploadSuccess = false;
                } else {
                    payloadImg[uploadImg[i][0]] = responseUpload.data.url;
                    uploadImg[i][1] = responseUpload.data.url;
                    uploadSuccess = true;
                }
            } else {
                payloadImg[uploadImg[i][0]] = $(`.${uploadImg[i][0]}Src`).eq(0).attr("src");
            }
        }
    }

    if (!uploadSuccess) {
        customSwal.open({
            type: 'danger',
            title: 'ทำรายการไม่สำเร็จ !',
            showConfirmButton: false,
            cancelText: 'ปิดหน้าต่าง',
            text: `พบปัญหาในการบันทึกข้อมูล อัปโหลดไฟล์ไม่สำเร็จ`
        });
        return;
    }
    for (let i = 0; i < uploadImgRewards.length; i++) {
        if (element = $('#' + uploadImgRewards[i][0])) {
            const input = element.get(0);
            const formData = new FormData();
            if (input.files.length != 0) {
                formData.append('file', input.files[0]);
                formData.append('directory', "setting-minigame");
                const responseUpload = await $.ajax({
                    url: uploadUrl,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false
                });

                if (responseUpload.message !== 'Success') {
                    uploadSuccess = false;
                } else {
                    payloadImgRewards[i] = responseUpload.data.url;
                    uploadImgRewards[i][1] = responseUpload.data.url;
                    uploadSuccess = true;
                }
            } else {
                payloadImgRewards[i] = $(`.${uploadImgRewards[i][0]}Src`).eq(0).attr("src");
            }
        }
    }

    if (!uploadSuccess) {
        customSwal.open({
            type: 'danger',
            title: 'ทำรายการไม่สำเร็จ !',
            showConfirmButton: false,
            cancelText: 'ปิดหน้าต่าง',
            text: `พบปัญหาในการบันทึกข้อมูล อัปโหลดไฟล์ไม่สำเร็จ`
        });
        return;
    }

    //console.log('payloadStep1')
    // Step 1
    payload.name = $('#minigameName').val();
    payload.status = $('#minigameStatus').prop('checked') ? "active" : "inactive";
    payload.conditionHtml = conditionHtml.getData();
    //console.log('conditionHtml', payload.conditionHtml)
    if (typeNow == 'mini-game') {
        payload.enableIfNotHaveMiniGame = $('#enableIfNotHaveLuckyWheel').prop('checked');
        payload.isReceiveBefore = $('input[name="turnOverBeforeOrAfterMiniGame"]:checked').val();
        payload.calculateType = '-';
    } else {
        payload.enableIfNotHaveLuckyWheel = $('#enableIfNotHaveLuckyWheel').prop('checked');
        payload.isReceiveBefore = $('input[name="turnOverBeforeOrAfterLuckyWheel"]:checked').val();
    }

    var nameArr = [];
    var conditionArr = [];
    var multiLanguageData = [];
    $('[data-name-lang]').each(function () {
        var code = $(this).attr("data-name-lang");
        var name = $(this).val();
        var multiLanguageDataName = {};
        multiLanguageDataName.Language = code;
        multiLanguageDataName.Name = name;
        nameArr.push(multiLanguageDataName);
    });
    $('[data-condition-lang]').each(function () {
        var code = $(this).attr("data-condition-lang");
        var multiLanguageDataCondition = {};
        var condition = null;
        if (code == "en") {
            condition = conditionHtmlEn.getData();
        }
        if (code == "tl") {
            condition = conditionHtmlTl.getData();
        }
        multiLanguageDataCondition.Language = code;
        multiLanguageDataCondition.ConditionHtml = condition;
        conditionArr.push(multiLanguageDataCondition);
    });

    for (var i = 0; i < nameArr.length; i++) {
        for (var j = 0; j < conditionArr.length; j++) {
            if (nameArr[i].Language == conditionArr[j].Language) {
                var objPayload = {};
                objPayload.Language = conditionArr[j].Language;
                objPayload.Name = nameArr[i].Name;
                objPayload.ConditionHtml = conditionArr[j].ConditionHtml;
                multiLanguageData.push(objPayload);
            }
        }
    }

    payload.iconUrl = $('#imageIconUrl').val();
    payload.languageSelected = $('.multi-lang-selected').attr("lang-select-btn");
    payload.miniGameMultiLanguages = multiLanguageData;

    payload.enableStartEndDate = $('#minigameEnableStartEndDate').prop('checked');
    payload.startDate = changeDateFormatToInt($('#startDateSettingMinigameFromInput').val());
    payload.endDate = changeDateFormatToInt($('#endDateSettingMinigameFromInput').val());
    payload.startTime = $('#startTimeSettingMinigameInput').val();
    payload.endTime = $('#endTimeSettingMinigameInput').val();

    payload.enableHiddenTime = $('#enableHiddenTime').prop('checked') ? true : false;

    if (typeNow == 'mini-game') {
        payload.miniGameWorkingDays = {};
        payload.miniGameWorkingDays.enableSunday = hiddenActiveEnableSunday;
        payload.miniGameWorkingDays.enableMonday = hiddenActiveEnableMonday;
        payload.miniGameWorkingDays.enableTuesday = hiddenActiveEnableTuesday;
        payload.miniGameWorkingDays.enableWednesday = hiddenActiveEnableWednesday;
        payload.miniGameWorkingDays.enableThursday = hiddenActiveEnableThursday;
        payload.miniGameWorkingDays.enableFriday = hiddenActiveEnableFriday;
        payload.miniGameWorkingDays.enableSaturday = hiddenActiveEnableSaturday;
        payload.miniGameTimes = getTemplateMinigameDatetime();
    } else {
        payload.luckyWheelWorkingDays = {};
        payload.luckyWheelWorkingDays.enableSunday = hiddenActiveEnableSunday;
        payload.luckyWheelWorkingDays.enableMonday = hiddenActiveEnableMonday;
        payload.luckyWheelWorkingDays.enableTuesday = hiddenActiveEnableTuesday;
        payload.luckyWheelWorkingDays.enableWednesday = hiddenActiveEnableWednesday;
        payload.luckyWheelWorkingDays.enableThursday = hiddenActiveEnableThursday;
        payload.luckyWheelWorkingDays.enableFriday = hiddenActiveEnableFriday;
        payload.luckyWheelWorkingDays.enableSaturday = hiddenActiveEnableSaturday;
        payload.luckyWheelTimes = getTemplateMinigameDatetime();
    }

    if (typeNow == 'mini-game') {
        payload.miniGameCountDowns = {};
        payload.miniGameCountDowns.enableCountDown = $('#changeMinigameEnableCountDown').prop('checked');
        payload.miniGameCountDowns.enableCountDownCreated = $('#minigameEnableCountDownCreated').prop('checked');
        payload.miniGameCountDowns.enableCountDownSetTime = $('#minigameEnableCountDownSetTime').prop('checked');
        payload.miniGameCountDowns.enableRemainingDay = $('#minigameEnableRemainingDay').prop('checked');
        payload.miniGameCountDowns.remainingDay = $('#minigameCountdownRemainingDay').val() || 0;
        payload.miniGameCountDowns.enableRemainingDateTime = $('#minigameEnableRemainingDateTime').prop('checked');
        payload.miniGameCountDowns.remainingDateBkk = $('#minigameCountdownRemainingDateBkk').val() || "";
        payload.miniGameCountDowns.remainingTimeBkk = $('#minigameCountdownRemainingTimeBkk').val() || "";
        payload.miniGameCountDowns.countDownColorCode = $('input[name="minigameCountDownColorCodeRadio"]:checked').val() || "";
    } else {
        payload.luckyWheelCountDowns = {};
        payload.luckyWheelCountDowns.enableCountDown = $('#changeMinigameEnableCountDown').prop('checked');
        payload.luckyWheelCountDowns.enableCountDownCreated = $('#minigameEnableCountDownCreated').prop('checked');
        payload.luckyWheelCountDowns.enableCountDownSetTime = $('#minigameEnableCountDownSetTime').prop('checked');
        payload.luckyWheelCountDowns.enableRemainingDay = $('#minigameEnableRemainingDay').prop('checked');
        payload.luckyWheelCountDowns.remainingDay = $('#minigameCountdownRemainingDay').val() || 0;
        payload.luckyWheelCountDowns.enableRemainingDateTime = $('#minigameEnableRemainingDateTime').prop('checked');
        payload.luckyWheelCountDowns.remainingDateBkk = $('#minigameCountdownRemainingDateBkk').val() || "";
        payload.luckyWheelCountDowns.remainingTimeBkk = $('#minigameCountdownRemainingTimeBkk').val() || "";
        payload.luckyWheelCountDowns.countDownColorCode = $('input[name="minigameCountDownColorCodeRadio"]:checked').val() || "";
    }

    payload.enableMaxRedeemPerDeposit = $('#minigameEnableMaxCountPerTimePerPerson').prop('checked');
    payload.maxRedeemPerDeposit = $('#minigameMaxCountPerTimePerPerson').val() || 0;

    if (typeNow == 'mini-game') {
        payload.miniGameLimitPromotions = {};
        payload.miniGameLimitPromotions.enableMaxPromotion = $('#minigameEnableMaxPromotion').prop('checked');
        payload.miniGameLimitPromotions.enableMaxCountPerDay = $('#minigameEnableMaxCountPerDay').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerDay = $('#minigameMaxCountPerDay').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerWeek = $('#minigameEnableMaxCountPerWeek').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerWeek = $('#minigameMaxCountPerWeek').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerMonth = $('#minigameEnableMaxCountPerMonth').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerMonth = $('#minigameMaxCountPerMonth').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerPromotion = $('#minigameEnableMaxCountPerPromotion').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerPromotion = $('#minigameMaxCountPerPromotion').val() || 0;
        payload.miniGameLimitPromotions.enableMaxPromotionPerPerson = $('#minigameEnableMaxPromotionPerPerson').prop('checked');
        payload.miniGameLimitPromotions.enableMaxCountPerDayPerPerson = $('#minigameEnableMaxCountPerDayPerPerson').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerDayPerPerson = $('#minigameMaxCountPerDayPerPerson').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerWeekPerPerson = $('#minigameEnableMaxCountPerWeekPerPerson').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerWeekPerPerson = $('#minigameMaxCountPerWeekPerPerson').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerMonthPerPerson = $('#minigameEnableMaxCountPerMonthPerPerson').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerMonthPerPerson = $('#minigameMaxCountPerMonthPerPerson').val() || 0;
        payload.miniGameLimitPromotions.enableMaxCountPerPerson = $('#minigameEnableMaxCountPerPerson').prop('checked');
        payload.miniGameLimitPromotions.maxCountPerPerson = $('#minigameMaxCountPerPerson').val() || 0;
    } else {
        payload.luckyWheelLimitPromotions = {};
        payload.luckyWheelLimitPromotions.enableMaxPromotion = $('#minigameEnableMaxPromotion').prop('checked');
        payload.luckyWheelLimitPromotions.enableMaxCountPerDay = $('#minigameEnableMaxCountPerDay').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerDay = $('#minigameMaxCountPerDay').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerWeek = $('#minigameEnableMaxCountPerWeek').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerWeek = $('#minigameMaxCountPerWeek').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerMonth = $('#minigameEnableMaxCountPerMonth').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerMonth = $('#minigameMaxCountPerMonth').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerPromotion = $('#minigameEnableMaxCountPerPromotion').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerPromotion = $('#minigameMaxCountPerPromotion').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxPromotionPerPerson = $('#minigameEnableMaxPromotionPerPerson').prop('checked');
        payload.luckyWheelLimitPromotions.enableMaxCountPerDayPerPerson = $('#minigameEnableMaxCountPerDayPerPerson').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerDayPerPerson = $('#minigameMaxCountPerDayPerPerson').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerWeekPerPerson = $('#minigameEnableMaxCountPerWeekPerPerson').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerWeekPerPerson = $('#minigameMaxCountPerWeekPerPerson').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerMonthPerPerson = $('#minigameEnableMaxCountPerMonthPerPerson').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerMonthPerPerson = $('#minigameMaxCountPerMonthPerPerson').val() || 0;
        payload.luckyWheelLimitPromotions.enableMaxCountPerPerson = $('#minigameEnableMaxCountPerPerson').prop('checked');
        payload.luckyWheelLimitPromotions.maxCountPerPerson = $('#minigameMaxCountPerPerson').val() || 0;
    }

    //console.log('payloadStep2.3')
    // Step 2.3

    if (typeNow == 'mini-game') {
        payload.miniGameResets = {};
        payload.miniGameResets.enableReset = $('#minigameEnableReset').prop('checked');
        payload.miniGameResets.enableResetExpired = $('#minigameEnableResetExpired').prop('checked');
        payload.miniGameResets.enableResetTime = $('#minigameEnableResetTime').prop('checked');
        payload.miniGameResets.resetTimeBkk = $('#minigameResetTimeBkk').val() || '';
        payload.miniGameResets.enableResetDateTime = $('#minigameEnableResetDateTime').prop('checked');
        payload.miniGameResets.day = $('#minigameResetDay').val() || 0;
        payload.miniGameResets.hour = $('#minigameResetHour').val() || 0;
        payload.miniGameResets.minute = $('#minigameResetMinute').val() || 0;
    } else {
        payload.luckyWheelResets = {};
        payload.luckyWheelResets.enableReset = $('#minigameEnableReset').prop('checked');
        payload.luckyWheelResets.enableResetExpired = $('#minigameEnableResetExpired').prop('checked');
        payload.luckyWheelResets.enableResetTime = $('#minigameEnableResetTime').prop('checked');
        payload.luckyWheelResets.resetTimeBkk = $('#minigameResetTimeBkk').val() || '';
        payload.luckyWheelResets.enableResetDateTime = $('#minigameEnableResetDateTime').prop('checked');
        payload.luckyWheelResets.day = $('#minigameResetDay').val() || 0;
        payload.luckyWheelResets.hour = $('#minigameResetHour').val() || 0;
        payload.luckyWheelResets.minute = $('#minigameResetMinute').val() || 0;
    }

    if (typeNow == 'mini-game') {
        payload.miniGameRemoveChances = getTemplateMinigameRemoveChance();
    } else {
        payload.luckyWheelRemoveChances = getTemplateMinigameRemoveChance();
    }
    payload.enableRemoveChance = $('#minigameEnableRemoveChance').prop('checked');

    if (typeNow == 'mini-game') {
        payload.miniGameFixChances = {};
        payload.miniGameFixChances.enableFixChance = $('#minigameEnableFixChance').prop('checked');
        payload.miniGameFixChances.enableLimitPerGamePerDay = $('#minigameEnableLimitPerGamePerDay').prop('checked');
        payload.miniGameFixChances.limitPerGamePerDay = $('#minigameLimitPerGamePerDay').val() || 0;
        payload.miniGameFixChances.enableLimitPerPerson = $('#minigameEnableLimitPerPerson').prop('checked');
        payload.miniGameFixChances.limitPerPerson = $('#minigameLimitPerPerson').val() || 0;
        payload.miniGameFixChances.enableLimitBalance = $('#minigameEnableLimitBalance').prop('checked');
        payload.miniGameFixChances.limitBalance = $('#minigameLimitBalance').val() || 0;

        payload.miniGameFixChances.enableCreditBalance = $('#enableCreditBalance').prop('checked') ? true : false;
        payload.miniGameFixChances.creditBalance = $('#creditBalance').val() || 0;
    } else {
        payload.luckyWheelFixChances = {};
        payload.luckyWheelFixChances.enableFixChance = $('#minigameEnableFixChance').prop('checked');
        payload.luckyWheelFixChances.enableLimitPerGamePerDay = $('#minigameEnableLimitPerGamePerDay').prop('checked');
        payload.luckyWheelFixChances.limitPerGamePerDay = $('#minigameLimitPerGamePerDay').val() || 0;
        payload.luckyWheelFixChances.enableLimitPerPerson = $('#minigameEnableLimitPerPerson').prop('checked');
        payload.luckyWheelFixChances.limitPerPerson = $('#minigameLimitPerPerson').val() || 0;
        payload.luckyWheelFixChances.enableLimitBalance = $('#minigameEnableLimitBalance').prop('checked');
        payload.luckyWheelFixChances.limitBalance = $('#minigameLimitBalance').val() || 0;

        payload.luckyWheelFixChances.enableCreditBalance = $('#enableCreditBalance').prop('checked') ? true : false;
        payload.luckyWheelFixChances.creditBalance = $('#creditBalance').val() || 0;
    }
    if (typeNow == 'mini-game') {
        payload.miniGameAutoDeposits = {};
        payload.miniGameAutoDeposits.depositType = customMinigameDepositTypeDropdown.getValue();
        payload.miniGameAutoDeposits.depositAmountType = customMinigameDepositAmountTypeDropdown.getValue();
        payload.miniGameAutoDeposits.minAmountAutoDeposit = $('#minigameMinAmountAutoDeposit').val() || 0;
        payload.miniGameAutoDeposits.maxAmountAutoDeposit = $('#minigameMaxAmountAutoDeposit').val() || 0;
        payload.miniGameAutoDeposits.amountAutoDeposit = $('#minigameAmountAutoDeposit').val() || 0;
        payload.miniGameAutoDeposits.amountAutoDepositFrom = $('#minigameAmountAutoDepositFrom').val() || 0;
        payload.miniGameAutoDeposits.amountAutoDepositTo = $('#minigameAmountAutoDepositTo').val() || 0;
        payload.miniGameAutoDeposits.period = $('#minigameDepositPeriod').val() || 0;
        payload.miniGameAutoDeposits.depositCount = $('#minigameDepositCount').val() || 0;
        payload.miniGameAutoDeposits.isMemberCanCancel = $('#isMemberCanCancel').prop('checked') ? true : false;
        payload.miniGameAutoDeposits.isMemberPromotionSuccess = $('#isMemberPromotionSuccess').prop('checked') ? true : false;

        let miniGameRewards = getTemplatMinigameMap();
        miniGameRewards = miniGameRewards.map(reward => {
            return {
                ...reward,
                MiniGameRewardImageUrl: payloadImg.imgMinigameReward,
            };
        });
        payload.miniGameRewards = miniGameRewards;

    } else {
        payload.luckyWheelAutoDeposits = {};
        payload.luckyWheelAutoDeposits.depositType = customMinigameDepositTypeDropdown.getValue();
        payload.luckyWheelAutoDeposits.depositAmountType = customMinigameDepositAmountTypeDropdown.getValue();
        payload.luckyWheelAutoDeposits.minAmountAutoDeposit = $('#minigameMinAmountAutoDeposit').val() || 0;
        payload.luckyWheelAutoDeposits.maxAmountAutoDeposit = $('#minigameMaxAmountAutoDeposit').val() || 0;
        payload.luckyWheelAutoDeposits.amountAutoDeposit = $('#minigameAmountAutoDeposit').val() || 0;
        payload.luckyWheelAutoDeposits.amountAutoDepositFrom = $('#minigameAmountAutoDepositFrom').val() || 0;
        payload.luckyWheelAutoDeposits.amountAutoDepositTo = $('#minigameAmountAutoDepositTo').val() || 0;
        payload.luckyWheelAutoDeposits.period = $('#minigameDepositPeriod').val() || 0;
        payload.luckyWheelAutoDeposits.depositCount = $('#minigameDepositCount').val() || 0;
        payload.luckyWheelAutoDeposits.isMemberCanCancel = $('#isMemberCanCancel').prop('checked') ? true : false;
        payload.luckyWheelAutoDeposits.isMemberPromotionSuccess = $('#isMemberPromotionSuccess').prop('checked') ? true : false;

        let luckyWheelRewards = getTemplatMinigameWheelMap();
        luckyWheelRewards = luckyWheelRewards.map((reward, index) => {
            return {
                ...reward,
                luckyWheelRewardImageUrl: payloadImgRewards[index] || null
            };
        });

        payload.luckyWheelRewards = luckyWheelRewards;

    }

    if (typeNow == 'mini-game') {
        payload.miniGameTurnoverConditions = {};
        payload.miniGameTurnoverConditions.enableConditionTurnover = $('#minigameEnableConditionTurnover').prop('checked');
        payload.miniGameTurnoverConditions.enableWithdrawConditionMinTurnover = $('#minigameEnableWithdrawConditionMinTurnover').prop('checked');
        payload.miniGameTurnoverConditions.withdrawConditionMinTurnover = $('#minigameWithdrawConditionMinTurnover').val() || 0;
        payload.miniGameTurnoverConditions.enableWithdrawConditionMinTurnoverCredit = $('#minigameEnableWithdrawConditionMinTurnoverCredit').prop('checked');
        payload.miniGameTurnoverConditions.withdrawConditionMinTurnoverCredit = $('#minigameWithdrawConditionMinTurnoverCredit').val() || 0;
        payload.miniGameTurnoverConditions.enableCreditToClearTurnover = $('#minigameEnableCreditToClearTurnover').prop('checked');
        payload.miniGameTurnoverConditions.enableMaxRemainCreditToClearTurnover = $('#minigameEnableMaxRemainCreditToClearTurnover').prop('checked');
        payload.miniGameTurnoverConditions.maxRemainCreditToClearTurnover = $('#minigameMaxRemainCreditToClearTurnover').val() || 0;
        payload.miniGameTurnoverConditions.enableMaxRemainCreditToClearTurnoverPercentage = $('#minigameEnableMaxRemainCreditToClearTurnoverPercentage').prop('checked');
        payload.miniGameTurnoverConditions.maxRemainCreditToClearTurnoverPercentage = $('#minigameMaxRemainCreditToClearTurnoverPercentage').val() || 0;
        payload.miniGameTurnoverConditions.enableIncreaseTurnOver = $('#minigameEnableIncreaseTurnOver').prop('checked');
        payload.miniGameTurnoverConditions.enableTurnOverDeposit = $('#minigameEnableTurnOverDepositOn').prop('checked');
        payload.miniGameTurnoverConditions.enableMinTurnover = $('#minigameEnableMinTurnover').prop('checked');
        payload.miniGameTurnoverConditions.minTurnover = $('#minigameMinTurnover').val() || 0;
        payload.miniGameTurnoverConditions.enableMinTurnoverCredit = $('#minigameEnableMinTurnoverCredit').prop('checked');
        payload.miniGameTurnoverConditions.minTurnoverCredit = $('#minigameminTurnoverCredit').val() || 0;
        payload.miniGameTurnoverConditions.enableTurnoverPeriodSetting = $('input[name="minigameTurnoverPeriodSettingRadio"]:checked').val();
        payload.miniGameTurnoverConditions.turnOverPeriodHours = $('#inputMinigameTurnOverHours').val();
        payload.miniGameTurnoverConditions.withdrawConditionMinTurnoverMinCredit = $('#minigameWithdrawConditionMinTurnoverMinCredit').val() || 0;
        payload.miniGameTurnoverConditions.disableMinTurnOverMinCredit = $('#disableMinTurnOverMinCredit').prop('checked');
    } else {
        payload.luckyWheelTurnoverConditions = {};
        payload.luckyWheelTurnoverConditions.enableConditionTurnover = $('#minigameEnableConditionTurnover').prop('checked');
        payload.luckyWheelTurnoverConditions.enableWithdrawConditionMinTurnover = $('#minigameEnableWithdrawConditionMinTurnover').prop('checked');
        payload.luckyWheelTurnoverConditions.withdrawConditionMinTurnover = $('#minigameWithdrawConditionMinTurnover').val() || 0;
        payload.luckyWheelTurnoverConditions.enableWithdrawConditionMinTurnoverCredit = $('#minigameEnableWithdrawConditionMinTurnoverCredit').prop('checked');
        payload.luckyWheelTurnoverConditions.withdrawConditionMinTurnoverCredit = $('#minigameWithdrawConditionMinTurnoverCredit').val() || 0;
        payload.luckyWheelTurnoverConditions.enableCreditToClearTurnover = $('#minigameEnableCreditToClearTurnover').prop('checked');
        payload.luckyWheelTurnoverConditions.enableMaxRemainCreditToClearTurnover = $('#minigameEnableMaxRemainCreditToClearTurnover').prop('checked');
        payload.luckyWheelTurnoverConditions.maxRemainCreditToClearTurnover = $('#minigameMaxRemainCreditToClearTurnover').val() || 0;
        payload.luckyWheelTurnoverConditions.enableMaxRemainCreditToClearTurnoverPercentage = $('#minigameEnableMaxRemainCreditToClearTurnoverPercentage').prop('checked');
        payload.luckyWheelTurnoverConditions.maxRemainCreditToClearTurnoverPercentage = $('#minigameMaxRemainCreditToClearTurnoverPercentage').val() || 0;
        payload.luckyWheelTurnoverConditions.enableIncreaseTurnOver = $('#minigameEnableIncreaseTurnOver').prop('checked');
        payload.luckyWheelTurnoverConditions.enableTurnOverDeposit = $('#minigameEnableTurnOverDepositOn').prop('checked');
        payload.luckyWheelTurnoverConditions.enableMinTurnover = $('#minigameEnableMinTurnover').prop('checked');
        payload.luckyWheelTurnoverConditions.minTurnover = $('#minigameMinTurnover').val() || 0;
        payload.luckyWheelTurnoverConditions.enableMinTurnoverCredit = $('#minigameEnableMinTurnoverCredit').prop('checked');
        payload.luckyWheelTurnoverConditions.minTurnoverCredit = $('#minigameminTurnoverCredit').val() || 0;
        payload.luckyWheelTurnoverConditions.enableTurnoverPeriodSetting = $('input[name="minigameTurnoverPeriodSettingRadio"]:checked').val();
        payload.luckyWheelTurnoverConditions.turnOverPeriodHours = $('#inputMinigameTurnOverHours').val();
        payload.luckyWheelTurnoverConditions.withdrawConditionMinTurnoverMinCredit = $('#minigameWithdrawConditionMinTurnoverMinCredit').val() || 0;
        payload.luckyWheelTurnoverConditions.disableMinTurnOverMinCredit = $('#disableMinTurnOverMinCredit').prop('checked');
    }

    if (typeNow == 'mini-game') {
        payload.miniGameWithdrawConditions = {};
        payload.miniGameWithdrawConditions.enableWithdrawCondition = $('#minigameEnableWithdrawCondition').prop('checked');
        payload.miniGameWithdrawConditions.enableCreditRemain = $('#minigameEnableCreditRemain').prop('checked');
        payload.miniGameWithdrawConditions.creditRemain = $('#minigameCreditRemain').val() || 0;
        payload.miniGameWithdrawConditions.enableMaxWithdraw = $('#minigameEnableMaxWithdraw').prop('checked');
        payload.miniGameWithdrawConditions.maxWithdraw = $('#minigameMaxWithdraw').val() || 0;
        payload.miniGameWithdrawConditions.enableDeductCreditAll = $('#minigameEnableDeductCreditAll').prop('checked');
        payload.miniGameWithdrawConditions.disableAutoWithdraw = $('#minigameDisableAutoWithdraw').prop('checked');
    } else {
        payload.luckyWheelWithdrawConditions = {};
        payload.luckyWheelWithdrawConditions.enableWithdrawCondition = $('#minigameEnableWithdrawCondition').prop('checked');
        payload.luckyWheelWithdrawConditions.enableCreditRemain = $('#minigameEnableCreditRemain').prop('checked');
        payload.luckyWheelWithdrawConditions.creditRemain = $('#minigameCreditRemain').val() || 0;
        payload.luckyWheelWithdrawConditions.enableMaxWithdraw = $('#minigameEnableMaxWithdraw').prop('checked');
        payload.luckyWheelWithdrawConditions.maxWithdraw = $('#minigameMaxWithdraw').val() || 0;
        payload.luckyWheelWithdrawConditions.enableDeductCreditAll = $('#minigameEnableDeductCreditAll').prop('checked');
        payload.luckyWheelWithdrawConditions.disableAutoWithdraw = $('#minigameDisableAutoWithdraw').prop('checked');

    }

    if (typeNow == 'mini-game') {
        payload.ImageUrl = payloadImg.imgMinigameReward;
        payload.AfterImageUrl = payloadImg.imgMinigamePopup;
        payload.pieceAmount = parseInt(hiddenCountImgMiniGame.val());
    } else {
        payload.centerImageUrl = payloadImg.luckywheelSpinBtn;
        payload.backgroundImageUrl = payloadImg.luckywheelFrame;
        payload.rewardImageUrl = payloadImg.luckywheelGetReward;
        payload.pieceAmount = customNumberPartsLuckywheel.getValue();
    }
    payload.tikSoundUrl = customLuckywheelSoundEffectDropdown.getValue();

    payload.enableLimitCustomerGroup = $('#enableLimitCustomerGroup').prop('checked');

    var customerGroupLists = customLimitCustomerGroupDropdown.getValue();
    var customerGroupListsArray = customerGroupLists.map(x => ({ id: x }))

    //console.log('customerGroupListsArraysssss', customerGroupListsArray)

    payload.customerGroupList = customerGroupListsArray;

    var customSelectAgentLists = customSelectAgentDropdown.getValue();
    var customSelectAgentListsArray = [];

    customSelectAgentListsArray.push({ agentId: customSelectAgentLists });

    //var customSelectAgentListsArray = customSelectAgentLists.map(x => ({ agentId: x }))

    //console.log('customSelectAgentListsss', customSelectAgentLists)
    //console.log('customSelectAgentListsArray', customSelectAgentListsArray)

    //console.log('payloadStep222')

    payload.agentGroupList = customSelectAgentListsArray;
    payload.enableLimitCustomerGroupShow = $('#enableLimitCustomerGroupShow').prop('checked');

    // ตั้งค่าตรวจสอบยอด Balance และ ยอดถอน เมื่อสมาชิกทำการถอนเงิน
    payload.enableCustomerCreditBalance = $('#enableCustomerCreditBalance').prop('checked');
    payload.customerCreditBalance = $('#customerCreditBalance').val();
    payload.reduceQuota = $('#reduceQuota').val();
    payload.enableReduceAllQuota = $('#enableReduceAllQuota').prop('checked');

    payload.enableCustomerCreditWithdraw = $('#enableCustomerCreditWithdraw').prop('checked');
    payload.customerCreditWithdraw = $('#customerCreditWithdraw').val();
    payload.reduceQuotaWithdraw = $('#reduceQuotaWithdraw').val();
    payload.enableReduceAllQuotaWithdraw = $('#enableReduceAllQuotaWithdraw').prop('checked');

    //console.log('payload.enableCustomerCreditBalance', payload.enableCustomerCreditBalance);
    //console.log('payload.customerCreditBalance', payload.customerCreditBalance);
    //console.log('payload.reduceQuota', payload.reduceQuota);
    //console.log('payload.enableReduceAllQuota', payload.enableReduceAllQuota);

    //console.log('payload.enableCustomerCreditWithdraw', payload.enableCustomerCreditWithdraw);
    //console.log('payload.customerCreditWithdraw', payload.customerCreditWithdraw);
    //console.log('payload.reduceQuotaWithdraw', payload.reduceQuotaWithdraw);
    //console.log('payload.enableReduceAllQuotaWithdraw', payload.enableReduceAllQuotaWithdraw);

    //Step4
    if (typeNow == 'mini-game') {

        var count = parseInt(hiddenCountImgMiniGame.val());

        //Step1

        var isCheckDisplayImgStep1 = true;
        var isCheckDisplayImgSortStep1 = true;
        var dataImgStep1 = [];
        payload.miniGameDisplaySettingStepOne = {};

        if ($("#isCheckDisplayImgBeforeAll").is(':checked')) {

            isCheckDisplayImgStep1 = true;

            var img = $("#imgBeforeMiniGame1").val();

            dataImgStep1.push({
                imageUrl: img,
                sequence: 1
            });

        } else {
            isCheckDisplayImgStep1 = false;

            for (let i = 0; i < count; i++) {
                var img = $("#imgBeforeMiniGame" + [i + 1]).val();

                console.log('img', img);

                dataImgStep1.push({
                    imageUrl: img,
                    sequence: i + 1
                });
            }
        }

        if ($("#isCheckStep1DisplayImgSort").is(':checked')) {
            isCheckDisplayImgSortStep1 = true;
        } else {
            isCheckDisplayImgSortStep1 = false;
        }

        payload.miniGameDisplaySettingStepOne.enableImageIdentical = isCheckDisplayImgStep1;
        payload.miniGameDisplaySettingStepOne.enableImageIdenticalSortBy = isCheckDisplayImgSortStep1;
        payload.miniGameDisplaySettingStepOne.miniGamePictuerList = dataImgStep1;

        //Step2
        var isCheckDisplayImgStep2 = true;
        var isCheckDisplayImgSortStep2 = true;
        var dataImgStep2 = [];
        payload.miniGameDisplaySettingStepTwo = {};

        if ($("#isCheckDisplayImgAfterAll").is(':checked')) {

            isCheckDisplayImgStep2 = true;

            var img = $("#imgAfterMiniGame1").val();

            console.log('img', img);

            dataImgStep2.push({
                imageUrl: img,
                sequence: 1
            });

        } else {

            isCheckDisplayImgStep2 = false;

            for (let i = 0; i < count; i++) {
                var img = $("#imgAfterMiniGame" + [i + 1]).val();

                //console.log('img', img);

                dataImgStep2.push({
                    imageUrl: img,
                    sequence: i + 1
                });
            }
        }

        if ($("#isCheckDisplayImgAfterSort").is(':checked')) {
            isCheckDisplayImgSortStep2 = true;
        } else {
            isCheckDisplayImgSortStep2 = false;
        }


        payload.miniGameDisplaySettingStepTwo.enableImageIdentical = isCheckDisplayImgStep2;
        payload.miniGameDisplaySettingStepTwo.enableImageIdenticalSortBy = isCheckDisplayImgSortStep2;
        payload.miniGameDisplaySettingStepTwo.miniGamePictuerList = dataImgStep2;


        var isCheckNextStep2 = false;

        if ($("#isCheckNextStep2").is(':checked')) {
            isCheckNextStep2 = true;
        } else {
            isCheckNextStep2 = false;
        }

        payload.miniGameDisplaySettingStepTwo.enableImageNexStep = isCheckNextStep2;
        

        //console.log('payloadStep3')
        //Step3
        var isCheckDisplayImgStep3 = true;
        var isCheckDisplayImgSortStep3 = true;
        var dataImgStep3 = [];
        payload.miniGameDisplaySettingStepThree = {};

        if ($("#isCheckDisplayImgResultsAll").is(':checked')) {

            isCheckDisplayImgStep3 = true;

            var img = $("#imgResultsMiniGame1").val();

            //console.log('img', img);

            dataImgStep3.push({
                imageUrl: img,
                sequence: 1
            });

        } else {

            isCheckDisplayImgStep3 = false;

            for (let i = 0; i < count; i++) {
                var img = $("#imgResultsMiniGame" + [i + 1]).val();

                //console.log('img', img);

                dataImgStep3.push({
                    imageUrl: img,
                    sequence: i + 1
                });
            }
        }

        if ($("#isCheckDisplayImgResultsSort").is(':checked')) {
            isCheckDisplayImgSortStep3 = true;
        } else {
            isCheckDisplayImgSortStep3 = false;
        }

        payload.miniGameDisplaySettingStepThree.enableImageIdentical = isCheckDisplayImgStep3;
        payload.miniGameDisplaySettingStepThree.enableImageIdenticalSortBy = isCheckDisplayImgSortStep3;
        payload.miniGameDisplaySettingStepThree.miniGamePictuerList = dataImgStep3;

        //Set Background And Color Code

        payload.miniGameDisplayOverviewSetting = {};

        //Bg Main
        payload.miniGameDisplayOverviewSetting.backgroundScreenDesktopImageUrl = $("#imgBgPcMiniGame").val();
        payload.miniGameDisplayOverviewSetting.backgroundScreenMobileImageUrl = $("#imgBgMobileMiniGame").val();
        payload.miniGameDisplayOverviewSetting.backgroundScreenColorCode = colorBgMainColorInput.getValue();

        //Bg MiniGame
        payload.miniGameDisplayOverviewSetting.miniGameScreenDesktopImageUrl = $("#imgBgPcDisplayMiniGame").val();
        payload.miniGameDisplayOverviewSetting.miniGameScreenMobileImageUrl = $("#imgBgMbDisplayMiniGame").val();
        payload.miniGameDisplayOverviewSetting.miniGameColorCode = colorBgInBoxMiniGameColorInput.getValue();

        //Set Color Code

        //Group1
        payload.miniGameDisplayOverviewSetting.textPrimaryHeaderColorCode = colorFontHeaderMainInputGroup1.getValue();
        payload.miniGameDisplayOverviewSetting.textSecondaryHeaderColorCode = colorFontHeaderSecondaryInputGroup1.getValue();
        payload.miniGameDisplayOverviewSetting.textPrimaryMainColorCode = colorFontMessageMainInputGroup1.getValue();
        payload.miniGameDisplayOverviewSetting.textSecondaryMainColorCode = colorFontMessageSecondaryInputGroup1.getValue();
        payload.miniGameDisplayOverviewSetting.textHighlightColorCode1 = colorFontHighlightsInputGroup1.getValue();
        payload.miniGameDisplayOverviewSetting.textCountDownColorCode = colorFontCountDownInputGroup1.getValue();

        //Group2
        payload.miniGameDisplayOverviewSetting.buttonBackgroundColorCode = colorBtnBgInputGroup2.getValue();
        payload.miniGameDisplayOverviewSetting.buttonTextColorCode = colorBtnMessageInputGroup2.getValue();
        payload.miniGameDisplayOverviewSetting.buttonFrameColorCode = colorBtnBorderInputGroup2.getValue();
        payload.miniGameDisplayOverviewSetting.frameBackgroundColorCode = colorDisplayBgInputInputGroup2.getValue();
        payload.miniGameDisplayOverviewSetting.frameColorCode = colorDisplayBorderInputGroup2.getValue();

        //Group3

        //Th
        payload.miniGameDisplayOverviewSetting.tableBackgroundColorCode = colorTableThBgInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableTextColorCode = colorTableThFontInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableFrameColorCode = colorTableThBorderInputGroup3.getValue();


        //Td
        payload.miniGameDisplayOverviewSetting.tableTextBackgroundColorCode1 = colorTableTdBg1InputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableTextBackgroundColorCode2 = colorTableTdBg2InputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableTextPrimaryColorCode = colorTableTdFontInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableTextHighlightColorCode1 = colorTableTdFontHighlights1InputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableTextHighlightColorCode2 = colorTableTdFontHighlights2InputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.tableDivideColorCode = colorTableTdBorderInputGroup3.getValue();

        //Pagination
        payload.miniGameDisplayOverviewSetting.pageActiveColorCode = colorPaginationFontActiveInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.pageInActiveColorCode = colorPaginationFontInActiveInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.pageBackgroundInActiveColorCode = colorPaginationBgInActiveInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.pageBackgroundActiveColorCode = colorPaginationBgActiveInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.arrowInActiveColorCode = colorPaginationArrowInActiveInputGroup3.getValue();
        payload.miniGameDisplayOverviewSetting.arrowActiveColorCode = colorPaginationArrowActiveInputGroup3.getValue();

    } else {

        //Set Background And Color Code

        payload.luckyWheelDisplayOverviewSetting = {};

        //Bg Main
        payload.luckyWheelDisplayOverviewSetting.backgroundScreenDesktopImageUrl = $("#imgBgPcMiniGame").val();
        payload.luckyWheelDisplayOverviewSetting.backgroundScreenMobileImageUrl = $("#imgBgMobileMiniGame").val();
        payload.luckyWheelDisplayOverviewSetting.backgroundScreenColorCode = colorBgMainColorInput.getValue();

        //Bg MiniGame
        payload.luckyWheelDisplayOverviewSetting.miniGameScreenDesktopImageUrl = $("#imgBgPcDisplayMiniGame").val();
        payload.luckyWheelDisplayOverviewSetting.miniGameScreenMobileImageUrl = $("#imgBgMbDisplayMiniGame").val();
        payload.luckyWheelDisplayOverviewSetting.miniGameColorCode = colorBgInBoxMiniGameColorInput.getValue();

        //Set Color Code

        //Group1
        payload.luckyWheelDisplayOverviewSetting.textPrimaryHeaderColorCode = colorFontHeaderMainInputGroup1.getValue();
        payload.luckyWheelDisplayOverviewSetting.textSecondaryHeaderColorCode = colorFontHeaderSecondaryInputGroup1.getValue();
        payload.luckyWheelDisplayOverviewSetting.textPrimaryMainColorCode = colorFontMessageMainInputGroup1.getValue();
        payload.luckyWheelDisplayOverviewSetting.textSecondaryMainColorCode = colorFontMessageSecondaryInputGroup1.getValue();
        payload.luckyWheelDisplayOverviewSetting.textHighlightColorCode1 = colorFontHighlightsInputGroup1.getValue();
        payload.luckyWheelDisplayOverviewSetting.textCountDownColorCode = colorFontCountDownInputGroup1.getValue();

        //Group2
        payload.luckyWheelDisplayOverviewSetting.buttonBackgroundColorCode = colorBtnBgInputGroup2.getValue();
        payload.luckyWheelDisplayOverviewSetting.buttonTextColorCode = colorBtnMessageInputGroup2.getValue();
        payload.luckyWheelDisplayOverviewSetting.buttonFrameColorCode = colorBtnBorderInputGroup2.getValue();
        payload.luckyWheelDisplayOverviewSetting.frameBackgroundColorCode = colorDisplayBgInputInputGroup2.getValue();
        payload.luckyWheelDisplayOverviewSetting.frameColorCode = colorDisplayBorderInputGroup2.getValue();

        //Group3

        //Th
        payload.luckyWheelDisplayOverviewSetting.tableBackgroundColorCode = colorTableThBgInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableTextColorCode = colorTableThFontInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableFrameColorCode = colorTableThBorderInputGroup3.getValue();


        //Td
        payload.luckyWheelDisplayOverviewSetting.tableTextBackgroundColorCode1 = colorTableTdBg1InputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableTextBackgroundColorCode2 = colorTableTdBg2InputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableTextPrimaryColorCode = colorTableTdFontInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableTextHighlightColorCode1 = colorTableTdFontHighlights1InputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableTextHighlightColorCode2 = colorTableTdFontHighlights2InputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.tableDivideColorCode = colorTableTdBorderInputGroup3.getValue();

        //Pagination
        payload.luckyWheelDisplayOverviewSetting.pageActiveColorCode = colorPaginationFontActiveInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.pageInActiveColorCode = colorPaginationFontInActiveInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.pageBackgroundInActiveColorCode = colorPaginationBgInActiveInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.pageBackgroundActiveColorCode = colorPaginationBgActiveInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.arrowInActiveColorCode = colorPaginationArrowInActiveInputGroup3.getValue();
        payload.luckyWheelDisplayOverviewSetting.arrowActiveColorCode = colorPaginationArrowActiveInputGroup3.getValue();
    }

    //Game Provider Selected
    payload.enableBrandGame = $('#minigameEnableGameProvider').prop('checked');
    var selectedProvider = $(".game-provider-checker-input:checked");

    if (typeNow == 'mini-game') {
        payload.miniGameBrandGames = [];
        var miniGameBrandGames = [];
        if (selectedProvider.length > 0) {
            for (var i = 0; i < selectedProvider.length; i++) {
                miniGameBrandGames.push({
                    BrandLsmNumber: $(selectedProvider[i]).attr('providerId'),
                    Code: $(selectedProvider[i]).attr('providerCode'),
                    Name: $(selectedProvider[i]).attr('name'),
                    Category: $(selectedProvider[i]).attr('category'),
                });
            }
            payload.miniGameBrandGames = miniGameBrandGames;
        }
    } else {
        payload.luckyWheelBrandGames = [];
        var luckyWheelBrandGames = [];
        if (selectedProvider.length > 0) {
            for (var i = 0; i < selectedProvider.length; i++) {
                luckyWheelBrandGames.push({
                    BrandLsmNumber: $(selectedProvider[i]).attr('providerId'),
                    Code: $(selectedProvider[i]).attr('providerCode'),
                    Name: $(selectedProvider[i]).attr('name'),
                    Category: $(selectedProvider[i]).attr('category'),
                });
            }
            payload.luckyWheelBrandGames = luckyWheelBrandGames;
        }
    }

    //console.log('payload', payload)

    let method = urlReq = textShow = '';
    if (action == 'create') {
        if (typeNow == 'mini-game') {
            urlReq = '/api/promotion/mini-game/create-v2';
            textShow = 'บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ !';
            method = 'POST';
        } else {
            urlReq = '/api/promotion/lucky-wheel/create-v2';
            textShow = 'บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ !';
            method = 'POST';
        }


    } else {
        if (typeNow == 'mini-game') {
            urlReq = '/api/promotion/mini-game/update-v2';
            textShow = 'บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ !';
            payload.miniGameId = luckyWheelIdNow;
            method = 'PUT';
        } else {
            urlReq = '/api/promotion/lucky-wheel/update-v2';
            textShow = 'บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ !';
            payload.luckyWheelId = luckyWheelIdNow;
            method = 'PUT';
        }

    }

    let req = await $.ajax({
        url: urlReq,
        method: method,
        data: payload
    }).done(function (res) {
        if (res.status == 200) {
            setTimeout(() => {
                confirmSavePromotionSwal.open({
                    type: 'success',
                    title: textShow,
                    showConfirmButton: false,
                    cancelText: 'ปิดหน้าต่าง',
                    text: `คุณสามารถกลับเข้ามาแก้ไขข้อมูลมินิเกมส์ของคุณได้ตลอดเวลา ตามที่คุณต้องการ แต่การเปลี่ยนแปลงอะไร บ่อย ๆ ไม่ใช่เรื่องดีนัก คุณอาจจะสร้างความสับสนให้กับสมาชิกของคุณก็เป็นได้ หากมีข้อสงสัยใดสามารถติดต่อ เราได้ที่กลุ่ม Support ของคุณใน Telegram เรามีทีมงานเตรียมพร้อมตอบทุกปัญหาข้อสงสัย ตลอด 24 ชั่วโมง`
                });

                tableMinigame.refresh();
            }, 2000);

            clearTemplateMinigameWheel();
            resetSettingPromotion();
            offcanvasMinigameSetting.offcanvas('hide');
        } else {
            customSwal.open({
                type: 'danger',
                title: 'ทำรายการไม่สำเร็จ !',
                showConfirmButton: false,
                cancelText: 'ปิดหน้าต่าง',
                text: `พบปัญหาในการบันทึกข้อมูล Error : ${res.status}`
            });
        }
    }).fail(function () {
        customSwal.open({
            type: 'danger',
            title: 'ทำรายการไม่สำเร็จ !',
            showConfirmButton: false,
            cancelText: 'ปิดหน้าต่าง',
            text: `พบปัญหาในการบันทึกข้อมูล`
        });
    });
    if (req.status == 200) {
        return true;
    } else {
        return false;
    }
}

const offcanvasMinigameSetting = $('#offcanvasMinigameSetting');
const openminigameSetting = (action, type) => {
    window.localStorage.setItem("action", action); // สรุปและบันทึก
    typeNow = type;
    validateStep();

    if (typeNow != 'mini-game') {
        let cloneTemplate = $('#wheelShow1').clone();

        cloneWheelMain = cloneTemplate.html();
        cloneWheelMain = $(cloneWheelMain);
        $('#showStepEnd').removeClass('preview-minigame');
        $('#showStepEnd').html(cloneWheelMain);
    }

    if (action == 'detail') {

        //if (type == 'mini-game') {
        //    settingstepNow = 6;
        //} else {
        //    settingstepNow = 5;
        //}

        settingstepNow = 6;

        
        $(".show-edit").hide();
        $(".show-create").hide();
        $(".show-detail").show();

        if (type == 'mini-game') {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.minigameDetails'>รายละเอียดเกมส์อื่น ๆ</span>");
            $("#offcanvasMinigameViewDetail1").html("<span data-i18n='minigameSetting.AllminigameDetails'>สรุปข้อมูลการตั้งค่าเกมส์อื่นๆ ของคุณ</span>");
            $("#textBtnEdit").html("<span data-i18n='minigameSetting.minigameEditDetails'>แก้ไขข้อมูลเกมส์อื่นๆ</span>");
            $("#textHeadDetail").html("<span data-i18n='minigameSetting.minigameSummarizeDetails'>สรุปรายละเอียดมินิเกมส์</span>");

            $("#textHeaderAllDetail").html("<span data-i18n='minigameSetting.minigameDetail'>รายละเอียดมินิเกมส์ :</span>");
            $("#textNameDetail").html("<span data-i18n='minigameSetting.minigameName'>ชื่อมินิเกมส์ :</span>");
            $("#textStatusDetail").html("<span data-i18n='minigameSetting.minigameStatus'>สถานะมินิเกมส์ :</span>");
            $("#textConditionDetail").html("<span data-i18n='minigameSetting.minigameConditions'>เงื่อนไขมินิเกมส์: </span>");
            //$("#textTestDetail").html("<span data-i18n='minigameSetting.minigameTestCondition'>การทดลองใช้มินิเกมส์ :</span>");
        } else {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.luckyWheelDetails'>รายละเอียดวงล้อนำโชค</span>");
            $("#offcanvasMinigameViewDetail1").html("<span data-i18n='minigameSetting.AllminigameDetails'>สรุปข้อมูลการตั้งค่าวงล้อนำโชค ของคุณ</span>");
            $("#textBtnEdit").html("<span data-i18n='minigameSetting.luckyWheelEditDetails'>แก้ไขข้อมูลวงล้อนำโชค</span>");
            $("#textHeadDetail").html("<span data-i18n='minigameSetting.luckyWheelSummarizeDetails'>สรุปรายละเอียดมินิเกมส์ - วงล้อนำโชค</span>");

            $("#textHeaderAllDetail").html("<span data-i18n='minigameSetting.luckyWheelDetail'>รายละเอียดมินิเกมส์วงล้อ :</span>");
            $("#textNameDetail").html("<span data-i18n='minigameSetting.luckyWheelName'>ชื่อมินิเกมส์วงล้อ :</span>");
            $("#textStatusDetail").html("<span data-i18n='minigameSetting.luckyWheelStatus'>สถานะมินิเกมส์วงล้อ :</span>");
            $("#textConditionDetail").html("<span data-i18n='minigameSetting.luckyWheelConditions'>เงื่อนไขมินิเกมส์วงล้อ :</span>");
            //$("#textTestDetail").html("<span data-i18n='minigameSetting.luckyWheelTestCondition'>การทดลองหมุนวงล้อ :</span>");
        }
        $("#offcanvasMinigameDetailLabel").localize();
        $("#offcanvasMinigameViewDetail1").localize();
        $("#textBtnEdit").localize();
        $("#textHeadDetail").localize();
        $("#textHeaderAllDetail").localize();
        $("#textNameDetail").localize();
        $("#textStatusDetail").localize();
        $("#textConditionDetail").localize();
        $("#textTestDetail").localize();
        btnStepSettingMinigame(this, '', '6', 'detail');
    } else if (action == 'edit') {
        settingstepNow = 1;
        $('[id^=groupBtnSettingMinigame]').hide();
        $('[id^=groupBtnSettingMinigame]').eq(0).show();
        $('[id^=SettingMinigameStep]').hide();
        $('[id^=SettingMinigameStep]').eq(0).show();
        $(".show-edit").show();
        $(".show-create").show();
        $(".show-detail").hide();
        if (type == 'mini-game') {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.minigameEdit'>แก้ไขข้อมูลเกมส์อื่น ๆ</span>");
            $(".luckyWheelShowLayout").hide();
            $(".minigameShowLayout").show();

            $("#offcanvasMinigameViewDetail1").html("<span data-i18n='minigameSetting.summarizeMinigameSetting'>สรุปข้อมูลการตั้งค่าเกมส์อื่นๆ ของคุณ</span>");
            $("#textBtnEdit").html("<span data-i18n='minigameSetting.minigameEditOther'>แก้ไขข้อมูลเกมส์อื่นๆ</span>");
            $("#textHeadDetail").html("<span data-i18n='minigameSetting.summarizeMinigame'>สรุปรายละเอียดมินิเกมส์</span>");
            $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameTypeOther'>ระบุรายละเอียดมินิเกมส์ : เกมส์อื่น ๆ</span>");
            $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSubTextSetting'>ระบุชื่อเกมส์ของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");
            $("#textHeadTap").html("<span data-i18n='minigameSetting.minigameDetailText'>รายละเอียดเกมส์</span>");
            $(".textLabelName").html("<span data-i18n='minigameSetting.minigameName'>ชื่อมินิเกมส์</span>");
            $('#minigameName').attr("placeholder", "ระบุชื่อมินิเกมส์");
            $("#textSwitch1").html("<span data-i18n='minigameSetting.minigameOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองเล่นมินิเกมส์ได้ เมื่อไม่มีสิทธิ์</span>");
            $("#textSwitchTab1").html("<span data-i18n='minigameSetting.minigameOpenSetting'>เปิด / ปิด การใช้งานมินิเกมส์</span>");

            $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.minigameDateRangeActive'>ระยะเวลามินิเกมส์และวันทำงาน</span>");
            $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.minigameCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
            $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.minigameDateTimeActive'>กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)</span>");
            $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.minigameDateActive'>กำหนดวันทำงานของมินิเกมส์</span>");

            $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.minigameCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุมินิเกมส์</span>");
            $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.minigameCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างมินิเกมส์สำเร็จ</span>");
            $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.minigameCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างมินิเกมส์สำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
            $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.minigameCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของมินิเกมส์นั้น</span>");

            $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.minigameRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์</span>");
            $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.minigameHowToGetMinigame'>การได้รับสิทธิ์มินิเกมส์</span>");
            $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.minigameEditAndSetting'>การปรับแต่งและตั้งค่ามินิเกมส์</span>");

        } else {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.luckyWheelEdit'>แก้ไขข้อมูลวงล้อนำโชค</span>");
            $(".minigameShowLayout").hide();
            $(".luckyWheelShowLayout").show();
            $("#offcanvasMinigameViewDetail1").html("<span data-i18n='minigameSetting.summarizeluckyWheelSetting'>สรุปข้อมูลการตั้งค่าวงล้อนำโชค ของคุณ</span>");
            $("#textBtnEdit").html("<span data-i18n='minigameSetting.luckyWheelEditOther'>แก้ไขข้อมูลวงล้อนำโชค</span>");
            $("#textHeadDetail").html("<span data-i18n='minigameSetting.summarizeluckyWheel'>สรุปรายละเอียดมินิเกมส์ - วงล้อนำโชค</span>");
            $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelTypeOther'>ระบุรายละเอียดมินิเกมส์ : วงล้อนำโชค</span>");
            $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelSubTextSetting'>ระบุชื่อวงล้อนำโชคของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");

            $("#textHeadTap").html("<span data-i18n='minigameSetting.luckyWheelDetailText'>รายละเอียดวงล้อนำโชค</span>");
            $(".textLabelName").html("<span data-i18n='minigameSetting.luckyWheelName'>ชื่อวงล้อนำโชค</span>");
            $('#minigameName').attr("placeholder", "ระบุชื่อวงล้อนำโชค");
            $("#textSwitch1").html("<span data-i18n='minigameSetting.luckyWheelOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองหมุนวงล้อนำโชคได้ เมื่อไม่มีสิทธิ์</span>");
            $("#textSwitchTab1").html("<span data-i18n='minigameSetting.luckyWheelOpenSetting'>เปิด / ปิด การใช้งานวงล้อนำโชค</span>");

            $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.luckyWheelDateRangeActive'>ระยะเวลาวงล้อนำโชคและวันทำงาน</span>");
            $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.luckyWheelCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
            $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.luckyWheelDateTimeAccess'>กำหนดระยะเวลาวงล้อนำโชค (อายุวงล้อ)</span>");
            $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.luckyWheelDateActive'>กำหนดวันทำงานของวงล้อนำโชค</span>");

            $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.luckyWheelCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุวงล้อ</span>");
            $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.luckyWheelCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ</span>");
            $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.luckyWheelCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างวงล้อนำโชคสำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
            $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.luckyWheelCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของวงล้อนั้น</span>");

            $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.luckyWheelRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค</span>");
            $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.luckyWheelHowToGetluckyWheel'>การได้รับสิทธิ์มินิเกมส์วงล้อนำโชค</span>");
            $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.luckyWheelEditAndSetting'>การปรับแต่งและตั้งค่าวงล้อนำโชค</span>");
        }

        $("#offcanvasMinigameDetailLabel").localize();
        $("#offcanvasMinigameViewDetail1").localize();
        $("#textBtnEdit").localize();
        $("#textHeadDetail").localize();
        $("#textDetailStepSettingMinigame").localize();
        $("#textdescriptionStepSettingMinigame").localize();

        $("#textHeadTap").localize();
        $(".textLabelName").localize();
        $("#textSwitch1").localize();
        $("#textSwitchTab1").localize();

        $("#textTabsStep2-1-1").localize();
        $("#textTabsStep2-1-2").localize();
        $("#textTabsStep2-1-3").localize();
        $("#textTabsStep2-1-4").localize();

        $("#textTabsStep2-2-1").localize();
        $("#textTabsStep2-2-2").localize();
        $("#textTabsStep2-2-3").localize();
        $("#textTabsStep2-2-4").localize();

        $("#textTabsStep2-3-1").localize();
        $("#textTabsStep2-3-2").localize();
        $("#textTabsStep2-3-3").localize();

        $("#textTitleStepSettingMinigame").html("Step 1");
        $("#textStepAllSettingMinigame").html("Step 1/5");
        $("#progressStepSettingMinigame").width("20%");
    } else {
        settingstepNow = 1;
        actionNow = "create";
        $('[id^=SettingMinigameTabsStep]').removeClass('active');
        $('[id^=SettingMinigameTabsStep]').eq(0).addClass('active')
        $('[id^=groupBtnSettingMinigame]').hide();
        $('[id^=groupBtnSettingMinigame]').eq(0).show();
        $('[id^=SettingMinigameStep]').hide();
        $('[id^=SettingMinigameStep]').eq(0).show();
        $(".show-edit").show();
        $(".show-create").show();
        $(".show-detail").hide();
        if (type == 'mini-game') {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.minigameCreate'>สร้างเกมส์อื่น ๆ</span>");
            $(".luckyWheelShowLayout").hide();
            $(".minigameShowLayout").show();

            $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameTypeOther'>ระบุรายละเอียดมินิเกมส์ : เกมส์อื่น ๆ</span>");
            $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.minigameSubTextSetting'>ระบุชื่อเกมส์ของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");
            $("#textHeadTap").html("<span data-i18n='minigameSetting.minigameDetailText'>รายละเอียดเกมส์</span>");
            $(".textLabelName").html("<span data-i18n='minigameSetting.minigameName'>ชื่อมินิเกมส์</span>");

            $("#textSwitch1").html("<span data-i18n='minigameSetting.minigameOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองเล่นมินิเกมส์ได้ เมื่อไม่มีสิทธิ์</span>");
            $("#textSwitchTab1").html("<span data-i18n='minigameSetting.minigameOpenSetting'>เปิด / ปิด การใช้งานมินิเกมส์</span>");

            $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.minigameDateRangeActive'>ระยะเวลามินิเกมส์และวันทำงาน</span>");
            $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.minigameCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
            $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.minigameDateTimeActive'>กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)</span>");
            $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.minigameDateActive'>กำหนดวันทำงานของมินิเกมส์</span>");

            $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.minigameCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุมินิเกมส์</span>");
            $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.minigameCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างมินิเกมส์สำเร็จ</span>");
            $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.minigameCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างมินิเกมส์สำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
            $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.minigameCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของมินิเกมส์นั้น</span>");

            $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.minigameRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์</span>");
            $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.minigameHowToGetMinigame'>การได้รับสิทธิ์มินิเกมส์</span>");
            $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.minigameEditAndSetting'>การปรับแต่งและตั้งค่ามินิเกมส์</span>");

            $(".showImagePreviewImageIcon").attr("src", LEGACY_ASSET_BASE + "/images/default/mini-game.png");
            $("#imageIconUrl").val(LEGACY_ASSET_BASE + "/images/default/mini-game.png");

        } else {
            $("#offcanvasMinigameDetailLabel").html("<span data-i18n='minigameSetting.luckyWheelCreate'>สร้างวงล้อนำโชค</span>");
            $(".minigameShowLayout").hide();
            $(".luckyWheelShowLayout").show();

            $("#textDetailStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelTypeOther'>ระบุรายละเอียดมินิเกมส์ : วงล้อนำโชค</span>");
            $("#textdescriptionStepSettingMinigame").html("<span data-i18n='minigameSetting.luckyWheelSubTextSetting'>ระบุชื่อวงล้อนำโชคของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย</span>");

            $("#textHeadTap").html("<span data-i18n='minigameSetting.luckyWheelDetailText'>รายละเอียดวงล้อนำโชค</span>");
            $(".textLabelName").html("<span data-i18n='minigameSetting.luckyWheelName'>ชื่อวงล้อนำโชค</span>");

            $("#textSwitch1").html("<span data-i18n='minigameSetting.luckyWheelOpenTestWhenDontHavePrivilage'>เปิดให้ทดลองหมุนวงล้อนำโชคได้ เมื่อไม่มีสิทธิ์</span>");
            $("#textSwitchTab1").html("<span data-i18n='minigameSetting.luckyWheelOpenSetting'>เปิด / ปิด การใช้งานวงล้อนำโชค</span>");

            $("#textTabsStep2-1-1").html("<span data-i18n='minigameSetting.luckyWheelDateRangeActive'>ระยะเวลาวงล้อนำโชคและวันทำงาน</span>");
            $("#textTabsStep2-1-2").html("<span data-i18n='minigameSetting.luckyWheelCountdown'>การนับถอยหลัง (Countdown) วันหมดอายุ</span>");
            $("#textTabsStep2-1-3").html("<span data-i18n='minigameSetting.luckyWheelDateTimeAccess'>กำหนดระยะเวลาวงล้อนำโชค (อายุวงล้อ)</span>");
            $("#textTabsStep2-1-4").html("<span data-i18n='minigameSetting.luckyWheelDateActive'>กำหนดวันทำงานของวงล้อนำโชค</span>");

            $("#textTabsStep2-2-1").html("<span data-i18n='minigameSetting.luckyWheelCountdownSetting'>กำหนดการนับถอยหลังวันหมดอายุวงล้อ</span>");
            $("#textTabsStep2-2-2").html("<span data-i18n='minigameSetting.luckyWheelCountdownWhenCreate'>นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ</span>");
            $("#textTabsStep2-2-3").html("<span data-i18n='minigameSetting.luckyWheelCountdownText'>ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างวงล้อนำโชคสำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที</span>");
            $("#textTabsStep2-2-4").html("<span data-i18n='minigameSetting.luckyWheelCountdownText2'>ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของวงล้อนั้น</span>");

            $("#textTabsStep2-3-1").html("<span data-i18n='minigameSetting.luckyWheelRightsSetting'>กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค</span>");
            $("#textTabsStep2-3-2").html("<span data-i18n='minigameSetting.luckyWheelHowToGetluckyWheel'>การได้รับสิทธิ์มินิเกมส์วงล้อนำโชค</span>");
            $("#textTabsStep2-3-3").html("<span data-i18n='minigameSetting.luckyWheelEditAndSetting'>การปรับแต่งและตั้งค่าวงล้อนำโชค</span>");

            $(".showImagePreviewImageIcon").attr("src", LEGACY_ASSET_BASE + "/images/default/ic-wheel.png");
            $("#imageIconUrl").val(LEGACY_ASSET_BASE + "/images/default/ic-wheel.png");
        }

        $("#offcanvasMinigameDetailLabel").localize();
        $("#textDetailStepSettingMinigame").localize();
        $("#textdescriptionStepSettingMinigame").localize();

        $("#textHeadTap").localize();
        $(".textLabelName").localize();
        $("#textSwitch1").localize();
        $("#textSwitchTab1").localize();

        $("#textTabsStep2-1-1").localize();
        $("#textTabsStep2-1-2").localize();
        $("#textTabsStep2-1-3").localize();
        $("#textTabsStep2-1-4").localize();

        $("#textTabsStep2-2-1").localize();
        $("#textTabsStep2-2-2").localize();
        $("#textTabsStep2-2-3").localize();
        $("#textTabsStep2-2-4").localize();

        $("#textTabsStep2-3-1").localize();
        $("#textTabsStep2-3-2").localize();
        $("#textTabsStep2-3-3").localize();

        $("#textTitleStepSettingMinigame").text("Step 1");
        $("#textStepAllSettingMinigame").text("Step 1/5");
        $("#progressStepSettingMinigame").width("20%");

        allAddTemplat();
        resetSettingPromotion();
        getGameProviderList();

        // clear data mini-game All
        clearDataMiniGameStep4();

        // hide สรุปและบันทึก
        hidePromotionMiniGameStepfinal();
    }

    validateStep();

    // ตั้งค่าตรวจสอบยอด Balance และ ยอดถอน เมื่อสมาชิกทำการถอนเงิน
    enableCreditBalance();
    enableCreditBalanceWithdraw();
    offcanvasMinigameSetting.offcanvas('show');
};

const editMinigameDetail = (id, type) => {
    actionNow = "edit";
    openminigameSetting('edit', typeNow);
}

const viewMinigameDetail = async (id, type, sequencePie, provided, isUnlimited, limitAmount) => {
    typeNow = type;
    actionNow = "detail";
    clearTemplateMinigameWheel();

    isErrorImgStep1.hide();
    textErrorImgStep1.html("");

    resetSettingPromotion();
    clearAllAddTemplat();
    luckyWheelIdNow = id;
    let run;

    if (sequencePie) {
        onloadShowWheelDetail = true;
        run = await getPromotionDetail(id, sequencePie, provided, isUnlimited, limitAmount);
        onloadShowWheelDetail = false;
    } else {
        // ⚠️ ปุ่มถูก disabled ระหว่างโหลด → เบราว์เซอร์ไม่ส่ง mouseleave → tooltip "detail" ค้างบนการ์ดตลอด (ทีมเทส #110 · ของเดิมก็เป็น) — ซ่อนก่อน
        $(`[data-minigame-id="${id}"] [data-bs-toggle="tooltip"]`).each((_, el) => bootstrap.Tooltip.getInstance(el)?.hide());
        $(`[data-minigame-id="${id}"] button`).html(`<span class="spinner-border flex-shrink-0" style="width: 15px;height: 15px;font-size: 10px;" role="status">
                                                                    <span class="visually-hidden">Loading...</span>
                                                                </span>`);
        $(`[data-minigame-id="${id}"] button`).attr("disabled", true);

        run = await getPromotionDetail(id);

        $(`[data-minigame-id="${id}"] button`).html(`<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.00163 11.6912C9.81395 11.6912 10.5039 11.4069 11.0715 10.8382C11.639 10.2696 11.9228 9.57909 11.9228 8.76675C11.9228 7.95443 11.6385 7.26449 11.0698 6.69693C10.5012 6.12937 9.8107 5.84559 8.99837 5.84559C8.18604 5.84559 7.4961 6.12991 6.92855 6.69854C6.36099 7.26719 6.07721 7.95768 6.07721 8.77001C6.07721 9.58234 6.36153 10.2723 6.93016 10.8398C7.49881 11.4074 8.18929 11.6912 9.00163 11.6912ZM9 10.7041C8.46231 10.7041 8.00528 10.5159 7.6289 10.1395C7.25252 9.7631 7.06433 9.30607 7.06433 8.76838C7.06433 8.2307 7.25252 7.77366 7.6289 7.39728C8.00528 7.0209 8.46231 6.83271 9 6.83271C9.53769 6.83271 9.99472 7.0209 10.3711 7.39728C10.7475 7.77366 10.9357 8.2307 10.9357 8.76838C10.9357 9.30607 10.7475 9.7631 10.3711 10.1395C9.99472 10.5159 9.53769 10.7041 9 10.7041ZM9.00099 13.7868C7.35236 13.7868 5.85019 13.332 4.49448 12.4226C3.13878 11.5131 2.14062 10.295 1.5 8.76838C2.14062 7.24173 3.13846 6.02366 4.49351 5.1142C5.84855 4.20473 7.35039 3.75 8.99901 3.75C10.6476 3.75 12.1498 4.20473 13.5055 5.1142C14.8612 6.02366 15.8594 7.24173 16.5 8.76838C15.8594 10.295 14.8615 11.5131 13.5065 12.4226C12.1514 13.332 10.6496 13.7868 9.00099 13.7868ZM9 12.7114C10.3502 12.7114 11.5899 12.3559 12.719 11.645C13.8481 10.9341 14.7114 9.97519 15.3088 8.76838C14.7114 7.56158 13.8481 6.6027 12.719 5.89176C11.5899 5.18082 10.3502 4.82535 9 4.82535C7.64981 4.82535 6.41015 5.18082 5.28101 5.89176C4.15187 6.6027 3.28858 7.56158 2.69115 8.76838C3.28858 9.97519 4.15187 10.9341 5.28101 11.645C6.41015 12.3559 7.64981 12.7114 9 12.7114Z"></path>
                                                </svg>`);

        $(`[data-minigame-id="${id}"] button`).attr("disabled", false);
    }

    if (run) {
        if (sequencePie) {
            modalShowWheelDetail.open();
        } else {
            openminigameSetting('detail', typeNow);
        }
    }
};

var miniGameNameOld = '';

const getPromotionDetail = async (id, sequencePie, provided, isUnlimited, limitAmount) => {
    var payload = {};

    let urlReq = textShow = '';
    if (typeNow == 'mini-game') {
        urlReq = '/api/promotion/mini-game/get/';
        payload.MiniGameId = id;

    } else {
        urlReq = '/api/promotion/lucky-wheel/get/';
        payload.LuckyWheelId = id;
    }
    let req = await $.ajax({
        url: urlReq,
        method: "POST",
        data: payload
    }).done(function (res) {
        if (res.status == 200) {
            var data = res.data;
            //console.log('data-mini-game', data)
            window.localStorage.setItem("isNewSetting", data.isNewSetting);
            // reset
            $('[id^=SettingMinigameTabsStep]').removeClass('active');
            $('[id^=SettingMinigameTabsStep]').eq(0).addClass('active')
            // Step 1
            $('#minigameName').val(data.name);

            for (var i = 0; i < data.miniGameMultiLanguages.length; i++) {
                if (data.miniGameMultiLanguages[i].language == "th") {
                    $('#minigameName').val(data.miniGameMultiLanguages[i].name);
                    conditionHtml.setData(data.miniGameMultiLanguages[i].conditionHtml);
                }
                if (data.miniGameMultiLanguages[i].language == "en") {
                    $('#minigameName-' + data.miniGameMultiLanguages[i].language).val(data.miniGameMultiLanguages[i].name);
                    $('#minigameConditionHtml-' + data.miniGameMultiLanguages[i].language).html(data.conditionHtml);
                    conditionHtmlEn.setData(data.miniGameMultiLanguages[i].conditionHtml);
                }
                if (data.miniGameMultiLanguages[i].language == "tl") {
                    $('#minigameName-' + data.miniGameMultiLanguages[i].language).val(data.miniGameMultiLanguages[i].name);
                    $('#minigameConditionHtml-' + data.miniGameMultiLanguages[i].language).html(data.conditionHtml);
                    conditionHtmlTl.setData(data.miniGameMultiLanguages[i].conditionHtml);
                }
            }

            if (data.languageSelected != null) {
                checkMultiSetting();
                selectMultiLanguage(data.languageSelected);
            }

            miniGameNameOld = data.name;
            $('#minigameStatus').prop('checked', (data.status == 'active' ? true : false));

            if (data.conditionHtml != "" && data.conditionHtml != null) {
                $('#minigameConditionHtml').html(data.conditionHtml);

                conditionHtml.setData(data.conditionHtml);
            }

            if (typeNow == 'mini-game') {
                $('#enableIfNotHaveLuckyWheel').prop('checked', data.enableIfNotHaveMiniGame);
                $("input[name=turnOverBeforeOrAfterMiniGame][value=" + (data.isReceiveBefore == true ? true : false) + "]").prop('checked', true);
            } else {
                $('#enableIfNotHaveLuckyWheel').prop('checked', data.enableIfNotHaveLuckyWheel);
                $("input[name=turnOverBeforeOrAfterLuckyWheel][value=" + (data.isReceiveBefore == true ? true : false) + "]").prop('checked', true);
            }

            //Step4
            if (typeNow == 'mini-game') {
                $(".box-select-quantity").removeClass("active");

                $(".box-select-quantity-" + data.pieceAmount).addClass("active");

                hiddenCountImgMiniGame.val(data.pieceAmount);

                //MiniGame Step1

                //1.1
                if (data.miniGameDisplaySettingStepOne.enableImageIdentical) {
                    $("#isCheckDisplayImgBeforeAll").prop("checked", true);
                } else {
                    $("#isCheckDisplayImgBeforeDifferent").prop("checked", true);
                }

                //1.2
                if (data.miniGameDisplaySettingStepOne.enableImageIdenticalSortBy) {
                    $("#isCheckStep1DisplayImgSort").prop("checked", true);
                } else {
                    $("#isCheckStep1DisplayImgSortRandom").prop("checked", true);
                }

                //1.3

                //For Img Group1
                if (data.miniGameDisplaySettingStepOne.miniGamePictuerList != null) {
                    for (let i = 0; i < data.miniGameDisplaySettingStepOne.miniGamePictuerList.length; i++) {
                        $(".img-show-upload-mini-game-before-" + [i + 1]).attr("src", data.miniGameDisplaySettingStepOne.miniGamePictuerList[i].imageUrl);
                        $("#imgBeforeMiniGame" + [i + 1]).val(data.miniGameDisplaySettingStepOne.miniGamePictuerList[i].imageUrl);
                        $(".default-img-mini-game-before-" + [i + 1]).hide();
                        $(".btn-close-img-mini-game-step-1-box-" + [i + 1]).show();
                        $(".img-show-upload-mini-game-before-" + [i + 1]).show();
                    }
                }

                hideImgBeforeDisplayTypeStep1();

                //2.0
                if (data.miniGameDisplaySettingStepTwo.enableImageNexStep === true) {
                    $("#isCheckNextStep2").prop("checked", true);
                } else {
                    $("#isCheckNextStep2").prop("checked", false);
                }

                //2.1
                if (data.miniGameDisplaySettingStepTwo.enableImageIdentical) {
                    $("#isCheckDisplayImgAfterAll").prop("checked", true);
                } else {
                    $("#isCheckDisplayImgAfterDifferent").prop("checked", true);
                }

                //2.2
                if (data.miniGameDisplaySettingStepTwo.enableImageIdenticalSortBy) {
                    $("#isCheckDisplayImgAfterSort").prop("checked", true);
                } else {
                    $("#isCheckDisplayImgAfterSortRandom").prop("checked", true);
                }

                //2.3

                if (data.miniGameDisplaySettingStepTwo.miniGamePictuerList != null) {
                    //For Img Group2
                    for (let i = 0; i < data.miniGameDisplaySettingStepTwo.miniGamePictuerList.length; i++) {
                        $(".img-show-upload-mini-game-after-" + [i + 1]).attr("src", data.miniGameDisplaySettingStepTwo.miniGamePictuerList[i].imageUrl);
                        $("#imgAfterMiniGame" + [i + 1]).val(data.miniGameDisplaySettingStepTwo.miniGamePictuerList[i].imageUrl);
                        $(".default-img-mini-game-after-" + [i + 1]).hide();
                        $(".btn-close-img-mini-game-step-2-box-" + [i + 1]).show();
                        $(".img-show-upload-mini-game-after-" + [i + 1]).show();
                    }
                }


                hideImgBeforeDisplayTypeStep2();

                //3.1
                if (data.miniGameDisplaySettingStepThree.enableImageIdentical) {
                    $("#isCheckDisplayImgResultsAll").prop("checked", true);
                } else {
                    $("#isCheckDisplayImgResultsDifferent").prop("checked", true);
                }

                //3.2
                if (data.miniGameDisplaySettingStepThree.enableImageIdenticalSortBy) {
                    $("#isCheckDisplayImgResultsSort").prop("checked", true);
                } else {
                    $("#isCheckDisplayImgResultsSortRandom").prop("checked", true);
                }

                //3.3

                if (data.miniGameDisplaySettingStepThree.miniGamePictuerList != null) {
                    //For Img Group3
                    for (let i = 0; i < data.miniGameDisplaySettingStepThree.miniGamePictuerList.length; i++) {
                        $(".img-show-upload-mini-game-results-" + [i + 1]).attr("src", data.miniGameDisplaySettingStepThree.miniGamePictuerList[i].imageUrl);
                        $("#imgResultsMiniGame" + [i + 1]).val(data.miniGameDisplaySettingStepThree.miniGamePictuerList[i].imageUrl);
                        $(".default-img-mini-game-results-" + [i + 1]).hide();
                        $(".btn-close-img-mini-game-step-3-box-" + [i + 1]).show();
                        $(".img-show-upload-mini-game-results-" + [i + 1]).show();
                    }
                }

                hideImgBeforeDisplayTypeStep3();

                //StepSettingDisplay Bg
                if (data.miniGameDisplayOverviewSetting.backgroundScreenDesktopImageUrl != null) {
                    $("#imgBgPcMiniGame").val(data.miniGameDisplayOverviewSetting.backgroundScreenDesktopImageUrl);
                    $(".img-bg-pc-show-in-box-upload").attr("src", data.miniGameDisplayOverviewSetting.backgroundScreenDesktopImageUrl);
                    $(".img-default-bg-pc-mini-game").hide();
                    btnCLoseImgBgPcMiniGame.show();
                    $(".img-bg-pc-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgPcMiniGame.hide();
                    $(".img-bg-pc-show-in-box-upload").hide();
                    $(".img-default-bg-pc-mini-game").show();
                }

                if (data.miniGameDisplayOverviewSetting.backgroundScreenMobileImageUrl != null) {
                    $("#imgBgMobileMiniGame").val(data.miniGameDisplayOverviewSetting.backgroundScreenMobileImageUrl);
                    $(".img-bg-mb-show-in-box-upload").attr("src", data.miniGameDisplayOverviewSetting.backgroundScreenMobileImageUrl);
                    $(".img-default-bg-mb-mini-game").hide();
                    btnCLoseImgBgMobileMiniGame.show();
                    $(".img-bg-mb-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-show-in-box-upload").hide();
                    $(".img-default-bg-mb-mini-game").show();
                }

                if (data.miniGameDisplayOverviewSetting.miniGameScreenDesktopImageUrl != null) {
                    $("#imgBgPcDisplayMiniGame").val(data.miniGameDisplayOverviewSetting.miniGameScreenDesktopImageUrl);
                    $(".img-bg-pc-display-show-in-box-upload").attr("src", data.miniGameDisplayOverviewSetting.miniGameScreenDesktopImageUrl);
                    $(".img-default-bg-pc-display-mini-game").hide();
                    btnCLoseImgBgPcDisplayMiniGame.show();
                    $(".img-bg-pc-display-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgPcDisplayMiniGame.hide();
                    $(".img-bg-pc-display-show-in-box-upload").hide();
                    $(".img-default-bg-pc-display-mini-game").show();
                }

                if (data.miniGameDisplayOverviewSetting.miniGameScreenMobileImageUrl != null) {
                    $("#imgBgMbDisplayMiniGame").val(data.miniGameDisplayOverviewSetting.miniGameScreenMobileImageUrl);
                    $(".img-bg-mb-display-show-in-box-upload").attr("src", data.miniGameDisplayOverviewSetting.miniGameScreenMobileImageUrl);
                    $(".img-default-bg-mb-display-mini-game").hide();
                    btnCLoseImgBgMobileDisplayMiniGame.show();
                    $(".img-bg-mb-display-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-display-show-in-box-upload").hide();
                    $(".img-default-bg-mb-display-mini-game").show();
                }

                var colorSettings = [
                    { key: "colorBgMainColorInput", value: data.miniGameDisplayOverviewSetting.backgroundScreenColorCode },
                    { key: "colorBgInBoxMiniGameColorInput", value: data.miniGameDisplayOverviewSetting.miniGameColorCode },
                    { key: "colorFontHeaderMainInputGroup1", value: data.miniGameDisplayOverviewSetting.textPrimaryHeaderColorCode },
                    { key: "colorFontHeaderSecondaryInputGroup1", value: data.miniGameDisplayOverviewSetting.textSecondaryHeaderColorCode },
                    { key: "colorFontMessageMainInputGroup1", value: data.miniGameDisplayOverviewSetting.textPrimaryMainColorCode },
                    { key: "colorFontMessageSecondaryInputGroup1", value: data.miniGameDisplayOverviewSetting.textSecondaryMainColorCode },
                    { key: "colorFontHighlightsInputGroup1", value: data.miniGameDisplayOverviewSetting.textHighlightColorCode1 },
                    { key: "colorFontCountDownInputGroup1", value: data.miniGameDisplayOverviewSetting.textCountDownColorCode },
                    { key: "colorBtnBgInputGroup2", value: data.miniGameDisplayOverviewSetting.buttonBackgroundColorCode },
                    { key: "colorBtnMessageInputGroup2", value: data.miniGameDisplayOverviewSetting.buttonTextColorCode },
                    { key: "colorBtnBorderInputGroup2", value: data.miniGameDisplayOverviewSetting.buttonFrameColorCode },
                    { key: "colorDisplayBgInputInputGroup2", value: data.miniGameDisplayOverviewSetting.frameBackgroundColorCode },
                    { key: "colorDisplayBorderInputGroup2", value: data.miniGameDisplayOverviewSetting.frameColorCode },
                    { key: "colorTableThBgInputGroup3", value: data.miniGameDisplayOverviewSetting.tableBackgroundColorCode },
                    { key: "colorTableThFontInputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextColorCode },
                    { key: "colorTableThBorderInputGroup3", value: data.miniGameDisplayOverviewSetting.tableFrameColorCode },
                    { key: "colorPaginationFontActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.pageActiveColorCode },
                    { key: "colorPaginationFontInActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.pageInActiveColorCode },
                    { key: "colorPaginationBgInActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.pageBackgroundInActiveColorCode },
                    { key: "colorPaginationBgActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.pageBackgroundActiveColorCode },
                    { key: "colorPaginationArrowInActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.arrowInActiveColorCode },
                    { key: "colorPaginationArrowActiveInputGroup3", value: data.miniGameDisplayOverviewSetting.arrowActiveColorCode },
                    { key: "colorTableTdBg1InputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextBackgroundColorCode1 },
                    { key: "colorTableTdBg2InputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextBackgroundColorCode2 },
                    { key: "colorTableTdFontInputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextPrimaryColorCode },
                    { key: "colorTableTdFontHighlights1InputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextHighlightColorCode1 },
                    { key: "colorTableTdFontHighlights2InputGroup3", value: data.miniGameDisplayOverviewSetting.tableTextHighlightColorCode2 },
                    { key: "colorTableTdBorderInputGroup3", value: data.miniGameDisplayOverviewSetting.tableDivideColorCode }
                ];

                colorSettings.forEach((item, index) => {
                    const colorKey = item.key; // ตัวแปร เช่น colorFontHeaderMainGroup1
                    const colorValue = item.value; // ค่าสี เช่น #FFFFFF หรือ gradient

                    // ตรวจสอบเงื่อนไข gradient

                    if (colorValue != null) {
                        if (colorValue.includes("gradient")) {
                            window[colorKey].set(colorValue);
                        } else {
                            window[colorKey].val(colorValue, true);
                        }
                    }

                    //console.log(`Set ${colorKey} => ${colorValue}`);
                });

            } else {
                //StepSettingDisplay Bg
                if (data.luckyWheelDisplayOverviewSetting.backgroundScreenDesktopImageUrl != null) {
                    $("#imgBgPcMiniGame").val(data.luckyWheelDisplayOverviewSetting.backgroundScreenDesktopImageUrl);
                    $(".img-bg-pc-show-in-box-upload").attr("src", data.luckyWheelDisplayOverviewSetting.backgroundScreenDesktopImageUrl);
                    $(".img-default-bg-pc-mini-game").hide();
                    btnCLoseImgBgPcMiniGame.show();
                    $(".img-bg-pc-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgPcMiniGame.hide();
                    $(".img-bg-pc-show-in-box-upload").hide();
                    $(".img-default-bg-pc-mini-game").show();
                }

                if (data.luckyWheelDisplayOverviewSetting.backgroundScreenMobileImageUrl != null) {
                    $("#imgBgMobileMiniGame").val(data.luckyWheelDisplayOverviewSetting.backgroundScreenMobileImageUrl);
                    $(".img-bg-mb-show-in-box-upload").attr("src", data.luckyWheelDisplayOverviewSetting.backgroundScreenMobileImageUrl);
                    $(".img-default-bg-mb-mini-game").hide();
                    btnCLoseImgBgMobileMiniGame.show();
                    $(".img-bg-mb-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-show-in-box-upload").hide();
                    $(".img-default-bg-mb-mini-game").show();
                }

                if (data.luckyWheelDisplayOverviewSetting.miniGameScreenDesktopImageUrl != null) {
                    $("#imgBgPcDisplayMiniGame").val(data.luckyWheelDisplayOverviewSetting.miniGameScreenDesktopImageUrl);
                    $(".img-bg-pc-display-show-in-box-upload").attr("src", data.luckyWheelDisplayOverviewSetting.miniGameScreenDesktopImageUrl);
                    $(".img-default-bg-pc-display-mini-game").hide();
                    btnCLoseImgBgPcDisplayMiniGame.show();
                    $(".img-bg-pc-display-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgPcDisplayMiniGame.hide();
                    $(".img-bg-pc-display-show-in-box-upload").hide();
                    $(".img-default-bg-pc-display-mini-game").show();
                }

                if (data.luckyWheelDisplayOverviewSetting.miniGameScreenMobileImageUrl != null) {
                    $("#imgBgMbDisplayMiniGame").val(data.luckyWheelDisplayOverviewSetting.miniGameScreenMobileImageUrl);
                    $(".img-bg-mb-display-show-in-box-upload").attr("src", data.luckyWheelDisplayOverviewSetting.miniGameScreenMobileImageUrl);
                    $(".img-default-bg-mb-display-mini-game").hide();
                    btnCLoseImgBgMobileDisplayMiniGame.show();
                    $(".img-bg-mb-display-show-in-box-upload").show();
                } else {
                    btnCLoseImgBgMobileMiniGame.hide();
                    $(".img-bg-mb-display-show-in-box-upload").hide();
                    $(".img-default-bg-mb-display-mini-game").show();
                }

                var colorSettings = [
                    { key: "colorBgMainColorInput", value: data.luckyWheelDisplayOverviewSetting.backgroundScreenColorCode },
                    { key: "colorBgInBoxMiniGameColorInput", value: data.luckyWheelDisplayOverviewSetting.miniGameColorCode },
                    { key: "colorFontHeaderMainInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textPrimaryHeaderColorCode },
                    { key: "colorFontHeaderSecondaryInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textSecondaryHeaderColorCode },
                    { key: "colorFontMessageMainInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textPrimaryMainColorCode },
                    { key: "colorFontMessageSecondaryInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textSecondaryMainColorCode },
                    { key: "colorFontHighlightsInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textHighlightColorCode1 },
                    { key: "colorFontCountDownInputGroup1", value: data.luckyWheelDisplayOverviewSetting.textCountDownColorCode },
                    { key: "colorBtnBgInputGroup2", value: data.luckyWheelDisplayOverviewSetting.buttonBackgroundColorCode },
                    { key: "colorBtnMessageInputGroup2", value: data.luckyWheelDisplayOverviewSetting.buttonTextColorCode },
                    { key: "colorBtnBorderInputGroup2", value: data.luckyWheelDisplayOverviewSetting.buttonFrameColorCode },
                    { key: "colorDisplayBgInputInputGroup2", value: data.luckyWheelDisplayOverviewSetting.frameBackgroundColorCode },
                    { key: "colorDisplayBorderInputGroup2", value: data.luckyWheelDisplayOverviewSetting.frameColorCode },
                    { key: "colorTableThBgInputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableBackgroundColorCode },
                    { key: "colorTableThFontInputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextColorCode },
                    { key: "colorTableThBorderInputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableFrameColorCode },
                    { key: "colorPaginationFontActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.pageActiveColorCode },
                    { key: "colorPaginationFontInActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.pageInActiveColorCode },
                    { key: "colorPaginationBgInActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.pageBackgroundInActiveColorCode },
                    { key: "colorPaginationBgActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.pageBackgroundActiveColorCode },
                    { key: "colorPaginationArrowInActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.arrowInActiveColorCode },
                    { key: "colorPaginationArrowActiveInputGroup3", value: data.luckyWheelDisplayOverviewSetting.arrowActiveColorCode },
                    { key: "colorTableTdBg1InputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextBackgroundColorCode1 },
                    { key: "colorTableTdBg2InputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextBackgroundColorCode2 },
                    { key: "colorTableTdFontInputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextPrimaryColorCode },
                    { key: "colorTableTdFontHighlights1InputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextHighlightColorCode1 },
                    { key: "colorTableTdFontHighlights2InputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableTextHighlightColorCode2 },
                    { key: "colorTableTdBorderInputGroup3", value: data.luckyWheelDisplayOverviewSetting.tableDivideColorCode }
                ];

                colorSettings.forEach((item, index) => {
                    const colorKey = item.key; // ตัวแปร เช่น colorFontHeaderMainGroup1
                    const colorValue = item.value; // ค่าสี เช่น #FFFFFF หรือ gradient

                    // ตรวจสอบเงื่อนไข gradient
                    if (colorValue != null) {
                        if (colorValue.includes("gradient")) {
                            window[colorKey].set(colorValue);
                        } else {
                            window[colorKey].val(colorValue, true);
                        }
                    }

                    //console.log(`Set ${colorKey} => ${colorValue}`);
                });
            }

            $('#minigameEnableStartEndDate').prop('checked', data.enableStartEndDate);

            if (data.iconUrl != "" && data.iconUrl != null) {
                $(".showImagePreviewImageIcon").attr("src", data.iconUrl);
                $("#imageIconUrl").val(data.iconUrl);
                $('#img-upload-image-icon-show').removeClass('d-none');
            } else {
                if (typeNow == 'mini-game') {
                    $(".showImagePreviewImageIcon").attr("src", LEGACY_ASSET_BASE + "/images/default/mini-game.png");
                    $("#imageIconUrl").val(LEGACY_ASSET_BASE + "/images/default/mini-game.png");
                } else {
                    $(".showImagePreviewImageIcon").attr("src", LEGACY_ASSET_BASE + "/images/default/ic-wheel.png");
                    $("#imageIconUrl").val(LEGACY_ASSET_BASE + "/images/default/ic-wheel.png");
                }
            }

            if (data.enableStartEndDate) {
                $("#enableStartEndDate").val(true);

                $('#startDateSettingMinigameFromInput').prop('disabled', false);
                $('#startTimeSettingMinigameInput').prop('disabled', false);
                $('#endDateSettingMinigameFromInput').prop('disabled', false);
                $('#endTimeSettingMinigameInput').prop('disabled', false);

                $('#enableHiddenTime').prop('disabled', false);
            } else {
                $("#enableStartEndDate").val(false);

                $('#startDateSettingMinigameFromInput').prop('disabled', true);
                $('#startTimeSettingMinigameInput').prop('disabled', true);
                $('#endDateSettingMinigameFromInput').prop('disabled', true);
                $('#endTimeSettingMinigameInput').prop('disabled', true);

                $('#enableHiddenTime').prop('disabled', true);
            }

            $('#enableHiddenTime').val(data.enableHiddenTime);
            $('#enableHiddenTime').prop('checked', data.enableHiddenTime);

            endDatePicker.set("minDate", changeDateFormat(data.startDate?.toString()));
            $('#startDateSettingMinigameFromInput').val(changeDateFormat(data.startDate?.toString()));
            $('#endDateSettingMinigameFromInput').val(changeDateFormat(data.endDate?.toString()));
            $('#startTimeSettingMinigameInput').val(data.startTime);
            $('#endTimeSettingMinigameInput').val(data.endTime);
            let arrayCheckDefault = [];
            let urlimg;
            if (typeNow == 'mini-game') {
                customNumberPartsMinigame.setValue(data.pieceAmount == 0 ? 8 : data.pieceAmount);
                customNumberPartsMinigame.update();
                changeMinigame(data.pieceAmount == 0 ? 6 : data.pieceAmount);

                if (data.miniGameDisplaySettingStepOne.miniGamePictuerList != null) {
                    $(`.imgMinigameRewardMainSrc`).attr('src', data.miniGameDisplaySettingStepOne.miniGamePictuerList[0].imageUrl);
                    $(`.imgMinigameRewardMainSrc`).show();
                    $(`.imgMinigameRewardSrc`).attr('src', data.miniGameDisplaySettingStepOne.miniGamePictuerList[0].imageUrl);
                    $(`.imgMinigameRewardSrc`).show();

                    let cloneWheelMain;
                    let cloneTemplate = $('#eleMinigameReward').clone();
                    cloneWheelMain = $(cloneTemplate.html());
                    $('#showStepEnd').addClass('preview-minigame');
                    $('#showStepEnd').html(cloneWheelMain);
                    arrayCheckDefault.push(false);
                } else {
                    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/`;
                    $(`.imgMinigameRewardMainSrc`).attr("src", urlimg + 'minigame-reward.png');
                    $(`.imgMinigameRewardMainSrc`).show();
                    $(`.imgMinigameRewardSrc`).attr("src", urlimg + 'minigame-reward.png');
                    $(`.imgMinigameRewardSrc`).show();
                    arrayCheckDefault.push(true);
                }
                if (data.afterImageUrl) {
                    $(`.imgMinigamePopupSrc`).attr('src', data.afterImageUrl);
                    $(`.imgMinigamePopupSrc`).show();
                    arrayCheckDefault.push(false);
                } else {
                    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/`;
                    $(`.imgMinigamePopupSrc`).attr("src", urlimg + 'minigame-popup.png');
                    $(`.imgMinigamePopupSrc`).show();
                    arrayCheckDefault.push(true);
                }
            }
            else {
                customNumberPartsLuckywheel.setValue(data.pieceAmount == 0 ? 8 : data.pieceAmount);
                customNumberPartsLuckywheel.update();
                showLabalLuckywheelImagePixel(data.pieceAmount == 0 ? 8 : data.pieceAmount);
                changeWheel(data.pieceAmount == 0 ? 8 : data.pieceAmount);
                if (data.pieceAmount != 0) {
                    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/wheel-${data.pieceAmount}/`;
                } else {
                    urlimg = `${LEGACY_ASSET_BASE}/images/minigame/wheel-8/`;
                }
                if (data.centerImageUrl) {
                    $(`.luckywheelSpinBtnSrc`).attr('src', data.centerImageUrl);
                    $(`.luckywheelSpinBtnSrc`).show();
                    arrayCheckDefault.push(false);
                } else {
                    $(`.luckywheelSpinBtnSrc`).attr("src", urlimg + 'button.png');
                    $(`.luckywheelSpinBtnSrc`).show();
                    arrayCheckDefault.push(true);
                }
                if (data.backgroundImageUrl) {
                    $(`.luckywheelFrameSrc`).attr('src', data.backgroundImageUrl);
                    $(`.luckywheelFrameSrc`).show();
                    arrayCheckDefault.push(false);
                } else {
                    $(`.luckywheelFrameSrc`).attr("src", urlimg + 'frame.png');
                    $(`.luckywheelFrameSrc`).show();
                    arrayCheckDefault.push(true);
                }
                if (data.rewardImageUrl) {
                    $(`.luckywheelGetRewardSrc`).attr('src', data.rewardImageUrl);
                    $(`.luckywheelGetRewardSrc`).show();
                    arrayCheckDefault.push(false);
                } else {
                    $(`.luckywheelGetRewardSrc`).attr("src", urlimg + 'popup.png');
                    $(`.luckywheelGetRewardSrc`).show();
                    arrayCheckDefault.push(true);
                }
            }
            let checkDefault = arrayCheckDefault.every(val => val === true);
            if (checkDefault) {
                $(`.btnSetDefault`).addClass('disabled');
            } else {
                $(`.btnSetDefault`).removeClass('disabled');
            }

            let workingDaysArray;
            if (typeNow == 'mini-game') {
                workingDaysArray = data.miniGameWorkingDays;
            } else {
                workingDaysArray = data.luckyWheelWorkingDays;
            }

            if (workingDaysArray.enableSunday) {
                $('#showEnableSunday').show();
                hiddenActiveEnableSunday = true;
                $("#enableSunday").removeClass("no-select");
            } else {
                $('#showEnableSunday').hide();
                hiddenActiveEnableSunday = false;
                $("#enableSunday").addClass("no-select");
            }

            if (workingDaysArray.enableMonday) {
                $('#showEnableMonday').show();
                hiddenActiveEnableMonday = true;
                $("#enableMonday").removeClass("no-select");
            } else {
                $('#showEnableMonday').hide();
                hiddenActiveEnableMonday = false;
                $("#enableMonday").addClass("no-select");
            }

            if (workingDaysArray.enableTuesday) {
                $('#showEnableTuesday').show();
                hiddenActiveEnableTuesday = true;
                $("#enableTuesday").removeClass("no-select");
            } else {
                $('#showEnableTuesday').hide();
                hiddenActiveEnableTuesday = false;
                $("#enableTuesday").addClass("no-select");
            }

            if (workingDaysArray.enableWednesday) {
                $('#showEnableWednesday').show();
                hiddenActiveEnableWednesday = true;
                $("#enableWednesday").removeClass("no-select");
            } else {
                $('#showEnableWednesday').hide();
                hiddenActiveEnableWednesday = false;
                $("#enableWednesday").addClass("no-select");
            }

            if (workingDaysArray.enableThursday) {
                $('#showEnableThursday').show();
                hiddenActiveEnableThursday = true;
                $("#enableThursday").removeClass("no-select");
            } else {
                $('#showEnablThursday').hide();
                hiddenActiveEnableThursday = false;
                $("#enableThursday").addClass("no-select");
            }

            if (workingDaysArray.enableFriday) {
                $('#showEnableFriday').show();
                workingDaysArray.enableFriday = true;
                $("#enableFriday").removeClass("no-select");
            } else {
                $('#showEnableFriday').hide();
                hiddenActiveEnableFriday = false;
                $("#enableFriday").addClass("no-select");
            }

            if (workingDaysArray.enableSaturday) {
                $('#showEnableSaturday').show();
                hiddenActiveEnableSaturday = true;
                $("#enableSaturday").removeClass("no-select");
            } else {
                $('#showEnableSaturday').hide();
                hiddenActiveEnableSaturday = false;
                $("#enableSaturday").addClass("no-select");
            }

            if (workingDaysArray.enableMonday &&
                workingDaysArray.enableTuesday &&
                workingDaysArray.enableWednesday &&
                workingDaysArray.enableThursday &&
                workingDaysArray.enableFriday &&
                !workingDaysArray.enableSaturday &&
                !workingDaysArray.enableSunday) {
                hiddenActivePromotionSelectWeekday = true;
                hiddenActivePromotionSelectWeekend = false;
                hiddenActivePromotionSelectEveryday = false;
                changePromotionSelectWeekday();
            } else if (!workingDaysArray.enableMonday &&
                !workingDaysArray.enableTuesday &&
                !workingDaysArray.enableWednesday &&
                !workingDaysArray.enableThursday &&
                !workingDaysArray.enableFriday &&
                workingDaysArray.enableSaturday &&
                workingDaysArray.enableSunday) {
                hiddenActivePromotionSelectWeekday = false;
                hiddenActivePromotionSelectWeekend = true;
                hiddenActivePromotionSelectEveryday = false;
                changePromotionSelectWeekend();
            } else if (workingDaysArray.enableMonday &&
                workingDaysArray.enableTuesday &&
                workingDaysArray.enableWednesday &&
                workingDaysArray.enableThursday &&
                workingDaysArray.enableFriday &&
                workingDaysArray.enableSaturday &&
                workingDaysArray.enableSunday) {
                hiddenActivePromotionSelectWeekday = false;
                hiddenActivePromotionSelectWeekend = false;
                hiddenActivePromotionSelectEveryday = true;
                changePromotionSelectEveryday();

                $('#showEnableEveryday').show();
                $('#showEnableSunday').hide();
                $('#showEnableMonday').hide();
                $('#showEnableTuesday').hide();
                $('#showEnableWednesday').hide();
                $('#showEnableThursday').hide();
                $('#showEnableFriday').hide();
                $('#showEnableSaturday').hide();
            } else {
                hiddenActivePromotionSelectWeekday = true;
                hiddenActivePromotionSelectWeekend = true;
                hiddenActivePromotionSelectEveryday = true;

                $("#boxPromotionSelectWeekday").addClass("no-select");
                $("#boxPromotionSelectWeekend").addClass("no-select");
                $("#boxPromotionSelectEveryday").addClass("no-select");
            }

            let workingTimesArray;
            if (typeNow == 'mini-game') {
                workingTimesArray = data.miniGameTimes;
            } else {
                workingTimesArray = data.luckyWheelTimes;
            }
            var dataList = workingTimesArray;

            if (dataList.length > 0) {
                for (const lists of dataList) {
                    addTemplateMinigameDatetime(lists);
                }
            } else {
                addTemplateMinigameDatetime();
            }

            let countDownsArray;
            if (typeNow == 'mini-game') {
                countDownsArray = data.miniGameCountDowns;
            } else {
                countDownsArray = data.luckyWheelCountDowns;
            }

            $('#changeMinigameEnableCountDown').prop('checked', countDownsArray.enableCountDown);
            $('#minigameEnableCountDownCreated').prop('checked', countDownsArray.enableCountDownCreated);
            $('#minigameEnableCountDownSetTime').prop('checked', countDownsArray.enableCountDownSetTime);
            $('#minigameEnableRemainingDay').prop('checked', countDownsArray.enableRemainingDay);
            $('#minigameCountdownRemainingDay').val(countDownsArray.remainingDay);
            $('#minigameEnableRemainingDateTime').prop('checked', countDownsArray.enableRemainingDateTime);
            $('#minigameCountdownRemainingDateBkk').val(countDownsArray.remainingDateBkk);
            $('#minigameCountdownRemainingTimeBkk').val(countDownsArray.remainingTimeBkk);
            $(`input[name="minigameCountDownColorCodeRadio"][value="${countDownsArray.countDownColorCode || '1'}"]`).prop('checked', true);
            iframeShowCountDownPreview(countDownsArray.countDownColorCode);

            changeStatusSwitch('#changeMinigameEnableCountDown', `2-2-1`);
            let limitPromotionsArray;
            if (typeNow == 'mini-game') {
                limitPromotionsArray = data.miniGameLimitPromotions;
            } else {
                limitPromotionsArray = data.luckyWheelLimitPromotions;
            }

            setValueCheckBox("minigameEnableMaxCountPerDay", limitPromotionsArray.enableMaxCountPerDay);
            $('#minigameMaxCountPerDay').val(limitPromotionsArray.maxCountPerDay);
            setValueCheckBox("minigameEnableMaxCountPerWeek", limitPromotionsArray.enableMaxCountPerWeek);
            $('#minigameMaxCountPerWeek').val(limitPromotionsArray.maxCountPerWeek);
            setValueCheckBox("minigameEnableMaxCountPerMonth", limitPromotionsArray.enableMaxCountPerMonth);

            $('#minigameMaxCountPerMonth').val(limitPromotionsArray.maxCountPerMonth);
            setValueCheckBox("minigameEnableMaxCountPerPromotion", limitPromotionsArray.enableMaxCountPerPromotion);
            $('#minigameMaxCountPerPromotion').val(limitPromotionsArray.maxCountPerPromotion);

            setValueSwitch("minigameEnableMaxPromotion", limitPromotionsArray.enableMaxPromotion);

            setValueCheckBox("minigameEnableMaxCountPerDayPerPerson", limitPromotionsArray.enableMaxCountPerDayPerPerson);
            $('#minigameMaxCountPerDayPerPerson').val(limitPromotionsArray.maxCountPerDayPerPerson);
            setValueCheckBox("minigameEnableMaxCountPerTimePerPerson", data.enableMaxRedeemPerDeposit);
            $('#minigameMaxCountPerTimePerPerson').val(data.maxRedeemPerDeposit);
            setValueCheckBox("minigameEnableMaxCountPerWeekPerPerson", limitPromotionsArray.enableMaxCountPerWeekPerPerson);
            $('#minigameMaxCountPerWeekPerPerson').val(limitPromotionsArray.maxCountPerWeekPerPerson);
            setValueCheckBox("minigameEnableMaxCountPerMonthPerPerson", limitPromotionsArray.enableMaxCountPerMonthPerPerson);
            $('#minigameMaxCountPerMonthPerPerson').val(limitPromotionsArray.maxCountPerMonthPerPerson);
            setValueCheckBox("minigameEnableMaxCountPerPerson", limitPromotionsArray.enableMaxCountPerPerson);
            $('#minigameMaxCountPerPerson').val(limitPromotionsArray.maxCountPerPerson);

            setValueSwitch("minigameEnableMaxPromotionPerPerson", limitPromotionsArray.enableMaxPromotionPerPerson);

            let miniGameResetsArray;
            if (typeNow == 'mini-game') {
                miniGameResetsArray = data.miniGameResets;
            } else {
                miniGameResetsArray = data.luckyWheelResets;
            }

            setValueCheckBox("minigameEnableResetExpired", miniGameResetsArray.enableResetExpired);
            setValueCheckBox("minigameEnableResetTime", miniGameResetsArray.enableResetTime);
            $('#minigameResetTimeBkk').val(miniGameResetsArray.resetTimeBkk);
            setValueCheckBox("minigameEnableResetDateTime", miniGameResetsArray.enableResetDateTime);

            $('#minigameResetDay').val(miniGameResetsArray.day);
            $('#minigameResetHour').val(miniGameResetsArray.hour);
            $('#minigameResetMinute').val(miniGameResetsArray.minute);

            setValueSwitch("minigameEnableReset", miniGameResetsArray.enableReset);

            let removeChancesArray;
            if (typeNow == 'mini-game') {
                removeChancesArray = data.miniGameRemoveChances;
            } else {
                removeChancesArray = data.luckyWheelRemoveChances;
            }
            var dataList = removeChancesArray;

            for (const lists of dataList) {
                addTemplateMinigameRemoveChance(lists);
            }

            setValueSwitch("minigameEnableRemoveChance", data.enableRemoveChance);

            let FixChancesArray;
            if (typeNow == 'mini-game') {
                FixChancesArray = data.miniGameFixChances;
            } else {
                FixChancesArray = data.luckyWheelFixChances;
            }
            setValueCheckBox("minigameEnableLimitPerGamePerDay", FixChancesArray.enableLimitPerGamePerDay);
            $('#minigameLimitPerGamePerDay').val(FixChancesArray.limitPerGamePerDay);
            setValueCheckBox("minigameEnableLimitPerPerson", FixChancesArray.enableLimitPerPerson);
            $('#minigameLimitPerPerson').val(FixChancesArray.limitPerPerson);
            setValueCheckBox("minigameEnableLimitBalance", FixChancesArray.enableLimitBalance);
            $('#minigameLimitBalance').val(FixChancesArray.limitBalance);

            setValueSwitch("minigameEnableFixChance", FixChancesArray.enableFixChance);

            let AutoDepositsArray;
            if (typeNow == 'mini-game') {
                AutoDepositsArray = data.miniGameAutoDeposits;
            } else {
                AutoDepositsArray = data.luckyWheelAutoDeposits;
            }

            if (AutoDepositsArray.depositType == null || AutoDepositsArray.depositType == '') {
                customMinigameDepositTypeDropdown.clearValue();
            } else {
                customMinigameDepositTypeDropdown.setValue(AutoDepositsArray.depositType);
                customMinigameDepositTypeDropdown.update();
                customMinigameDepositTypeDropdown.options.onSelect();
            }

            if (AutoDepositsArray.depositAmountType == null || AutoDepositsArray.depositAmountType == '') {
                customMinigameDepositAmountTypeDropdown.clearValue()
            } else {
                customMinigameDepositAmountTypeDropdown.setValue(AutoDepositsArray.depositAmountType);
                customMinigameDepositAmountTypeDropdown.update();
                customMinigameDepositAmountTypeDropdown.options.onSelect()
            }

            $('#minigameMinAmountAutoDeposit').val(AutoDepositsArray.minAmountAutoDeposit);
            $('#minigameMaxAmountAutoDeposit').val(AutoDepositsArray.maxAmountAutoDeposit);
            $('#minigameAmountAutoDeposit').val(AutoDepositsArray.amountAutoDeposit);
            $('#minigameAmountAutoDepositFrom').val(AutoDepositsArray.amountAutoDepositFrom);
            $('#minigameAmountAutoDepositTo').val(AutoDepositsArray.amountAutoDepositTo);
            $('#minigameDepositPeriod').val(AutoDepositsArray.period);
            $('#minigameDepositCount').val(AutoDepositsArray.depositCount);
            $("#isMemberPromotionSuccess").prop("checked", AutoDepositsArray.isMemberPromotionSuccess);
            $("#isMemberCanCancel").prop("checked", AutoDepositsArray.isMemberCanCancel);

            let RewardsArray;
            if (typeNow == 'mini-game') {
                RewardsArray = data.miniGameRewards;
            } else {
                RewardsArray = data.luckyWheelRewards;
            }
            var dataList = RewardsArray;

            for (const lists of dataList) {
                addtemplateMinigameWheel(lists);
            }

            let TurnoverConditionsArray;
            if (typeNow == 'mini-game') {
                TurnoverConditionsArray = data.miniGameTurnoverConditions;
            } else {
                TurnoverConditionsArray = data.luckyWheelTurnoverConditions;
            }

            setValueSwitch("minigameEnableConditionTurnover", TurnoverConditionsArray.enableConditionTurnover);
            setValueCheckBox("minigameEnableWithdrawConditionMinTurnover", TurnoverConditionsArray.enableWithdrawConditionMinTurnover);
            $('#minigameWithdrawConditionMinTurnover').val(TurnoverConditionsArray.withdrawConditionMinTurnover);
            setValueCheckBox("minigameEnableWithdrawConditionMinTurnoverCredit", TurnoverConditionsArray.enableWithdrawConditionMinTurnoverCredit);
            $('#minigameWithdrawConditionMinTurnoverCredit').val(TurnoverConditionsArray.withdrawConditionMinTurnoverCredit);
            $('#minigameWithdrawConditionMinTurnoverMinCredit').val(TurnoverConditionsArray.withdrawConditionMinTurnoverMinCredit); // minCredit
            setValueCheckBox("disableMinTurnOverMinCredit", TurnoverConditionsArray.disableMinTurnOverMinCredit); // 

            setValueCheckBox("minigameEnableMaxRemainCreditToClearTurnover", TurnoverConditionsArray.enableMaxRemainCreditToClearTurnover);
            $('#minigameMaxRemainCreditToClearTurnover').val(TurnoverConditionsArray.maxRemainCreditToClearTurnover);
            setValueCheckBox("minigameEnableMaxRemainCreditToClearTurnoverPercentage", TurnoverConditionsArray.enableMaxRemainCreditToClearTurnoverPercentage);
            $('#minigameMaxRemainCreditToClearTurnoverPercentage').val(TurnoverConditionsArray.maxRemainCreditToClearTurnoverPercentage);

            setValueSwitch("minigameEnableCreditToClearTurnover", TurnoverConditionsArray.enableCreditToClearTurnover);


            setValueRadio("minigameEnableTurnOverDepositOn", TurnoverConditionsArray.enableTurnOverDeposit);
            setValueCheckBox("minigameEnableMinTurnoverCredit", TurnoverConditionsArray.enableMinTurnoverCredit);
            $('#minigameminTurnoverCredit').val(TurnoverConditionsArray.minTurnoverCredit);
            setValueCheckBox("minigameEnableMinTurnover", TurnoverConditionsArray.enableMinTurnover);
            $('#minigameMinTurnover').val(TurnoverConditionsArray.minTurnover);
            setValueSwitch("minigameEnableIncreaseTurnOver", TurnoverConditionsArray.enableIncreaseTurnOver);
            $("input[name=minigameTurnoverPeriodSettingRadio][value=" + (TurnoverConditionsArray.enableTurnoverPeriodSetting == true ? true : false) + "]").prop('checked', true);
            $('#inputMinigameTurnOverHours').val(TurnoverConditionsArray.turnOverPeriodHours);

            if (TurnoverConditionsArray.enableTurnoverPeriodSetting) {
                $("#inputMinigameTurnoverPeriodSettingOffRadio").removeClass('disabled');
            }

            let WithdrawConditionsArray;
            let customerGroupLists;

            if (typeNow == 'mini-game') {
                WithdrawConditionsArray = data.miniGameWithdrawConditions;
                customerGroupLists = data.miniGameCustomerGroupList;

                $('#enableCreditBalance').val(data.miniGameFixChances.enableCreditBalance);
                $('#enableCreditBalance').prop('checked', data.miniGameFixChances.enableCreditBalance);

                if (data.miniGameFixChances.enableCreditBalance) {
                    $('#inputCreditBalance').removeClass("disabled");
                } else {
                    $('#inputCreditBalance').addClass("disabled");
                }

                $('#creditBalance').val(data.miniGameFixChances.creditBalance);
            } else {
                WithdrawConditionsArray = data.luckyWheelWithdrawConditions;
                customerGroupLists = data.luckyWheelCustomerGroupList;

                $('#enableCreditBalance').val(data.luckyWheelFixChances.enableCreditBalance);
                $('#enableCreditBalance').prop('checked', data.luckyWheelFixChances.enableCreditBalance);

                if (data.luckyWheelFixChances.enableCreditBalance) {
                    $('#inputCreditBalance').removeClass("disabled");
                } else {
                    $('#inputCreditBalance').addClass("disabled");
                }

                $('#creditBalance').val(data.luckyWheelFixChances.creditBalance);
            }

            setValueCheckBox("minigameEnableCreditRemain", WithdrawConditionsArray.enableCreditRemain);
            $('#minigameCreditRemain').val(WithdrawConditionsArray.creditRemain);
            setValueCheckBox("minigameEnableMaxWithdraw", WithdrawConditionsArray.enableMaxWithdraw);
            $('#minigameMaxWithdraw').val(WithdrawConditionsArray.maxWithdraw);
            setValueCheckBox("minigameEnableDeductCreditAll", WithdrawConditionsArray.enableDeductCreditAll);
            setValueCheckBox("minigameDisableAutoWithdraw", WithdrawConditionsArray.disableAutoWithdraw);

            setValueSwitch("minigameEnableWithdrawCondition", WithdrawConditionsArray.enableWithdrawCondition);

            $('#enableLimitCustomerGroup').val(data.enableLimitCustomerGroup);

            if (data.enableLimitCustomerGroup) {
                $(".boxEnableLimitCustomerGroup").removeClass('disabled');
                $('#enableLimitCustomerGroup').val(true);
                $('#enableLimitCustomerGroup').prop('checked', true);
                $(".boxEnableLimitCustomerGroupShow").removeClass('disabled');

                $('#showEnableLimitCustomerGroupActive').show();
                $('#showEnableLimitCustomerGroupInactive').hide();
            } else {
                $(".boxEnableLimitCustomerGroup").addClass('disabled');
                $('#enableLimitCustomerGroup').val(false);
                $('#enableLimitCustomerGroup').prop('checked', false);
                $(".boxEnableLimitCustomerGroupShow").addClass('disabled');

                $('#showEnableLimitCustomerGroupActive').hide();
                $('#showEnableLimitCustomerGroupInactive').show();
            }

            if (data.enableLimitCustomerGroupShow) {
                $('#enableLimitCustomerGroupShow').val(true);
                $('#enableLimitCustomerGroupShow').prop('checked', true);
            } else {
                $('#enableLimitCustomerGroupShow').val(false);
                $('#enableLimitCustomerGroupShow').prop('checked', false);
            }

            // ตั้งค่าตรวจสอบยอด Balance และ ยอดถอน เมื่อสมาชิกทำการถอนเงิน
            $("#customerCreditBalance").val(data.customerCreditBalance);
            $("#reduceQuota").val(data.reduceQuota);
            $("#customerCreditWithdraw").val(data.customerCreditWithdraw);
            $("#reduceQuotaWithdraw").val(data.reduceQuotaWithdraw);

            if (data.enableCustomerCreditBalance) {
                $("#enableCustomerCreditBalance").val(true);
                $('#enableCustomerCreditBalance').prop('checked', true);
                $("#enableReduceAllQuota").prop('disabled', false);
                $("#reduceQuota").prop('disabled', false);
                $("#customerCreditBalance").prop('disabled', false);
            } else {
                $("#enableCustomerCreditBalance").val(false);
                $('#enableCustomerCreditBalance').prop('checked', false);
                $("#enableReduceAllQuota").prop('disabled', true);
                $("#reduceQuota").prop('disabled', true);
                $("#customerCreditBalance").prop('disabled', true);
            }

            if (data.enableCustomerCreditWithdraw) {
                $("#enableCustomerCreditWithdraw").val(true);
                $('#enableCustomerCreditWithdraw').prop('checked', true);
                $("#enableReduceAllQuotaWithdraw").prop('disabled', false);
                $("#customerCreditWithdraw").prop('disabled', false);
                $("#reduceQuotaWithdraw").prop('disabled', false);
            } else {
                $("#enableCustomerCreditWithdraw").val(false);
                $('#enableCustomerCreditWithdraw').prop('checked', false);
                $("#enableReduceAllQuotaWithdraw").prop('disabled', true);
                $("#customerCreditWithdraw").prop('disabled', true);
                $("#reduceQuotaWithdraw").prop('disabled', true);
            }

            if (data.enableReduceAllQuota) {
                $("#enableReduceAllQuota").val(true);
                $('#enableReduceAllQuota').prop('checked', true);
            } else {
                $("#enableReduceAllQuota").val(false);
                $('#enableReduceAllQuota').prop('checked', false);
            }

            if (data.enableReduceAllQuotaWithdraw) {
                $("#enableReduceAllQuotaWithdraw").val(true);
                $('#enableReduceAllQuotaWithdraw').prop('checked', true);
            } else {
                $("#enableReduceAllQuotaWithdraw").val(false);
                $('#enableReduceAllQuotaWithdraw').prop('checked', false);
            }

            var customerGroupListsArray = customerGroupLists.map(x => (`${x.id}`))

            customLimitCustomerGroupDropdown.setValue(customerGroupListsArray);
            customLimitCustomerGroupDropdown.update();

            var customerGroupListsArrayByName = customerGroupLists.map(x => (x.name));

            getShowLimitCustomerGroupActiveHtml(customerGroupListsArrayByName);

            let agentGroupLists;


            if (typeNow == 'mini-game') {
                agentGroupLists = data.miniGameAgentGroupList;
            } else {
                agentGroupLists = data.luckyWheelAgentGroupList;
            }

            var agentGroupListsArray = agentGroupLists.map(x => (`${x.agentId}`))[0];

            customSelectAgentDropdown.setValue(agentGroupListsArray);
            customSelectAgentDropdown.update();

            var agentGroupListsArrayByName = agentGroupLists.map(x => (x.name));

            getShowLimitAgentGroupActiveHtml(agentGroupListsArrayByName);

            if (customerGroupLists != "" && customerGroupLists != null && customerGroupLists.length != 0) {
                $('#showLimitCustomerGroupActive').show();
                $('#showLimitCustomerGroupInactive').hide();
            } else {
                $('#showLimitCustomerGroupActive').hide();
                $('#showLimitCustomerGroupInactive').show();
            }

            if (sequencePie != "" || sequencePie != null) {
                getMinigameDetail(sequencePie);
            } else {
                getMinigameDetail();
            }

            $(`.invalid-feedback`).hide();

            $('#wheelNumber').text(`Wheel ${sequencePie} - จำนวนโบนัสที่แจก`);

            let wheelCheckLimit = "";

            if (isUnlimited == "True") {
                wheelCheckLimit = "<span>ไม่จำกัด</span>";
            } else {
                wheelCheckLimit = `<span>${provided}/${limitAmount}</span>`;
            }
            $('.wheelCheckLimit').html(wheelCheckLimit);

            var brandGamesArray;
            var isGameProviderEnable = false;
            var brandGamesHtml = "";
            var brandGamesHtmlLoop = "";

            $(".provider-count-display").html(data.gameProviderTotal);
            $(".provider-selected-count-display").html(data.gameProviderSelectedTotal);

            if (typeNow == 'mini-game') {
                brandGamesArray = data.miniGameBrandGamesLists;

                console.log('brandGamesArray', brandGamesArray);

                isGameProviderEnable = data.enableBrandGame;
                var anySport = false;
                var anyGame = false;
                var anyCasino = false;
                var anyLotto = false;
                for (var i = 0; i < brandGamesArray.length; i++) {
                    if (brandGamesArray[i].isChecked) {
                        var catString = brandGamesArray[i].categoryString;

                        brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-shown col-4 col-md-4 mb-2" 
                                           is-category-sport="${brandGamesArray[i].isSport}" 
                                           is-category-game="${brandGamesArray[i].isGame}" 
                                           is-category-casino="${brandGamesArray[i].isCasino}" 
                                           is-category-lotto="${brandGamesArray[i].islotto}">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox"
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${catString}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           checked>
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;

                    } else {

                        var catString = brandGamesArray[i].categoryString;

                        var classDisplay = "game-provider-input-hide";
                        if (anySport == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyGame == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyCasino == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyLotto == true) {
                            classDisplay = "game-provider-input-shown";
                        }


                        brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div ` + classDisplay + ` col-4 col-md-4 mb-2" 
                                           is-category-sport="${brandGamesArray[i].isSport}" 
                                           is-category-game="${brandGamesArray[i].isGame}" 
                                           is-category-casino="${brandGamesArray[i].isCasino}" 
                                           is-category-lotto="${brandGamesArray[i].islotto}">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input game-provider-input-shown" type="checkbox"
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${brandGamesArray[i].categoryString}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                    }
                }

                $(".games-display-check-list").html(brandGamesHtml);
                if (isGameProviderEnable) {
                    $('#minigameEnableGameProvider').prop('checked', true);
                    var btt = $("#minigameEnableGameProvider");
                    changeStatusSwitch(btt, '2-3-7');
                } else {
                    $('#minigameEnableGameProvider').prop('checked', false);
                }
                $(".game-provider-checker-input").bind("change", function () {
                    countingGameProviderSelected();
                });

                onSelectGameProvider("1", "active");
            }
            else {
                brandGamesArray = data.luckyWheelBrandGamesLists;
                isGameProviderEnable = data.enableBrandGame;
                var anySport = false;
                var anyGame = false;
                var anyCasino = false;
                var anyLotto = false;
                for (var i = 0; i < brandGamesArray.length; i++) {
                    if (brandGamesArray[i].isChecked) {
                        var catString = brandGamesArray[i].categoryString;

                        brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-shown col-4 col-md-4 mb-2" 
                                           is-category-sport="${brandGamesArray[i].isSport}" 
                                           is-category-game="${brandGamesArray[i].isGame}" 
                                           is-category-casino="${brandGamesArray[i].isCasino}" 
                                           is-category-lotto="${brandGamesArray[i].islotto}">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox"
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${catString}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           checked>
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;

                    } else {
                        var classDisplay = "game-provider-input-hide";
                        if (anySport == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyGame == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyCasino == true) {
                            classDisplay = "game-provider-input-shown";
                        }
                        if (anyLotto == true) {
                            classDisplay = "game-provider-input-shown";
                        }

                        brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div ` + classDisplay + ` col-4 col-md-4 mb-2" 
                                           is-category-sport="${brandGamesArray[i].isSport}" 
                                           is-category-game="${brandGamesArray[i].isGame}" 
                                           is-category-casino="${brandGamesArray[i].isCasino}" 
                                           is-category-lotto="${brandGamesArray[i].islotto}">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox"
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${brandGamesArray[i].categoryString}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                    }
                }
                $(".games-display-check-list").html(brandGamesHtml);
                if (isGameProviderEnable) {
                    $('#minigameEnableGameProvider').prop('checked', true);
                    var btt = $("#minigameEnableGameProvider");
                    changeStatusSwitch(btt, '2-3-7')
                } else {
                    $('#minigameEnableGameProvider').prop('checked', false);
                }
                $(".game-provider-checker-input").bind("change", function () {
                    countingGameProviderSelected();
                });

                onSelectGameProvider("1", "active");
            }
            countingGameProviderSelected();
        } else {
            customSwal.open({
                type: 'danger',
                title: 'ทำรายการไม่สำเร็จ !',
                showConfirmButton: false,
                cancelText: 'ปิดหน้าต่าง',
                text: `พบปัญหาในการดึงข้อมูล Error : ${res.status}`
            });
        }

    }).fail(function () {
        customSwal.open({
            type: 'danger',
            title: 'ทำรายการไม่สำเร็จ !',
            showConfirmButton: false,
            cancelText: 'ปิดหน้าต่าง',
            text: `พบปัญหาในการดึงข้อมูล`
        });
    });
    if (req.status == 200) {
        return true;
    } else {
        return false;
    }
};

function changeWheel(number) {
    let url = `${LEGACY_ASSET_BASE}/images/minigame/wheel-${number}/`;
    let html = `<div class="custom-wheel wheel-${number}" data-deg="0">
                                                                    <div class="wheel-item-all">`;
    let htmlTest = `<div class="custom-wheel wheel-${number} test-spin" data-deg="0">
                                                                    <div class="wheel-item-all">`;
    for (let i = 0; i < number; i++) {
        html += `<div class="wheel-item" style="--item: ${i + 1};">
                                                    <div class="wheel-image">
                                                                        <img draggable='false' src='${url}pie-${i + 1}.png' class="luckywheelWheel${i + 1}Src" />
                                                    </div>
                                                </div>`;
        htmlTest += `<div class="wheel-item" style="--item: ${i + 1};">
                                                    <div class="wheel-image">
                                                                        <img draggable='false' src='${url}pie-${i + 1}.png' class="luckywheelWheel${i + 1}Src" />
                                                    </div>
                                                </div>`;

        $(`.luckywheelWheel${i + 1}Src`).attr("src", `${url}pie-${i + 1}.png`);
    }
    html += `</div></div><div class="wheel-spin">
                                                                                    <img draggable='false' src='${url}button.png' class="luckywheelSpinBtnSrc" />
                                                                            </div>
                                                                        <div class="wheel-frame">
                                                                                            <img draggable='false' src='${url}frame.png' class="luckywheelFrameSrc" />
                                                                        </div>`;
    htmlTest += `</div></div><div class="wheel-spin" onclick="spinWheel()">
                                                                                            <img draggable='false' src='${url}button.png' class="luckywheelSpinBtnSrc" />
                                                                                    </div>
                                                                                <div class="wheel-frame">
                                                                                                    <img draggable='false' src='${url}frame.png' class="luckywheelFrameSrc" />
                                                                                </div>`;
    $(`#wheelShow1`).html(html);
    $(`#wheelShowTest`).html(htmlTest);

    let html2 = `<div class="custom-wheel-out wheel-${number}">`;
    for (let i = 0; i < number; i++) {
        let pos = "";
        if (i + 1 == (number / 2) || i + 1 == number) {
            pos = " top-bottom";
        }
        html2 += `<div class="wheel-item-out" style="--item: ${i + 1};">
                                                    <div class="wheel-image">
                                                        <div class="btn-text${pos}" style="--item: ${i + 1};" onclick="luckywheelWheel${i + 1}.click()">
                                                            <img src="/assets/images/minigame/add-img.png" width="16" height="16" />
                                                                    <span>Wheel ${i + 1}</span>
                                                        </div>
                                                                <input id="luckywheelWheel${i + 1}" type="file" class="d-none" onchange="handleUploadBlob(event)" data-error="โปรดอัพโหลดรูป Wheel ${i + 1}">
                                                    </div>
                                                </div>`;

    }
    html2 += `</div>`;

    $(`#wheelInputShow1`).html(html2);
    $(`.luckywheelSpinBtnSrc`).attr("src", `${url}button.png`);
    $(`.luckywheelFrameSrc`).attr("src", `${url}frame.png`);
    $(`.luckywheelGetRewardSrc`).attr("src", `${url}popup.png`);
}

function changeMinigame(number) {
    let url = $(`.imgMinigameRewardMainSrc`).eq(0).attr("src");

    if (url.length == 0) {
        url = LEGACY_ASSET_BASE + '/images/minigame/minigame-reward.png';

        $('.imgMinigameRewardSrc').attr('src', url);
    }

    if (number == 3) {
        $('#item-wheel-4').addClass('d-none');
        $('#item-wheel-5').addClass('d-none');
        $('#item-wheel-6').addClass('d-none');
        $('#item-wheel-7').addClass('d-none');
        $('#item-wheel-8').addClass('d-none');
        $('#item-wheel-9').addClass('d-none');
    } else if (number == 6) {
        $('#item-wheel-4').removeClass('d-none');
        $('#item-wheel-5').removeClass('d-none');
        $('#item-wheel-6').removeClass('d-none');
        $('#item-wheel-7').addClass('d-none');
        $('#item-wheel-8').addClass('d-none');
        $('#item-wheel-9').addClass('d-none');
    } else if (number == 9) {
        $('#item-wheel-4').removeClass('d-none');
        $('#item-wheel-5').removeClass('d-none');
        $('#item-wheel-6').removeClass('d-none');
        $('#item-wheel-7').removeClass('d-none');
        $('#item-wheel-8').removeClass('d-none');
        $('#item-wheel-9').removeClass('d-none');
    }

    // let html = "";

    // for (let i = 0; i < number; i++) {
    //     html += `<div class="card-item" style="--item: ${i};" onclick="testMinigame()">
    //                 <div class="card-image">
    //                     <img src='${url}' class="imgMinigameRewardSrc" />
    //                 </div>
    //             </div>`;
    // }

    // let html = `<div class="custom-minigame minigame-6 test-spin" data-deg="0">
    //                                 <div class="minigame-item-all">`;
    // for (let i = 0; i < number; i++) {
    //     html += `<div class="card-item" style="--item: ${number};" onclick="testMinigame()">
    //                                                     <div class="card-image">
    //                                                                 <img src='${url}' class="imgMinigameRewardSrc" />
    //                                                     </div>
    //                                                 </div>`;

    //     $(`.imgMinigameRewardSrc`).attr("src", url);
    // }
    // html += `</div></div>`;

    // $(`#minigameShowTest`).html(html);
}

function handleTimeBkkTo(event, id) {
    var dataTimeMinigame = document.querySelectorAll("[data-time-minigame]");
    var number = dataTimeMinigame.length;

    if (id == "template") {
        id = number;
    }

    var startTime = $(`#minigameCustomStartTime-${id}`).val();
    var endTime = event.target.value;

    if (startTime == "00:00" && endTime == "23:59") {
        $("#checkAddTemplateMinigameDatetime").addClass("disabled");
        $(`#boxMinigameSelectAllDay-${id}`).removeClass('no-select');
    } else {
        $("#checkAddTemplateMinigameDatetime").removeClass("disabled");
        $(`#boxMinigameSelectAllDay-${id}`).addClass('no-select');
    }

    $(`#minigameCustomEndTime-${id}`).val(endTime);
    $("#hiddenIdAfterInputTime").val(id);
}

function handleTimeBkkFrom(event, id) {
    var dataTimeMinigame = document.querySelectorAll("[data-time-minigame]");
    var number = dataTimeMinigame.length;

    if (id == "template") {
        id = number;
    }

    var startTime = event.target.value;
    var endTime = $(`#minigameCustomEndTime-${id}`).val();

    if (startTime == "00:00" && endTime == "23:59") {
        $("#checkAddTemplateMinigameDatetime").addClass("disabled");
        $(`#boxMinigameSelectAllDay-${id}`).removeClass('no-select');
    } else {
        $("#checkAddTemplateMinigameDatetime").removeClass("disabled");
        $(`#boxMinigameSelectAllDay-${id}`).addClass('no-select');
    }

    $(`#minigameCustomStartTime-${id}`).val(startTime);
}
function cilckStylecountdown(ele) {
    var minigameCountDownColorCode = ele.querySelector("input");
    $(minigameCountDownColorCode).prop('checked', true);
    iframeShowCountDownPreview($('[name="minigameCountDownColorCodeRadio"]:checked').val());
}

function iframeShowCountDownPreview(val) {
    // let iframe = document.getElementById("iframeShowCountDownPreview");
    // let playerUrl = "";
    // if (typeNow == 'mini-game') {
    //     playerUrl = `@(playerUrl)/member/mini-game/true/${val}`;
    // } else {
    //     playerUrl = `@(playerUrl)/member/lucky-wheel/true/${val}`;
    // }

    // iframe.src = playerUrl;
}

$('[name="minigameCountDownColorCodeRadio"]').click(function () {
    iframeShowCountDownPreview($('[name="minigameCountDownColorCodeRadio"]:checked').val());
});

function setValueCheckBox(id, value) {
    $('#' + id).prop('checked', value);
    if (value || value == "true") {
        $('#' + id).parent().removeClass("disabled");
        if ($('#' + id).hasClass("box-radio")) {

            if ($('#' + id).parent().hasClass("box-minigame-click-select.minigame-box-reset")) {
                $('#' + id).parent().addClass('active');
            }
            if ($('#' + id).parent().parent().attr("onclick")?.length > 0) {
                $('#' + id).parent().parent()[0].onclick();
            } else if ($('#' + id).parent().parent().attr("onchange")?.length > 0) {
                $('#' + id).parent().parent()[0].onchange();
            }
        }
        //changeMinigamecheckbox($('#' + id)[0]);
        if ($('#' + id).attr("onclick")?.length > 0) {
            $('#' + id)[0].onclick();
        } else if ($('#' + id).attr("onchange")?.length > 0) {
            $('#' + id)[0].onchange();
        }

    }
}

function setValueSwitch(id, value) {
    $('#' + id).prop('checked', value);
    if ($('#' + id).attr("onclick")?.length > 0) {
        $('#' + id)[0].onclick();
    } else if ($('#' + id).attr("onchange")?.length > 0) {
        $('#' + id)[0].onchange();
    }
}

function setValueRadio(id, value) {
    $('#' + id).prop('checked', value);
    if (value || value == "true") {
        $('#' + id).parent().removeClass("disabled");
        //$('#' + id).closest('.box-minigame-click-select.minigame-box-reset').addClass("active");
        if ($('#' + id).attr("onclick")?.length > 0) {
            $('#' + id)[0].onclick();
        } else if ($('#' + id).attr("onchange")?.length > 0) {
            $('#' + id)[0].onchange();
        }
    } else {
        let idOther = $('#' + id).attr("data-value-other");
        if (idOther?.length > 0) {
            $('#' + idOther).prop('checked', true);
            //$('#' + idOther).closest('.box-minigame-click-select.minigame-box-reset').addClass("active");
            if ($('#' + idOther).attr("onclick")?.length > 0) {
                $('#' + idOther)[0].onclick();
            } else if ($('#' + idOther).attr("onchange")?.length > 0) {
                $('#' + idOther)[0].onchange();
            }
        }

    }
}

function setMaxValueInput(e) {
    let group = $(e).attr("data-group");
    let allele = document.querySelectorAll(`[data-group=${group}]`);
    var nodes = Array.prototype.slice.call(allele);
    let index = nodes.indexOf(e);
    let lengthAll = allele.length;
    // for (let i = index-1; i >= 0; i--) {
    //     if (parseInt(allele[i]?.value) < parseInt(allele[i - 1]?.value) && parseInt(allele[i - 1]?.value) != 0) {
    //         allele[i].value = allele[i - 1].value;
    //     }
    // }

    for (let i = index; i >= 0; i--) {
        if (parseInt(allele[i]?.value) < parseInt(allele[i - 1]?.value) && parseInt(allele[i - 1]?.value) != 0) {
            allele[index].value = allele[i - 1].value;
        }
    }

    for (let i = index; i < lengthAll; i++) {
        if (parseInt(allele[i]?.value) > parseInt(allele[i + 1]?.value) && parseInt(allele[i + 1]?.value) != 0) {
            allele[index].value = allele[i + 1].value;
        }
    }
    if (group == "MinigamePerDayPerPerson") {
        let MaxPromotion = document.querySelectorAll(`[data-group=MaxPromotion]`);
        if (parseInt($(e).val()) > parseInt(MaxPromotion[index]?.value) && parseInt(MaxPromotion[index]?.value) != 0) {
            $(e).val(MaxPromotion[index].value);
        }
    }
}

function setMaxValueDateTime(e) {
    let type = $(e).attr("data-type");
    if (type == "hour" && parseInt(e.value) > 24) {
        e.value = 24;
    } else if (type == "minute" && parseInt(e.value) > 60) {
        e.value = 60;
    }
}

function setMaxValueInputAlert(e) {
    let group = $(e).attr("data-group");
    let allele = document.querySelectorAll(`[data-group=${group}]`);
    var nodes = Array.prototype.slice.call(allele);
    let index = nodes.indexOf(e);
    let lengthAll = allele.length;
    for (let i = lengthAll - 1; i >= 0; i--) {
        if (parseInt(allele[i]?.value) > parseInt(allele[i - 1]?.value)) {
            allele[i].value = allele[i - 1].value;
        }
    }
}

function setdefaultValueRadio() {
    let allele = document.querySelectorAll(`[data-group="defaultValueRadio"]`);
    var nodes = Array.prototype.slice.call(allele);
    let index = nodes.indexOf(e);
    let lengthAll = allele.length;
    for (let i = index - 1; i >= 0; i--) {
        if (parseInt(allele[i]?.value) > parseInt(allele[i + 1]?.value)) {
            allele[i].value = allele[i + 1].value;
        }
    }
    for (let i = index; i < lengthAll; i++) {
        if (parseInt(allele[i]?.value) > parseInt(allele[i + 1]?.value)) {
            allele[i + 1].value = allele[index].value;
        }
    }
}

function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

// กดดู สรุปและบันทึก Step
const nextPromotionMiniGameStepFinal = (element, step, next) => {
    window.localStorage.setItem("element", element);
    window.localStorage.setItem("step", step);
    window.localStorage.setItem("next", next);
    btnStepSettingMinigame(element, step, next)
};

const previousPromotionStepFinal = () => {
    var element = window.localStorage.getItem("element");
    var step = window.localStorage.getItem("step");
    var next = window.localStorage.getItem("next");

    localStorage.removeItem("element");
    localStorage.removeItem("step");
    localStorage.removeItem("next");

    console.log('step', step);
    console.log('nefxt', next);

    btnStepSettingMinigame('', next, step);
};

//Note: hide ปุ่ม สรุปและบันทึก Type create
const hidePromotionMiniGameStepfinal = () => {
    var action = window.localStorage.getItem("action");
    if (action == 'create') {
        $('#buttonNextPromotionStepfinal1').hide();
        $('#buttonNextPromotionStepfinal21').hide();
        $('#buttonNextPromotionStepfinal22').hide();
        $('#buttonNextPromotionStepfinal23').hide();
        $('#buttonNextPromotionStepfinal3').hide();
        $('#buttonNextPromotionStepfinal4').hide();
        $('#buttonNextPromotionStepfinal5').hide();
        $('#buttonPreviousPromotionStepfinal').hide();
    }
    else {
        $('#buttonNextPromotionStepfinal1').show();
        $('#buttonNextPromotionStepfinal21').show();
        $('#buttonNextPromotionStepfinal22').show();
        $('#buttonNextPromotionStepfinal23').show();
        $('#buttonNextPromotionStepfinal3').show();
        $('#buttonNextPromotionStepfinal4').show();
        $('#buttonNextPromotionStepfinal5').show();
        $('#buttonPreviousPromotionStepfinal').show();
    };

    if (action != 'create') {
        hidePromotionMiniGameIsNewSetting();
    };
};

const hidePromotionMiniGameIsNewSetting = () => {
    var isNewSetting = window.localStorage.getItem("isNewSetting");
    console.log('isNewSetting', isNewSetting);

    if (isNewSetting == 'false') {
        $('#buttonNextPromotionStepfinal1').hide();
        $('#buttonNextPromotionStepfinal21').hide();
        $('#buttonNextPromotionStepfinal22').hide();
        $('#buttonNextPromotionStepfinal23').hide();
        $('#buttonNextPromotionStepfinal3').hide();
        $('#buttonNextPromotionStepfinal4').hide();
        $('#buttonNextPromotionStepfinal5').hide();
        $('#buttonPreviousPromotionStepfinal').hide();
    };
};

const changeEnableHiddenTime = () => {
    let hiddenEnableHiddenTime = $("#enableHiddenTime").val();

    if (hiddenEnableHiddenTime == "true") {
        $("#enableHiddenTime").val(false);
    } else {
        $("#enableHiddenTime").val(true);
    }
}

const modalShowWheelDetail = new CustomModal('#modalShowWheelDetail');

var onloadShowWheelDetail = false;
const openModalShowWheelDetail = async (id, type, sequencePie, provided, isUnlimited, limitAmount) => {
    if (!onloadShowWheelDetail) {
        viewMinigameDetail(id, type, sequencePie, provided, isUnlimited, limitAmount);
    }
}

const closeModalShowWheelDetail = () => {
    modalShowWheelDetail.close();
}

customSelectAgentDropdown = new CustomDropdown('#customSelectAgentDropdown', {
    single: true,
    auto: true,
    fakeValue: (item) => (item?.textContent || ''),
    required: 'กรุณาเลือก Agent',
    placeholder: 'เลือก Agent',
    selfSearch: true,
    stretch: true,
    scrollRoot: '#rootScrollMinigame',
    offsetY: 72,
    offsetMargin: 72,
    onSelect: (value, select, list) => {
        var data = customSelectAgentDropdown.getValue();

        //console.log('dataSelectAgent', data)
        //console.log('list', list)

        var a = list?.data;
        var b = list?.selected;
        var c = [];

        //console.log('listA', a)

        //console.log('listB', b)

        //let d = {};
        //for (let obj of a) {
        //    d[obj.value] = { chip: obj.chip, text: obj.text };
        //}

        for (let id of a) {
            if (data === id.value) {
                c.push(id.text);
            }
        }

        //c.push(a[0].text);

        //console.log('listC', c)

        getShowLimitAgentGroupActiveHtml(c);

        if (data.length != 0) {
            $('#customSelectAgentDropdown').removeClass("custom-invalid");
            $('#error-selectAgentDropdown').hide();
        } else {
            $('#showLimitAgentGroupActiveHtml').html('<span>-</span>');
            $('#customSelectAgentDropdown').addClass("custom-invalid");
            $('#error-selectAgentDropdown').show();
        }

        //console.log('stepSettingMinigameNowInCome')

        validateStep("minigameName");
    }
});

const getShowLimitAgentGroupActiveHtml = (dataLists) => {

    console.log('dataListssss', dataLists)

    $("#showLimitAgentGroupActiveHtml").html("");
    let agentGroupHtml = "";

    //for (const dataList of dataLists) {
    //    console.log('datalist', dataList);
    //    agentGroupHtml += `<div class="text-center">
    //                                    <span class="custom-badge bg-green-10">${dataList}</span>
    //                                </div>`
    //}

    agentGroupHtml += `<div class="text-center">
                                        <span class="custom-badge bg-green-10">${dataLists[0]}</span>
                                    </div>`

    $("#showLimitAgentGroupActiveHtml").html(agentGroupHtml);
};


function enableCreditBalance() {
    var enableCustomerCreditBalance = $("#enableCustomerCreditBalance").prop('checked');

    if (enableCustomerCreditBalance) {
        $("#enableReduceAllQuota").prop('disabled', false);
        $("#reduceQuota").prop('disabled', false);
        $("#customerCreditBalance").prop('disabled', false);
    } else {
        $("#enableReduceAllQuota").prop('disabled', true);
        $("#reduceQuota").prop('disabled', true);
        $("#customerCreditBalance").prop('disabled', true);
    }

};

function enableCreditBalanceWithdraw() {
    var enableCustomerCreditWithdraw = $("#enableCustomerCreditWithdraw").prop('checked');

    if (enableCustomerCreditWithdraw) {
        $("#enableReduceAllQuotaWithdraw").prop('disabled', false);
        $("#customerCreditWithdraw").prop('disabled', false);
        $("#reduceQuotaWithdraw").prop('disabled', false);
    } else {
        $("#enableReduceAllQuotaWithdraw").prop('disabled', true);
        $("#customerCreditWithdraw").prop('disabled', true);
        $("#reduceQuotaWithdraw").prop('disabled', true);
    }

};

function onSelectGameProvider(button, status) {
    var buttonVal = $("#hiddenGameProviderButtonStatus").val();

    console.log('onSelectGameProvider', status);

    $(".inactive-game-button-1").removeClass("display-none");
    $(".active-game-button-1").addClass("display-none");
    $(".inactive-game-button-2").removeClass("display-none");
    $(".active-game-button-2").addClass("display-none");
    $(".inactive-game-button-3").removeClass("display-none");
    $(".active-game-button-3").addClass("display-none");
    $(".inactive-game-button-4").removeClass("display-none");
    $(".active-game-button-4").addClass("display-none");

    $("#selectAllGameProviderSport").hide();
    $("#selectAllGameProviderGame").hide();
    $("#selectAllGameProviderCasino").hide();
    $("#selectAllGameProviderLotto").hide();


    if (button == "1") {

        //sport
        $("#selectAllGameProviderSport").show();

        buttonVal = buttonVal.replace('#SPORT#', '');
        if (status == "active") {
            $(".active-game-button-1").removeClass("display-none");
            $(".inactive-game-button-1").addClass("display-none");
            buttonVal += '#SPORT#';
        } else if (status == "inactive") {
            $(".active-game-button-1").addClass("display-none");
            $(".inactive-game-button-1").removeClass("display-none");
        }

        // check selet all
        var inputGameCheck = $(`[is-category-sport="true"]`).find(".game-provider-checker-input:checked");
        var inputGameAll = $(`[is-category-sport="true"]`).find(".game-provider-checker-input");

        if (inputGameCheck.length >= inputGameAll.length) {
            $('#selectAllDisplayGameProviderSport').prop("checked", true);
        }
        else {
            $('#selectAllDisplayGameProviderSport').prop("checked", false);
        }

    }
    else if (button == "2") {
        //games
        $("#selectAllGameProviderGame").show();

        buttonVal = buttonVal.replace('#GAME#', '');
        if (status == "active") {
            $(".active-game-button-2").removeClass("display-none");
            $(".inactive-game-button-2").addClass("display-none");
            buttonVal += '#GAME#';
        } else if (status == "inactive") {
            $(".active-game-button-2").addClass("display-none");
            $(".inactive-game-button-2").removeClass("display-none");
        }

        // check selet all
        var inputGameCheck = $(`[is-category-game="true"]`).find(".game-provider-checker-input:checked");
        var inputGameAll = $(`[is-category-game="true"]`).find(".game-provider-checker-input");

        if (inputGameCheck.length >= inputGameAll.length) {
            $('#selectAllDisplayGameProviderGame').prop("checked", true);
        } else {
            $('#selectAllDisplayGameProviderGame').prop("checked", false);
        }
    }
    else if (button == "3") {
        //casino
        $("#selectAllGameProviderCasino").show();

        buttonVal = buttonVal.replace('#CASINO#', '');
        if (status == "active") {
            $(".active-game-button-3").removeClass("display-none");
            $(".inactive-game-button-3").addClass("display-none");
            buttonVal += '#CASINO#';
        } else if (status == "inactive") {
            $(".active-game-button-3").addClass("display-none");
            $(".inactive-game-button-3").removeClass("display-none");
        }

        // check selet all
        var inputGameCheck = $(`[is-category-casino="true"]`).find(".game-provider-checker-input:checked");
        var inputGameAll = $(`[is-category-casino="true"]`).find(".game-provider-checker-input");

        if (inputGameCheck.length >= inputGameAll.length) {
            $('#selectAllDisplayGameProviderCasino').prop("checked", true);
        }
        else {
            $('#selectAllDisplayGameProviderCasino').prop("checked", false);
        }
    }
    else if (button == "4") {
        // lotto
        $("#selectAllGameProviderLotto").show();

        buttonVal = buttonVal.replace('#LOTTO#', '');
        if (status == "active") {
            $(".active-game-button-4").removeClass("display-none");
            $(".inactive-game-button-4").addClass("display-none");
            buttonVal += '#LOTTO#';
        } else if (status == "inactive") {
            $(".active-game-button-4").addClass("display-none");
            $(".inactive-game-button-4").removeClass("display-none");
        }

        // check selet all
        var inputGameCheck = $(`[is-category-lotto="true"]`).find(".game-provider-checker-input:checked");
        var inputGameAll = $(`[is-category-lotto="true"]`).find(".game-provider-checker-input");

        if (inputGameCheck.length >= inputGameAll.length) {
            $('#selectAllDisplayGameProviderLotto').prop("checked", true);
        } else {
            $('#selectAllDisplayGameProviderLotto').prop("checked", false);
        }
    }
    $("#hiddenGameProviderButtonStatus").val(buttonVal);
    setGameProviderByTypeSelected(button);
}

function setGameProviderByTypeSelected(button) {


    $(`[is-category-sport="true"]`).addClass("display-none");
    $(`[is-category-sport="true"]`).addClass("game-provider-input-hide");
    $(`[is-category-sport="true"]`).removeClass("game-provider-input-shown");

    $(`[is-category-game="true"]`).addClass("display-none");
    $(`[is-category-game="true"]`).addClass("game-provider-input-hide");
    $(`[is-category-game="true"]`).removeClass("game-provider-input-shown");

    $(`[is-category-casino="true"]`).addClass("display-none");
    $(`[is-category-casino="true"]`).addClass("game-provider-input-hide");
    $(`[is-category-casino="true"]`).removeClass("game-provider-input-shown");

    $(`[is-category-lotto="true"]`).addClass("display-none");
    $(`[is-category-lotto="true"]`).addClass("game-provider-input-hide");
    $(`[is-category-lotto="true"]`).removeClass("game-provider-input-shown");

    if (button == "1") {
        $(`[is-category-sport="true"]`).removeClass("display-none");
        $(`[is-category-sport="true"]`).removeClass("game-provider-input-hide");
        $(`[is-category-sport="true"]`).addClass("game-provider-input-shown");
    }

    if (button == "2") {
        $(`[is-category-game="true"]`).removeClass("display-none");
        $(`[is-category-game="true"]`).removeClass("game-provider-input-hide");
        $(`[is-category-game="true"]`).addClass("game-provider-input-shown");
    }

    if (button == "3") {
        $(`[is-category-casino="true"]`).removeClass("display-none");
        $(`[is-category-casino="true"]`).removeClass("game-provider-input-hide");
        $(`[is-category-casino="true"]`).addClass("game-provider-input-shown");
    }

    if (button == "4") {
        $(`[is-category-lotto="true"]`).removeClass("display-none");
        $(`[is-category-lotto="true"]`).removeClass("game-provider-input-hide");
        $(`[is-category-lotto="true"]`).addClass("game-provider-input-shown");
    }


    countingGameProviderSelected();
}
function selectAllDisplayGameProvider(selectAllType) {

    if (selectAllType == "sport") {

        var isChecked = $('#selectAllDisplayGameProviderSport').is(":checked");
        if (!isChecked) {
            $(`[is-category-sport="true"]`).find(".game-provider-checker-input").prop("checked", false);
        } else {
            $(`[is-category-sport="true"]`).find(".game-provider-checker-input").prop("checked", true);
        }
    }
    else if (selectAllType == "game") {

        var isChecked = $('#selectAllDisplayGameProviderGame').is(":checked");
        if (!isChecked) {
            $(`[is-category-game="true"]`).find(".game-provider-checker-input").prop("checked", false);
        } else {
            $(`[is-category-game="true"]`).find(".game-provider-checker-input").prop("checked", true);
        }
    }
    else if (selectAllType == "casino") {

        var isChecked = $('#selectAllDisplayGameProviderCasino').is(":checked");
        if (!isChecked) {
            $(`[is-category-casino="true"]`).find(".game-provider-checker-input").prop("checked", false);
        } else {
            $(`[is-category-casino="true"]`).find(".game-provider-checker-input").prop("checked", true);
        }
    }
    else if (selectAllType == "lotto") {

        var isChecked = $('#selectAllDisplayGameProviderLotto').is(":checked");
        if (!isChecked) {
            $(`[is-category-lotto="true"]`).find(".game-provider-checker-input").prop("checked", false);
        } else {
            $(`[is-category-lotto="true"]`).find(".game-provider-checker-input").prop("checked", true);
        }
    }
    countingGameProviderSelected();
}

function getGameProviderList() {
    $.ajax({
        url: '/api/promotion/get-game-provider-list',
        type: 'GET',
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != 0) {
                var brandGamesHtml = "";
                var brandGamesArray = response.data;

                for (var i = 0; i < brandGamesArray.length; i++) {


                    var caegoryList = brandGamesArray[i].categoryString.split(",");

                    for (var e = 0; e < caegoryList.length; e++) {

                        if (caegoryList[e] === "sport") {
                            brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-hide col-4 col-md-4 mb-2" 
                                           is-category-sport="true" 
                                           is-category-game="false"
                                           is-category-casino="false" 
                                           is-category-lotto="false">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox" 
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${caegoryList[e]}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                        }
                        else if (caegoryList[e] === "game") {
                            brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-hide col-4 col-md-4 mb-2" 
                                           is-category-sport="false" 
                                           is-category-game="true"
                                           is-category-casino="false" 
                                           is-category-lotto="false">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox" 
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${caegoryList[e]}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                        }
                        else if (caegoryList[e] === "casino") {
                            brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-hide col-4 col-md-4 mb-2" 
                                           is-category-sport="false" 
                                           is-category-game="false"
                                           is-category-casino="true" 
                                           is-category-lotto="false">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox" 
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${caegoryList[e]}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                        }
                        else if (caegoryList[e] === "lotto") {
                            brandGamesHtml += `<div class="form-check minigame-reset game-provider-checker-div game-provider-input-hide col-4 col-md-4 mb-2" 
                                           is-category-sport="false" 
                                           is-category-game="false"
                                           is-category-casino="false" 
                                           is-category-lotto="true">
                                           <input class="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox" 
                                           providerId="${brandGamesArray[i].brandLsmNumber}" 
                                           providerCode="${brandGamesArray[i].code}" 
                                           name="${brandGamesArray[i].name}" 
                                           category="${caegoryList[e]}" 
                                           id="prov-game-${brandGamesArray[i].brandLsmNumber}" 
                                           >
                                           <label class="form-check-label d-flex flex-column" for="prov-game-${brandGamesArray[i].brandLsmNumber}">
                                               <span class="p2 color-emerald-title-1">${brandGamesArray[i].name} </span>
                                           </label>
                                           </div>
                                      </div>`;
                        }
                    }


                }
                $(".games-display-check-list").html(brandGamesHtml);
                $('#minigameEnableGameProvider').prop('checked', false);
                $(".game-provider-checker-input").bind("change", function () {
                    countingGameProviderSelected();
                });
                onSelectGameProvider("1", "active");
            } else {
                customSwal.open({
                    type: 'danger',
                    title: 'ไม่พบ Game Provider !',
                    showConfirmButton: false,
                    cancelText: 'ปิดหน้าต่าง',
                    text: `พบปัญหาในการดึงข้อมูล Error : ${res.status}`
                });
                return;
            }
        }
    });
}
function countingGameProviderSelected() {
    var allElement = $(".game-provider-checker-input:checked");
    var countAll = allElement.length;
    $(".provider-selected-count-display").html(countAll);
}
function selectMultiLanguage(langCode) {
    if (langCode == "th") {
        $(".btn-lang-th").addClass("multi-lang-selected");
        $(".btn-lang-en").removeClass("multi-lang-selected");
        $(".btn-lang-tl").removeClass("multi-lang-selected");

        $("#minigameName").removeClass("display-none");
        $("#minigameName-en").addClass("display-none");
        $("#minigameName-tl").addClass("display-none");

        $(".minigame-name-label").removeClass("display-none");
        $(".minigame-name-label-en").addClass("display-none");
        $(".minigame-name-label-tl").addClass("display-none");

        $(".textarea-condition-th").show();
        $(".textarea-condition-en").hide();
        $(".textarea-condition-tl").hide();
    }
    else if (langCode == "en") {
        $(".btn-lang-th").removeClass("multi-lang-selected");
        $(".btn-lang-en").addClass("multi-lang-selected");
        $(".btn-lang-tl").removeClass("multi-lang-selected");

        $("#minigameName").addClass("display-none");
        $("#minigameName-en").removeClass("display-none");
        $("#minigameName-tl").addClass("display-none");

        $(".minigame-name-label").addClass("display-none");
        $(".minigame-name-label-en").removeClass("display-none");
        $(".minigame-name-label-tl").addClass("display-none");

        $(".textarea-condition-th").hide();
        $(".textarea-condition-en").show();
        $(".textarea-condition-tl").hide();
    }
    else if (langCode == "tl") {
        $(".btn-lang-th").removeClass("multi-lang-selected");
        $(".btn-lang-en").removeClass("multi-lang-selected");
        $(".btn-lang-tl").addClass("multi-lang-selected");

        $("#minigameName").addClass("display-none");
        $("#minigameName-en").addClass("display-none");
        $("#minigameName-tl").removeClass("display-none");

        $(".minigame-name-label").addClass("display-none");
        $(".minigame-name-label-en").addClass("display-none");
        $(".minigame-name-label-tl").removeClass("display-none");

        $(".textarea-condition-th").hide();
        $(".textarea-condition-en").hide();
        $(".textarea-condition-tl").show();
    }
}

async function checkMultiSetting() {
    if (conditionHtml != null) {
        var name = $("#minigameName").val();
        var condition = conditionHtml.getData();
        if (name.length > 0 || (condition.length > 0 && condition != "<p>&nbsp;</p>")) {
            $(".multi-setting-th").addClass("multi-lang-status-t");
            $(".multi-setting-th").removeClass("multi-lang-status-f");
            $(".multi-setting-th").html("<span data-i18n='minigameSetting.settingSet'>(ตั้งค่าแล้ว)</span>");
        } else {
            $(".multi-setting-th").removeClass("multi-lang-status-t");
            $(".multi-setting-th").addClass("multi-lang-status-f");
            $(".multi-setting-th").html("<span data-i18n='minigameSetting.settingNotSet'>(ยังไม่กำหนด)</span>");
        }
        $(".multi-setting-th").localize();
    }

    if (conditionHtmlEn != null) {
        var nameEn = $("#minigameName-en").val();
        var conditionEn = conditionHtmlEn.getData();
        if (nameEn.length > 0 || (conditionEn.length > 0 && conditionEn != "<p>&nbsp;</p>")) {
            $(".multi-setting-en").addClass("multi-lang-status-t");
            $(".multi-setting-en").removeClass("multi-lang-status-f");
            $(".multi-setting-en").html("<span data-i18n='minigameSetting.settingSet'>(ตั้งค่าแล้ว)</span>");
        } else {
            $(".multi-setting-en").removeClass("multi-lang-status-t");
            $(".multi-setting-en").addClass("multi-lang-status-f");
            $(".multi-setting-en").html("<span data-i18n='minigameSetting.settingNotSet'>(ยังไม่กำหนด)</span>");
        }
        $(".multi-setting-en").localize();

    }

    if (conditionHtmlTl != null) {
        var nameTl = $("#minigameName-tl").val();
        var conditionTL = conditionHtmlTl.getData();
        if (nameTl.length > 0 || (conditionTL.length > 0 && conditionTL != "<p>&nbsp;</p>")) {
            $(".multi-setting-tl").addClass("multi-lang-status-t");
            $(".multi-setting-tl").removeClass("multi-lang-status-f");
            $(".multi-setting-tl").html("<span data-i18n='minigameSetting.settingSet'>(ตั้งค่าแล้ว)</span>");
        } else {
            $(".multi-setting-tl").removeClass("multi-lang-status-t");
            $(".multi-setting-tl").addClass("multi-lang-status-f");
            $(".multi-setting-tl").html("<span data-i18n='minigameSetting.settingNotSet'>(ยังไม่กำหนด)</span>");
        }
        $(".multi-setting-tl").localize();
    }
    /*$(".multi-lang-text-en").localize();
    $(".multi-lang-text-tl").localize();*/
}

function changDisableMinTurnoverMinCredit() {

    var value = $('#disableMinTurnOverMinCredit').prop('checked');
    var amount = $('#minigameWithdrawConditionMinTurnoverMinCredit');

    if (value) {
        amount.prop('disabled', true)

        if (amount.val() == "" || amount == null) {
            amount.val('0');
            $("#error-minigameWithdrawConditionMinTurnoverMinCredit").hide();
        }

    } else {
        amount.prop('disabled', false)
    }
}

changDisableMinTurnoverMinCredit();

// Color Bg
var colorBgMainColorInput = $(".getColorBgMainColor").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorBgMainColorInput
});

var colorBgInBoxMiniGameColorInput = $(".getColorBgInBoxMiniGameColor").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorBgInBoxMiniGameColorInput
});

// Color Group 1
var colorFontHeaderMainInputGroup1 = $(".getColorFontHeaderMainGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontHeaderMainInputGroup1
});

var colorFontHeaderSecondaryInputGroup1 = $(".getColorFontHeaderSecondaryGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontHeaderSecondaryInputGroup1
});

var colorFontMessageMainInputGroup1 = $(".getColorFontMessageMainGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontMessageMainInputGroup1
});

var colorFontMessageSecondaryInputGroup1 = $(".getColorFontMessageSecondaryGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontMessageSecondaryInputGroup1
});

var colorFontHighlightsInputGroup1 = $(".getColorFontHighlightsGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontHighlightsInputGroup1
});

var colorFontCountDownInputGroup1 = $(".getColorFontCountDownGroup1").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorFontCountDownInputGroup1
});

// Color Group 2
var colorBtnBgInputGroup2 = $(".getColorBtnBgGroup2").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorBtnBgInputGroup2
});

var colorBtnMessageInputGroup2 = $(".getColorBtnMessageGroup2").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorBtnMessageInputGroup2
});

var colorBtnBorderInputGroup2 = $(".getColorBtnBorderGroup2").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorBtnBorderInputGroup2
});

var colorDisplayBgInputInputGroup2 = $(".getColorDisplayBgGroup2").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorDisplayBgInputGroup2
});

var colorDisplayBorderInputGroup2 = $(".getColorDisplayBorderGroup2").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorDisplayBorderInputGroup2
});

// Color Group 3

var colorTableThBgInputGroup3 = $(".getColorTableThBgGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableThBgInputGroup3
});

var colorTableThFontInputGroup3 = $(".getColorTableThFontGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableThFontInputGroup3
});

var colorTableThBorderInputGroup3 = $(".getColorTableThBorderGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableThBorderInputGroup3
});


var colorPaginationFontActiveInputGroup3 = $(".getColorPaginationFontActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationFontActiveInputGroup3
});

var colorPaginationFontInActiveInputGroup3 = $(".getColorPaginationFontInActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationFontInActiveInputGroup3
});

var colorPaginationBgInActiveInputGroup3 = $(".getColorPaginationBgInActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationBgInActiveInputGroup3
});

var colorPaginationBgActiveInputGroup3 = $(".getColorPaginationBgActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationBgActiveInputGroup3
});

var colorPaginationArrowInActiveInputGroup3 = $(".getColorPaginationArrowInActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationArrowInActiveInputGroup3
});

var colorPaginationArrowActiveInputGroup3 = $(".getColorPaginationArrowActiveGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorPaginationArrowActiveInputGroup3
});


var colorTableTdBg1InputGroup3 = $(".getColorTableTdBg1Group3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdBg1InputGroup3
});

var colorTableTdBg2InputGroup3 = $(".getColorTableTdBg2Group3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdBg2InputGroup3
});

var colorTableTdFontInputGroup3 = $(".getColorTableTdFontGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdFontInputGroup3
});

var colorTableTdFontHighlights1InputGroup3 = $(".getColorTableTdFontHighlights1Group3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdFontHighlights1InputGroup3
});

var colorTableTdFontHighlights2InputGroup3 = $(".getColorTableTdFontHighlights2Group3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdFontHighlights2InputGroup3
});

var colorTableTdBorderInputGroup3 = $(".getColorTableTdBorderGroup3").asColorPicker({
    hidePaletteColor: true,
    onChange: changeColorTableTdBorderInputGroup3
});


// Function Color Bg
function changeColorBgMainColorInput(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-bg-main', color);
}

function changeColorBgInBoxMiniGameColorInput(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-bg-in-box-mini-game', color);
}

// Function Color Group 1
function changeColorFontHeaderMainInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-header-main-group-1', color);
}

function changeColorFontHeaderSecondaryInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-header-secondary-group-1', color);
}

function changeColorFontMessageMainInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-message-main-group-1', color);
}

function changeColorFontMessageSecondaryInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-message-secondary-group-1', color);
}

function changeColorFontHighlightsInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-highlights-group-1', color);
}

function changeColorFontCountDownInputGroup1(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-font-count-down-group-1', color);
}

// Function Color Group 2
function changeColorBtnBgInputGroup2(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-btn-bg-group-2', color);
}

function changeColorBtnMessageInputGroup2(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-btn-message-group-2', color);
}

function changeColorBtnBorderInputGroup2(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-btn-border-group-2', color);
}

function changeColorDisplayBgInputGroup2(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-display-bg-group-2', color);
}

function changeColorDisplayBorderInputGroup2(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-display-border-group-2', color);
}

// Function Color Group 3

function changeColorTableThBgInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-th-bg-group-3', color);
}

function changeColorTableThFontInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-th-font-group-3', color);
}

function changeColorTableThBorderInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-th-border-group-3', color);
}



function changeColorPaginationFontActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-font-active-group-3', color);
}

function changeColorPaginationFontInActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-font-in-active-group-3', color);
}

function changeColorPaginationBgInActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-bg-in-active-group-3', color);
}

function changeColorPaginationBgActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-bg-active-group-3', color);
}

function changeColorPaginationArrowInActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-arrow-in-active-group-3', color);
}

function changeColorPaginationArrowActiveInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-pagination-arrow-active-group-3', color);
}


function changeColorTableTdBg1InputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-bg-1-group-3', color);
}

function changeColorTableTdBg2InputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-bg-2-group-3', color);
}

function changeColorTableTdFontInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-font-group-3', color);
}

function changeColorTableTdFontHighlights1InputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-font-highlights-1-group-3', color);
}

function changeColorTableTdFontHighlights2InputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-font-highlights-2-group-3', color);
}

function changeColorTableTdBorderInputGroup3(value) {
    var color = value;
    document.documentElement.style.setProperty('--color-table-td-border-group-3', color);
}

function onSetColorDefaultColorFunction() {

    var dataType = $(this).attr("data-default-color-type");

    if (dataType === "bg") {
        setColorDefaultBg();
    } else if (dataType === "bg-display") {
        setColorDefaultBgDisplay();
    } else if (dataType === "color-group-1") {
        setColorDefaultGroup1();
    } else if (dataType === "color-group-2") {
        setColorDefaultGroup2();
    } else if (dataType === "color-group-3") {
        setColorDefaultGroup3();
    }

}

function setColorDefaultBg() {
    colorBgMainColorInput.val(colorDefaultBgMainColor, true);
}

function setColorDefaultBgDisplay() {
    colorBgInBoxMiniGameColorInput.val(colorDefaultBgInBoxMiniGameColor, true);
}

function setColorDefaultGroup1() {
    colorFontHeaderMainInputGroup1.val(colorDefaultFontHeaderMainGroup1, true);
    colorFontHeaderSecondaryInputGroup1.val(colorDefaultFontHeaderSecondaryGroup1, true);
    colorFontMessageMainInputGroup1.val(colorDefaultFontMessageMainGroup1, true);
    colorFontMessageSecondaryInputGroup1.val(colorDefaultFontMessageSecondaryGroup1, true);
    colorFontHighlightsInputGroup1.val(colorDefaultFontHighlightsGroup1, true);
    colorFontCountDownInputGroup1.val(colorDefaultFontCountDownGroup1, true);
}

function setColorDefaultGroup2() {
    colorBtnBgInputGroup2.val(colorDefaultBtnBgGroup2, true);
    colorBtnMessageInputGroup2.val(colorDefaultBtnMessageGroup2, true);
    colorBtnBorderInputGroup2.val(colorDefaultBtnBorderGroup2, true);
    colorDisplayBgInputInputGroup2.val(colorDefaultDisplayBgGroup2, true);
    colorDisplayBorderInputGroup2.val(colorDefaultDisplayBorderGroup2, true);
}

function setColorDefaultGroup3() {
    colorTableThBgInputGroup3.val(colorDefaultTableThBgGroup3, true);
    colorTableThFontInputGroup3.val(colorDefaultTableThFontGroup3, true);
    colorTableThBorderInputGroup3.val(colorDefaultTableThBorderGroup3, true);

    colorPaginationFontActiveInputGroup3.val(colorDefaultPaginationFontActiveGroup3, true);
    colorPaginationFontInActiveInputGroup3.val(colorDefaultPaginationFontInActiveGroup3, true);
    colorPaginationBgInActiveInputGroup3.val(colorDefaultPaginationBgInActiveGroup3, true);
    colorPaginationBgActiveInputGroup3.val(colorDefaultPaginationBgActiveGroup3, true);
    colorPaginationArrowInActiveInputGroup3.val(colorDefaultPaginationArrowInActiveGroup3, true);
    colorPaginationArrowActiveInputGroup3.val(colorDefaultPaginationArrowActiveGroup3, true);

    colorTableTdBg1InputGroup3.val(colorDefaultTableTdBg1Group3, true);
    colorTableTdBg2InputGroup3.val(colorDefaultTableTdBg2Group3, true);
    colorTableTdFontInputGroup3.val(colorDefaultTableTdFontGroup3, true);
    colorTableTdFontHighlights1InputGroup3.val(colorDefaultTableTdFontHighlights1Group3, true);
    colorTableTdFontHighlights2InputGroup3.val(colorDefaultTableTdFontHighlights2Group3, true);
    colorTableTdBorderInputGroup3.val(colorDefaultTableTdBorderGroup3, true);

}

function clearDataMiniGameStep4() {

    hiddenCountImgMiniGame.val("6");
    var countClear = 9;

    isErrorImgStep1.hide();
    textErrorImgStep1.html("");

    $(".box-select-quantity").removeClass("active");
    $(".box-select-quantity-6").addClass("active");

    $("#isCheckDisplayImgBeforeAll").prop("checked", true);
    $("#isCheckStep1DisplayImgSort").prop("checked", true);
    $("#isCheckNextStep2").prop("checked", false);
    $("#isCheckDisplayImgAfterAll").prop("checked", true);
    $("#isCheckDisplayImgAfterSort").prop("checked", true);
    $("#isCheckDisplayImgResultsAll").prop("checked", true);
    $("#isCheckDisplayImgResultsSort").prop("checked", true);

    //For Img Group1
    for (let i = 0; i < countClear; i++) {
        $(".img-show-upload-mini-game-before-" + [i + 1]).attr("src", "");
        $("#imgBeforeMiniGame" + [i + 1]).val("");
        $(".img-show-upload-mini-game-before-" + [i + 1]).hide();
        $(".btn-close-img-mini-game-step-1-box-" + [i + 1]).hide();
        $(".default-img-mini-game-before-" + [i + 1]).show();
    }

    //For Img Group2
    for (let i = 0; i < countClear; i++) {
        $(".img-show-upload-mini-game-after-" + [i + 1]).attr("src", "");
        $("#imgAfterMiniGame" + [i + 1]).val("");
        $(".img-show-upload-mini-game-after-" + [i + 1]).hide();
        $(".btn-close-img-mini-game-step-2-box-" + [i + 1]).hide();
        $(".default-img-mini-game-after-" + [i + 1]).show();
    }

    //For Img Group3
    for (let i = 0; i < countClear; i++) {
        $(".img-show-upload-mini-game-results-" + [i + 1]).attr("src", "");
        $("#imgResultsMiniGame" + [i + 1]).val("");
        $(".img-show-upload-mini-game-results-" + [i + 1]).hide();
        $(".btn-close-img-mini-game-step-3-box-" + [i + 1]).hide();
        $(".default-img-mini-game-results-" + [i + 1]).show();
    }

    onCloseImgBgMobileMiniGame();
    onCloseImgBgPcMiniGame();
    onCloseImgBgMbDisplayMiniGame();
    onCloseImgBgPcDisplayMiniGame();

    setColorDefaultBg();
    setColorDefaultBgDisplay();
    setColorDefaultGroup1();
    setColorDefaultGroup2();
    setColorDefaultGroup3();

    hideImgBeforeDisplayTypeStep1();
    hideImgBeforeDisplayTypeStep2();
    hideImgBeforeDisplayTypeStep3();
}