import React from "react";
import "./FileHandler.css";

function FileHandler({
  fileData,
  filename,
  announcedTrigger,
}: {
  fileData: any;
  filename: string[];
  announcedTrigger: boolean;
}) {
  const files = fileData.download_urls || [];

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Try again.");
    }
  };

  return (
    <>
      {/* PDF Preview if PDF files exist */}
      {files.map((file: string, index: number) => {
        if (file.endsWith(".pdf")) {
          return (
            <div id="preview-screen" key={`preview-${index}`}>
              <embed
                src={file}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </div>
          );
        }
        return null;
      })}

      {/* Table */}
      <div className="file-table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Filename</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={3}>No files found.</td>
              </tr>
            ) : (
              files.map((file: string, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={file} target="_blank" rel="noreferrer">
                      {filename[index] || `File ${index + 1}`}
                    </a>
                  </td>
                  <td>
                    <button
                      className="download-btn"
                      onClick={() =>
                        handleDownload(file, filename[index] || `file-${index + 1}`)
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FileHandler;
