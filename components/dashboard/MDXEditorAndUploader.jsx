"use client";
import React, { useState, useMemo } from "react";
import { createEditor } from "slate";
import { Slate, withReact } from "slate-react";
import { toast } from "sonner";
import EditorToolbar from "./EditorToolbar";
import EditorContent from "./EditorContent";
import MainImageUpload from "./MainImageUpload";
import LightboxImageUpload from "./LightboxImageUpload";
import TitleDescriptionInput from "./TitleDescriptionInput";
import SaveButton from "./SaveButton";
import { uploadImage, uploadJSONFile, createAndUploadMDX } from "./uploadUtils";
import { serializeToMDX, createSlug, replaceCharacters } from "./editorUtils";

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [editorContent, setEditorContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([
    { id: Date.now(), file: null, description: "" },
  ]);

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX(title, description, image, editor, lightboxImages);
      resetForm();
      toast.success("MDX file created and uploaded successfully");
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
    setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
    // Reset file inputs
    document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
  };

  return (
    <div className="container mx-auto p-4">
      <TitleDescriptionInput
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      <MainImageUpload setImage={setImage} />
      <LightboxImageUpload lightboxImages={lightboxImages} setLightboxImages={setLightboxImages} />
      <Slate
        editor={editor}
        value={editorContent}
        onChange={setEditorContent}
        initialValue={[{ type: "paragraph", children: [{ text: "" }] }]}
      >
        <EditorToolbar />
        <EditorContent />
      </Slate>
      <SaveButton
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        onConfirm={handleMDXCreationAndUpload}
      />
    </div>
  );
};

export default RichTextMDXEditorUploader;
