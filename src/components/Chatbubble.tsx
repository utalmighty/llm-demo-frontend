import { useEffect, useState } from "react";

export interface ChatProps {
  message: string
  session: string
  query: string
  isUser?: boolean
}

export default function ChatBubble({ message, query, isUser = false, session }: Readonly<ChatProps>) {

  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!isUser) {      
      console.log("Sending query to SSE:", query);
      const eventSource = new EventSource(`http://localhost:8080/tldr/api/session/${session}/chat?query=${query}`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.response === "") {
          console.log("SSE connection closed.");
          eventSource.close();
        } else {
          setResponse((prev) => prev + data.response);
        }
      };
      eventSource.onerror = (error) => {
        console.error("Error in SSE connection:", error);
        eventSource.close();
      };
      return () => {
        eventSource.close();
      }; // TODO remove this in production
    } 
    else {
      setResponse(message);
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="px-2 flex w-full text-[#00c900] text-lg">
        {isUser ? "USER" : "LLM"}
      </div>
      <div className="p-2 text-[#00c900]">{response}</div>
    </div>
  );
}
