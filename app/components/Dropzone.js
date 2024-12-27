"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone() {
    const [downloadLink, setDownloadLink] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        // aggiungere il controllo per tipo per tutti i file e non solo il primo e loggare solo per il file validi e comunicare i file invalidi
        if (acceptedFiles.length > 0 && acceptedFiles[0].type === "application/x-cbr") {
            console.log("Files dropped:", acceptedFiles);
            // fetch to converter api
            const formData = new FormData();
            formData.append("file", acceptedFiles[0]);
            fetch("/api/convert", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    console.log("PDF file created:", data.pdfPath);
                    setDownloadLink(data.pdfPath);
                } else {
                    console.error("Conversion error:", data.message);
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
        }
        else {
            console.log("Invalid file type");
        }  
    }, []);

    const { getRootProps, getInputProps } = useDropzone({onDrop});

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div {...getRootProps()} style={{ border: "2px dashed white", padding: "20px", textAlign: "center", cursor: "pointer" }}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
        </div>
    );
}