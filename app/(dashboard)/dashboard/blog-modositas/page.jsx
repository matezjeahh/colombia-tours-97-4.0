"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomAlertDialog from "@/components/custom-alert-dialog";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import { batchUploadToGithub } from "@/components/dashboard/batchUploadToGithub";
import LightboxImageManager from "@/components/dashboard/LightboxBlog";

const ArticleEditor = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  const [lightboxImages, setLightboxImages] = useState([]);
  const [existingLightboxImages, setExistingLightboxImages] = useState([]);
  const [editorContent, setEditorContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
    }
  };

  const loadArticle = async (slug) => {
    try {
      const response = await fetch(`/api/articles/${slug}`);
      const article = await response.json();
      setSelectedArticle(article);
      setTitle(article.title);
      setDescription(article.description);
      setMainImage(article.image || "");
      setOriginalDate(article.date || "");
      setEditorContent(article.content);
      setExistingLightboxImages(
        article.lightboxImages?.map((path, index) => ({
          path,
          description: article.imageDescriptions[index] || "",
        })) || []
      );
      setLightboxImages([]);
    } catch (error) {
      console.error("Error loading article:", error);
      toast.error("Failed to load article");
    }
  };

  const handleArticleSelection = (slug) => {
    loadArticle(slug);
  };

  const clearInputs = () => {
    setSelectedArticle(null);
    setTitle("");
    setDescription("");
    setMainImage("");
    setOriginalDate("");
    setLightboxImages([]);
    setExistingLightboxImages([]);
    setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
  };

  const handleUpdateArticle = async () => {
    try {
      const slug = selectedArticle.slug;

      // Prepare new lightbox images
      const newLightboxImageFiles = lightboxImages.map((img, index) => ({
        file: img.file,
        path: `public/blog/${slug}/lightbox-images/${
          existingLightboxImages.length + index
        }${img.file.name.substring(img.file.name.lastIndexOf("."))}`,
        description: img.description,
      }));

      // Combine existing and new lightbox images for MDX frontmatter
      const allLightboxImages = [
        ...existingLightboxImages.map((img) => img.path),
        ...newLightboxImageFiles.map((img) => "/" + img.path.replace("public/", "")),
      ];

      const allImageDescriptions = [
        ...existingLightboxImages.map((img) => img.description),
        ...newLightboxImageFiles.map((img) => img.description),
      ];

      // Prepare MDX content
      const mdxContent = `---
title: "${title}"
date: "${originalDate}"
description: "${description}"
image: ${mainImage}
lightboxImages: ${JSON.stringify(allLightboxImages).replace(/"/g, "")}
imageDescriptions: ${JSON.stringify(allImageDescriptions)}
---

${editorContent}`;

      // Upload files and MDX content
      await batchUploadToGithub(
        newLightboxImageFiles,
        mdxContent,
        slug,
        process.env.NEXT_PUBLIC_GITHUB_REPO,
        process.env.NEXT_PUBLIC_GITHUB_TOKEN
      );

      toast.success("Article updated successfully");
      clearInputs();
      fetchArticles(); // Refresh the article list
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error(`Failed to update article: ${error.message}`);
    }
  };

  const handleExistingImageDescriptionChange = (index, newDescription) => {
    const updatedExistingImages = existingLightboxImages.map((img, i) =>
      i === index ? { ...img, description: newDescription } : img
    );
    setExistingLightboxImages(updatedExistingImages);
  };

  return (
    <div className="container mx-auto p-4">
      <Select onValueChange={handleArticleSelection}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select an article to edit" />
        </SelectTrigger>
        <SelectContent>
          {articles.map((article) => (
            <SelectItem key={article.slug} value={article.slug}>
              {article.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      {/* Display existing lightbox images with editable descriptions */}
      {existingLightboxImages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Existing Lightbox Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {existingLightboxImages.map((img, index) => (
              <div key={index} className="border p-2">
                <img src={img.path} alt={`Lightbox image ${index + 1}`} className="w-full h-auto" />
                <Textarea
                  value={img.description}
                  onChange={(e) => handleExistingImageDescriptionChange(index, e.target.value)}
                  placeholder="Image description"
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <LightboxImageManager
        lightboxImages={lightboxImages}
        onLightboxImagesChange={setLightboxImages}
      />

      <RichTextEditor value={editorContent} onChange={setEditorContent} />

      <CustomAlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleUpdateArticle}
        triggerButton={
          <Button
            onClick={() => setIsAlertOpen(true)}
            className="w-full mt-4"
            disabled={!selectedArticle}
          >
            Update Article
          </Button>
        }
      />
    </div>
  );
};

export default ArticleEditor;
