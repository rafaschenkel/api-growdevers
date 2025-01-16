import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { growdevers } from "./data.js";
import * as dotenv from "dotenv";
import {
  validateGrowdeverMiddleware,
  verifyGrowdeverRegisteredMiddleware,
} from "./middlewares.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

// Routes

// GET /growdevers
app.get("/growdevers", (req, res) => {
  try {
    const { name, email, email_includes, age, registered } = req.query;

    if (
      Object.keys(req.query).length !== 0 &&
      !Object.keys(req.query).includes("name") &&
      !Object.keys(req.query).includes("email") &&
      !Object.keys(req.query).includes("email_includes") &&
      !Object.keys(req.query).includes("age") &&
      !Object.keys(req.query).includes("registered")
    ) {
      return res.status(400).json({
        ok: false,
        message: "Parâmetros inválidos",
      });
    }

    let data = growdevers;

    if (name) {
      data = growdevers.filter((growdever) => growdever.name.includes(name));
    }

    if (email) {
      data = growdevers.filter((growdever) => growdever.email === email);
    }

    if (email_includes) {
      data = growdevers.filter((growdever) =>
        growdever.email.includes(email_includes)
      );
    }

    if (age) {
      data = growdevers.filter((growdever) => growdever.age >= Number(age));
    }

    if (registered) {
      data = growdevers.filter(
        (growdever) => String(growdever.registered) === registered
      );
    }

    return res.status(200).json({
      ok: true,
      message: "Lista de Growdevers obtida com sucesso",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Não foi possível obter a lista de Growdevers",
      error: error.message,
    });
  }
});

// GET /growdevers/:id
app.get("/growdevers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const growdever = growdevers.find((growdever) => growdever.id === id);

    if (!growdever) {
      return res.status(404).json({
        ok: false,
        message: "Growdever não encontrado",
      });
    }
    return res.status(200).json({
      ok: true,
      message: "Growdever obtido com sucesso",
      data: growdever,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Não foi possível obter o Growdever",
      error: error.message,
    });
  }
});

// POST /growdevers
app.post("/growdevers", [validateGrowdeverMiddleware], (req, res) => {
  try {
    const { name, email, age, registered } = req.body;

    const newGrowdever = {
      id: randomUUID(),
      name,
      email,
      age,
      registered,
    };

    growdevers.push(newGrowdever);

    return res.status(201).json({
      ok: true,
      message: "Growdever criado com sucesso",
      data: newGrowdever,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Não foi possível criar o Growdever",
      error: error.message,
    });
  }
});

// PUT /growdevers/:id
app.put(
  "/growdevers/:id",
  [verifyGrowdeverRegisteredMiddleware, validateGrowdeverMiddleware],
  (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, age, registered } = req.body;

      const growdever = growdevers.find((growdever) => growdever.id === id);

      if (!growdever) {
        return res.status(404).json({
          ok: false,
          message: "Growdever não encontrado",
        });
      }

      growdever.name = name;
      growdever.email = email;
      growdever.age = age;
      growdever.registered = registered;

      return res.status(200).json({
        ok: true,
        message: "Growdever atualizado com sucesso",
        data: growdever,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Não foi possível atualizar o Growdever",
        error: error.message,
      });
    }
  }
);

// PATCH /growdevers/:id - Toggle registered
app.patch("/growdevers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const growdever = growdevers.find((growdever) => growdever.id === id);

    if (!growdever) {
      return res.status(404).json({
        ok: false,
        message: "Growdever não encontrado",
      });
    }

    growdever.registered = !growdever.registered;

    return res.status(200).json({
      ok: true,
      message: "Growdever atualizado com sucesso",
      data: growdever,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Não foi possível atualizar o Growdever",
      error: error.message,
    });
  }
});

// DELETE /growdevers/:id
app.delete("/growdevers/:id", (req, res) => {
  try {
    const { id } = req.params;

    const growdeverIndex = growdevers.findIndex(
      (growdever) => growdever.id === id
    );

    if (growdeverIndex === -1) {
      return res.status(404).json({
        ok: false,
        message: "Growdever não encontrado",
      });
    }
    growdevers.splice(growdeverIndex, 1);

    return res.status(200).json({
      ok: true,
      message: "Growdever excluído com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Não foi possível excluir o Growdever",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
