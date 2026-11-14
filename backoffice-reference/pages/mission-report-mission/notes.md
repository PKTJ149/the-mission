# mission-report-mission — /mission/report-mission (สรุปรายงานรายภารกิจ)

Layout `layout-mission-report`; common CSS + IBM-Plex-Sans-Thai.css + mission.css. Server/JS-rendered grouped table (mission row followed by its sub-mission rows); no pagination; sticky summary row `tr.tr-summary`.
Filters: Search, วันที่สรุป (flatpickr), status pill (its title wrongly reuses i18n key dateReport → shows "วันที่สรุป"; screenshot shows "วันที่สรุป All"), ภารกิจ.
Drill-down links (separate pages, NOT captured): /mission/report-mission-by-mission/<id>, /mission/report-mission-by-reward/<id>?isMission=true, /mission/report-mission-by-member/<id>?isMission=true.
Network: /mission/report-mission-table, GET /api/agent/get-credit-agent, GET /sms/get-credit.
