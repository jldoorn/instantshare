
import axios from "axios";
import React, { Component, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Uploader() {
    const api = axios.create({
        baseURL: "http://localhost:5000"
    })
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles);
        acceptedFiles.forEach(file => {
            api.postForm("/board/sjxvup/files", {
                'upload': file
            });
        });
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop files here</p> :
                    <p>Drag and drop files here or click to select</p>
            }
        </div>
    )
}
export default Uploader;