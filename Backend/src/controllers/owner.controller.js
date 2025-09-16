import { db } from "../config/db.js";

// list all ratings for stores owned by this owner
export const getMyStoreRatings = async (req, res) => {
  const ownerId = req.user.id; // must be role='owner'

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(
      `
      SELECT s.id AS store_id,
             s.name AS store_name,
             r.id AS rating_id,
             r.rating,
             u.name AS rated_by,
             u.email AS rated_by_email
      FROM stores s
      JOIN ratings r ON s.id = r.store_id
      JOIN users u ON u.id = r.user_id
      WHERE s.owner_id = ?
      LIMIT ? OFFSET ?
      `,
      [ownerId, limit, offset]
    );

    // get total count for pagination
    const [[countRow]] = await db.query(
      `SELECT COUNT(*) as total
       FROM stores s
       JOIN ratings r ON s.id=r.store_id
       WHERE s.owner_id=?`,
      [ownerId]
    );

    res.json({
      total: countRow.total,
      page,
      limit,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings" });
  }
};
