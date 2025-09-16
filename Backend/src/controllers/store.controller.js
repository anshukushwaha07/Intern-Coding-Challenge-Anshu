import { db } from "../config/db.js";

// Get all stores with avg rating
export const getStores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating),0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
};

// Submit or update rating
export const submitRating = async (req, res) => {
  const userId = req.user.id; // from JWT
  const storeId = req.params.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: "Invalid rating" });

  try {
    // Check if already rated
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE user_id=? AND store_id=?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      // Update rating
      await db.query("UPDATE ratings SET rating=? WHERE id=?", [
        rating,
        existing[0].id,
      ]);
    } else {
      // Insert rating
      await db.query(
        "INSERT INTO ratings (user_id,store_id,rating) VALUES (?,?,?)",
        [userId, storeId, rating]
      );
    }

    res.json({ message: "Rating saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving rating" });
  }
};
