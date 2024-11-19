import os
import json
import google.generativeai as genai
from PIL import Image

# Get the working directory and load the configuration file
working_directory = os.path.dirname(os.path.realpath(__file__))
config_file_path = f"{working_directory}/config.json"

# Load the configuration data
with open(config_file_path) as config_file:
    config_data = json.load(config_file)

# Extract the API key
GOOGLE_API_KEY = config_data["GOOGLE_API_KEY"]

# Configure the genai library with the API key
genai.configure(api_key=GOOGLE_API_KEY)

# Function to load the Gemini Pro model
def load_gemini_pro_model():
    try:
        gemini_pro_model = genai.GenerativeModel("gemini-pro")
        return gemini_pro_model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Function for vision-related responses
def gemini_pro_vision_response(prompt, image):
    try:
        model = genai.GenerativeModel('gemini-pro-vision')
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        print(f"Error in vision response: {e}")
        return "Sorry, I couldn't process that image."