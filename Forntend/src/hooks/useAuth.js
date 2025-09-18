import { useContext } from "react";
import { AuthContext } from "../context/auth.js";

export const useAuth = () => useContext(AuthContext);