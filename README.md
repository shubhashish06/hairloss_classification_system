🧬 Hair Loss Detection & AI Chat Assistant

A full-stack web application that predicts hair-loss stage from an uploaded image using a trained ML model and provides personalized treatment suggestions using an AI chat assistant powered by OpenAI — with secure backend integration (no API key in frontend).

🚀 Features

🔍 Hair Loss Detection
	•	Upload an image (up to 5MB)
	•	Model predicts hair-loss stage
	•	Returns stage + confidence score
	•	Automatically generates a follow-up question for the chat assistant

🤖 AI Chat Assistant
	•	OpenAI-powered chatbot (via Flask backend)
	•	No secret keys exposed in frontend
	•	Helps the user with hair-loss treatments, recommendations, and general guidance
	•	Smooth “thinking…” animation + chat bubbles UI

⚙️ Tech Stack
	•	Frontend: HTML + CSS + JavaScript
	•	Backend: Flask, Python
	•	Model: Custom trained classifier
	•	Cloud/AI: OpenAI API (via backend)
	•	Security: Environment variables, no keys in JS
	•	Other: CORS, Fetch API, File Validation


 📂 Project Structure

 project/
│
├── backend/
│   ├── app.py
│   ├── model.pkl
│   ├── requirements.txt
│   └── .env               # contains OPENAI_API_KEY (not committed)
│
├── static/
│   ├── script.js
│   ├── styles.css
│   └── assets/
│        └── icons, images
│
├── templates/
│   └── index.html
│
└── README.md


🛠️ Installation & Setup

1️⃣ Clone the repository
https://github.com/shubhashish06/hairloss_classification_system.git


🧩 Backend Setup (Flask + Model + OpenAI)

2️⃣ Create and activate virtual environment

cd backend
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows


3️⃣ Install backend dependencies
pip install -r requirements.txt


4️⃣ Add your OpenAI API Key securely

Create .env inside the backend/ folder & add the following code:

(OPENAI_API_KEY=your_openai_key_here)


Make sure .env is added to .gitignore.

5️⃣ Run the backend server
python app.py


Server runs at: http://localhost:5000


🔐 Security Notes

✔ No API keys stored in frontend
✔ .env included in .gitignore
✔ GitHub push-protection compliant
✔ All AI calls routed through Flask backend
✔ No CORS issues


🎯 Future Improvements
	•	Deploy backend on Render / Railway
	•	Deploy frontend using GitHub Pages / Netlify
	•	Add more advanced UI for chat
	•	Improve ML model with larger dataset
	•	Add treatment comparison charts
	•	Add user login + history tracking


💡 Contributing

Pull requests are welcome!
For major changes, open an issue first to discuss what you’d like to modify.



📄 License

This project is open-source and available under the MIT License.
