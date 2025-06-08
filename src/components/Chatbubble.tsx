export default function ChatBubble({
  message,
  isUser = false,
}: {
  message: string;
  isUser?: boolean;
}) {
  return (
    <div className="mb-4">
        <div className="px-2 flex w-full text-[#00c900] text-lg"> {isUser ? "USER" : "LLM"} </div>
        <div className="p-2 text-[#00c900]">{message}</div>
    </div>
  );
}
