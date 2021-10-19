import React from "react";
import axios from "axios";

export default function index() {
  const [uploadFile, setUploadFile] = React.useState();
  const [uploadResponse, setUploadResponse] = React.useState();

  const submitForm = (event) => {
    event.preventDefault();

    // const dataArray = new FormData();
    axios
      .post("/api/file-import", uploadFile[0], {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        setUploadResponse(`File uploaded successfully`)
       
      })
      
  };

  return (
    <div className="App">
      <form onSubmit={submitForm}>
        <input type="file" name="file" onChange={(e) => setUploadFile(e.target.files)} />
        <br />
        <input type="submit" />
      </form>
      <hr />
      <pre>{uploadResponse}</pre>
    </div>
  );
}
