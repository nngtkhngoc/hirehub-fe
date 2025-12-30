import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Highlighter,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
}: ToolbarButtonProps) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "h-8 w-8 p-0",
            isActive && "bg-gray-200 text-gray-900"
        )}
    >
        {children}
    </Button>
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Nhập URL:", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
            {/* Text formatting */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Đậm (Ctrl+B)"
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Nghiêng (Ctrl+I)"
                >
                    <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Gạch chân (Ctrl+U)"
                >
                    <UnderlineIcon size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Gạch ngang"
                >
                    <Strikethrough size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    isActive={editor.isActive("highlight")}
                    title="Tô sáng"
                >
                    <Highlighter size={16} />
                </ToolbarButton>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Căn trái"
                >
                    <AlignLeft size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="Căn giữa"
                >
                    <AlignCenter size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Căn phải"
                >
                    <AlignRight size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    isActive={editor.isActive({ textAlign: "justify" })}
                    title="Căn đều"
                >
                    <AlignJustify size={16} />
                </ToolbarButton>
            </div>

            {/* Lists & Quote */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Danh sách"
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Danh sách số"
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Trích dẫn"
                >
                    <Quote size={16} />
                </ToolbarButton>
            </div>

            {/* Link */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive("link")}
                    title="Thêm liên kết"
                >
                    <LinkIcon size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive("link")}
                    title="Xóa liên kết"
                >
                    <Unlink size={16} />
                </ToolbarButton>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Hoàn tác (Ctrl+Z)"
                >
                    <Undo size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Làm lại (Ctrl+Y)"
                >
                    <Redo size={16} />
                </ToolbarButton>
            </div>
        </div>
    );
};

export const RichTextEditor = ({
    content,
    onChange,
    placeholder = "Nhập nội dung...",
    className,
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline cursor-pointer",
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={cn("border border-gray-200 rounded-lg bg-white", className)}>
            <MenuBar editor={editor} />
            <div className="relative">
                <EditorContent editor={editor} />
                {!content && (
                    <p className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                        {placeholder}
                    </p>
                )}
            </div>
        </div>
    );
};
