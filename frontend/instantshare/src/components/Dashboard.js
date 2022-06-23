import React from "react";
import { Col, Row, Container, Button } from "react-bootstrap";
import Api from "../Api";
import File from "./File";
import Uploader from "./Uploader"
class Dashboard extends React.Component {
constructor(props) {
        super(props);
        this.state = {
            files: [
                // {id: '1', name: 'test1'},
                // {id: '2', name: 'test2'},
                // {id: '3', name: 'test3'},
              ]
        }

        this.deleteFile = this.deleteFile.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
    }

    onRefresh() {
        Api.get(`/board/${this.props.obj.id}/files`).then((res) => {
          this.setState({files: res.data})
        })
    
      }

    deleteFile(id) {
        Api.delete(`/board/${this.props.obj.id}/files/${id}`)
            .then((res) => {
                const newFiles = this.state.files.filter(obj => obj.id !== id)

                this.setState({
                    files: newFiles
                })
            })
    }

    render() {
        return (
            <Container>
                <Button variant="secondary" onClick={this.onRefresh}>Refresh</Button>
                <h1>{this.props.obj.name}</h1>
                <p>Link: {window.location.href}board/{this.props.obj.id}</p>
                <Container>
                    <Uploader boardid={this.props.obj.id}></Uploader>
                </Container>
                <Row xs={1} md={2} lg={3} className="g-4">
                {this.state.files.map((file) => {
                    return <Col><File key={file.id} onDelete={this.deleteFile} obj={file} boardid={this.props.obj.id}></File></Col>
                })}
                </Row>
                
                
            </Container>
        );
    }
}

export default Dashboard;