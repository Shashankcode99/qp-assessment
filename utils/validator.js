const validator = require("validator");
module.exports = async function payloadValidator(payload, check) {
  const { userName, email, password, isAdmin, itemName, publishedYear, price, expiryDate } = payload;
  const errorMessage = {
    errors: [],
  };

  //Username Validator
  if (check?.register && !userName ) {
    errorMessage.errors.push({
      field: "userName",
      error: "Name Missing",
    });
  } else if (check?.register && typeof userName !== "string") {
    errorMessage.errors.push({
      field: "name",
      error: "User name should be a valid string",
    });
  }

  // Email Address Validator
  if ((check?.register || check?.login) && !email) {
    errorMessage.errors.push({
      field: "email",
      error: "Missing email address",
    });
  } else if ((check?.register || check?.login) && !validator.isEmail(email)) {
    errorMessage.errors.push({
      field: "email",
      error: "Valid Email Address Required",
    });
  }

  // Password Address Validator
  if ((check?.register || check?.login) && !password) {
    errorMessage.errors.push({
      field: "password",
      error: "Missing Password",
    });
  } else if (
    (check?.register || check?.login) &&
    (!validator.isAlphanumeric(password) ||
    password?.length < 8 ||
    password?.length > 30)
  ) {
    errorMessage.errors.push({
      field: "password",
      error: "Inappropriate Password Length",
    });
  }

  if (check?.register && isAdmin?.length === 0) {
    errorMessage.errors.push({
      field: "isAdmin",
      error: "isAdmin value is required",
    });
  } else if (
    check?.register &&
    payload.hasOwnProperty("isAdmin") &&
    typeof payload.isAdmin != "boolean"
  ) {
    errorMessage.errors.push({
      field: "isAdmin",
      error: "Must be true or false",
    });
  }

  //Item Validator
  if (check?.item && !itemName) {
    errorMessage.errors.push({
      field: "itemName",
      error: "Item Name Missing",
    });
  } else if (check?.item && typeof itemName !== "string") {
    errorMessage.errors.push({
      field: "itemName",
      error: "Item name should be a valid string",
    });
  }


  //Publisher Validator
  if (check?.books && !publishedYear) {
    errorMessage.errors.push({
      field: "publishedYear",
      error: "Published year is missing!",
    });
  } else if (check?.books && typeof publishedYear !== "string") {
    errorMessage.errors.push({
      field: "publishedYear",
      error: "Published Year should be a valid string",
    });
  }

  //Price Validator
  if (check?.item && !price) {
    errorMessage.errors.push({
      field: "price",
      error: "Price is missing!",
    });
  } else if (check?.item && typeof price !== "string") {
    errorMessage.errors.push({
      field: "price",
      error: "Price should be a valid string",
    });
  }


  //Date Validator
  if (check?.item && expiryDate && !validator.isDate(expiryDate)) {
    errorMessage.errors.push({
      field: "expiryDate",
      error: "Invalid expiry date",
    });
  }

  return errorMessage;
};
