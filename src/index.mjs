import express from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/", )

app.listen(PORT, () => {
    console.log(`Server is running on PORT `, PORT);
});