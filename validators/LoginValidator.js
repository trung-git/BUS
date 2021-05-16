const { check } = require('express-validator')

module.exports = [
    check('username')
    .exists().withMessage("Hãy nhập username")
    .notEmpty().withMessage("Username không được để trống"),

    check('password')
    .exists().withMessage("Hãy nhập password")
    .notEmpty().withMessage("Password không được để trống")
    .isLength({ min: 6 }).withMessage("Password phải chứa ít nhất 6 ký tự"),

]