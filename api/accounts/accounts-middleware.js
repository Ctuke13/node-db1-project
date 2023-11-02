const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    return next({ status: 400, message: "name and budget are required" });
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    return next({
      status: 400,
      message: "name of account must be between 3 and 100",
    });
  } else if (typeof budget !== "number") {
    return next({
      status: 400,
      message: "budget of account must be a number",
    });
  } else if (budget < 1 || budget > 1000000) {
    next({
      status: 400,
      message: "budget of account is too large or too small",
    });
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const { name } = req.body;
    const dbAccountName = await db("accounts").where("name", name).first();

    if (dbAccountName) {
      next({ status: 400, message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = async (req, res, next) => {
  const account = await db("accounts").where("id", req.params.id).first();

  if (!account) {
    next({ status: 404, message: "account not found" });
  } else {
    req.account = account;
    next();
  }
};
