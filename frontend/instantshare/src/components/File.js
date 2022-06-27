import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import { Button, Card, CloseButton } from "react-bootstrap";
import { toast } from "react-toastify";
import Api from "../Api";

function File(props) {

    const deleteFile = () => {
        props.onDelete(props.obj.id)
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
                    <Button variant="primary" download="downloaded" href={`http://localhost:5000/board/${props.boardid}/files/${props.obj.id}`}>Download</Button>
                </Card.Body>
            </Card>
            
            </div>
    );

}

export default File;