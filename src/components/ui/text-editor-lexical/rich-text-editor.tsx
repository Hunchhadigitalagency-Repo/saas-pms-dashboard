import './rich-text-editor.css';
import type { EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import type { LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import ToolbarPlugin from './ToolbarPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import {
    HeadingNode,
    QuoteNode
} from '@lexical/rich-text';
import {
    ListItemNode,
    ListNode
} from '@lexical/list';
import {
    CodeHighlightNode,
    CodeNode
} from '@lexical/code';
import {
    AutoLinkNode,
    LinkNode
} from '@lexical/link';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';
// import { ImageNode } from './ImageNode';


const theme = {
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
    },
};

const editorConfig = {
    namespace: 'react-rich-text-editor',
    nodes: [
        HeadingNode,
        QuoteNode,
        ListItemNode,
        ListNode,
        CodeHighlightNode,
        CodeNode,
        AutoLinkNode,
        LinkNode,
        // ImageNode,
    ],
    onError(error: Error) {
        throw error;
    },
    theme,
};



interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {

    const initialConfig = {
        ...editorConfig,
        editorState: (editor: LexicalEditor) => {
            if (value) {
                editor.update(() => {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(value, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);

                    const root = $getRoot();
                    root.clear();
                    nodes.forEach(node => root.append(node));
                });
            }
        },
    };

    const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor);
            onChange(html);
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`editor-container ${className}`}>
                <ToolbarPlugin />
                <div className="editor-inner h-full">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">{placeholder}</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <CheckListPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <OnChangePlugin onChange={handleOnChange} />
                </div>
            </div>
        </LexicalComposer>
    );
}