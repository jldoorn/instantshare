
import React, { useEffect, useState } from "react";

import Dashboard from '../components/Dashboard'
import Api from '../Api'
import { Button, Container } from 'react-bootstrap';
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from "react-router-dom";


function Board() {
    const params = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);

    useEffect( () => {
      Api.get(`/board/${params.boardId}`).then((res) => {
            if (res.status < 400) {
              setBoard(res.data)
            } else {
              alert("no board found with that id")
            }
      }).catch(() => {alert("no board found with that id"); navigate("/")})
    }, [params.boardId, navigate])
    
    const onDeleteBoard = () => {
        Api.delete(`/board/${board.id}`).then((res)=> {
          setBoard(null)
          navigate("/")
        })
      }

    const onBoardDestroyed = () => {
      setBoard(null)
      alert("board deleted")
      navigate("/")
    }

      return (
        <div className="App">
          <Container>
            {board && <Dashboard obj={board} onDeleteBoard={onDeleteBoard} destroy={onBoardDestroyed}/> }
          </Container>
          <ToastContainer />
        </div>
      );

}

export default Board;
