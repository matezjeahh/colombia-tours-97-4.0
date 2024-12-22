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
import { batchUploadToGithub } from "@/components/dashboard/batchUploadToGithub";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MDXEditorComponent = dynamic(() => import("@/components/dashboard/LexicalEditor"), {
  ssr: false,
});

const replaceCharacters = (text) => {
  const replacements = {
    û: "ű",
    ô: "ő",
    ò: "ó",
    Û: "Ű",
    Ô: "Ő",
    Ò: "Ó",
  };
  return text.replace(/[ûôòÛÔÒ]/g, (char) => replacements[char] || char);
};

const ArticleEditor = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [originalDate, setOriginalDate] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [mdxContent, setMdxContent] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();
      setArticles(
        data.map((article) => ({
          ...article,
          title: replaceCharacters(article.title),
        }))
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Nem sikerült betölteni a cikkeket");
    }
  };

  const loadArticle = async (slug) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles/${slug}`);
      const article = await response.json();
      setSelectedArticle(article);
      setSelectedSlug(slug);
      setTitle(replaceCharacters(article.title));
      setDescription(replaceCharacters(article.description));
      setMainImage(article.image || "");
      setOriginalDate(article.date || "");
      setFacebookLink(article.facebookLink || "");
      setMdxContent(replaceCharacters(article.content));
    } catch (error) {
      console.error("Error loading article:", error);
      toast.error("Nem sikerült betölteni a cikket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleSelection = (slug) => {
    loadArticle(slug);
  };

  const clearInputs = () => {
    setSelectedArticle(null);
    setSelectedSlug("");
    setTitle("");
    setDescription("");
    setMainImage(null);
    setOriginalDate("");
    setFacebookLink("");
    setMdxContent("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMainImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateArticle = async () => {
    setIsUpdating(true);
    try {
      const slug = selectedArticle.slug;

      // Prepare MDX content with frontmatter
      const updatedMdxContent = `---
title: "${replaceCharacters(title)}"
date: "${originalDate}"
description: "${replaceCharacters(description)}"
image: ${mainImage}
facebookLink: "${facebookLink}"
---

${replaceCharacters(mdxContent)}`;

      // Upload MDX content
      await batchUploadToGithub(
        [], // No lightbox images to upload
        updatedMdxContent,
        slug,
        process.env.NEXT_PUBLIC_GITHUB_REPO,
        process.env.NEXT_PUBLIC_GITHUB_TOKEN
      );

      toast.success("A cikk sikeresen frissítve");
      clearInputs();
      fetchArticles(); // Refresh the article list
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error(`Nem sikerült frissíteni a cikket: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="mb-8">Blogok szerkesztése</h1>
      <div className="space-y-4">
        <Select onValueChange={handleArticleSelection} value={selectedSlug}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Válassz egy cikket" />
          </SelectTrigger>
          <SelectContent>
            {articles.map((article) => (
              <SelectItem key={article.slug} value={article.slug}>
                {article.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          selectedArticle && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Blog címe</h3>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Blog címe"
                  className="mb-4"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Blog leírása</h3>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Blog leírásának szerkesztése"
                  className="mb-4"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Fő kép</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
                {mainImage && <img src={mainImage} alt="Fő kép" className="mb-4" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Facebook link</h3>
                <Input
                  type="text"
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.target.value)}
                  placeholder="Facebook link"
                  className="mb-4"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cikk szerkesztése</h3>
                <MDXEditorComponent
                  selectedArticle={selectedArticle}
                  onChange={(newContent) => setMdxContent(newContent)}
                />
              </div>

              <CustomAlertDialog
                isOpen={isAlertOpen}
                onOpenChange={setIsAlertOpen}
                onConfirm={handleUpdateArticle}
                triggerButton={
                  <Button
                    onClick={() => setIsAlertOpen(true)}
                    className="w-full mt-4"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Frissítés...
                      </>
                    ) : (
                      "Blog frissítése"
                    )}
                  </Button>
                }
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
