import React, { useState } from "react";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- your n8n webhook URL (use env variable if possible)
  const N8N_WEBHOOK_URL =
    "https://shreyahubcredo.app.n8n.cloud/webhook/e8fcdb39-9fc8-4d8e-bef6-9137cf29d4e2";

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from n8n:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Image Error Detector
      </h1>

      {/* Image Upload Section */}
      <div
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          background: "#fafafa",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "1rem" }}
        />
        <br />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          {loading ? "Processing..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "1rem",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      {/* Display Result */}
      {result && (
        <div style={{ marginTop: "2rem" }}>
          {/* Display Processed Image */}
          {result.image && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h3>🖼️ Highlighted Image</h3>
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Processed Result"
                style={{
                  maxWidth: "90%",
                  border: "2px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          )}

          {/* Display Extracted Text */}
          {result.text && (
            <div
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1.5rem",
              }}
            >
              <h3>📜 Extracted Text</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{result.text}</p>
            </div>
          )}

          {/* Display Errors in a Table */}
          {result.errors && result.errors.length > 0 && (
            <div>
              <h3>⚠️ Detected Errors</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <thead style={{ background: "#f2f2f2" }}>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      ID
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Found Text
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Type
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Description
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Corrected Text
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Location Hint
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err) => (
                    <tr key={err.error_id}>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {err.error_id}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {err.found_text}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          color:
                            err.error_type === "Spelling"
                              ? "red"
                              : err.error_type === "Grammar"
                              ? "blue"
                              : err.error_type === "Consistency"
                              ? "purple"
                              : "black",
                          fontWeight: "600",
                        }}
                      >
                        {err.error_type}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {err.issue_description}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {err.corrected_text}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {err.location_hint || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
