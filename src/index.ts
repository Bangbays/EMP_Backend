import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config";
import authRouter from "./routes/auth.route";

const port = PORT || 8080;
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server dimulai di port ${port}`);
});

export default app;
