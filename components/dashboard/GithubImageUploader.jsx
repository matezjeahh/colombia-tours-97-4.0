import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TourImageUploader = ({ tourId }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ type: "error", message: "Please select a file to upload." });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tourId", tourId);

      // Make a POST request to your server-side API route
      const response = await fetch("/api/upload-tour-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({ type: "success", message: "Image uploaded successfully!" });
      } else {
        const errorData = await response.json();
        setUploadStatus({ type: "error", message: `Upload failed: ${errorData.message}` });
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: `Upload failed: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Tour Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-4">
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
        {uploadStatus && (
          <Alert variant={uploadStatus.type === "error" ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{uploadStatus.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default TourImageUploader;
