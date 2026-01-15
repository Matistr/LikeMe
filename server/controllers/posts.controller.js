import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "21323113",
  host: "localhost",
  port: 5432,
  database: "LIKEME",
});

export const getPosts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error en GET /posts:", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};

export const createPost = async (req, res) => {
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
};

export const likePost = async (req, res) => {
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
};

export const deletePost = async (req, res) => {
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
};
