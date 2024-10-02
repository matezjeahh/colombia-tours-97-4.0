import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

const ImageUploadComponent = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Character replacement function
  const replaceCharacters = (text) => {
    const replacements = {
      û: "ű",
      ô: "ő",
      ò: "ó",
      // Add more replacements as needed
    };
    return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && description) {
      try {
        // Replace characters in the description before uploading
        const replacedDescription = replaceCharacters(description);
        await onUpload(file, replacedDescription);
        // Clear the input fields after successful upload
        setFile(null);
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error during upload:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="file" onChange={handleFileChange} accept="image/*" ref={fileInputRef} />
          <Input
            type="text"
            placeholder="Enter image description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <Button type="submit" disabled={!file || !description}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageUploadComponent;
