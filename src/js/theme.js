class Theme {
    constructor(selecter) {
        this.container = selecter.container;
        this.body = selecter.template.body
        this.options = selecter.options;
        this.theme = selecter.options.theme
        this.ALLOWED_THEME = ['default', 'sakura', 'sakura_light']
        this.THEME_LIST = {
            default: {
                bgcolor: '#fff',
                txtcolor: '#2a3a4a',
                shadow_color: '21, 101, 192',
                bgcolor_able: '#fff',
                txtcolor_able: '#1565C0',
                bgcolor_disabled: '#ededed',
                txtcolor_disabled: '#888',
                bgcolor_hover: '#6999d3',
                txtcolor_hover: '#fff'
            },
            sakura: {
                bgcolor: '#fff7f7',
                txtcolor: '#da7878',
                shadow_color: '243,131,143',
                bgcolor_able: '#fff',
                txtcolor_able: '#f3838f',
                bgcolor_disabled: '#ffefec',
                txtcolor_disabled: '#f7b9b9',
                bgcolor_hover: '#f1bdb2',
                txtcolor_hover: '#fff'
            },
            sakura_light: {
                bgcolor: '#fff',
                txtcolor: '#d45966',
                shadow_color: '243,131,143',
                bgcolor_able: '#fff',
                txtcolor_able: '#f3838f',
                bgcolor_disabled: '#fff1f1',
                txtcolor_disabled: '#e8cccc',
                bgcolor_hover: '#f1bdb2',
                txtcolor_hover: '#fff'
            },
        }
        this.init();
    }

    init() {
        if (typeof this.theme == 'string') {
            if (this.ALLOWED_THEME.indexOf(this.theme) >= 0) {
                var theme_data = this.THEME_LIST[this.theme]
                for (const item in theme_data) {
                    this.body.style.setProperty('--eselector_' + item, theme_data[item]);
                }
            }
        }
        if (typeof this.theme == 'object') {
            for (const defaultKey in this.THEME_LIST.default) {
                if (this.THEME_LIST.default.hasOwnProperty(defaultKey) && !this.theme.hasOwnProperty(defaultKey)) {
                    this.theme[defaultKey] = this.THEME_LIST.default[defaultKey];
                }
            }
            for (const item in this.theme) {
                this.body.style.setProperty('--eselector_' + item, this.theme[item]);
            }
        }
    }
}

export default Theme;