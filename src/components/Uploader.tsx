import { useState, useRef } from "react";
import "./Uploader.css";
import uploadImg from "../assets/Upload.jpeg";

// Authorization key (Move this to .env in real apps)
const VITE_AUTH_ACCESS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImlhdCI6MTc1Mzg0MzYzOSwiZXhwIjoxNzU2NDM1NjM5fQ.fu6K01gn....................";

// maximum file size to make it into chuncks 
const MAKE_CHUNKS_AFTER = 5*1024*1024;

export default function Uploader() {


  // File handling state
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File selection handler
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Upload logic
  const handleUploadFileIntoApi = async () => {
    if (files.length === 0) return;

    const FILE_WE_GOT = files[0];

    console.log(
      `The file name is: ${FILE_WE_GOT.name}, type: ${FILE_WE_GOT.type}, size: ${FILE_WE_GOT.size}`
    );

    // Get the number of parts from the details 
    const parts = Math.ceil(FILE_WE_GOT.size/MAKE_CHUNKS_AFTER);
    console.log(parts);
    

    // First API: Start multipart upload
    try {
      const res = await fetch(
        "https://v2-dev-api-nyayatech.workr.in/v1.0/files/start-multipart-upload",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `${VITE_AUTH_ACCESS_KEY}`,
          },
          body: JSON.stringify({
            file_name: FILE_WE_GOT.name,
            file_type: FILE_WE_GOT.type,
            file_size: FILE_WE_GOT.size,
            file_path: FILE_WE_GOT.name,
          }),
        }
      );

      if (!res.ok) {
        console.log("The API posting is not done properly");
        return;
      }

      const gotData = await res.json();
      const { file_key, upload_id } = gotData.data;

      // Second API: Get multipart upload URLs
      await secondApiCallData(upload_id, file_key, parts);
    } catch (err) {
      console.log(`Error while posting data in API: ${err}`);
    }
  };

   
  // Second API logic
  const secondApiCallData = async (uploadId: string, fileKey: string, parts: number) => {
    try {
      const res = await fetch(
        "https://v2-dev-api-nyayatech.workr.in/v1.0/files/multipart-upload-urls",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `${VITE_AUTH_ACCESS_KEY}`,
          },
          body: JSON.stringify({
            file_key: fileKey,
            upload_id: uploadId,
            parts: parts
          }),
        }
      );

      const data = await res.json();

      const uploadUrlsList = data.data.upload_urls;
 
      uploadUrlsList.map((url) => {
   
      })
      
       
      
    } catch (err) {
      console.log(`Error in second API call: ${err}`);
    }
  };

  return(
    <>
     
    </>
  )

}
