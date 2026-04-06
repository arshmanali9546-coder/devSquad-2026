"use client";

import { useState } from "react";
import { useSocket } from "./SocketProvider";

export default function CommentForm() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const { socket, isConnected } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    if (socket && isConnected) {
      socket.emit("add_comment", {
        text,
        author: author.trim() || "Anonymous",
      });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Leave a Comment</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
        />
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
          required
        />
        <button
          type="submit"
          disabled={!isConnected || !text.trim()}
          className="self-end px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          {isConnected ? "Post Comment" : "Connecting..."}
        </button>
      </div>
    </form>
  );
}
