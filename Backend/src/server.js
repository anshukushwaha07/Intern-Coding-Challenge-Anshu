import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import ownerRoutes from "./routes/owner.routes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);


const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
