# mission-report-mission-detail-by-reward — /mission/report-mission-by-reward/<id>?isMission=true|false

Reached from the count links in /mission/report-mission (the "reward" count column; mission rows use `?isMission=true` + mission id, sub-mission rows `?isMission=false` + sub-mission id).
`<title>`/h4 "สรุปรายงานรายสมาชิก". `#layout-wrapper.layout-mission-report`; common CSS + IBM-Plex-Sans-Thai.css + mission.css; scripts common + sweetalert2 + /js/table.js.

## Captured state: EMPTY
Both variants tried (isMission=false on sub-mission "QA Login ครบ 1 วัน" whose parent count was non-zero, and isMission=true on mission "QA Mission Rewards 20261015 Updated" with count 1) rendered the empty state `.table-jumbotron` (lord-icon nmgjlgnk + "ไม่พบข้อมูลที่ค้นหา" / "ลองเปลี่ยนเงื่อนไขการค้นหานะคะ"). The populated table markup is therefore NOT captured; it is almost certainly the same table as mission-report-mission-detail-by-mission (same container id `#reportMissionByMemberTable`).
**by-reward and by-member pages are byte-identical** in markup and both call the same endpoint (by-member-table) — likely a legacy bug, kept here as observed.

Differences vs by-mission: search placeholder "ค้นหาโปรโมชั่น"; filter titles have a trailing colon ("ภารกิจ :", "ประเภท :") and no i18n attributes; "ทั้งหมด" option values are `""`.

## Network
- POST /mission/report-mission-by-member-table/<id>?isMission=True|False (used by BOTH by-reward and by-member)
- /api/agent/get-credit-agent, /sms/get-credit
