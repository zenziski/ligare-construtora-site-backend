export interface IUser {
    _id: any,
    name: string,
    email: string,
    password: string,
    isBlocked: boolean,
    isActive: boolean,
    validation: {
        isValidated: boolean,
        validationCode?: Number
    },
    permission: string
    cpf: string
}

export interface IUserLogin {
    email: string,
    password: string
}

export interface IUserRegister {
    email: string,
    password: string,
    name: string,
    cpf: string
}

export enum IUserErrors {
    NOT_FOUND = "NOT_FOUND",
    IS_BLOCKED = "IS_BLOCKED",
    IS_NOT_ACTIVE = "IS_NOT_ACTIVE",
    IS_NOT_VALIDATED = "IS_NOT_VALIDATED",
    WRONG_PASSWORD = "WRONG_PASSWORD",
    EMAIL_ALREADY_IN_USE = "EMAIL_ALREADY_IN_USE",
    REQUIRED_FIELD = "REQUIRED_FIELD"
}