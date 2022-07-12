import { withScale } from '@geist-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Container, Button } from "react-bootstrap";
import Api from "../Api";
import File from "./File";
import Uploader from "./Uploader"

function Dashboard(props) {

    const [files, setFiles] = useState([]);

    const onRefresh = () => {
        Api.get(`/board/${props.obj.id}/files`).then((res) => {
          setFiles(res.data)
        })
    
      }

      const deleteFile = (id) => {
        Api.delete(`/board/${props.obj.id}/files/${id}`)
            .then((res) => {
                
            })
    }

    const onMessage = (msg) => {
        let data = JSON.parse(msg.data)
        if (data.status === 0) {
            // file uploaded
            onRefresh()
        } else if (data.status === 1) {
            // file deleted
            const newFiles = files.filter(obj => obj.id !== data.payload)

            setFiles(newFiles)
        } else if (data.status === 2) {
            props.destroy()
        }
    }


    // const [socket, setSocket] = useState(null)
    const ws = useRef(null);
    
    useEffect(() => {

        ws.current = new WebSocket(`ws://localhost:5000/board/${props.obj.id}/subscribe`)
        
        console.log('setting socket');
        const wsCurrent = ws.current;
        onRefresh();
        return () => {wsCurrent.close()}
        
    }, [])

    useEffect(() => {
        ws.current.onmessage = onMessage
    }, [onMessage])

    return (
        <Container>

            <Button variant="primary" onClick={props.onDeleteBoard}>Delete Board</Button>
            <Button variant="secondary" onClick={onRefresh}>Refresh</Button>
            <h1>{props.obj.name}</h1>
            <p>Link: {window.location.href}</p>
            <Container>
                <Uploader boardid={props.obj.id}></Uploader>
            </Container>
            
            <Row xs={1} md={2} lg={3} className="g-4">
            {files.map((file) => {
                return <Col><File key={file.id} onDelete={deleteFile} obj={file} boardid={props.obj.id}></File></Col>
            })}
            </Row>
            
            
            
        </Container>
    );
}

export default Dashboard;