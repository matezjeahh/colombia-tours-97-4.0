import React, { useCallback } from "react";
import { Editable } from "slate-react";
import { Text, Element as SlateElement } from "slate";

const EditorContent = () => {
  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case "heading-one":
        return (
          <h1 {...attributes} className="text-3xl font-bold my-4">
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} className="text-2xl font-bold my-3">
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...attributes} className="text-xl font-bold my-2">
            {children}
          </h3>
        );
      case "block-quote":
        return (
          <blockquote {...attributes} className="border-l-4 pl-4 italic my-4">
            {children}
          </blockquote>
        );
      case "numbered-list":
        return (
          <ol {...attributes} className="list-decimal pl-5 my-4">
            {children}
          </ol>
        );
      case "bulleted-list":
        return (
          <ul {...attributes} className="list-disc pl-5 my-4">
            {children}
          </ul>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "code":
        return (
          <pre {...attributes} className="bg-gray-100 p-2 rounded my-4">
            <code>{children}</code>
          </pre>
        );
      default:
        return (
          <p {...attributes} className="my-2">
            {children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.code) children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder="Enter your blog post content here..."
      className="border p-4 rounded-md min-h-[300px] mb-4"
    />
  );
};

export default EditorContent;
