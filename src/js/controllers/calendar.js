import utils from '../utils';

class Controller {
    constructor(selector) {
        this.selector = selector;
        this.options = selector.options
        this.target = selector.target
        this.body = selector.template.body

        this.addTargetListener()
        this.initNextMonthButton();
        this.initNextYearButton();
        this.initPrevMonthButton();
        this.initPrevYearButton();
        this.initCancelButton();
        this.initCalendarItems();
        this.addClickListener()
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
            if(e.target.classList.contains('this') && e.target.classList.contains('optional') ){
                this.selector.selectDate(e.target.innerHTML)
            }
            if(e.target.classList.contains('prev') && this.selector.template.control.prev_month == true){
                this.selector.changeCalender('prevMonth', this.options);
            }
            if(e.target.classList.contains('next') && this.selector.template.control.next_month == true){
                this.selector.changeCalender('nextMonth', this.options);
            }
        });
    }

    addClickListener() {
        document.addEventListener('click', (e) => {
            if(e.path.indexOf(this.body) < 0 && e.path.indexOf(this.target) < 0){
                this.selector.hideCalendar()
            }
        });
    }
}

export default Controller;
