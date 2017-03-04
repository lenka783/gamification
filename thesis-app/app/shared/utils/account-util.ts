import { Account } from "../";

var validator = require("email-validator");

export function hasValidEmail(account: Account) {
    return validator.validate(account.email);
}