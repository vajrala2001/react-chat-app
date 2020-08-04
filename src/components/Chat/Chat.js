import React , {useState,useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import Grid from '@material-ui/core/Grid'
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

import './Chat.css'
let socket

const Chat = ({location}) => {
    const [name,setName] = useState('')
    const [room,setRoom] = useState('')
    const [users, setUsers] = useState('');
    const [message,setMessage] = useState('')
    const [messages,setMessages] = useState([])
    const ENDPOINT = 'https://chat-app-react-nodejs.herokuapp.com/'
    useEffect(() => {
        const {name,room} = queryString.parse(location.search)

        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)
        socket.emit('join',{name,room},(error) => {
            if(error) return error
        })
    },[ENDPOINT,location.search]) 

    useEffect(() => {
        socket.on('message',(message) => {
            setMessages([...messages,message])
        })
    },[messages])

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);
  

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault()
        if(message){
            socket.emit('sendMessage',message,() => setMessage(''))
        }
    }
    return(
        <div className="outerContainer">
            <Grid container spacing = {0} justify = "center">
                <Grid item xs = {12} md = {6}>
                    <div className="container">
                        <InfoBar room={room}/>
                        <Messages messages = {messages} name = {name}/>
                        <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage}/>
                    </div>
                </Grid>
                <Grid item xs = {12} md = {6}>
                    <div className="container1">
                        <TextContainer users={users}/>
                    </div>
                </Grid>
            </Grid>     
        </div>
    )
}
    
export default Chat;