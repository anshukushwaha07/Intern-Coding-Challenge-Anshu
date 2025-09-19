import { db } from "./config/db.js";

const testDb = async () => {
  try {
    const [rows] = await db.query("SELECT NOW() as now");
    console.log("DB connected. Current time:", rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

testDb();
