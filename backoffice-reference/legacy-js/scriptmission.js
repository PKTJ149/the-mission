class CustomPopupAlert {
    constructor() {
        this.alertElement = null;
        this.loading = null;
        this.showing = false;
    }

    show(options) {
        const { title, type, message, needConfirmation, loading, loadingId } = options;

        this.loading = loading;
        this.showing = true;

        return new Promise((resolve, reject) => {
            const alertHTML = `
                  <div class="system-popup-alert">
                      <div class="system-popup-alert-content">
                          <div class="system-popup-alert-content-header">
                              <h4>${title}</h4>
                          </div>
                          <div class="system-popup-alert-content-inner">
                              <div class="system-popup-alert-content-inner-text">
                                  <img src="/assets/images/mission/system-popup-alert/icon-${type}.png" />
                                  <p>${message}</p>
                              </div>
                              ${needConfirmation ? `
                                  <div class="system-popup-alert-btns confirm">
                                      <button class="mission-btn-outline system-popup-alert-btn-cancel">Cancel</button>
                                      <button class="mission-btn system-popup-alert-btn-confirm" ${loading ? `id="${loadingId}"` : ''}>${type === 'edit' ? 'Edit' : 'Confirm'}</button>
                                  </div>
                              ` : `<div class="system-popup-alert-btns">
                                      <button class="mission-btn system-popup-alert-btn-confirm">Close</button>
                                  </div>`}
                          </div>
                      </div>
                  </div>
              `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = alertHTML;
            this.alertElement = tempDiv.firstElementChild;

            if (needConfirmation) {
                this.alertElement.querySelector('.system-popup-alert-btn-cancel').addEventListener('click', () => {
                    this.hide(true);
                    reject('cancelled');
                });
                this.alertElement.querySelector('.system-popup-alert-btn-confirm').addEventListener('click', () => {
                    this.hide();
                    resolve('confirmed');
                });
            }

            document.querySelector('.main-content').appendChild(this.alertElement);
            // document.body.appendChild(this.alertElement);

            setTimeout(() => {
                this.alertElement.classList.add('show', 'animate-in');
            }, 10);

            if (!needConfirmation) {
                this.alertElement.querySelector('.system-popup-alert-btn-confirm').addEventListener('click', () => {
                    this.hide(true);
                    resolve('cancelled');
                });
            }
        });
    }

    hide(hideLoading = false) {
        if (!this.loading || hideLoading && this.showing) {
            if (this.alertElement) {
                this.alertElement.classList.remove('show');
                this.alertElement.classList.add('animate-out');
                setTimeout(() => {
                    this.alertElement?.remove();
                    this.alertElement = null;
                }, 800);
            }
        }
    }
}

const customPopupAlert = new CustomPopupAlert();
const customPopupAlertSecond = new CustomPopupAlert();
const customPopupAlertThird = new CustomPopupAlert();
async function toggleMissionStatus(missionId, input) {
    try {
        const currentStatus = !input.checked;
        //console.log('toggleMissionStatus', missionId, currentStatus);
        // const newStatus = currentStatus === 'เปิด' ? 'ปิด' : 'เปิด';
        const newStatus = currentStatus === true ? 'offline' : 'online';
        let message = '';
        let type = '';
        if (newStatus === 'offline') {
            message = $.t("missionPage.js.missionStatusOffline");
            type = 'off';
        } else {
            message = $.t("missionPage.js.missionStatusOnline");
            type = 'on';
        }

        const result = await customPopupAlert.show({
            title: $.t("missionPage.js.confirm") + newStatus + $.t("missionPage.js.confirmMsg"),
            type: type,
            message: message,
            needConfirmation: true
        }).then(async (result) => {
            if (result === 'confirmed') {
                if (newStatus === 'ปิด') {
                    message = $.t("missionPage.js.missionStatusOfflineNew");
                } else {
                    message = $.t("missionPage.js.missionStatusOnlineNew");
                }

                var payload = {
                    MissionId: missionId,
                    Status: newStatus,
                };

                let req = await $.ajax({
                    url: "/mission/update-status",
                    method: "POST",
                    data: payload
                }).done(function (res) {
                    //console.log("check res", res);
                }).fail(function () { });

                customPopupAlertSecond.show({
                    title: newStatus + $.t("missionPage.js.confirmMission"),
                    type: type,
                    message: message,
                    needConfirmation: false
                }).then(() => {
                    location.reload();
                });
            }
        }).catch((error) => {
            if (error === 'cancelled') {
                //console.log(`ผู้ใช้ยกเลิกการ${currentStatus === true ? 'ปิด' : 'เปิด'}การใช้งานภารกิจ`);
                input.checked = !input.checked;
            }
        });

        if (result === 'confirmed') {
            /* const response = await fetch(`/api/missions/${missionId}/toggle-status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ newStatus })
            });
      
            if (response.ok) {
              // อัพเดตสถานะบนหน้าเว็บ
              const statusElement = document.querySelector(`#mission-status-${missionId}`);
              if (statusElement) {
                statusElement.textContent = newStatus;
                statusElement.classList.toggle('status-open', newStatus === 'เปิด');
                statusElement.classList.toggle('status-closed', newStatus === 'ปิด');
              }
      
              // แสดงข้อความแจ้งเตือนว่าสำเร็จ
              customPopupAlert.show({
                title: 'สำเร็จ',
                type: 'success',
                message: `มิชชั่นถูก${newStatus}เรียบร้อยแล้ว`,
                needConfirmation: false
              });
            } else {
              throw new Error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะมิชชั่น');
            } */
        }
    } catch (error) {
        //console.error('เกิดข้อผิดพลาด:', error);
        customPopupAlert.show({
            title: $.t("missionPage.js.error"),
            type: 'error',
            message: $.t("missionPage.js.tryAgainMission"),
            needConfirmation: false
        });
    }
}
async function toggleMissionDelete(missionId) {
    let text1 = $.t("missionPage.js.confirmDelete");
    let text2 = $.t("missionPage.js.confirmDeleteMsg");
    let text3 = $.t("missionPage.js.confirmDeletePass");
    let text4 = $.t("missionPage.js.confirmDeletePassMsg");
    let text5 = $.t("missionPage.js.error");
    let text6 = $.t("missionPage.js.errorMissionMsg");

    try {
        const result = await customPopupAlert.show({
            title: text1,
            type: 'delete',
            message: text2,
            needConfirmation: true
        }).then(async (result) => {
            if (result === 'confirmed') {

                var payload = {
                    MissionId: missionId,
                };

                let req = await $.ajax({
                    url: "/mission/delete-mission",
                    method: "POST",
                    data: payload
                }).done(function (res) {
                    //console.log("check res", res);
                }).fail(function () { });
                customPopupAlertSecond.show({
                    title: text3,
                    type: 'delete',
                    message: text4,
                    needConfirmation: false
                }).then(() => {
                    location.reload();
                });
            }
        }).catch((error) => {
            if (error === 'cancelled') {
                //console.log('ผู้ใช้ยกเลิกการลบภารกิจ');
            }
        });
    } catch (error) {
        //console.error('เกิดข้อผิดพลาด:', error);
        customPopupAlert.show({
            title: text5,
            type: 'error',
            message: text6,
            needConfirmation: false
        });
    }
}
async function toggleMissionEdit(missionId) {
    location.href = `/mission/setting?missionId=${missionId}&edit=1`;
}

async function toggleTranslateLocalize() {
    $(".mission-page").localize();
}
document.addEventListener('DOMContentLoaded', function () {
    const pageContent = document.querySelector('.main-content-mission');

    if (pageContent) {
        let scrollAmount = 0;
        let scrollTimer = null;

        pageContent.addEventListener('wheel', function (e) {
            e.preventDefault();

            const delta = e.deltaY || e.detail || e.wheelDelta;
            scrollAmount += delta * 2;

            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }

            scrollTimer = setTimeout(function () {
                pageContent.scrollLeft += scrollAmount;
                scrollAmount = 0;
                scrollTimer = null;
            }, 20);
        });
    }
});
function toggleTranslate() {
    try {
        $(".mission-page").localize();
    } catch (e) {
        console.log(e.message);
    }
}
