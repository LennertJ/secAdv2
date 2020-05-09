const sendMessage = document.querySelector('.chatbox1')
sendMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = sendMessage.querySelector('#textarea1').value;
  const receiver = sendMessage.querySelector('#receiver').value;
  const sender = document.getElementById('name').innerHTML;
  const time =  Date.now();
  console.log("[" + time + "] " + sender  + ": " + message + " to: " + receiver)
  post('/message', { message,sender,receiver,time })
})

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
