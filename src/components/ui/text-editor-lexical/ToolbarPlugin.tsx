import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list';
import { $isLinkNode } from '@lexical/link';
import { Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, CheckSquare, Undo, Redo } from 'lucide-react';
import { $getNearestNodeOfType } from '@lexical/utils';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);



  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      console.log('Selection:', selection);
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));

        const anchorNode = selection.anchor.getNode();
        const link = $isLinkNode(anchorNode.getParent()) || $isLinkNode(anchorNode);
        console.log('Is link?', link);
        setIsLink(link);
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // const insertLink = useCallback(() => {
  //   editor.update(() => {
  //     const selection = $getSelection();
  //     if (!$isRangeSelection(selection) || selection.isCollapsed()) {
  //       console.log('Nothing selected');
  //       return;
  //     }

  //     const anchorNode = selection.anchor.getNode();
  //     const nearestLink = $getNearestNodeOfType(anchorNode, LinkNode);

  //     if (nearestLink) {
  //       editor.dispatchCommand(TOGGLE_LINK_COMMAND, null); // remove link
  //     } else {
  //       const url = window.prompt('Enter URL', 'https://');
  //       if (url) {
  //         editor.dispatchCommand(TOGGLE_LINK_COMMAND, url); // add link
  //       }
  //     }
  //   });
  // }, [editor]);

  // const insertImage = useCallback(() => {
  //   handleUpload()

  //   editor.update(() => {
  //     const imageNode = $createImageNode(url);
  //     const selection = $getSelection();
  //     if ($isRangeSelection(selection)) {
  //       selection.insertNodes([imageNode]);
  //     }
  //   });
  // }, [editor]);

  // const handleUpload = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const url = reader.result as string;
  //     editor.update(() => {
  //       const imageNode = $createImageNode(url);
  //       const selection = $getSelection();
  //       if ($isRangeSelection(selection)) {
  //         selection.insertNodes([imageNode]);
  //       }
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // };

  const toggleList = useCallback((type: 'bullet' | 'number' | 'check') => {
    const cmd =
      type === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND :
        type === 'number' ? INSERT_ORDERED_LIST_COMMAND :
          INSERT_CHECK_LIST_COMMAND;

    let removed = false;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const nearestList = $getNearestNodeOfType(anchorNode, ListNode) as ListNode | null;

      if (nearestList) {
        const listType = nearestList.getListType();
        if (
          (type === 'bullet' && listType === 'bullet') ||
          (type === 'number' && listType === 'number') ||
          (type === 'check' && listType === 'check')
        ) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          removed = true;
        }
      }
    });

    if (removed) return;

    // focus editor to make sure insert applies right
    editor.focus();
    editor.dispatchCommand(cmd, undefined);
  }, [editor]);

  // const refreshToolbar = () => {
  //   editor.getEditorState().read(() => updateToolbar());
  // };

  // Helper wrapper used by format buttons to prevent focus loss and ensure toggle
  const applyFormat = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    console.log(isUnderline, isBold, isStrikethrough, isUnderline)
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  // Use onMouseDown to stop the button from stealing focus
  const handleMouseDownPrevent = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="toolbar">
      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => { editor.focus(); editor.dispatchCommand(UNDO_COMMAND, undefined); }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => { editor.focus(); editor.dispatchCommand(REDO_COMMAND, undefined); }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <div className="divider" />

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => applyFormat('bold')}
        className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
        aria-label="Format Bold"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => applyFormat('italic')}
        className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
        aria-label="Format Italic"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => applyFormat('underline')}
        className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
        aria-label="Format Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => applyFormat('strikethrough')}
        className={`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`}
        aria-label="Format Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      {/* <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => { insertLink(); }}
        className={`toolbar-item spaced ${isLink ? 'active' : ''}`}
        aria-label="Insert Link"
      >
        <Link className="h-4 w-4" />
      </button> */}

      <div className="divider" />

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => toggleList('bullet')}
        className="toolbar-item spaced"
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => toggleList('number')}
        className="toolbar-item spaced"
        aria-label="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={() => toggleList('check')}
        className="toolbar-item spaced"
        aria-label="Check List"
      >
        <CheckSquare className="h-4 w-4" />
      </button>
      {/* <button
        type="button"
        onMouseDown={handleMouseDownPrevent}
        onClick={insertImage}
        className="toolbar-item spaced"
        aria-label="Insert Image"
      >
        🖼️
      </button> */}
    </div>
  );
}
