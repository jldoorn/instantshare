import { Input } from "@geist-ui/core";
import React from "react";
import Api from "../Api";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col, Form, InputGroup, FormControl} from "react-bootstrap";

function onNewBoard() {
    Api.post("/board").then((res) => {
      console.log(res.data);
    });
  };


function Home(props) {

    return (
        // <Container >

        //     <h1>Home page</h1>
        // </Container>

        <Container>
            <h1>Instantshare</h1>
            <Row>
                <Col>
                    <Button variant="primary" onClick={onNewBoard}>Create Board</Button>
                </Col>
            </Row>
            <Row>
            <Col>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="join-entry-addon">
                            http://instantshare.doorn.us/board/
                            </InputGroup.Text>
                            <FormControl id="join-entry" aria-describedby="join-entry-addon" />
                        </InputGroup>
                        <Button type="submit">Join Board</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
           
    )
}

export default Home;