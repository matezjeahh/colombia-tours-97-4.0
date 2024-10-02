import { toast } from "sonner";

const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const uploadImageAndUpdateGitHub = async (file, description, tourId) => {
  console.log("uploadImageAndUpdateGitHub called with:", { file, description, tourId });

  if (!file) {
    throw new Error("Missing required parameter: file");
  }
  if (!description) {
    throw new Error("Missing required parameter: description");
  }
  if (!tourId) {
    throw new Error("Missing required parameter: tourId");
  }

  try {
    // 1. Upload the file to your server or cloud storage
    console.log("Uploading file...");
    const uploadedFileUrl = await uploadFile(file, tourId);
    console.log("File uploaded successfully:", uploadedFileUrl);

    // 2. Update the image descriptions in the GitHub repository
    console.log("Updating GitHub repository...");
    await updateGitHubImageDescriptions(tourId, description);
    console.log("GitHub repository updated successfully");

    return uploadedFileUrl;
  } catch (error) {
    console.error("Error in uploadImageAndUpdateGitHub:", error);
    throw error;
  }
};

const uploadFile = async (file, tourId) => {
  // This is a placeholder function. You need to implement the actual file upload logic
  // to your server or cloud storage service (e.g., AWS S3, Google Cloud Storage, etc.)

  console.log("Simulating file upload for tourId:", tourId);

  // Simulating an upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return a mock URL
  return `https://example.com/uploads/${tourId}/${file.name}`;
};

const updateGitHubImageDescriptions = async (tourId, newDescription) => {
  const FILE_PATH = `public/${tourId}/image-descriptions.json`;
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

  console.log("Updating GitHub file:", FILE_PATH);

  if (!GITHUB_REPO) {
    throw new Error("GITHUB_REPO environment variable is not set");
  }

  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  try {
    // Fetch the current file content
    console.log("Fetching current file content...");
    const fileResponse = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!fileResponse.ok) {
      throw new Error(`GitHub API responded with status: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    const currentContent = JSON.parse(atob(fileData.content));

    console.log("Current content:", currentContent);

    // Add the new description
    currentContent.descriptions.push(newDescription);

    console.log("Updated content:", currentContent);

    // Prepare the updated content
    const updatedContentBase64 = btoa(JSON.stringify(currentContent, null, 2));

    // Update the file in the repository
    console.log("Updating file in GitHub repository...");
    const updateResponse = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add new image description for tour ${tourId}`,
        content: updatedContentBase64,
        sha: fileData.sha,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    console.log("File updated successfully in GitHub repository");

    return true;
  } catch (error) {
    console.error("Error updating GitHub:", error);
    throw error;
  }
};
