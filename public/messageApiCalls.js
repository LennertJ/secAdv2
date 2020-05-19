const sendMessage = document.querySelector('.chatbox1')
sendMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = sendMessage.querySelector('#textarea1').value;
  const receiver = sendMessage.querySelector('#receiver').value;
  const sender = document.getElementById('name').innerHTML;
  const time =  Date.now();
  //console.log("[" + time + "] " + sender  + ": " + message + " to: " + receiver)
  post('/message', { message,sender,receiver,time })

})

function loadContacts(){
  let sender = document.getElementById('name').innerHTML;
  return getContacts('/message/sender/'+ sender, { sender });
}

function getAdapter(){
  let sender = document.getElementById('name').innerHTML;
  document.getElementById('messagebox').innerHTML ="";
  var e = document.getElementById("receiver");
  var receiver = e.options[e.selectedIndex].value;
  return get('/message/sender/' + sender + '/receiver/' + receiver, { sender,receiver})
}

function post (path, data) {
  console.log(data);
    return window.fetch(path, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
}

function getContacts(path,{sender}){
  return window.fetch(path, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => displayContacts(data));
}

function get(path){
  return window.fetch(path, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })  
  .then(response => response.json())
  .then(data => display(data));
}

function displayContacts(contacts){
  var e = document.getElementById("receiver");
  console.log(e);
  var catOptions = '<select id="receiver" name="" onchange="getAdapter()">';

  for(let i = 0; i<contacts.body.length; i++){
    
    catOptions += '<option value="' + JSON.parse( contacts.body[i]).username  + '">' + JSON.parse(contacts.body[i]).username + "</option>";
  }
  catOptions += "</select>"
  e.innerHTML = catOptions;
}

function display(data){
  for (let i = 0; i < data.body.length; i++) {
    if(JSON.parse(data.body[i]).sender = document.getElementById('name').innerHTML){
      displayMessageOrigin(JSON.parse(data.body[i]).Message);
    }else{
      displayMessageReceiver(JSON.parse(data.body[i]).Message,1);
    }
  }
}