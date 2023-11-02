const express = require("express");
const Accounts = require("./accounts-model");
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require("./accounts-middleware");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkAccountId, async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id);
    res.json(account);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  checkAccountPayload,
  checkAccountNameUnique,

  async (req, res, next) => {
    const { name, budget } = req.body;
    try {
      const account = await Accounts.create({
        name: name.trim(),
        budget: budget,
      });
      res.status(201).json(account);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkAccountId,
  checkAccountPayload,
  async (req, res, next) => {
    const account = await Accounts.updateById(req.params.id, req.body);
    res.json(account);
    // try {
    //   res.json(account);
    // } catch (err) {
    //   next(err);
    // }
  }
);

router.delete("/:id", checkAccountId, async (req, res, next) => {
  try {
    const account = await Accounts.deleteById(req.params.id);

    res.json(account);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // DO YOUR MAGIC
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
