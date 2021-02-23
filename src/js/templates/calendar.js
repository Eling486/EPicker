import Icons from '../icons';
import utils from '../utils';
import dateSelector from '../../template/calendar.art';

class Calendar {
    constructor(options) {
        this.container = options.container;
        this.target = options.target;
        this.options = options.options;
        this.init();
    }

    init() {
        var now = new Date()
        var now_str = utils.timeToStr(now)
        var now_arr = now_str.split('-')
        if (this.options.default) {
            if(typeof this.options.default == 'string'){
                if (this.options.default == 'today') {
                    var option_default = now
                }else if(this.options.default.split('-').length === 3){
                    var option_default = utils.strToTime(this.options.default)
                }else{
                    return console.error(`[EPicker]ERROR: '${this.options.default}' is not allowed!`)
                }
            }else if(typeof this.options.default == 'object'){
                var option_default = this.options.default
            }else{
                return console.error(`[EPicker]ERROR: '${this.options.default}' is not allowed!`)
            }
            var default_str = utils.timeToStr(option_default)
            var default_fill = default_str.split('-')
            if (this.options.rules.indexOf('future') >= 0) {
                if (option_default.getTime() < now.getTime()) {
                    var default_str = now_str
                    var default_fill = now_arr
                    console.error(`[EPicker]WARNING: '${this.options.default}' is earlier than today!`)
                }
            }
            if (this.options.rules.indexOf('past') >= 0) {
                if (option_default.getTime() > now.getTime()) {
                    var default_str = now_str
                    var default_fill = now_arr
                    console.error(`[EPicker]WARNING: '${this.options.default}' is later than today!`)
                }
            }
            this.selected_year = default_fill[0]
            this.selected_month = default_fill[1]
            this.selected_date = default_fill[2]
            this.view_year = this.selected_year
            this.view_month = this.selected_month
        } else {
            this.selected_year = ''
            this.selected_month = ''
            this.selected_date = ''
            this.view_year = now_arr[0]
            this.view_month = now_arr[1]
            var default_str = now_str
        }

        this.viewDate = utils.strToTime(default_str)
        this.viewDate.setDate(1)
        this.calendar = utils.getCalendar(this.viewDate)

        this.control = {
            prev_year: true,
            prev_month: true,
            next_year: true,
            next_month: true,
        }

        this.container.innerHTML = dateSelector({
            options: this.options,
            Icons: Icons,
            getObject: (obj) => obj,
            view_year: this.view_year,
            view_month: this.view_month,
            selected_year: this.selected_year,
            selected_month: this.selected_month,
            selected_date: this.selected_date,
            control: this.control,
            calendar: this.calendar
        });

        this.body = this.container.querySelector('.epicker-body');
        this.ViewInfo = this.container.querySelector('.control-wrap .text');
        this.prevYearButton = this.container.querySelector('.prev-year');
        this.prevMonthButton = this.container.querySelector('.prev-month');
        this.nextMonthButton = this.container.querySelector('.next-month');
        this.nextYearButton = this.container.querySelector('.next-year');
        this.cancelButton = this.container.querySelector('.cancel');
        this.calendarContent = this.container.querySelector('.calendar-content');
    }
}

export default Calendar;
