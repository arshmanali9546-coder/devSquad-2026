"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import toast from "react-hot-toast";

type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  clientId: string;
};

export default function CommentList() {
  const { socket, isConnected } = useSocket();
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Load initial comments
    const handleInitialComments = (initialComments: Comment[]) => {
      setComments(initialComments);
    };

    // Handle new incoming comment
    const handleNewComment = (comment: Comment) => {
      setComments((prev) => [...prev, comment]);

      // If the comment wasn't from us, show a toast!
      if (comment.clientId !== socket.id) {
        toast(`New comment from ${comment.author}`, {
          icon: '💬',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          },
        });
      }
    };

    // Handle comment update
    const handleCommentUpdated = (updatedComment: Comment) => {
      setComments((prev) =>
        prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
      if (updatedComment.clientId !== socket.id) {
        toast.success(`Comment updated by ${updatedComment.author}`);
      }
    };

    // Handle comment deletion
    const handleCommentDeleted = (deletedId: string) => {
      setComments((prev) => prev.filter((c) => c.id !== deletedId));
      toast.error("A comment was deleted");
    };

    socket.on("initial_comments", handleInitialComments);
    socket.on("new_comment", handleNewComment);
    socket.on("comment_updated", handleCommentUpdated);
    socket.on("comment_deleted", handleCommentDeleted);

    return () => {
      socket.off("initial_comments", handleInitialComments);
      socket.off("new_comment", handleNewComment);
      socket.off("comment_updated", handleCommentUpdated);
      socket.off("comment_deleted", handleCommentDeleted);
    };
  }, [socket]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      socket?.emit("delete_comment", { id });
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleUpdate = (id: string) => {
    if (!editText.trim()) return;
    socket?.emit("update_comment", { id, text: editText });
    setEditingId(null);
    setEditText("");
  };

  if (!isConnected) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-pulse flex items-center gap-2 text-slate-400">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
          <span>Connecting to realtime server...</span>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
        No comments yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow-md transition-all hover:border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-indigo-400">{comment.author}</h3>
              {comment.clientId === socket?.id && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => startEditing(comment)}
                  className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="Edit comment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete comment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
            </div>
          </div>

          {editingId === comment.id ? (
            <div className="mt-2 space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(comment.id)}
                  className="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{comment.text}</p>
          )}
        </div>
      ))}
    </div>
  );
}
