const isMobile = /mobile/i.test(window.navigator.userAgent);
const supportCssVar = window.CSS && window.CSS.supports && window.CSS.supports('--a', 0);

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const utils = {
    isMobile: isMobile,

    isSupportCssVar: supportCssVar,

    storage: {
        set: (key, value) => {
            localStorage.setItem(key, value);
        },

        get: (key) => localStorage.getItem(key),
    },

    timeToStr: (date) => {
        return date.format("yyyy-MM-dd")
    },

    strToTime: (str) => {
        str = str.replace(/[^\d|^\-|^\\|^:|^\.]/g, " ");
        return new Date(str.replace(/-/g, "/"));
    },

    getCalendar: (time_obj) => {
        var view_date_arr = utils.timeToStr(time_obj).split('-')
        var view_firstday = new Date(view_date_arr[0], view_date_arr[1] - 1, 1)
        var view_first_weekday = view_firstday.getDay()
        if (view_first_weekday == 0) {
            view_first_weekday = 7
        }
        var days_num = new Date(view_date_arr[0], view_date_arr[1], 0).getDate()
        var prev_days_num = new Date(view_date_arr[0], view_date_arr[1] - 1, 0).getDate()

        var calendar = []

        var process_date = 0
        for (var j = 0; j < 6; j++) {
            var week_arr = []
            if (process_date == 0) {
                for (var i = 0; i < view_first_weekday - 1; i++) {
                    var week_item = {
                        "date": prev_days_num - (view_first_weekday - 2 - i),
                        "class": "prev"
                    }
                    week_arr.push(week_item)
                }
                for (var i = 0; i < 8 - view_first_weekday; i++) {
                    var week_item = {
                        "date": process_date + 1,
                        "class": "this"
                    }
                    week_arr.push(week_item)
                    process_date++
                }
            } else if (process_date < days_num) {
                for (var i = 0; i < 7; i++) {
                    if (process_date < days_num) {
                        var week_item = {
                            "date": process_date + 1,
                            "class": "this"
                        }
                        week_arr.push(week_item)
                        process_date++
                    } else {
                        var week_item = {
                            "date": process_date - days_num + 1,
                            "class": "next"
                        }
                        week_arr.push(week_item)
                        process_date++
                    }

                }
            } else {
                for (var i = 0; i < 7; i++) {
                    var week_item = {
                        "date": process_date - days_num + 1,
                        "class": "next"
                    }
                    week_arr.push(week_item)
                    process_date++
                }
            }
            calendar.push(week_arr)
        }
        return calendar
    }
};

export default utils;
