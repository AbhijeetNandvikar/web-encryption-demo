import * as FileSaver from "file-saver";

export const getKey = (value) => {
  return window.crypto.subtle.importKey("raw", value, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const formatBytes = (bytes) => {
  var marker = 1024; // Change to 1000 if required
  var decimal = 3; // Change as required
  var kiloBytes = marker; // One Kilobyte is 1024 bytes
  var megaBytes = marker * marker; // One MB is 1024 KB
  var gigaBytes = marker * marker * marker; // One GB is 1024 MB

  // return bytes if less than a KB
  if (bytes < kiloBytes) return bytes + " Bytes";
  // return KB if less than a MB
  else if (bytes < megaBytes)
    return (bytes / kiloBytes).toFixed(decimal) + " KB";
  // return MB if less than a GB
  else if (bytes < gigaBytes)
    return (bytes / megaBytes).toFixed(decimal) + " MB";
  // return GB if less than a TB
  else return (bytes / gigaBytes).toFixed(decimal) + " GB";
};

export const encryptFile = async (key, iv, file) => {
  return await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    file
  );
};

// get the iv which is similar the salt value used for encryption
export const getiv = () => {
  return window.crypto.getRandomValues(new Uint8Array(12));
};

// load the file in the memory
export const getFile = async (inputFile) => {
  return await inputFile.arrayBuffer();
};

export const decryptFile = (key, iv, cipherText) => {
  return window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    cipherText
  );
};

export const getDigest = (uid) => {
  let enc = new TextEncoder();
  return crypto.subtle.digest("SHA-256", enc.encode(uid));
};

export const startEncryption = (file, password, setIv) => {
  console.log(file, password);
  let digest = getDigest(password);
  let rawFile = getFile(file);
  let iv = getiv();
  Promise.all([digest, iv, rawFile]).then((values) => {
    setIv(iv);
    console.log(values);
    // generate a crypto key
    getKey(values[0]).then((resp) => {
      encryptFile(resp, values[1], values[2]).then((cipherText) => {
        let fileBlob = new Blob([cipherText], { type: file.type });
        FileSaver.saveAs(fileBlob, file.name);
      });
    });
  });
};

export const startDecryption = (cipherText, password, iv) => {
  let digest = getDigest(password);
  let rawFile = getFile(cipherText);
  // let iv = getiv();
  Promise.all([digest, "", rawFile]).then((values) => {
    // generate a crypto key
    getKey(values[0]).then((resp) => {
      decryptFile(resp, iv, values[2]).then((file) => {
        console.log(file);
        let fileBlob = new Blob([file], { type: file.type });
        FileSaver.saveAs(fileBlob, file.name);
      });
    });
  });
};
