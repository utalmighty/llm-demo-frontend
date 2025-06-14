import { useState, useRef } from "react";

export default function Talk({baseUrl}: {baseUrl: string}) {    
  const [base, setbase] = useState(baseUrl);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) {
      console.error("MediaDevices API not supported.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setAudioChunks([]);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        console.log("Recording finished. Audio blob:", audioBlob);
        // TODO: Send the audioBlob to a server or process it further.
        
        console.log("Uploading audio:", audioBlob);
        if (!audioBlob) {
            alert("Audio is empty");
            return;
        }
        const formData = new FormData();
        formData.append("file", audioBlob);
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
            })
        } catch (error) {
            console.error("Error uploading file:", error);
        }
        return;
        
        //
      };
      mediaRecorder.start();
      setRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      console.log("Recording stopped");
    }
  };

  return (
    <>
    <div className="border-2 border-[#00c900] text-[#009900] box-border size-16 border-t-0 border-b-0 border-r-0
                        flex items-center justify-center
                        hover:bg-[#00c900] hover:text-white transition-colors duration-300 cursor-pointer"
      onMouseDown={handleStartRecording}
      onMouseUp={handleStopRecording}
      onMouseLeave={handleStopRecording}
      
      >
            <div>Talk</div>
        </div>
    </>
  );
}