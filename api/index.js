
import express from "express";
import cors from 'cors';
import userRoutes from "./router/UserRoute.js"
import noteRoutes from "./router/NoteRoute.js"

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
}));


app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/user", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`)
});




