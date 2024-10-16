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
  const [lightboxImages, setLightboxImages] = useState([]);
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
      setEditorContent(article.content);
      setLightboxImages(
        article.lightboxImages?.map((img, index) => ({
          id: Date.now() + index,
          file: null,
          description: img.description || "",
          existingPath: img.path,
        })) || []
      );
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
    setLightboxImages([]);
    setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
  };

  const handleUpdateArticle = async () => {
    try {
      const slug = selectedArticle.slug;

      // Prepare lightbox images
      const lightboxImageFiles = lightboxImages.map((img, index) => ({
        file: img.file,
        path: img.existingPath
          ? `public${img.existingPath}`
          : `public/blog/${slug}/lightbox-images/${index}${img.file.name.substring(
              img.file.name.lastIndexOf(".")
            )}`,
        isExisting: !!img.existingPath,
        description: img.description,
      }));

      // Prepare MDX content
      const mdxContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
description: "${description}"
lightboxImages: ${JSON.stringify(
        lightboxImageFiles.map((img) => "/" + img.path.replace("public/", ""))
      ).replace(/"/g, "")}
imageDescriptions: ${JSON.stringify(lightboxImageFiles.map((img) => img.description))}
---

${editorContent}`;

      // Upload files and MDX content
      await batchUploadToGithub(
        lightboxImageFiles.filter((img) => !img.isExisting),
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
