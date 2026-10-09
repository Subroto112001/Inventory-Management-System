"use client";

import { useEffect, useRef } from "react";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Italic,
  Link as LinkIcon, List, ListOrdered, Palette, Strikethrough,
  Table as TableIcon, Underline as UnderlineIcon,
} from "lucide-react";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [{
      types: ["textStyle"],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize || null,
          renderHTML: (attributes) => attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
        },
      },
    }];
  },
});

const buttonClass = "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40";

function ToolbarButton({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`${buttonClass} ${active ? "bg-gray-200 text-gray-950" : ""}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ id, value = "", onChange, placeholder, disabled = false, ariaLabel }) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    content: value || "",
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TableKit.configure({ table: { resizable: true } }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-40 px-4 py-3 text-sm text-gray-800 outline-none [&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2",
        "data-placeholder": placeholder || "Write here...",
        "aria-label": ariaLabel || placeholder || "Rich text editor",
        ...(id ? { id } : {}),
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChangeRef.current?.(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return <div className="min-h-40 rounded-b-xl bg-white px-4 py-3 text-sm text-gray-400">Loading editor...</div>;
  }

  const setLink = () => {
    const current = editor.getAttributes("link").href || "";
    const href = window.prompt("Enter link URL", current);
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[var(--theme-primary)] focus-within:ring-4 focus-within:ring-[var(--theme-primary)]/10 ${disabled ? "opacity-60 [&_[role=toolbar]]:pointer-events-none" : ""}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2" role="toolbar" aria-label={`${ariaLabel || "Text"} formatting`}>
        <select aria-label="Heading style" className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs" value={editor.isActive("heading", { level: 1 }) ? "h1" : editor.isActive("heading", { level: 2 }) ? "h2" : "p"} onChange={(event) => event.target.value === "p" ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: Number(event.target.value.slice(1)) }).run()}>
          <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option>
        </select>
        <select aria-label="Font size" className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs" defaultValue="" onChange={(event) => { const size = event.target.value; if (size) editor.chain().focus().setMark("textStyle", { fontSize: size }).run(); else editor.chain().focus().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(); }}>
          <option value="">Size</option><option value="12px">Small</option><option value="16px">Normal</option><option value="20px">Large</option><option value="28px">Extra large</option>
        </select>
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolbarButton>
        <label className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-gray-600 hover:bg-gray-100" title="Text color" aria-label="Text color"><Palette size={16} /><input aria-label="Text color" type="color" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} /></label>
        <ToolbarButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={16} /></ToolbarButton>
        <ToolbarButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={16} /></ToolbarButton>
        <ToolbarButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={16} /></ToolbarButton>
        <ToolbarButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton>
        <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={setLink}><LinkIcon size={16} /></ToolbarButton>
        <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
