// githubUtils.js
export class GitHubBatchOperation {
  constructor(repo, token) {
    this.repo = repo;
    this.token = token;
    this.changes = [];
    this.deletions = [];
  }

  addFileChange(path, content, message) {
    this.changes.push({ path, content, message });
  }

  addFileDeletion(path, sha, message) {
    this.deletions.push({ path, sha, message });
  }

  async executeChanges(mainMessage) {
    const baseUrl = `https://api.github.com/repos/${this.repo}/contents/`;

    try {
      // First, get all current file information
      const fileData = await Promise.all(
        [...this.changes, ...this.deletions].map(async ({ path }) => {
          try {
            const response = await fetch(`${baseUrl}${path}`, {
              headers: {
                Authorization: `Bearer ${this.token}`,
                Accept: "application/vnd.github.v3+json",
              },
            });
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (error) {
            return null;
          }
        })
      );

      // Create a tree of all changes
      const tree = [];

      // Add updates
      for (let i = 0; i < this.changes.length; i++) {
        const { path, content } = this.changes[i];
        tree.push({
          path,
          mode: "100644",
          type: "blob",
          content: typeof content === "string" ? content : JSON.stringify(content),
        });
      }

      // Add deletions
      for (const { path } of this.deletions) {
        tree.push({
          path,
          mode: "100644",
          type: "blob",
          sha: null, // This will delete the file
        });
      }

      // Get the main branch reference
      const refResponse = await fetch(
        `https://api.github.com/repos/${this.repo}/git/refs/heads/master`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const refData = await refResponse.json();
      const latestCommitSha = refData.object.sha;

      // Create a new tree
      const treeResponse = await fetch(`https://api.github.com/repos/${this.repo}/git/trees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_tree: latestCommitSha,
          tree: tree,
        }),
      });
      const treeData = await treeResponse.json();

      // Create a new commit
      const commitResponse = await fetch(`https://api.github.com/repos/${this.repo}/git/commits`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mainMessage,
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      });
      const commitData = await commitResponse.json();

      // Update the reference
      await fetch(`https://api.github.com/repos/${this.repo}/git/refs/heads/master`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: true,
        }),
      });

      // Clear the changes and deletions arrays
      this.changes = [];
      this.deletions = [];

      return true;
    } catch (error) {
      console.error("Error executing batch changes:", error);
      throw error;
    }
  }
}
