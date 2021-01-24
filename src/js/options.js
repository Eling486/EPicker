export default (options) => {
    // default options
    const defaultOption = {
        container: options.element || document.getElementsByClassName('eselector')[0],
        type: 'calendar',
        target: options.fill || document.getElementsByClassName('eselector-target')[0],
        readonly: true,
        rules: 'all',
        rules_data: null,
        default: null,
        theme: 'default',
        data: null,
    };
    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }
    return options;
};
