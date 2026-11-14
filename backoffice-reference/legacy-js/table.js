class Table {
    constructor(selector, url, options = {}) {
        this.selector = selector;

        this.$selector = $(selector);
        if (this.$selector.length <= 0) throw 'selector is require one element.';

        /* System Table */
        this.isSystem = this.$selector.hasClass('system-table');
        this.isInitialize = false;
        this.isBindEvent = false;

        this.options = options;
        this.loadingSelector = null;
        this.url = url || null;
        this.offset = 0;
        this.limit = 10;
        this.searchSelector = "#txtSearch";
        this.sortingSelector = "#selectSorting";
        this.refreshButtonSelector = "#btnRefresh";
        this.deleteUrl = "";
        this.filters = [];

        if (this.isSystem) {
            this.body = $(`<div class='table-body'></div>`);
            this.$selector.append(this.body);

            const loading = this.$selector.find('.table-loading');
            if (loading.length > 0) this.loadingSelector = loading;

            const search = $(this.searchSelector);
            if (search.length > 0) this.$search = search;

            this.isInitialize = true;
        }
    }

    setLoading(selector) {
        this.loadingSelector = selector;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setDeleteUrl(deleteUrl) {
        this.deleteUrl = deleteUrl;
        return this;
    }

    setSearchInput(selector) {
        this.searchSelector = selector;
        var $this = this;

        $(selector).on('keyup', function (e) {
            if (e.which == 13) {
                $this.refresh(true);
            }
        });

        return this;
    }

    setSorting(selector) {
        this.sortingSelector = selector;

        var $this = this;

        $(selector).change(function (e) {
            $this.refresh();
        });

        return this;
    }

    addFilterDateRange(selector, field) {
        //this.refreshButtonSelector = selector;
        //var $this = this;

        //this.filters.push({ selector: selector, field: field, type: "DateRange" });

        //console.log($(selector));

        //$(selector)[0]._flatpickr.config.onChange.push(function() {
        //    $this.refresh();
        //});

        //return this;

        var $this = this;
        this.filters.push({ selector: selector, field: field, type: "DateRange" });

        $(selector).change(function () {
            $this.refresh();
        });

        return this;
    }

    addFilterSelect2(selector, field) {
        this.refreshButtonSelector = selector;
        var $this = this;

        this.filters.push({ selector: selector, field: field, type: "Select2" });

        $(selector).change(function () {
            $this.refresh();
        });

        return this;
    }

    addFilterHiddenField(selector, field) {
        this.refreshButtonSelector = selector;
        var $this = this;

        this.filters.push({ selector: selector, field: field, type: "Hidden" });

        $(selector).change(function () {
            $this.refresh();
        });

        return this;
    }

    addFilterValue(value, field) {
        this.filters.push({ value: value, field: field, type: "Value" });

        return this;
    }

    useFilterHiddenField(selector, field) {
        this.filters.push({ selector, field, type: "Hidden" });
        return this;
    }

    useFilterSingle(instance, field) {
        if (instance instanceof CustomDropdown) {
            this.filters.push({ instance, field, type: "FilterSingle" });
            const fs = instance.getOption('onSelect');

            instance.setOptions({
                onSelect: (...args) => {
                    this.requestData(true);
                    if (fs) fs(...args);
                }
            });
        }

        return this;
    }

    useFilterMultiple(instance, field, delimiter = null) {
        if (instance instanceof CustomDropdown) {
            this.filters.push({ instance, field, type: "FilterMultiple", delimiter });
            const fs = instance.getOption('onSelect');

            instance.setOptions({
                onSelect: (...args) => {
                    this.requestData(true);
                    if (fs) fs(...args);
                }
            });
        }

        return this;
    }

    setRefreshButton(selector) {
        this.refreshButtonSelector = selector;
        var $this = this;

        $(selector).click(function () {
            $this.refresh();
        });

        return this;
    }

    setOffset(offset) {
        this.offset = offset == null ? 0 : offset;

        return this;
    }

    setLimit(limit) {
        this.limit = limit == null || limit < 0 ? 0 : limit;

        return this;
    }

    bindEvents() {
        if (this.isSystem) {
            return this.bindPagination();
        }

        var $this = this;
        let localSelector = this.selector;
        let localDeleteUrl = this.deleteUrl;

        $(this.selector + " li:not(.active) .page:not(.disabled)").click(function () {
            var offset = $(this).data("offset");
            $this.setOffset(offset);
            $this.refresh();
        });
        $(this.selector + " .pagination-prev:not(.disabled)").click(function () {
            var offset = $(this).data("offset");
            $this.setOffset(offset);
            $this.refresh();
        });
        $(this.selector + " .pagination-next:not(.disabled)").click(function () {
            var offset = $(this).data("offset");
            $this.setOffset(offset);
            $this.refresh();
        });
        $(this.selector + " .limit").change(function () {
            var limit = $(this).val();
            $this.setOffset(0);
            $this.setLimit(limit);
            $this.refresh();
        });

        $(this.selector + " .delete").click(function () {
            var id = $(this).data("id");
            $(localSelector + " .deleteModal .btnDelete").data("id", id);

            let $localDeleteModel = $(localSelector + " .deleteModal");
            $localDeleteModel.modal("show");

            $(localSelector + " .deleteModal .btnDelete").click(function () {
                $.ajax({
                    url: localDeleteUrl + "/" + id,
                    method: "DELETE"
                }).done(function (res) {
                    if (res.status == 200) {
                        $this.refresh();
                    } else {
                        alert(res.message);
                    }
                }).fail(function () {
                    alert("พบปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
                }).always(function () {
                    $localDeleteModel.modal("hide");
                });
            });
        });

        return this;
    }

    bindPagination() { /* For system table */
        const wrapper = this.$selector.find('.system-pagination');
        if (wrapper.length > 0) {
            const pagination = this.pagination = {};
            const limit = wrapper.find('.pagination-limit');
            pagination.list = wrapper.find('.pagination-list');

            pagination.limit = new CustomDropdown(limit[0], {
                single: true,
                initValue: this.limit,
                stretch: true,
                auto: true,
                horizontal: false,
                onSelect: (value) => {
                    this.offset = 0;
                    this.limit = parseInt(value);
                    this.requestData();
                }
            });

            pagination.offsets = wrapper.find(`
                .paginate-page:not(.disabled):not(.active),
                .paginate-next:not(.disabled),
                .paginate-next-all:not(.disabled),
                .paginate-prev:not(.disabled),
                .paginate-prev-all:not(.disabled)
            `);

            $.each(pagination.offsets, (_, elem) => {
                elem.onclick = (e) => {
                    this.offset = Number(e.currentTarget.dataset.offset) || 0;
                    this.requestData();
                }
            });

            // Binding delete event via table
            $(this.selector + " .delete").click(function () {
                var id = $(this).data("id");
                $(localSelector + " .deleteModal .btnDelete").data("id", id);

                let $localDeleteModel = $(localSelector + " .deleteModal");
                $localDeleteModel.modal("show");

                $(localSelector + " .deleteModal .btnDelete").click(function () {
                    $.ajax({
                        url: localDeleteUrl + "/" + id,
                        method: "DELETE"
                    }).done(function (res) {
                        if (res.status == 200) {
                            $this.refresh();
                        } else {
                            alert(res.message);
                        }
                    }).fail(function () {
                        alert("พบปัญหาในการเชื่อมต่อเซิร์ฟเวอร์");
                    }).always(function () {
                        $localDeleteModel.modal("hide");
                    });
                });
            });

            this.isBindEvent = true;
        }
    }

    async requestData(reset = false) { /* For system table */
        if (reset) this.setOffset(0);

        const { adjustableColumns, beforeRequest, afterRequest } = this.options;
        let limit = this.limit,
            offset = this.offset,
            columns = null;

        const search = $(this.searchSelector).val();
        const sorting = $(this.sortingSelector).val();
        const loading = $(this.loadingSelector);

        //! Enable adjustable columns (Mockup)
        if (adjustableColumns) {
            columns = [];
        }

        // Prevent faster filters
        this.$selector.children(':not(.table-loading)').remove();
        loading.show();

        const filters = this.getFilter();
        console.log('filters', filters);

        const fallback = new Promise(
            resv => setTimeout(
                () => resv(), 500
            )
        );

        const response = $.ajax({
            url: this.url,
            method: "post",
            data: {
                offset,
                limit,
                search,
                sorting,
                filters,
                columns
            }
        });

        if (beforeRequest) beforeRequest();

        await Promise.all([response, fallback]).then(([resp]) => {
            loading.hide();

            // Prevent faster filters
            // ⚠️ ลบแถวตอน tooltip ยังโชว์อยู่ = tooltip กำพร้าค้างบนจอตลอด (Bootstrap ต้อง dispose ก่อนลบ element) — ทีมเทส #110
            this.$selector.find('[data-bs-toggle="tooltip"]').each((_, el) => bootstrap.Tooltip.getInstance(el)?.dispose());
            this.$selector.children(':not(.table-loading)').remove();
            this.$selector.append(resp);

            if (updateI18n) updateI18n();

            this.bindPagination();

            CustomTooltip.initBootstrap();
            CustomTooltip.initCustom();

            if (afterRequest) afterRequest();
        });

        loading.hide();
    }

    getSearchValue = () => {
        return $(this.searchSelector).val();
    };

    getFilter() {
        const filters = [];
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];

            if (filter.type == "DateRange") {
                var dates = $(filter.selector).val().trim();

                if (dates == "")
                    continue;

                if (dates != "" && dates.indexOf("to") == -1) {
                    filters.push({ field: filter.field + "From", value: dates });
                    filters.push({ field: filter.field + "To", value: dates });
                }
                else if (dates != null && dates !== "") {
                    var dateArray = dates.split(" to ");

                    filters.push({ field: filter.field + "From", value: dateArray[0] });
                    filters.push({ field: filter.field + "To", value: dateArray[1] });
                }
            } else if (filter.type == "Select2") {
                var value = $(filter.selector).val();

                if (value != "") {
                    filters.push({ field: filter.field, value: value });
                }
            } else if (filter.type == "Hidden") {
                var value = $(filter.selector).val();

                if (value != "") {
                    filters.push({ field: filter.field, value: value });
                }
            } else if (filter.type == "Value") {
                filters.push({ field: filter.field, value: filter.value });
            } else if (filter.type === 'FilterSingle') {
                const { instance, field } = filter;
                const value = instance.getValue();

                filters.push({ field, value });
            } else if (filter.type === 'FilterMultiple') {
                const { instance, field, delimiter } = filter;
                const _value = instance.getValue();
                let value = _value;

                if (delimiter) value = _value.join(delimiter);

                filters.push({ field, value, arrayValues: _value });
            }
        }
        return filters;
    }

    refresh(reset = false) {
        if (this.isSystem) {
            return this.requestData(reset);
        }

        var selector = this.selector;
        if (reset) this.setOffset(0);

        var search = $(this.searchSelector).val();
        var limit = $(this.selector + " .limit").val();
        var sorting = $(this.sortingSelector).val();

        const filters = this.getFilter();

        var $table = $(this.selector);
        $table.hide();

        var $loading = $(this.loadingSelector);
        $loading.show();

        $.ajax({
            url: this.url,
            method: "POST",
            data: {
                offset: this.offset,
                limit: limit,
                search: search,
                sorting: sorting,
                filters
            }
        }).done(function (res) {
            // ⚠️ เหมือนข้างบน: dispose tooltip ก่อนแทนที่แถว ไม่งั้นค้างบนจอ (ทีมเทส #110)
            $(selector).find('[data-bs-toggle="tooltip"]').each((_, el) => bootstrap.Tooltip.getInstance(el)?.dispose());
            $(selector).html(res);

            if (updateI18n) updateI18n();

            CustomTooltip.initBootstrap();
            CustomTooltip.initCustom();
        }).always(function (res) {
            $loading.hide();
            $table.show();
        });

        return this;
    }

    setOptions(options = {}) {
        return Object.assign(this.options, options);
    }
}
