import React, { useState, useEffect, useRef } from "react";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  diffSourcePlugin,
  BlockTypeSelect,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const MDXEditorComponent = ({ selectedArticle, onChange }) => {
  const [markdown, setMarkdown] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (selectedArticle && selectedArticle.content) {
      setMarkdown(selectedArticle.content);
      console.log("Setting markdown:", selectedArticle.content);

      // Force re-render of MDXEditor
      if (editorRef.current) {
        editorRef.current.setMarkdown(selectedArticle.content);
      }
    } else {
      // Clear the editor when no article is selected
      setMarkdown("");
      if (editorRef.current) {
        editorRef.current.setMarkdown("");
      }
    }
  }, [selectedArticle]);

  const handleEditorChange = (newMarkdown) => {
    setMarkdown(newMarkdown);
    if (onChange) {
      onChange(newMarkdown);
    }
  };

  return (
    <div className="border rounded-md">
      <MDXEditor
        contentEditableClassName="my-prose"
        ref={editorRef}
        markdown={markdown}
        onChange={handleEditorChange}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
              </>
            ),
          }),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin(),
          sandpackPlugin(),
          diffSourcePlugin(),
        ]}
      />
      <style jsx global>{`
        :root {
          --navbar-height: 64px; /* Adjust this to match your navbar height */
        }

        .mdxeditor-wrapper {
          position: relative;
          height: calc(100vh - var(--navbar-height) - 2rem);
        }

        .mdxeditor {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .mdxeditor-toolbar {
          position: sticky;
          top: var(--navbar-height);
          z-index: 10;
          padding: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .mdxeditor-root-contenteditable {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .mdxeditor-popup-container {
          z-index: 20;
        }

        /* Adjustments for diff source plugin if you're using it */
        .mdxeditor-diff-source-wrapper {
          height: 100%;
        }

        .mdxeditor-rich-text-editor,
        .mdxeditor-source-editor,
        .mdxeditor-diff-editor {
          height: 100%;
        }

        /* Limit dropdown size on smaller viewports */
        @media (max-width: 640px) {
          .mdxeditor-select-content {
            max-height: 200px;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default MDXEditorComponent;
