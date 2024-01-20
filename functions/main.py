from firebase_functions import https_fn
from firebase_functions.params import StringParam
from firebase_admin import initialize_app
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage
import os

# Define google api key
google_api_key = StringParam("GOOGLE_API_KEY")

# Define your desired data structure.
class Format(BaseModel):
    item: str = Field(description="Bought item, displayed on receipt")
    cost: str = Field(description="Cost of item")
    date: str = Field(description="Date of invoice")

# Initialize app
initialize_app()


@https_fn.on_request()
def on_request_example(req: https_fn.Request):
    try:
        request_json = req.get_json(silent=True)
        file = req.files.get("image")
        dest_file_path = file.filename
        file.save(dest_file_path)
        response = call_gemini_vision(dest_file_path)
        os.remove(dest_file_path)
        print(response)
        return response
    except Exception as e:
        return https_fn.Response({"error": str(e)}, status=500)

def call_gemini_vision(file_path):
    # Set up a parser + inject instructions into the prompt template.
    parser = JsonOutputParser(pydantic_object=Format)
    vision_llm = ChatGoogleGenerativeAI(model="gemini-pro-vision", google_api_key=google_api_key.value)
    chain = vision_llm | parser
    format_instructions = parser.get_format_instructions()
    message1 = HumanMessage(
        content=[
            {
                "type": "text",
                "text": "I am giving an image of a bill. I want to know items with their prices in the bill. Please provide items with their cost." + format_instructions,
            },
            {"type": "image_url", "image_url": file_path},
        ]
    )
    return chain.invoke([message1])
