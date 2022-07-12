
import axios from "axios";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

function Uploader(props) {
    const api = axios.create({
        baseURL: "http://localhost:5000"
    })
    const onDrop = useCallback(acceptedFiles => {
        let toastId = null
        console.log(acceptedFiles);
        acceptedFiles.forEach(file => {
            api.postForm(`/board/${props.boardid}/files`, {
                'upload': file,
            }, {
                onUploadProgress: (evt) => {
                    const progress = evt.loaded / evt.total
                if (toastId === null) {
                    toastId = toast("Uploading", {progress})
                } else {
                    toast.update(toastId, {progress})
                }
                }
            }).then(() => {toast.done(toastId)});
        });
    }, [api, props.boardid]);
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