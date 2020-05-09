let imagecounter = 0;
let cachedImage = "";

{//send
function ChatBoxMessage(fromId, toId){//main
    //display message
    let message = document.getElementById('textarea' + fromId).value;
    if(message == ""){return};
    displayMessageOrigin(fromId ,message);
    document.getElementById('textarea' + fromId).value="";
    // encript message
    let hashedMessage = hashcode(message);
    
    let encriptedMessage = encryptWithAes( message,sharedAESKey);

    //send encypted message
    chatboxReceiveMessage(toId, encriptedMessage , hashedMessage );
}

function UploadMessage(fromId, toId){
    //display message 
    let filename = document.getElementById("fileUpload" + fromId).value;
    if(filename == ""){return};
    displayImageOrigin(fromId);
    // encript message
    let hashedMessage = hashcode(filename);

    if (fromId == 1){ 
        senderKey = privateKeyBob; //A
        receiverkey = askPrivateKey(fromId); //BG
    }
    else if(fromId == 2) {
        senderKey = privateKeyAlice; //B
        receiverkey = askPrivateKey(fromId); //AG
    }
    if(receiverkey == null || senderKey == null ){console.log("error while ecrypting, unknown ID");return;}

    let sharedAESKey = generateAESKey(senderKey, receiverkey); //generateAESKey(A or B, AG or BG);

    let encriptedFilename = encryptWithAes( filename,sharedAESKey);

    //send message
    chatboxReceiveImage(toId,encriptedFilename, hashedMessage );
    imagecounter++;
    document.getElementById("fileUpload" + fromId).value = "";
    cachedImage = "";
}
}

{//recieve
function chatboxReceiveMessage(hashedMessage) {
    //✔ hash
    let hash = "another error occured"
    if(hashcode(message) == hashedMessage){
        hash = "hash matches, message received correctly (" + hashedMessage + ")"; 
    }else{
        hash = "hash doesn't match, expected hashvalue not met (" + hashedMessage + ")"; 
    }

    //display decrypted message
    displayMessageReceiver(message, hash);
}

function chatboxReceiveImage( hashedMessage) {
    //decrypt message

    //hash
    let hash = "another error occured"
    if(hashcode(filename) == hashedMessage){
        hash = "hash matches, message received correctly (" + hashedMessage + ")"; 
    }else{
        hash = "hash doesn't match, expected hashvalue not met (" + hashedMessage + ")"; 
    }

    //display decrypted message
    displayImageReceiver(hash);
}
}

{//displays 
function displayMessageOrigin( message) {
    let messagefield = document.createElement("Div");
    messagefield.className += "container";
    let messageParagraph = document.createElement("P");
    messageParagraph.innerHTML = message;
    messagefield.appendChild(messageParagraph);
    document.getElementById("chatbox1").appendChild(messagefield);
}

function displayImageOrigin() {
    let messagefield = document.createElement("Div");
    messagefield.className += "container";
    let messageImage = document.createElement("img");
    messageImage.id = "image" + imagecounter;
    messageImage.src = cachedImage;
    messagefield.appendChild(messageImage);
    document.getElementById("chatbox1").appendChild(messagefield);
}

function displayMessageReceiver(message, hash) {
    let messagefield = document.createElement("Div");
    messagefield.className += "container darker";
    let messageParagraph = document.createElement("P");
    messageParagraph.innerHTML = message;
    let hashcheck = document.createElement("P");
    hashcheck.innerHTML = hash;
    messagefield.appendChild(hashcheck);
    messagefield.appendChild(messageParagraph);
    document.getElementById("chatbox1").appendChild(messagefield);
}

function displayImageReceiver(hash) {
    let messagefield = document.createElement("Div");
    messagefield.className += "container darker";
    let messageImage = document.createElement("img");
    messageImage.id = "image" + imagecounter;
    messageImage.src = cachedImage;
    let hashcheck = document.createElement("P");
    hashcheck.innerHTML = hash;
    messagefield.appendChild(hashcheck);
    messagefield.appendChild(messageImage);
    document.getElementById("chatbox1").appendChild(messagefield);
}
}

{//helpers
var loadFile = function(event) {
    cachedImage = URL.createObjectURL(event.target.files[0]);
    };

function hashcode(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    }
}

function loadName(){
    let name = window.location.search.split('=')[1];
    document.getElementById('name').innerHTML = name;
}