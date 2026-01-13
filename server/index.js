import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// conexión
const pool = new Pool({
  user: "postgres",
  password: "21323113",
  host: "localhost",
  port: 5432,
  database: "LIKEME",
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error en GET /posts:", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;

    if (!titulo || !url || !descripcion) {
      return res
        .status(400)
        .json({ error: "Faltan campos requeridos (titulo, url, descripcion)" });
    }

    const query =
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [titulo, url, descripcion, 0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en POST /posts:", error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en PUT /posts/like/:id:", error);
    res.status(500).json({ error: "Error al dar like al post" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM posts WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en DELETE /posts/:id:", error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
