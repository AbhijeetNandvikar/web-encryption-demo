import { useState } from "react";
import { startEncryption, startDecryption } from "./utils";

export const App = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const [password, setPassword] = useState("");
  const [iv, setIv] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) setCurrentFile(e.target.files[0]);
  };

  return (
    <div>
      <h2>How to use this App?</h2>
      <ul>
        <li>
          If you want to encrypt a file:
          <ol>
            <li>Choose a password for encryption</li>
            <li>Add a file to encrypt</li>
            <li>
              Click on start encryption, the file will be encrypted and will be
              saved on your machine.
            </li>
          </ol>
        </li>
        <br />
        <li>
          <ol>
            <li>Enter the password you used while encrypting the file.</li>
            <li>Click on Add file button add encrypted file</li>
            <li>
              Click on decrypt file button and decrypted file will be saved on
              your machine
            </li>
          </ol>
        </li>
      </ul>
      <h3 style={{ marginBottom: "32px" }}>
        {`Note : Don't refresh browser because initializaton vector value is
        stored temporarily, also after decrypting file remember to give correct
        file extension while saving file.`}
      </h3>
      <div style={{ marginBottom: "25px" }}>
        <label htmlFor="passwordInput">
          Enter password for encryption / decryption :
        </label>
        <input
          id="passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="fileStagingContainer">
        <label className="fileUploadBtn" htmlFor="fileInput">
          Add File
        </label>
        <input id="fileInput" type="file" onChange={(e) => handleChange(e)} />
        {currentFile ? (
          <div className="fileInfoContainer">
            <h3>File Info :</h3>
            <div>{`Name: ` + currentFile.name}</div>
            <div>{`Size: ` + currentFile.size}</div>
            <div>{`Type: ` + currentFile.type}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div style={{ marginTop: "25px" }}>
        <button
          className="encryptFileBtn"
          onClick={() => startEncryption(currentFile, password, setIv)}
        >
          Start Encryption
        </button>
        <button
          className="decryptFileBtn"
          onClick={() => startDecryption(currentFile, password, iv)}
        >
          Start Decryption
        </button>
      </div>
    </div>
  );
};
