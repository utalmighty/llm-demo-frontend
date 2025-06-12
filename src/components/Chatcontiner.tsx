import ChatBubble, { type ChatProps } from "./Chatbubble";

export default function ChatContainer(props: { chatArr: ChatProps[] }) {
    const { chatArr } = props;
    
    return (
        <div className="px-5 pt-1 overflow-auto h-[calc(100vh-100px)]">
            {chatArr.map((chat, index) => (
                <ChatBubble key={index} message={chat.message} query={chat.query} session={chat.session} isUser={chat.isUser} documentId={chat.documentId} baseUrl={chat.baseUrl} />
            ))}
        </div>
    );
}