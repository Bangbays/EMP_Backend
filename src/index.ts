import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config";
import authRouter from "./routes/auth.route";
import referralRouter from "./routes/referral.routes";
import voucherRouter from "./routes/voucher.route";
import profileRouter from "./routes/profile.routes";
import organizerRouter from "./routes/organizer.route";

const port = PORT || 8080;
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/referral", referralRouter);
app.use("/api", voucherRouter);
app.use("/profile", profileRouter);
app.use("/api/organizer", organizerRouter);

app.listen(port, () => {
  console.log(`Server dimulai di port ${port}`);
});

export default app;
