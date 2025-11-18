const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('input_image');
const preview = document.getElementById('selectedImage');
const resultDiv = document.getElementById('result');
const welcomeMessage = document.getElementById("welcome");
const inputElement=document.getElementById('openChat');


function checkImageSize(){
    const fileInput=document.getElementById("input_image");
    const fileSizeError=document.getElementById("fileSizeError");
    const maxSizeInBytes=5*1024*1024;
    if(fileInput.files.length>0){
        const file=fileInput.files[0];
        if(file.size>maxSizeInBytes){
            fileSizeError.textContent="File size exceeded the limit (5MB)";
            fileInput.value="";
            return false;
        }
        else{
            fileSizeError.textContent="File has been successfully uploaded.";
            const imageInput = document.getElementById('input_image');
            let imageDisplay = document.getElementById('selectedImage');

            fileSizeError.textContent = "File has been successfully uploaded.";

            // Revoke previous object URL to avoid memory leaks
            if (imageDisplay.dataset.url) {
                URL.revokeObjectURL(imageDisplay.dataset.url);
            }
    
            // Create a new blob URL and set it as src
            const objectUrl = URL.createObjectURL(file);
            imageDisplay.src = objectUrl;
    
            // Store the current URL so it can be revoked next time
            imageDisplay.dataset.url = objectUrl;
        }
    }
}
let input = document.getElementById("openChat");
  const button = document.getElementById("chatSubmit");

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action (e.g., form submission)
      button.click();
      input.value=""
    }
  });



const chatInput = 
    document.querySelector('.chat-input input');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = 
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    // ✅ Call your Flask backend instead of OpenAI directly
    fetch("/api/openai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: userMessage   // send what the user typed
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            messageElement.classList.add("error");
            messageElement.textContent = "Error: " + data.error;
        } else {
            // 🧠 `data.response` will come from Flask
            messageElement.textContent = data.response;
        }
    })
    .catch((error) => {
        console.error(error);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again!";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

 


const handleChat = () => {
    userMessage = chatInput.value.trim();
    
    if (!userMessage) {
        return;
    }
    chatbox
    .appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox
    .scrollTo(0, chatbox.scrollHeight);

   

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);





// Preview the image when selected
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    resultDiv.textContent = '';
  }
});

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  const file = fileInput.files[0];
  if (!file) {
    alert('Please select an image.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  resultDiv.textContent = 'Predicting...';

  fetch('/predict', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
   
    if (data.error) {
      resultDiv.textContent = `Error: ${data.error}`;
    } else {
      
      
      resultDiv.textContent= `We believe that you have ${data.prediction} Hairloss with ${(data.confidence * 100).toFixed(2)}% Confidence.`;
      const texttoType=`Ok, could you please suggest me a treatment for ${data.prediction} Hairloss?`;
      let charIndex=0;
      let speed=100;
      inputElement.value='';
      function typewriter(){
        if(charIndex<texttoType.length){
          inputElement.value+=texttoType.charAt(charIndex);
          charIndex++;
          setTimeout(typewriter,speed);
        }
      }
      if(data.prediction!='Stage 0')
      {
      setTimeout(typewriter,3000);
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.textContent = 'An error occurred while predicting.';
  });
  if (welcomeMessage && welcomeMessage.style.display === "none") {
    welcomeMessage.style.display = "block";
  }
});