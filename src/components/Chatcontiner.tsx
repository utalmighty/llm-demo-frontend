import ChatBubble from "./Chatbubble";

export default function ChatContainer() {
    return (
        <div className="px-5 pt-1 overflow-auto h-[calc(100vh-100px)]">
            <ChatBubble message="Hello, how can I help you? Prefix a text-shadow utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:" />
            <ChatBubble message="Hello, how can I help you?" isUser={true} />
        </div>
    );
}