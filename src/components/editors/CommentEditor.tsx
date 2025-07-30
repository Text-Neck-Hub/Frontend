import { useEffect, useState } from "react";

interface CommentEditorProps {
  initialContent: string;
  onCommentSubmit: (content: string) => void;
  onCancel?: () => void;
  submitButtonText: string;
}

const CommentEditor = ({
  initialContent,
  onCommentSubmit,
  onCancel,
  submitButtonText,
}: CommentEditorProps) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    onCommentSubmit(content);
    setContent("");
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleSubmit}>{submitButtonText}</button>
      {onCancel && (
        <button onClick={onCancel} style={{ marginLeft: "10px" }}>
          취소
        </button>
      )}
    </div>
  );
};

export default CommentEditor;
