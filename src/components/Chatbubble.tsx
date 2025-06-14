import { useEffect, useState } from "react";

export interface ChatProps {
  message: string
  session: string
  query: string
  documentId: string
  baseUrl: string
  isUser?: boolean
}

export default function ChatBubble({ message, query, isUser = false, session, documentId, baseUrl }: Readonly<ChatProps>) {

  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!isUser) {
      let url = `${baseUrl}/session/${session}/chat?query=${query}`;
      if (query.startsWith("/")) {
        const command = query.slice(1).toLowerCase();
        url = `${baseUrl}/session/${session}/command/${command}?documentId=${documentId}`;
      }
      else if (documentId) {
        url = `${baseUrl}/session/${session}/short-term-memory/${documentId}?query=${query}`;
      }
      console.log("Sending query to SSE:", query);
      const eventSource = new EventSource(url);
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
