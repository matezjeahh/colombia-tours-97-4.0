"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert-dialog";
import MDXEditorComponent from "./LexicalEditor";

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [facebookLink, setFacebookLink] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title || "");
      setDescription(selectedArticle.description || "");
      setEditorContent(selectedArticle.content || "");
      setFacebookLink(selectedArticle.facebookLink || "");
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

  const createAndUploadMDX = async () => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    const slug = createSlug(title);
    const now = new Date();

    const files = [];
    if (mainImage) {
      files.push({ file: mainImage, path: `public/images/${slug}-main.jpg` });
    }

    const mdxContent = `---
title: "${replaceCharacters(title)}"
date: "${now.toISOString()}"
description: "${replaceCharacters(description)}"
image: /images/${slug}-main.jpg
facebook: "${facebookLink}"
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

      setTitle("");
      setDescription("");
      setMainImage(null);
      setFacebookLink("");
      setEditorContent("");
    } catch (error) {
      console.error("Error in batch upload:", error);
      toast.error(`Nem sikerült létrehozni és feltölteni a blogbejegyzést: ${error.message}`);
    }
  };

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX();
      setTitle("");
      setDescription("");
      setMainImage(null);
      setFacebookLink("");
      setEditorContent("");
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
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

        <div>
          <h3 className="text-lg font-semibold mb-2">Facebook link</h3>
          <Input
            type="text"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            placeholder="Add meg a Facebook linket"
            className="mb-4"
          />
        </div>

        <Input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} />

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
