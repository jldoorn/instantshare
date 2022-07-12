import { Input } from "@geist-ui/core";
import {React, useState} from "react";
import Api from "../Api";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Form, InputGroup, FormControl} from "react-bootstrap";

function onNewBoard(nav) {
    Api.post("/board").then((res) => {
      console.log(res.data);
      nav(`/board/${res.data.id}`)
    });
  };


function Home(props) {
    const nav = useNavigate();
    const [boardIdValue, setBoardIdValue] = useState("");

    function handleSubmit(evt) {
        evt.preventDefault();
        nav(`/board/${boardIdValue}`)
    }
    return (
        // <Container >

        //     <h1>Home page</h1>
        // </Container>
        

        <Container>
            <h1>Instantshare</h1>
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => {onNewBoard(nav)}}>Create Board</Button>
                </Col>
            </Row>
            <Row>
            <Col>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="join-entry-addon">
                            http://instantshare.doorn.us/board/
                            </InputGroup.Text>
                            <FormControl id="join-entry" aria-describedby="join-entry-addon" value={boardIdValue} onChange={(evt) => {setBoardIdValue(evt.target.value)}} />
                        </InputGroup>
                        <Button type="submit">Join Board</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
           
    )
}

export default Home;