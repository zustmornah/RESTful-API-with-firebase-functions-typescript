/* eslint-disable no-useless-escape */
export const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const regEx = /^\+[1-9]\d{10,14}$/;

/**
 * Adds two numbers together.
 * @param {string} niceString  Entity to validate.
 * @return {boolean} True or False if typeof is string.
 */
export function IsValidString(niceString: string): boolean {
    return typeof niceString === "string";
}

/**
 * Adds two numbers together.
 * @param {number} jumpyNumber  Entity to validate.
 * @return {boolean} True or False if typeof is string.
 */
export function IsValidNumber(jumpyNumber: number): boolean {
    return typeof jumpyNumber === "number";
}
