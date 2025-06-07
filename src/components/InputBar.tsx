import { useState } from "react";

export default function InputBar() {

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    
    const handleSend = () => {
        // handle sse streaming response
        const eventSource = new EventSource('http://localhost:8080/short-term-memory?query=' + prompt);
        eventSource.onmessage = (event) => {        
            if (event.data === '[DONE]') {
                eventSource.close();
            } else {
                const data = JSON.parse(event.data);
                setResponse((prev) => prev + data.response);
            }
        }
        eventSource.onerror = (error) => {
            console.error("Error in SSE connection:", error);
            eventSource.close();
        }
        // Reset response for new prompt
        setResponse('');
        setPrompt('');
            
    };

    return (
        <>
            <p>{response}</p>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button type="submit" onClick={handleSend}>Send</button>
        </>
    );
}