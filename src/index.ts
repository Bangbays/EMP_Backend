import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import organizerRoutes from "./routes/organizerRoutes";
import eventRoutes from "./routes/eventRouter";
import transactionRoutes from "./routes/transactionRoutes";
import { authenticate } from "./middlewares/authMiddleware";
import errorHandler from "./middlewares/errorHandler";
import { PORT } from "./config";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

// Protected
app.use("/organizer", authenticate, organizerRoutes);
app.use("/transaction", authenticate, transactionRoutes);

// Global error handler
app.use(errorHandler);

const port = PORT || 8090;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));