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

export const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)",
      [name, email, address, owner_id || null]
    );
    res.status(201).json({ message: "Store added", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding store" });
  }
};


export const updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, owner_id } = req.body;
  try {
    await db.query(
      "UPDATE stores SET name=?, email=?, address=?, owner_id=? WHERE id=?",
      [name, email, address, owner_id || null, id]
    );
    res.json({ message: "Store updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating store" });
  }
};

export const rateStore = async (req, res) => {
  const { id } = req.params; // store id
  const { rating, comment } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating, comment)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment)`,
      [userId, id, rating, comment || null]
    );
    res.json({ message: "Rating submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving rating" });
  }
};

export const getStoreWithRating = async (req, res) => {
  const { id } = req.params;

  try {
    const [[store]] = await db.query("SELECT * FROM stores WHERE id=?", [id]);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const [[avg]] = await db.query(
      "SELECT AVG(rating) as average_rating, COUNT(*) as rating_count FROM ratings WHERE store_id=?",
      [id]
    );

    const [ratings] = await db.query(
      "SELECT r.rating, r.comment, u.name as user_name FROM ratings r JOIN users u ON r.user_id=u.id WHERE r.store_id=?",
      [id]
    );

    res.json({
      ...store,
      average_rating: avg.average_rating || 0,
      rating_count: avg.rating_count || 0,
      ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching store" });
  }
};
