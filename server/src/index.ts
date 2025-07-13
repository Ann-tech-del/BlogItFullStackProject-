import express, { Express } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";
import cloudinary from "./utils/cloudinary";
import path from 'path';

const app: Express = express();


app.use(cors({
  origin: "http://localhost:5173",
   credentials:true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get("/", (req, res) => {
  res.send("<h1>welcome to BlogIt Api</h1>");
});



app.get('/api/images', async (_req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:dev_setups')
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const publicIds: string[] = result.resources.map((file: { public_id: string }) => file.public_id);
    res.status(200).json(publicIds);
  } catch (error) {
    console.error('Cloudinary search error:', error);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

app.use("/api/auth", authRouter)
app.use("/api",blogRouter)

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`app is live on port ${port}`);
});
