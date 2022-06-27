import { type } from "@testing-library/user-event/dist/type";
import React, { useRef } from "react";
import { Button, Card, CloseButton, Toast } from "react-bootstrap";
import { toast } from "react-toastify";
import Api from "../Api";

function File(props) {

    const deleteFile = () => {
        props.onDelete(props.obj.id)
    }

    const downloadFile = () => {
        let toastId = null
        Api.get(`/board/${props.boardid}/files/${props.obj.id}`, {
            responseType: 'blob',
            onClick: {},
            onDownloadProgress: (evt) => {
                const progress = evt.loaded / evt.total
                if (toastId === null) {
                    toastId = toast("Downloading", {progress})
                } else {
                    toast.update(toastId, {progress})
                }

            }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', props.obj.name)
            document.body.appendChild(link);
            link.click();
            toast.done(toastId)
            // toast.update(toastId, {autoClose: 1000})
        }) 
    }

    return (
        <div>
        <Card>
                <Card.Header>
                    <CloseButton onClick={deleteFile}/>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{props.obj.name}</Card.Title>
                    <Card.Text>{props.obj.id}</Card.Text>
                    <Button variant="primary" onClick={downloadFile}>Download</Button>
                </Card.Body>
            </Card>
            
            </div>
    );

}

export default File;