export async function batchUploadToGithub(files, mdxContent, imageDescriptions, slug, repo, token) {
  const apiUrl = `https://api.github.com/repos/${repo}`;

  async function createBlob(content, encoding = "utf-8") {
    const response = await fetch(`${apiUrl}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, encoding }),
    });
    return response.json();
  }

  // Create blobs for all files
  const blobPromises = files.map(async (file) => {
    const content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file.file);
    });
    const blob = await createBlob(content, "base64");
    return { path: file.path, sha: blob.sha, mode: "100644", type: "blob" };
  });

  // Create blob for MDX content
  const mdxBlob = await createBlob(mdxContent);
  blobPromises.push({
    path: `app/(static)/blog/posts/${slug}.mdx`,
    sha: mdxBlob.sha,
    mode: "100644",
    type: "blob",
  });

  // Create blob for image descriptions JSON
  const jsonContent = JSON.stringify(imageDescriptions, null, 2);
  const jsonBlob = await createBlob(jsonContent);
  blobPromises.push({
    path: `app/(static)/blog/image-descriptions/${slug}.json`,
    sha: jsonBlob.sha,
    mode: "100644",
    type: "blob",
  });

  // Wait for all blobs to be created
  const tree = await Promise.all(blobPromises);

  // Get the SHA of the latest commit on the master branch
  const branchResponse = await fetch(`${apiUrl}/git/ref/heads/master`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const branchData = await branchResponse.json();
  const latestCommitSha = branchData.object.sha;

  // Create a new tree
  const newTreeResponse = await fetch(`${apiUrl}/git/trees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base_tree: latestCommitSha,
      tree: tree,
    }),
  });
  const newTreeData = await newTreeResponse.json();

  // Create a new commit
  const newCommitResponse = await fetch(`${apiUrl}/git/commits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add new blog post: ${slug}`,
      tree: newTreeData.sha,
      parents: [latestCommitSha],
    }),
  });
  const newCommitData = await newCommitResponse.json();

  // Update the reference of the master branch
  await fetch(`${apiUrl}/git/refs/heads/master`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sha: newCommitData.sha,
    }),
  });

  return newCommitData.sha;
}
