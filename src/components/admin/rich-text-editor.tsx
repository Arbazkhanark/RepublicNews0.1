"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [selectedText, setSelectedText] = useState("");

  const insertFormatting = (before: string, after = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onChange(newContent);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: Heading1,
      action: () => insertFormatting("# "),
      label: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => insertFormatting("## "),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => insertFormatting("### "),
      label: "Heading 3",
    },
    { icon: Bold, action: () => insertFormatting("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insertFormatting("*", "*"), label: "Italic" },
    {
      icon: Underline,
      action: () => insertFormatting("<u>", "</u>"),
      label: "Underline",
    },
    { icon: List, action: () => insertFormatting("- "), label: "Bullet List" },
    {
      icon: ListOrdered,
      action: () => insertFormatting("1. "),
      label: "Numbered List",
    },
    { icon: Quote, action: () => insertFormatting("> "), label: "Quote" },
    {
      icon: Link,
      action: () => insertFormatting("[", "](url)"),
      label: "Link",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md bg-muted/50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] font-mono text-sm"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectedText(
            target.value.substring(target.selectionStart, target.selectionEnd)
          );
        }}
      />

      <div className="text-xs text-muted-foreground">
        Supports Markdown formatting. Use the toolbar buttons or type Markdown
        directly.
      </div>
    </div>
  );
}
