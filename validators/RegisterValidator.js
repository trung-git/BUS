const { check } = require('express-validator')

module.exports = [
    check('username')
    .exists().withMessage("Please enter Username")
    .notEmpty().withMessage("Username can't empty"),

    check('password')
    .exists().withMessage("Please enter Password")
    .notEmpty().withMessage("Password can't empty")
    .isLength({ min: 6 }).withMessage("Password length min are 6 character"),

]