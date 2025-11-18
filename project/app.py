from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from keras.utils import load_img, img_to_array
import os
from PIL import Image
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Load model with basic parameters
model = tf.keras.models.load_model("model.h5", compile=False)

class_names=["Stage 0","Stage 1","Stage 2"]

def preprocessing_image(img_path,target_size=(224,224)):
    img=load_img(img_path,target_size=target_size)
    img_array=img_to_array(img)
    img_array=np.expand_dims(img_array,axis=0)
    img_array=img_array/255
    return img_array

@app.route("/")
def index():
    return render_template("index.html")
@app.route('/predict',methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({'error':'No file part'}),400
    file=request.files['file']
    
    if file.filename=='':
        return jsonify({'error':'No selected file'}),400
    
    if file:
        try:
            filepath=os.path.join('temp',file.filename)
            file.save(filepath)

            processed_img=preprocessing_image(filepath)
            predictions=model.predict(processed_img)
            predicted_class_index=np.argmax(predictions)
            predicted_class=class_names[predicted_class_index]

            confidence=float(np.max(predictions[0]))

            os.remove(filepath)

            return jsonify({
                'prediction':predicted_class,
                'confidence':confidence
            })
        except Exception as e:
            return jsonify({'error':str(e)}),500
        

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/api/openai", methods=["POST"])
def call_openai():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        # Simple text response using Responses API
        response = client.responses.create(
            model="gpt-5.1-mini",  # or another model you prefer
            input=prompt,
        )

        # The Python client gives a helper to get the final text
        output_text = response.output_text

        return jsonify({"response": output_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    if not os.path.exists('temp'):
        os.makedirs('temp')
    app.run(host="0.0.0.0",port=8000)


