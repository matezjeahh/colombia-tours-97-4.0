"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert-dialog";
import RichTextEditor from "./RichTextEditor";
import ImageUploaderAndLightboxManager from "./ImageUploaderAndLightboxManager";
import { batchUploadToGithub } from "./batchUploadToGithub";

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [editorContent, setEditorContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([
    { id: Date.now(), file: null, description: "" },
  ]);

  const createSlug = (text) => {
    return text
      .toLowerCase()
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

  const serializeToMDX = (nodes) => {
    return nodes
      .map((n) => {
        if (n.text) {
          let string = replaceCharacters(n.text);
          if (n.bold) {
            string = `**${string}**`;
          }
          if (n.italic) {
            string = `*${string}*`;
          }
          if (n.underline) {
            string = `<u>${string}</u>`;
          }
          if (n.code) {
            string = `\`${string}\``;
          }
          return string;
        }

        const children = n.children.map((child) => serializeToMDX([child])).join("");

        switch (n.type) {
          case "heading-one":
            return `# ${children}\n\n`;
          case "heading-two":
            return `## ${children}\n\n`;
          case "heading-three":
            return `### ${children}\n\n`;
          case "block-quote":
            return `> ${children}\n\n`;
          case "numbered-list":
            return children;
          case "bulleted-list":
            return children;
          case "list-item":
            return `- ${replaceCharacters(children)}\n`;
          case "code":
            return `\`\`\`\n${children}\n\`\`\`\n\n`;
          default:
            return `${children}\n\n`;
        }
      })
      .join("");
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

    const path = folder ? `${folder}/${filename}` : `public/images/${filename}`;

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
          path: `app/(static)/blog/lightbox-images/${slug}/${index}.jpg`,
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
      files.map((f) => f.path).filter((p) => p.includes("lightbox-images"))
    )}
imageDescriptionsUrl: /app/(static)/blog/image-descriptions/${slug}.json
---

${serializeToMDX(editorContent)}
`;

    try {
      const commitSha = await batchUploadToGithub(
        files,
        mdxContent,
        imageDescriptions,
        slug,
        GITHUB_REPO,
        GITHUB_TOKEN
      );
      console.log("Batch upload successful. Commit SHA:", commitSha);
      toast.success("Blog post created and uploaded successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setMainImage(null);
      setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
      setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
    } catch (error) {
      console.error("Error in batch upload:", error);
      toast.error(`Failed to create and upload blog post: ${error.message}`);
    }
  };

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX();
      // Reset all inputs and editor content after successful upload
      setTitle("");
      setDescription("");
      setMainImage(null);
      setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
      // Reset lightbox images
      setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
      toast.success("MDX file created and uploaded successfully");
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter blog post title"
        className="mb-4"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter blog post description"
        className="mb-4"
      />

      <ImageUploaderAndLightboxManager
        mainImage={mainImage}
        onMainImageChange={setMainImage}
        lightboxImages={lightboxImages}
        onLightboxImagesChange={setLightboxImages}
      />

      <RichTextEditor value={editorContent} onChange={setEditorContent} />

      <CustomAlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleMDXCreationAndUpload}
        triggerButton={
          <Button onClick={() => setIsAlertOpen(true)} className="w-full">
            Save and Upload
          </Button>
        }
      />
    </div>
  );
};

export default RichTextMDXEditorUploader;
