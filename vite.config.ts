import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "lexical",
      "@lexical/html",
      "@lexical/rich-text",
      "@lexical/history",
      "@lexical/link",
      "@lexical/list",
      "@lexical/react/LexicalComposer",
      "@lexical/react/LexicalRichTextPlugin",
      "@lexical/react/LexicalHistoryPlugin",
      "@lexical/react/LexicalListPlugin",
      "@lexical/react/LexicalLinkPlugin",
      "@lexical/react/LexicalContentEditable",
      "@lexical/react/LexicalOnChangePlugin",
      "@lexical/react/LexicalErrorBoundary",
      "@lexical/react/LexicalComposerContext",
    ],
  },
})
