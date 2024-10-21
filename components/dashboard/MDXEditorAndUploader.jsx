"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert-dialog";
import ImageUploaderAndLightboxManager from "./ImageUploaderAndLightboxManager";
import { batchUploadToGithub } from "./batchUploadToGithub";
import MDXEditorComponent from "./LexicalEditor";

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([
    { id: Date.now(), file: null, description: "" },
  ]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // Load the selected article if needed
    // This is just a placeholder, you'll need to implement the actual loading logic
    if (selectedArticle) {
      setTitle(selectedArticle.title || "");
      setDescription(selectedArticle.description || "");
      setEditorContent(selectedArticle.content || "");
      // Load main image and lightbox images if needed
    }
  }, [selectedArticle]);

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/û/g, "u")
      .replace(/ô/g, "o")
      .replace(/ò/g, "o")
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ö/g, "o")
      .replace(/ő/g, "o")
      .replace(/ú/g, "u")
      .replace(/ü/g, "u")
      .replace(/ű/g, "u")
      .replace(/ñ/g, "n")
      .replace(/ç/g, "c")
      .replace(/ß/g, "ss")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const replaceCharacters = (text) => {
    const replacements = {
      û: "ű",
      ô: "ő",
      ò: "ó",
    };
    return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
  };

  const uploadImage = async (file, folder = "", retryCount = 0) => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    const datePrefix = new Date().toISOString().split("T")[0];
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${datePrefix}-${createSlug(
      originalFilename.replace(`.${fileExtension}`, "")
    )}-${uniqueSuffix}.${fileExtension}`;

    const content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    const path = folder
      ? `public/blog/${slug}/lightbox-images/${filename}`
      : `public/images/${filename}`;

    try {
      const response = await fetch(`${GITHUB_API_URL}${path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: content,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GitHub API Error (${response.status}):`, errorBody);

        if (response.status === 409 && retryCount < 3) {
          console.log(`Conflict detected, retrying upload (attempt ${retryCount + 1})...`);
          return uploadImage(file, folder, retryCount + 1);
        }

        throw new Error(`Failed to upload image to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`Image uploaded successfully:`, result);
      return path.replace("public/", "/");
    } catch (error) {
      console.error(`Error in uploadImage (${filename}):`, error);
      throw error;
    }
  };

  const createAndUploadMDX = async () => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    const slug = createSlug(title);
    const now = new Date();

    // Prepare files for upload
    const files = [];
    if (mainImage) {
      files.push({ file: mainImage, path: `public/images/${slug}-main.jpg` });
    }
    lightboxImages.forEach((img, index) => {
      if (img.file) {
        files.push({
          file: img.file,
          path: `public/blog/${slug}/lightbox-images/${index}.jpg`,
        });
      }
    });

    // Prepare image descriptions
    const imageDescriptions = lightboxImages
      .filter((img) => img.file)
      .map((img) => img.description);

    // Prepare MDX content
    const mdxContent = `---
title: "${replaceCharacters(title)}"
date: "${now.toISOString()}"
description: "${replaceCharacters(description)}"
image: /images/${slug}-main.jpg
lightboxImages: ${JSON.stringify(
      files
        .map((f) => f.path)
        .filter((p) => p.includes("lightbox-images"))
        .map((path) => path.replace(/^public/, ""))
    )}
imageDescriptions: ${JSON.stringify(imageDescriptions)}
---

${editorContent}
`;

    try {
      const commitSha = await batchUploadToGithub(
        files,
        mdxContent,
        slug,
        GITHUB_REPO,
        GITHUB_TOKEN
      );
      console.log("Batch upload successful. Commit SHA:", commitSha);
      toast.success("Blogbejegyzés sikeresen létrehozva és feltöltve");

      // Reset form
      setTitle("");
      setDescription("");
      setMainImage(null);
      setEditorContent("");
      setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
    } catch (error) {
      console.error("Error in batch upload:", error);
      toast.error(`Nem sikerült létrehozni és feltölteni a blogbejegyzést: ${error.message}`);
    }
  };

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX();
      // Reset all inputs and editor content after successful upload
      setTitle("");
      setDescription("");
      setMainImage(null);
      setEditorContent("");
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
      // Reset lightbox images
      setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
      toast.success("MDX fájl sikeresen létrehozva és feltöltve");
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
      toast.error(`Nem sikerült létrehozni és feltölteni az MDX fájlt: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto my-8 ">
      <h1 className="mb-8">Új blog létrehozása</h1>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Blog címe</h3>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add meg a blogbejegyzés címét"
            className="mb-4"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Blog leírása</h3>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add meg a blogbejegyzés leírását"
            className="mb-4"
          />
        </div>

        <ImageUploaderAndLightboxManager
          mainImage={mainImage}
          onMainImageChange={setMainImage}
          lightboxImages={lightboxImages}
          onLightboxImagesChange={setLightboxImages}
        />

        <MDXEditorComponent
          selectedArticle={{ content: editorContent }}
          onChange={setEditorContent}
        />

        <CustomAlertDialog
          isOpen={isAlertOpen}
          onOpenChange={setIsAlertOpen}
          onConfirm={handleMDXCreationAndUpload}
          triggerButton={
            <Button onClick={() => setIsAlertOpen(true)} className="w-full">
              Mentés és Feltöltés
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default RichTextMDXEditorUploader;
