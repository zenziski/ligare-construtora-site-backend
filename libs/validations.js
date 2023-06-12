const _ = require('lodash');
const moment = require('moment');

const optionsDefault = {
    removeUnknown: true
}

const create = (schema, options = {}) => {
    options = { ...optionsDefault, ...options };

    let fieldsConfig = {};
    for (const dataKey of Object.keys(schema)) {
        const keySchema = schema[dataKey];

        if (typeof keySchema === 'string') {
            const separatorIndex = keySchema.indexOf('|');
            const schemaType = keySchema.substr(0, separatorIndex !== -1 ? separatorIndex : keySchema.length);
            const schemaOptions = separatorIndex !== -1 ? keySchema.substr(separatorIndex + 1, keySchema.length) : ''

            if (!validators[schemaType]) continue;

            fieldsConfig[dataKey] = {
                type: schemaType,
                validators: []
            };

            if (schemaOptions) {
                for (let option of schemaOptions.split('|')) {
                    const [func, param] = option.split(':');

                    if (validators[schemaType][func]) {
                        fieldsConfig[dataKey].validators.push({ func, param });
                    }
                }
            }
        } else if (typeof keySchema === 'object' && Array.isArray(keySchema) && typeof keySchema[0] === 'object') {
            fieldsConfig[dataKey] = { objectValidator: create(keySchema[0]) };
        } else if (typeof keySchema === 'object') {
            if (keySchema['$type']) {
                const schemaType = keySchema.$type;
                if (!validators[schemaType]) continue;

                fieldsConfig[dataKey] = {
                    type: schemaType,
                    validators: []
                };

                for (let func of Object.keys(keySchema)) {
                    if (func === 'type') continue;

                    let param = keySchema[func];

                    if (func === 'function' || validators[schemaType][func]) {
                        fieldsConfig[dataKey].validators.push({ func, param });
                    }
                }
            } else {
                fieldsConfig[dataKey] = { objectValidator: create(keySchema) };
            }
        }
    }

    const schemaKeys = Object.keys(fieldsConfig);

    return async (data) => {
        data = _.cloneDeep(data);
        let dataKeys = Object.keys(data);

        if (options.removeUnknown) {
            for (const dataKey of dataKeys) {
                if (!schemaKeys.includes(dataKey)) {
                    delete data[dataKey];
                }
            }

            dataKeys = Object.keys(data);
        }

        let errors = {};

        for (const dataKey of dataKeys) {
            const fieldConfig = fieldsConfig[dataKey];
            if (!fieldConfig) continue;

            const isInnerObject = fieldConfig.hasOwnProperty('objectValidator');

            let error = null;


            if (isInnerObject && Array.isArray(data[dataKey])) {
                const arrayErrors = [];
                for (let i = 0; i < data[dataKey].length; i++) {
                    const innerValidationResult = await fieldConfig.objectValidator(data[dataKey][i]);
                    if (!innerValidationResult.valid) {
                        arrayErrors[i] = innerValidationResult.errors;
                    } else {
                        data[dataKey][i] = innerValidationResult.data;
                    }
                }

                if (arrayErrors.length > 0) error = [...arrayErrors];
            }
            else if (isInnerObject) {
                const innerValidationResult = await fieldConfig.objectValidator(data[dataKey]);
                if (!innerValidationResult.valid) {
                    error = innerValidationResult.errors;
                } else {
                    data[dataKey] = innerValidationResult.data;
                }
            } else {
                data[dataKey] = validators[fieldConfig.type].cast(data[dataKey]);

                for (let option of fieldConfig.validators) {
                    if (error) continue;

                    if (option.func === 'function' && option.param) {
                        error = await option.param(data[dataKey], data);
                    }
                    else {
                        error = validators[fieldConfig.type][option.func](data[dataKey], option.param, data);
                    }
                }
            }

            if (error) errors[dataKey] = error;
        }

        return { valid: Object.keys(errors).length === 0, data, errors };
    };
}

module.exports.create = create;
module.exports.registerValidator = (type, name, func) => {
    if (!validators[type]) return;
    validators[type][name] = func;
}

var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validators = {
    string: {
        cast: value => {
            return value.toString()
        },
        min: (value, param) => {
            return (value.length < parseInt(param)) ? 'Valor abaixo do esperado' : ''
        },
        max: (value, param) => {
            return (value.length > parseInt(param)) ? 'Valor acima do esperado' : ''
        },
        required: value => {
            return value ? '' : 'Campo obrigatório'
        },
        equals: (value, param, object) => {
            return object[param] === value ? '' : 'Valores não batem';
        },
        email: (value) => {
            return EMAIL_REGEX.test(value) ? '' : 'Email inválido';
        }
    },
    int: {
        cast: value => {
            return parseInt(value);
        },
        min: (value, param) => {
            return value <= parseInt(param) ? 'Valor abaixo do esperado' : ''
        },
        max: (value, param) => {
            return value >= parseInt(param) ? 'Valor acima do esperado' : ''
        },
        required: value => {
            return value > 0 ? '' : 'Campo obrigatório'
        }
    },
    float: {
        cast: value => {
            return parseFloat(value);
        },
        required: value => {
            return value > 0 ? '' : 'Preenchimento obrigatório'
        }
    },
    bool: {
        cast: value => {
            return value.toString() === 'true' || parseInt(value) > 0
        }
    },
    date: {
        cast: value => {
            return moment(value).isValid() ? moment(value).toDate() : null;
        }
    },
    object: {
        cast: value => {
            return value;
        }
    }
}