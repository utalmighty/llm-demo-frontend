import { useState } from "react";
import Send from "./Send";
import Attach from "./Attach";
import Talk from "./Talk";

export default function InputBar() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = () => {
    // handle sse streaming response
    if (!prompt.trim()) {
      return; // Do not send empty prompts
    }
    const eventSource = new EventSource(
      "http://localhost:8080/short-term-memory?query=" + prompt
    );
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
      } else {
        const data = JSON.parse(event.data);
        setResponse((prev) => prev + data.response);
      }
    };
    eventSource.onerror = (error) => {
      console.error("Error in SSE connection:", error);
      eventSource.close();
    };
    // Reset response for new prompt
    setResponse("");
    setPrompt("");
  };

  return (
    <div className="flex flex-row w-full border-2 border-[#00c900] border-r-0 border-l-0">
    <div className="w-full flex justify-between items-center">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-full p-2 focus:outline-none placeholder:text-[#00c900] placeholder:italic caret-[#00c900] text-color-[#00c900] bg-transparent"
        placeholder="type here..."
      />
    </div>
      <div className="flex flex-row">
        <div onClick={handleSend}>
          <Send />
        </div>
        <Attach></Attach>
        <Talk></Talk>
      </div>
    </div>
  );
}
