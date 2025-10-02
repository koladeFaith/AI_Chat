
export type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  time?: string;
};

export default function ChatBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} py-2`}>
      <div
        className={`max-w-[90%] md:max-w-[80%] break-words p-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            : "bg-white text-gray-900"
        } `}>
        <div className="text-sm md:text-[16px] whitespace-pre-line">{msg.text}</div>
        <div
          className={`text-[10px]   ${
            isUser ? "text-blue-100" : "text-gray-400"
          } text-right`}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}
