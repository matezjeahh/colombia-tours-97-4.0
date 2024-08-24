import fs from "fs";
import path from "path";

export function getFirstImageFromFolder(folderIndex) {
  const folderPath = path.join(process.cwd(), "public", folderIndex.toString());

  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

    return imageFiles.length > 0 ? imageFiles[0] : null;
  } catch (error) {
    console.error(`Error reading folder ${folderIndex}:`, error);
    return null;
  }
}
