const { check, validationResult } = require("express-validator");
const { BadRequest, NotFound } = require("../helper/error");
const UserModel = require("../models/user");

const resultsOfValidation = (req, res, next) => {
  const messages = [];
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next(); //pass to controller
  }
  errors.array().map((err) => messages.push({ [err.param]: err.msg }));
  throw new BadRequest(messages);
};

const createUserValidator = () => {
  return [
    check("sapid")
      .exists({ checkFalsy: true })
      .withMessage("SAP ID is mandatory")
      .bail()
      .isNumeric()
      .withMessage("SAP ID should have all numbers")
      .bail()
      .isLength({ min: 6, max: 8 })
      .withMessage("SAP ID should have minimum 6, max 8 characters")
      .custom(async (value) => {
        const { user, userName } = await UserModel.getUserBySapId(value);
        if (!user) {
          // user doesn't exist but SAPID exist
          return true;
        }
        if (user.error) {
          throw new Error(user.error);
        } else if (user) {
          throw new Error(`User with SAP Id ${value} already exist`);
        }
        return true;
      }),
    check("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is mandatory")
      .bail()
      .isLength({ min: 5 })
      .withMessage("Password should have minimum 5 characters"),
    check("confirmPassword")
      .exists({ checkFalsy: true })
      .withMessage("Repeat Password is mandatory")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Repeat Password is incorrect");
        }
        return true;
      }),

    /* check('firstName')
            .exists({ checkFalsy: true }).withMessage('First Name is mandatory')
            .bail()
            .isAlpha().withMessage('First Name should have all alphabets') 
            .bail()
            .isLength({min:3}).withMessage('First Name should have minimum 3 characters')
        ,
        check('lastName')
            .optional({ checkFalsy: true }) //ignore validation when null or empty
            .isAlpha().withMessage('Last Name should have only alphabets')
            .bail()   */
  ];
};

const createSapUserValidator = () => {
  return [
    check("sapid")
      .exists({ checkFalsy: true })
      .withMessage("SAP ID is mandatory")
      .bail()
      .isNumeric()
      .withMessage("SAP ID should have all numbers")
      .bail()
      .isLength({ min: 6, max: 8 })
      .withMessage("SAP ID should have minimum 6, max 8 characters"),
    check("firstName")
      .exists({ checkFalsy: true })
      .withMessage("First Name is mandatory")
      .bail()
      .isAlpha()
      .withMessage("First Name should have only alphabets")
      .bail(),
    check("lastName")
      .optional({ checkFalsy: true }) //ignore validation when null or empty
      .isAlpha()
      .withMessage("Last Name should have only alphabets")
      .bail(),
  ];
};

const initiateChatValidator = () => {
  return [
    check("userIds")
      .isArray({ min: 1 })
      .withMessage("User Ids must be an non-empty array"),
  ];
};

// modify for other validations if any
const sendMessageValidator = () => {
  return [
    check("message")
      .exists({ checkFalsy: true })
      .withMessage("Blank message should not be sent!")
      .bail(),
  ];
};

module.exports = {
  resultsOfValidation,
  createUserValidator,
  initiateChatValidator,
  sendMessageValidator,
  createSapUserValidator,
};
