import axios from "axios";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Popup from "reactjs-popup";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function Attach() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
    const [uploadProcess, setUploadProgress] = useState<number>(0);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    async function handleUpload() {

        if (!file) {
            console.error("No file selected");
            return;
        }

        setUploadStatus("uploading");
        setUploadProgress(0); // Reset progress before starting upload

        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post("http://httpbin.org/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1; // Avoid division by zero
                    const current = progressEvent.loaded;
                    const percentCompleted = Math.round((current / total) * 100);
                    setUploadProgress(percentCompleted);
                    setUploadStatus("uploading");
                },
            });
            setUploadStatus("success");
            setUploadProgress(100);
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("error");
            setUploadProgress(0);
            setFile(null); // Clear the file after an error
            return;
        }
    }


    return (
        <div className="text-[#009900] box-border size-16
                        flex items-center justify-center 
                        hover:bg-[#00c900] hover:text-white transition-colors duration-300 cursor-pointer">
        
                <input type="file" onChange={handleFileChange}/>

                {file && uploadStatus === "uploading" 
                    && (<span className="ml-2">Uploading: {uploadProcess}%</span>)}

                {file && uploadStatus !== "uploading" 
                    && (<button onClick={handleUpload} className="ml-2"> Upload </button>)}

                {uploadStatus === "success" 
                    && (<span className="ml-2 text-green-500">File uploaded successfully!</span>)}

                {uploadStatus === "error"
                    && (<span className="ml-2 text-red-500">Error uploading file.</span>)}
        </div>
    )
}

