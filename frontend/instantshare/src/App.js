import logo from './logo.svg';
// import './App.css';
import File from './components/File';
import Dashboard from './components/Dashboard';
import { Component } from 'react';
import axios from 'axios';
import Api from './Api';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      board: null,
    };
    this.onNewBoard = this.onNewBoard.bind(this);
    this.onDeleteBoard = this.onDeleteBoard.bind(this);
  }

  onNewBoard() {
    Api.post("/board").then((res) => {
      console.log(res.data);
      this.setState({board: res.data});
    });
  };

  
  onDeleteBoard() {
    Api.delete(`/board/${this.state.board.id}`).then((res)=> {
      this.setState({board: null, files: []})
    })
  }

  render() {
    return (
    <div className="App">
      <Container>
        {!this.state.board && <Button variant="primary" onClick={this.onNewBoard}>New Board</Button>}
        {!this.state.board && 
          <Form>
          <Form.Group className="mb-3" controlId="formBoardID">
            <Form.Label>Board ID</Form.Label>
            <Form.Control type="text" placeholder="Board ID" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        }
        {this.state.board && <Button variant="primary" onClick={this.onDeleteBoard}>Delete Board</Button>}
        {this.state.board && <Dashboard obj={this.state.board} files={this.state.files}/> }
      </Container>
      
    </div>
  );
    }
}

export default App;
