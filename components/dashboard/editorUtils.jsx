// editorUtils.js
import { Editor, Transforms, Text, Element as SlateElement } from "slate";

export const CustomEditor = {
  toggleMark(editor, format) {
    const isActive = this.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const isActive = this.isBlockActive(editor, format);
    const isList = ["numbered-list", "bulleted-list"].includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ["numbered-list", "bulleted-list"].includes(n.type),
      split: true,
    });

    const newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },

  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
};

export const serializeToMDX = (nodes) => {
  return nodes
    .map((n) => {
      if (Text.isText(n)) {
        let string = replaceCharacters(n.text);
        if (n.bold) {
          string = `**${string}**`;
        }
        if (n.italic) {
          string = `*${string}*`;
        }
        if (n.underline) {
          string = `<u>${string}</u>`;
        }
        if (n.code) {
          string = `\`${string}\``;
        }
        return string;
      }

      const children = n.children.map((n) => serializeToMDX([n])).join("");

      switch (n.type) {
        case "heading-one":
          return `# ${children}\n\n`;
        case "heading-two":
          return `## ${children}\n\n`;
        case "heading-three":
          return `### ${children}\n\n`;
        case "block-quote":
          return `> ${children}\n\n`;
        case "numbered-list":
          return children;
        case "bulleted-list":
          return children;
        case "list-item":
          return `- ${replaceCharacters(children)}\n`;
        case "code":
          return `\`\`\`\n${children}\n\`\`\`\n\n`;
        default:
          return `${children}\n\n`;
      }
    })
    .join("");
};

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};

export const replaceCharacters = (text) => {
  const replacements = {
    û: "ű",
    ô: "ő",
    ò: "ó",
  };
  return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
};
