import express from "express";
import cors from "cors";
import postsRoutes from "./routes/posts.routes.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use(postsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
