import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import openapiSpec from "./openapi.json" with { type: "json" };

const app = express();

app.use(express.json());

// Documentation interactive (Scalar UI) + spec brute
app.get("/openapi.json", (req, res) => res.json(openapiSpec));
app.use("/docs", apiReference({ spec: { url: "/openapi.json" } }));

// TODO (Jour 1) : monter les routes CRUD réelles ici
// const platsRoutes = require("./routes/plats.routes");
// app.use("/api/plats", platsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Documentation : http://localhost:${PORT}/docs`);
});

