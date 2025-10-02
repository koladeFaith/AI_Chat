/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./components/chatBubble";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const submit = async () => {
    if (!input.trim()) return;

    const userMsg: Msg = {
      id: uuidv4(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setError("");
    try {
      const resp = await fetch(
        "https://ai-chat-backend-1-ld9s.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "API error");
      }

      const body = await resp.json();
      const assistantMsg: Msg = {
        id: uuidv4(),
        role: "assistant",
        text: body.reply || "No response",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      console.log("Assistant reply:", body.reply);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fbff] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_100%)] rounded-3xl shadow-2xl p-6 md:p-8">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Faith AI Chat</h2>
          </div>
          <div className="text-sm text-gray-400">
            Status: {loading ? "Thinking..." : "Idle"}
          </div>
        </header>

        <main
          ref={scrollRef}
          className="h-[60vh] md:h-[65vh]  overflow-y-auto rounded-lg p-4 bg-gradient-to-b from-white/70 to-white/60">
          {messages.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
        </main>

        <footer className="mt-4">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message. Press Enter to send."
              className="flex-1 min-h-[30px] text-[15px] md:text-[18px] max-h-20 p-3 rounded-xl resize-none border border-transparent shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <button
              onClick={submit}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-3 rounded-xl shadow hover:opacity-95 disabled:opacity-60">
              {loading ? "..." : "Send"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
