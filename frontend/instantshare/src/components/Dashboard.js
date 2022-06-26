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
              ],
            socket: null
        }

        console.log("constructing")
        this.deleteFile = this.deleteFile.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.onOpen = this.onOpen.bind(this)
        this.onOpen()
        // let ws = new WebSocket(`ws://localhost:5000/board/${this.props.obj.id}/subscribe`)
        // ws.onmessage = (msg) => {
        //     let data = JSON.parse(msg.data)
        //     if (data.status == 0) {
        //         // file uploaded
        //         console.log(data)
        //         this.setState({files: this.state.files.push(data.payload)})
        //     } else if (data.status == 1) {
        //         // file deleted
        //         this.deleteFile(data.payload)
        //     }
        // }

        
    }

    onOpen() {
        const ws = new WebSocket(`ws://localhost:5000/board/${this.props.obj.id}/subscribe`)
        ws.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            if (data.status == 0) {
                // file uploaded
                console.log(data)
                this.onRefresh()
            } else if (data.status == 1) {
                // file deleted
                // this.deleteFile(data.payload)
                const newFiles = this.state.files.filter(obj => obj.id !== data.payload)

                this.setState({
                    files: newFiles
                })
                console.log(data)
            } else if (data.status == 2) {
                this.props.destroy()
            }
        }
        this.setState({socket: ws})
        this.onRefresh()
    }

    onRefresh() {
        Api.get(`/board/${this.props.obj.id}/files`).then((res) => {
          this.setState({files: res.data})
        })
    
      }

    deleteFile(id) {
        Api.delete(`/board/${this.props.obj.id}/files/${id}`)
            .then((res) => {
                
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