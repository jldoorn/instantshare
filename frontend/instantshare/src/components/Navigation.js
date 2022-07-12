import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

function Navigation(props) {
    return ( 
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>Instantshare</Navbar.Brand>
            </Container>
        </Navbar>
     );
}

export default Navigation;