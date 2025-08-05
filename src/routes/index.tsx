// File: routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Uploader from '../components/Uploader';
import FileHandler from '../components/FileHandler';
import "./index.css";

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [uploadedFileData, setUploadedFileData] = useState<any>(null);
  const [fName, setFName] = useState<string[]>([]);
  const [triggeredUpload, setTriggeredUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  function handleTriggerUpload(click: boolean) {
    setTriggeredUpload(click);
    setIsUploading(false);
  }

  function handleFileName(names: string[]) {
    setFName(prev => [...prev, ...names]);
  }

  function handleUploadStart() {
    setIsUploading(true);
  }

  return (
    <div className="container">
      <div className="half left">
        <Uploader
          onUploadSuccess={(data) => {
            setUploadedFileData(data);
            setIsUploading(false);
          }}
          onFileName={handleFileName}
          onUploadTriggered={handleTriggerUpload}
          onUploadStart={handleUploadStart}
        />
      </div>
      <div className="half right">
        {uploadedFileData ? (
          <FileHandler
            fileData={uploadedFileData}
            filename={fName}
            announcedTrigger={triggeredUpload}
          />
        ) : fName.length > 0 ? (
          <div className="file-table-container">
            <table>
              <thead>
                <tr><th>#</th><th>File name</th></tr>
              </thead>
              <tbody>
                {fName.map((name, i) => (
                  <tr key={i} className={isUploading ? "uploading-row" : ""}>
                    <td>{i + 1}</td>
                    <td>{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="file-table-container">
            <p>No file selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteComponent;
