import React from "react";
import { Button, Card, CloseButton } from "react-bootstrap";
import Api from "../Api";

class File extends React.Component {

    constructor(props) {
        super(props);
        this.deleteFile = this.deleteFile.bind(this)
    }
    deleteFile() {
        this.props.onDelete(this.props.obj.id)
    }
    render() {
        return (
            <Card>
                <Card.Header>
                    <CloseButton onClick={this.deleteFile}/>
                </Card.Header>
                <Card.Body>
                    <Card.Title>File</Card.Title>
                    <Card.Text>{this.props.obj.name} {this.props.obj.id}</Card.Text>
                    <Button variant="primary" href={`http://localhost:5000/board/${this.props.boardid}/files/${this.props.obj.id}`}>Download</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default File;