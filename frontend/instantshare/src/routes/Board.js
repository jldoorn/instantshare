
import React, { useEffect, useState } from "react";

// import './App.css';
import Dashboard from '../components/Dashboard';
import { Component } from 'react';
import Api from '../Api'
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

// class Board extends Component{
//   constructor(props) {
//     super(useParams());
//     this.state = {
//       board: null,
//       boardIdEntry: props.boardId
//     };
//     this.onDeleteBoard = this.onDeleteBoard.bind(this);
//   }

//   componentDidMount() {
//     Api.get(`/board/${this.state.boardIdEntry}`).then((res) => {
//         if (res.status < 400) {
//           this.setState({board: {id: this.state.boardIdEntry}})
//         } else {
//           alert("no board found with that id")
//         }
//       }).catch(() => {alert("no board found with that id")})
//   }

//   onDeleteBoard() {
//     Api.delete(`/board/${this.state.board.id}`).then((res)=> {
//       this.setState({board: null, files: [], boardIdEntry: ""})
//     })
//   }

//   render() {
//     return (
//     <div className="App">
//       <Container>
//         {this.state.board && <Button variant="primary" onClick={this.onDeleteBoard}>Delete Board</Button>}
//         {this.state.board && <Dashboard obj={this.state.board} destroy={() => {this.setState({board: null})}}/> }
//       </Container>
//       <ToastContainer />
//     </div>
//   );
//     }
// }

function Board() {
    const params = useParams();
    const [board, setBoard] = useState(null);
    const [boardIdEntry, setBoardIdEntry] = useState(params.boardId)

    useState(Api.get(`/board/${boardIdEntry}`).then((res) => {
        if (res.status < 400) {
          setBoard(res.data)
        } else {
          alert("no board found with that id")
        }
      }), [boardIdEntry])
    
    const onDeleteBoard = () => {
        Api.delete(`/board/${board.id}`).then((res)=> {
          setBoard(null)
        })
      }

      return (
        <div className="App">
          <Container>
            {board && <Button variant="primary" onClick={onDeleteBoard}>Delete Board</Button>}
            {board && <Dashboard obj={board} destroy={() => {setBoard(null)}}/> }
          </Container>
          <ToastContainer />
        </div>
      );

}

export default Board;
