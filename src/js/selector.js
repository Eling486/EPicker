import Icons from './icons';
import utils from './utils';
import handleOption from './options';
import Calendar from './templates/calendar';
import CalendarController from './controllers/calendar';
import CalendarContent from '../template/calendar_content.art';
import Events from './events';
import Theme from './theme';

const instances = [];

class ESelector {
    /**
     * ESelector constructor function
     *
     * @param {Object} options - See README
     * @constructor
     */
    constructor(options) {
        this.options = handleOption(options);
        this.container = this.options.container;
        this.target = this.options.target;

        if (this.options.type == 'calendar') {
            var rules = this.options.rules.split(' ')
            var rules_allow = ['all', 'future', 'past', 'weekday', 'fromData']

            for (var i = 0; i < rules.length; i++) {
                if (rules_allow.indexOf(rules[i]) < 0) {
                    return console.error(`[ESelector]ERROR: The rule: '${rules[i]}' is not allowed!`)
                }
            }
            if (this.options.rules.indexOf('future') >= 0 && this.options.rules.indexOf('past') >= 0) {
                return console.error("[ESelector]ERROR: The rules: 'future' and 'past' cannot be used at the same time.")
            }
            if (this.options.rules.indexOf('fromData') >= 0 && this.options.rules !== 'fromData') {
                return console.error("[ESelector]ERROR: The rule: 'fromData' can only be used alone.")
            }
            if (this.options.rules.indexOf('all') >= 0 && this.options.rules !== 'all') {
                return console.error("[ESelector]ERROR: The rule: 'all' can only be used alone.")
            }
            if (this.options.target.tagName !== 'INPUT') {
                return console.error("[ESelector]ERROR: The 'target' should be a <input>.")
            }
            if (!this.options.rules_data && (this.options.rules.indexOf('weekday') >= 0 || this.options.rules.indexOf('fromData') >= 0)) {
                return console.error("[ESelector]ERROR: Missing option: 'rules_data'.(If you want to use the rules: 'weekday' or 'fromData', you need to specify the 'rules_data')")
            }

            if (this.options.readonly) {
                this.target.readOnly = true
            }

            this.template = new Calendar({
                container: this.container,
                options: this.options
            });

            this.events = new Events();
            this.theme = new Theme(this)
            if (utils.isMobile) {
                this.template.body.classList.add('mobile')
            }
            this.changeCalender(0)
            if (this.options.default) {
                this.selectCalender(this.template.selected_date)
            }
            this.controller = new CalendarController(this);
        }

        instances.push(this);
    }

    showCalendar() {
        this.changeCalender(0)
        this.template.body.classList.add("active")
    }

    hideCalendar() {
        this.template.body.classList.remove("active")
    }

    changeCalender(order) {
        var viewDate = this.template.viewDate
        var nowDate = new Date()
        nowDate.setDate(1)
        if (order === -1) { //prevMonth
            var targetDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
            if (this.options.rules.indexOf('future') >= 0 && targetDate <= nowDate) {
                targetDate = nowDate
            }
        }
        if (order === 1) { //nextMonth
            var targetDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
            if (this.options.rules.indexOf('past') >= 0 && targetDate >= nowDate) {
                targetDate = nowDate
            }
        }
        if (order === -12) { //prevYear
            var targetDate = new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)
            if (this.options.rules.indexOf('future') >= 0 && targetDate <= nowDate) {
                targetDate = nowDate
            }
        }
        if (order === 12) { //nextYear
            var targetDate = new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)
            if (this.options.rules.indexOf('past') >= 0 && targetDate >= nowDate) {
                targetDate = nowDate
            }
        }
        if (order === 0) { //refresh
            var targetDate = this.template.viewDate
        }
        var calendar = utils.getCalendar(targetDate)

        if (this.options.rules.indexOf('weekday') >= 0) {
            var firstDay = targetDate
            firstDay.setDate(1)
            var weekday_first = firstDay.getDay()
            if (weekday_first == 0) {
                weekday_first = 7
            }
            for (var k = 0; k < this.options.rules_data.length; k++) {
                if (this.options.rules_data[k] > 7 || this.options.rules_data[k] < 1) {
                    return console.error("[ESelector]ERROR: The elements in the 'rules_data'(array) should be between 1 and 7.")
                }
                var weekday = this.options.rules_data[k]
                var date_constant = 36 + (weekday - weekday_first)
                for (var j = 0; j < calendar.length; j++) {
                    for (var i = 0; i < calendar[j].length; i++) {
                        if ((date_constant - calendar[j][i].date) % 7 == 0 && calendar[j][i].class.indexOf('this') >= 0) {
                            calendar[j][i].class += ' optional'
                        }
                    }
                }
            }
            if (this.options.rules_data.length == 0) {
                console.warn("[ESelector]WARNING: The 'rules_data'(array) is empty.")
            }
        }
        if (this.options.rules.indexOf('future') >= 0) {
            var nowDate = new Date()
            if (targetDate.getFullYear() == nowDate.getFullYear() && targetDate.getMonth() == nowDate.getMonth()) {
                var now_date = nowDate.getDate()
                for (var j = 0; j < calendar.length; j++) {
                    for (var i = 0; i < calendar[j].length; i++) {
                        if (calendar[j][i].class.indexOf('prev') >= 0) {
                            calendar[j][i].class += ' not-allow'
                        }
                        if (this.options.rules.indexOf('weekday') >= 0) {
                            if (calendar[j][i].date < now_date && calendar[j][i].class.indexOf('this') >= 0 && calendar[j][i].class.indexOf('optional') >= 0) {
                                calendar[j][i].class = 'this'
                            }
                        } else {
                            if (calendar[j][i].date >= now_date && calendar[j][i].class.indexOf('this') >= 0) {
                                calendar[j][i].class += ' optional'
                            }
                        }

                    }
                }
                this.template.prevMonthButton.classList.remove('active')
                this.template.prevYearButton.classList.remove('active')
                this.template.control.prev_month = false
                this.template.control.prev_year = false
            } else {
                for (var j = 0; j < calendar.length; j++) {
                    for (var i = 0; i < calendar[j].length; i++) {
                        if (this.options.rules.indexOf('weekday') < 0) {
                            calendar[j][i].class += ' optional'
                        }
                    }
                }
                this.template.prevMonthButton.classList.add('active')
                this.template.prevYearButton.classList.add('active')
                this.template.control.prev_month = true
                this.template.control.prev_year = true
            }
        }
        if (this.options.rules.indexOf('past') >= 0) {
            var nowDate = new Date()
            if (targetDate.getFullYear() == nowDate.getFullYear() && targetDate.getMonth() == nowDate.getMonth()) {
                var now_date = nowDate.getDate()
                for (var j = 0; j < calendar.length; j++) {
                    for (var i = 0; i < calendar[j].length; i++) {
                        if (calendar[j][i].class.indexOf('next') >= 0) {
                            calendar[j][i].class += ' not-allow'
                        }
                        if (this.options.rules.indexOf('weekday') >= 0) {
                            if (calendar[j][i].date > now_date && calendar[j][i].class.indexOf('this') >= 0 && calendar[j][i].class.indexOf('optional') >= 0) {
                                calendar[j][i].class = 'this'
                            }
                        } else {
                            if (calendar[j][i].date <= now_date && calendar[j][i].class.indexOf('this') >= 0) {
                                calendar[j][i].class += ' optional'
                            }
                        }
                    }
                }
                this.template.nextMonthButton.classList.remove('active')
                this.template.nextYearButton.classList.remove('active')
                this.template.control.next_month = false
                this.template.control.next_year = false
            } else {
                for (var j = 0; j < calendar.length; j++) {
                    for (var i = 0; i < calendar[j].length; i++) {
                        if (this.options.rules.indexOf('weekday') < 0) {
                            calendar[j][i].class += ' optional'
                        }
                    }
                }
            }
            this.template.nextMonthButton.classList.add('active')
            this.template.nextYearButton.classList.add('active')
            this.template.control.next_month = true
            this.template.control.next_year = true
        }

        if (this.options.rules == 'fromData') {
            var target_arr = utils.timeToStr(targetDate).split('-')
            var date_arr = []
            var date_item = []
            for (var i = 0; i < this.options.rules_data.length; i++) {
                var data_arr = this.options.rules_data[i].date.split('-')
                if (parseInt(data_arr[0]) == target_arr[0] && parseInt(data_arr[1]) == target_arr[1]) {
                    date_arr.push(parseInt(data_arr[2]))
                    date_item.push(this.options.rules_data[i])
                }
            }
            for (var j = 0; j < calendar.length; j++) {
                for (var i = 0; i < calendar[j].length; i++) {
                    var arr_index = date_arr.indexOf(calendar[j][i].date)
                    if (arr_index >= 0 && calendar[j][i].class.indexOf('this') >= 0) {
                        calendar[j][i].class += ' optional'
                        if (date_item[arr_index]) {
                            calendar[j][i].title = date_item[arr_index].title
                        }
                    }
                }
            }
            if (this.options.rules_data.length == 0) {
                console.warn("[ESelector]WARNING: The 'rules_data'(array) is empty.")
            }
        }

        if (this.options.rules == 'all') {
            for (var j = 0; j < calendar.length; j++) {
                for (var i = 0; i < calendar[j].length; i++) {
                    if (calendar[j][i].class.indexOf('this') >= 0) {
                        calendar[j][i].class += ' optional'
                    }
                }
            }
        }

        this.template.viewDate = targetDate
        var view_arr = utils.timeToStr(targetDate).split('-')
        this.template.view_year = view_arr[0]
        this.template.view_month = view_arr[1]
        this.template.ViewInfo.innerHTML = view_arr[0] + '-' + view_arr[1]
        this.template.calendar = calendar
        this.template.calendarContent.innerHTML = CalendarContent({
            view_year: this.template.view_year,
            view_month: this.template.view_month,
            selected_year: this.template.selected_year,
            selected_month: this.template.selected_month,
            selected_date: this.template.selected_date,
            calendar: calendar
        })
    }

    selectCalender(target) {
        this.template.selected_year = this.template.view_year
        this.template.selected_month = this.template.view_month
        this.template.selected_date = target
        this.template.calendarContent.innerHTML = CalendarContent({
            view_year: this.template.view_year,
            view_month: this.template.view_month,
            selected_year: this.template.selected_year,
            selected_month: this.template.selected_month,
            selected_date: this.template.selected_date,
            calendar: this.template.calendar
        })
        this.target.value = utils.timeToStr(new Date(this.template.selected_year, this.template.selected_month - 1, this.template.selected_date))
        this.events.trigger('selected');
        this.hideCalendar()
    }

    cancel() {
        if (this.options.type == 'calendar') {
            this.template.selected_year = null
            this.template.selected_month = null
            this.template.selected_date = null
            this.template.calendarContent.innerHTML = CalendarContent({
                view_year: this.template.view_year,
                view_month: this.template.view_month,
                selected_year: this.template.selected_year,
                selected_month: this.template.selected_month,
                selected_date: this.template.selected_date,
                calendar: this.template.calendar
            })
            this.target.value = ''
            this.events.trigger('cancel');
            this.hideCalendar();
        }
    }

    select(target) {
        if (this.options.type == 'calendar') {
            if (typeof target == 'undefined') {
                return console.warn(`[ESelector]TIPS: es.select(target); target is a time string or a Date()`)
            } else if (typeof target == 'string') {
                if (target.split('-').length === 3) {
                    var target_date = utils.strToTime(target)
                } else {
                    return console.error(`[ESelector]ERROR: The target: '${target}' is not allowed!`)
                }
            } else if (typeof target == 'object') {
                var target_date = target
            } else {
                return console.error(`[ESelector]ERROR: The target: '${target}'(${typeof target}) is not allowed!`)
            }
            var target_date_arr = utils.timeToStr(target_date).split('-')
            target_date.setDate(1)
            this.template.viewDate = target_date
            this.template.view_year = target_date_arr[0]
            this.template.view_month = target_date_arr[1]
            this.selectCalender(parseInt(target_date_arr[2]))
        }
    }

    /**
     * bind events
     */
    on(name, callback) {
        this.events.on(name, callback);
    }

    /**
     * destroy this selector
     */
    destroy() {
        instances.splice(instances.indexOf(this), 1);
        this.container.innerHTML = '';
        this.events.trigger('destroy');
    }

    static get version() {
        /* global ESELECTOR_VERSION */
        return ESELECTOR_VERSION;
    }
}


export default ESelector;