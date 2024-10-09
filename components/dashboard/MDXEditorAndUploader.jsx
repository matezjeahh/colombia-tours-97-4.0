"use client";
import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToMarkdown from "draftjs-to-markdown";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MDXEditorAndUploader = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const replaceCharacters = (text) => {
    const replacements = {
      û: "ű",
      ô: "ő",
      ò: "ó",
    };
    return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
  };

  const uploadImage = async (file) => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `${timestamp}_${file.name}`;
    const content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    const response = await fetch(`${GITHUB_API_URL}public/images/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload image for blog post: ${title}`,
        content: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image to GitHub: ${response.statusText}`);
    }

    const result = await response.json();
    return result.content.download_url;
  };

  const createAndUploadMDX = async () => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    // Upload image if present
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
    }

    // Convert Draft.js content to markdown
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    let markdown = draftToMarkdown(raw);

    // Apply character replacements
    markdown = replaceCharacters(markdown);

    // Generate a unique filename
    const now = new Date();
    const timestamp = now.toISOString().split("T")[0].replace(/-/g, "_");
    const filename = `${timestamp}_${title.toLowerCase().replace(/\s+/g, "_")}.mdx`;

    // Create front matter
    const frontMatter = `---
title: "${title}"
date: "${now.toISOString()}"
description: "${description}"
image: "${imageUrl}"
---

`;

    // Combine front matter and content
    const fullContent = frontMatter + markdown;

    // Prepare the file content
    const content = btoa(unescape(encodeURIComponent(fullContent)));

    try {
      // Upload the MDX file to GitHub
      const response = await fetch(`${GITHUB_API_URL}public/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create MDX file: ${title}`,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload MDX file to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`MDX file uploaded successfully: ${result.content.html_url}`);
      toast.success(`MDX file created and uploaded successfully`);
      return result.content.html_url;
    } catch (error) {
      console.error("Error uploading MDX file to GitHub:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
      throw error;
    }
  };

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX();
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="container">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter blog post title"
        className="title-input"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter blog post description"
        className="description-input"
      />
      <Input type="file" onChange={handleImageChange} accept="image/*" className="image-input" />
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <Button onClick={handleMDXCreationAndUpload} className="upload-button">
        Create and Upload MDX
      </Button>
    </div>
  );
};

export default MDXEditorAndUploader;
