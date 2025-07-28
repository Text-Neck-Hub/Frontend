import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  toolbarOptions?: (string | string[] | { [key: string]: any }[])[];
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
  toolbarOptions,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const isUpdatingInternally = useRef(false); 

  const modules = useMemo(
    () => ({
      toolbar: toolbarOptions,
    }),
    [toolbarOptions]
  );


  const handleChange = useCallback((_delta: any, _oldDelta: any, source: string) => {
    if (quillInstance.current && source === "user") { 
      isUpdatingInternally.current = true; 
      onChange(quillInstance.current.root.innerHTML);
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      if (!quillInstance.current) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: placeholder,
          modules: modules,
        });

        quillInstance.current.on("text-change", handleChange);

        if (value) {
            quillInstance.current.pasteHTML(value);
        }
      } 
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change", handleChange);
      }
    };
  }, [placeholder, modules, handleChange]);

  useEffect(() => {
    if (quillInstance.current && !isUpdatingInternally.current) {
        const currentEditorHtml = quillInstance.current.root.innerHTML;
        if (currentEditorHtml !== value) {
            quillInstance.current.pasteHTML(value); 
        }
    }
    isUpdatingInternally.current = false;
  }, [value]);

  return (
    <div style={{ height: "auto", minHeight: "200px" }}>
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;