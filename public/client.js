const socket = io()

let username;

let textarea = document.querySelector('#textarea')

let messageArea = document.querySelector('.message__area')


do {
    username = prompt('Please enter your name: ')
}while(!username)

socket.emit("new-user-joined", username)

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
})

function userJoinLeft(usr,status){
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${usr}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    messageArea.appendChild(div);
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
})
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
        user: username,
        message: message.trim(),
    }

    //append
    appendMessage(msg,'outgoing')
    textarea.value = ''
    scrollToBottom()

    //send to server
    socket.emit('message',msg)
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')

    let className = type

    mainDiv.classList.add(className,'message')

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup

    messageArea.appendChild(mainDiv)
}

//Receive
socket.on('message',(msg) => {
    appendMessage(msg,'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}