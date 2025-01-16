import { growdevers } from "./data.js";

export const validateGrowdeverMiddleware = (req, res, next) => {
  try {
    const { name, email, age, registered = false } = req.body;

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "O campo nome não foi preenchido",
      });
    }

    if (!email) {
      return res.status(400).json({
        ok: false,
        message: "O campo email não foi preenchido",
      });
    }

    if (!age) {
      return res.status(400).json({
        ok: false,
        message: "O campo idade não foi preenchido",
      });
    }

    if (Number(age) < 18) {
      return res.status(400).json({
        ok: false,
        message: "O growdever deve ser maior de idade (+18) ",
      });
    }

    if (typeof registered !== "boolean") {
      return res.status(400).json({
        ok: false,
        message: "O campo registered deve ser true ou false",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const verifyGrowdeverRegisteredMiddleware = (req, res, next) => {
  try {
    const { id } = req.params;
    const growdever = growdevers.find((growdever) => growdever.id === id);

    if (!growdever) {
      return next();
    }

    if (!growdever.registered) {
      return res.status(400).json({
        ok: false,
        message: "O growdever precisa estar matriculado",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
