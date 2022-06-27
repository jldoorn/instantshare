import logo from './logo.svg';
// import './App.css';
import File from './components/File';
import Dashboard from './components/Dashboard';
import { Component } from 'react';
import axios from 'axios';
import Api from './Api';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      boardIdEntry: ""
    };
    this.onNewBoard = this.onNewBoard.bind(this);
    this.onDeleteBoard = this.onDeleteBoard.bind(this);
    this.handleManualEntry = this.handleManualEntry.bind(this);
  }

  onNewBoard() {
    Api.post("/board").then((res) => {
      console.log(res.data);
      this.setState({board: res.data});
    });
  };

  
  onDeleteBoard() {
    Api.delete(`/board/${this.state.board.id}`).then((res)=> {
      this.setState({board: null, files: [], boardIdEntry: ""})
    })
  }

  handleManualEntry(event) {
    event.preventDefault();
    if (this.state.boardIdEntry.length == 0) {
      alert('enter an id')
      return
    }
    Api.get(`/board/${this.state.boardIdEntry}`).then((res) => {
      if (res.status < 400) {
        this.setState({board: {id: this.state.boardIdEntry}})
      } else {
        alert("no board found with that id")
      }
    }).catch(() => {alert("no board found with that id")})
    
  }

  render() {
    return (
    <div className="App">
      <Container>
        {!this.state.board && <Button variant="primary" onClick={this.onNewBoard}>New Board</Button>}
        {!this.state.board && 
          <Form onSubmit={this.handleManualEntry}>
          <Form.Group className="mb-3" controlId="formBoardID">
            <Form.Label>Board ID</Form.Label>
            <Form.Control type="text" value={this.state.boardIdEntry} onChange={(e) => this.setState({boardIdEntry: e.target.value})} placeholder="Board ID" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        }
        {this.state.board && <Button variant="primary" onClick={this.onDeleteBoard}>Delete Board</Button>}
        {this.state.board && <Dashboard obj={this.state.board} destroy={() => {this.setState({board: null, files: []})}} files={this.state.files}/> }
      </Container>
      <ToastContainer />
    </div>
  );
    }
}

export default App;
