const validator = require("validator");
module.exports = async function payloadValidator(payload, check) {
  const { userName, email, password, isAdmin, title, author, summary, publishedYear, price } = payload;
  const errorMessage = {
    errors: [],
  };

  //Name Validator
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

  //Title Validator
  if (check?.books && !title) {
    errorMessage.errors.push({
      field: "title",
      error: "Title Missing",
    });
  } else if (check?.books && typeof title !== "string") {
    errorMessage.errors.push({
      field: "title",
      error: "Title name should be a valid string",
    });
  }

  // Author Validator
  if (check?.books && !author) {
    errorMessage.errors.push({
      field: "author",
      error: "Author is missing!",
    });
  } else if (check?.books && typeof author !== "string") {
    errorMessage.errors.push({
      field: "author",
      error: "Author name should be a valid string",
    });
  }

  //Summary Validator
  if (check?.books && !summary) {
    errorMessage.errors.push({
      field: "summary",
      error: "Summary is missing!",
    });
  } else if (check?.books && typeof summary !== "string") {
    errorMessage.errors.push({
      field: "summary",
      error: "Summary should be a valid string",
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
  if (check?.books && !price) {
    errorMessage.errors.push({
      field: "price",
      error: "Price is missing!",
    });
  } else if (check?.books && typeof price !== "string") {
    errorMessage.errors.push({
      field: "price",
      error: "Price should be a valid string",
    });
  }

  return errorMessage;
};
