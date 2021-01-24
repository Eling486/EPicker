import utils from '../utils';

class Controller {
    constructor(selector) {
        this.selector = selector;
        this.options = selector.options

        this.addTargetListener()
        this.initNextMonthButton();
        this.initNextYearButton();
        this.initPrevMonthButton();
        this.initPrevYearButton();
        this.initCancelButton();
        this.initCalendarItems();
    }

    addTargetListener(){
        this.options.target.addEventListener('focus', () => {
            this.selector.showCalendar();
        });
    }
    initNextMonthButton() {
        this.selector.template.nextMonthButton.addEventListener('click', () => {
            if(this.selector.template.control.next_month == true){
                this.selector.changeCalender('nextMonth');
            }
        });
    }

    initNextYearButton() {
        this.selector.template.nextYearButton.addEventListener('click', () => {
            if(this.selector.template.control.next_year == true){
                this.selector.changeCalender('nextYear');
            }
        });
    }

    initPrevMonthButton() {
        this.selector.template.prevMonthButton.addEventListener('click', () => {
            if(this.selector.template.control.prev_month == true){
                this.selector.changeCalender('prevMonth');
            }
        });
    }

    initPrevYearButton() {
        this.selector.template.prevYearButton.addEventListener('click', () => {
            if(this.selector.template.control.prev_year == true){
                this.selector.changeCalender('prevYear');
            }
        });
    }
    initCancelButton() {
        this.selector.template.cancelButton.addEventListener('click', () => {
            this.selector.selectNone();
        });
    }

    initCalendarItems() {
        this.selector.template.calendarContent.addEventListener('click', (e) => {
            if(e.target.classList[2] == 'this' && e.target.classList[3] == 'optional'){
                this.selector.selectDate(e.target.innerHTML)
            }
            if(e.target.classList[2] == 'prev' && this.selector.template.control.prev_month == true){
                this.selector.changeCalender('prevMonth', this.options);
            }
            if(e.target.classList[2] == 'next' && this.selector.template.control.next_month == true){
                this.selector.changeCalender('nextMonth', this.options);
            }
        });
    }
}

export default Controller;
