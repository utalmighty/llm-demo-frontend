import { useEffect, useState } from "react";
import Send from "./Send";
import Attach from "./Attach";
import Talk from "./Talk";
import type { ChatProps } from "./Chatbubble";
import ChatContainer from "./Chatcontiner";
import axios from "axios";

export default function Home() {
  
  const baseUrl = "http://localhost:8080/tldr/api";
  
  const [chatArr, setChatArr] = useState<ChatProps[]>([])
  const [userInput, setUserInput] = useState("");
  const [session, setSession] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // Create a session when the component mounts
  useEffect(()=> {
    axios.get(`${baseUrl}/session/create`)
      .then((response) => {
        setSession(response.data.response);
        console.log("Session created:", response.data.response);
      })
      .catch((error) => {
        alert("Error creating session: " + error.message);
      });
    return () => {};
  }, []);


  const handleSend = () => {    
    if (file) {
      handleUpload();
      setChatArr([...chatArr,
        { message: userInput, query: userInput, isUser: true, session: session, documentId: documentId, baseUrl: baseUrl }]);
      setUserInput("");
      setFile(null);
    } else {
      setChatArr([...chatArr,
        { message: userInput, query: userInput, isUser: true, session: session, documentId: documentId, baseUrl: baseUrl },
        { message: "", query: userInput, isUser: false, session: session, documentId: documentId, baseUrl: baseUrl }]);
      setUserInput("");
    }
  };
  
  function handleUpload() {
        console.log("Uploading file:", file);
        if (!file) {
            alert("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            axios.post(`http://localhost:8080/tldr/api/session/${session}/short-term-memory`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: () => {
                    console.log("Uploading");
                },
            }).then((response) => {
                console.log("File uploaded successfully:", response.data);
                setDocumentId(response.data.response);
            });
        } catch (error) {
            console.error("Error uploading file:", error);
        }
        return;
    }

  return (
    <div className="bg-[#0f0f23] h-screen flex flex-col items-center justify-between relative">
      <div className="border-2 border-[#00c900] h-full border-t-0 border-b-0 w-full md:w-[50%]">
        <div><ChatContainer chatArr={chatArr} /></div>
        <div className="absolute bottom-0 w-full md:w-[50%]">
          <div className="flex flex-row w-full border-2 border-[#00c900] border-r-0 border-l-0">
            <div className="w-full flex justify-between items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-full p-2 focus:outline-none placeholder:text-[#00cc00] placeholder:italic caret-[#00c900] text-[#00c900] bg-transparent"
                placeholder="type here..."
              />
            </div>
            <div className="flex flex-row">
              <button
              type="button"
              onClick={() => handleSend()}
              className="flex items-center"
              aria-label="Send message"
              disabled={!userInput.trim()}>
              <Send />
              </button>

              {/* Attach button with file input */}
              <label className="flex items-center cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
                  setUserInput(e.target.files && e.target.files[0] ? "📁"+e.target.files[0].name : "");
                }}
              />
              <Attach />
              </label>

              <Talk />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
