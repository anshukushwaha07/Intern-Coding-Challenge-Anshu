import { db } from "../config/db.js";

export const addUser = async (req, res) => {
  const { name, email, address, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)",
      [name, email, address, hash, role]
    );
    res.status(201).json({ message: "User added", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
};



// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [[usersCount]] = await db.query("SELECT COUNT(*) as total_users FROM users");
    const [[storesCount]] = await db.query("SELECT COUNT(*) as total_stores FROM stores");
    const [[ratingsCount]] = await db.query("SELECT COUNT(*) as total_ratings FROM ratings");

    res.json({
      total_users: usersCount.total_users,
      total_stores: storesCount.total_stores,
      total_ratings: ratingsCount.total_ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};


// delete a user
export const deleteUser = async (req, res) => {
    try {
      await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
      res.json({ message: "User deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting user" });
    }
  };
  
  // update a user (address or role)
  export const updateUser = async (req, res) => {
    const { address, role } = req.body;
    try {
      await db.query(
        "UPDATE users SET address=?, role=? WHERE id=?",
        [address, role, req.params.id]
      );
      res.json({ message: "User updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating user" });
    }
  };
  
  // delete a store
  export const deleteStore = async (req, res) => {
    try {
      await db.query("DELETE FROM stores WHERE id=?", [req.params.id]);
      res.json({ message: "Store deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting store" });
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

