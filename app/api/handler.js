import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { slug } = req.query;
  const directory = path.join(process.cwd(), "app", "(static)", "blog", "lightbox-images", slug);

  try {
    const files = fs.readdirSync(directory);
    const imagePaths = files
      .filter((file) => /\.(png|jpe?g|svg)$/i.test(file))
      .map((file) => `/blog/lightbox-images/${slug}/${file}`);

    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Unable to read image directory" });
  }
}
