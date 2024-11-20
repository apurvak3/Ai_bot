import os
from PIL import Image
import streamlit as st
from streamlit_option_menu import option_menu
from gemini_utility import load_gemini_pro_model, gemini_pro_vision_response

# Configure the page
st.set_page_config(
    page_title="Gemini AI",
    page_icon="🧠",
    layout="centered",
)

# Add custom CSS for styling if needed
st.markdown("""
    <style>
    .stApp {
        max-width: 1200px;
        margin: 0 auto;
    }
    </style>
    """, unsafe_allow_html=True)

# Sidebar menu
with st.sidebar:
    selected = option_menu(
        "Gemini AI",
        options=["ChatBot", "Image Captioning", "Embed Text", "Ask Me Anything"],
        menu_icon='robot',
        icons=['chat-dot-fill', 'image-fill', 'image-fill', 'patch-question-fill'],
        default_index=0
    )


# Function to translate user role for Streamlit
def translate_role_for_streamlit(user_role):
    return "assistant" if user_role == 'model' else user_role


# Initialize session state for chat history if it doesn't exist
if 'chat_session' not in st.session_state:
    st.session_state.chat_session = None

# ChatBot Section
if selected == "ChatBot":
    st.title("💬 ChatBot")

    # Load the model
    if st.session_state.chat_session is None:
        model = load_gemini_pro_model()
        if model:
            st.session_state.chat_session = model.start_chat(history=[])
        else:
            st.error("Failed to load the Gemini Pro model. Please check your API key and configuration.")
            st.stop()

    # Display chat messages
    if st.session_state.chat_session:
        for message in st.session_state.chat_session.history:
            with st.chat_message(translate_role_for_streamlit(message.role)):
                st.markdown(message.parts[0].text)

        # Get user input
        user_prompt = st.chat_input("Ask Gemini Pro...")
        if user_prompt:
            # Display user message
            st.chat_message("user").markdown(user_prompt)

            try:
                # Get model's response
                response = st.session_state.chat_session.send_message(user_prompt)

                # Display assistant response
                with st.chat_message("assistant"):
                    st.markdown(response.text)
            except Exception as e:
                st.error(f"Error: {str(e)}")

# Image Captioning Section
elif selected == "Image Captioning":
    st.title("🖼️ Image Captioning")

    uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

    if uploaded_file:
        image = Image.open(uploaded_file)

        col1, col2 = st.columns([1, 1])

        with col1:
            # Display uploaded image
            st.image(image, caption="Uploaded Image", use_column_width=True)

        with col2:
            if st.button("Generate Caption"):
                with st.spinner("Analyzing image..."):
                    try:
                        # Generate caption
                        prompt = "Write a detailed caption for this image"
                        caption = gemini_pro_vision_response(prompt, image)
                        st.success("Caption Generated!")
                        st.write(caption)
                    except Exception as e:
                        st.error(f"Error generating caption: {str(e)}")

# Embed Text Section (Placeholder)
elif selected == "Embed Text":
    st.title("📝 Text Embedding")
    st.write("This feature is coming soon!")

# Ask Me Anything Section (Placeholder)
elif selected == "Ask Me Anything":
    st.title("❓ Ask Me Anything")
    st.write("This feature is coming soon!")

# Add footer
st.markdown("""
    <div style='position: fixed; bottom: 0; width: 100%; text-align: center; padding: 10px;'>
        <p>Powered by Google Gemini Pro 🤖</p>
    </div>
    """, unsafe_allow_html=True)