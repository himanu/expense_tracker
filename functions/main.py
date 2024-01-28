from firebase_functions import https_fn
from firebase_functions.params import StringParam
from firebase_functions.options import CorsOptions
import firebase_admin
from google.cloud import firestore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage
import os
from pathlib import Path
from forex_python.converter import CurrencyRates
from datetime import datetime

# Define google api key
google_api_key = StringParam("GOOGLE_API_KEY")

# Define your desired data structure.
class Format(BaseModel):
    item: str = Field(description="String of all Bought items, separated by comma, displayed on receipt")
    cost: str = Field(description="Total Cost of items")
    date: str = Field(description="Date of invoice in format YYYY-MM-DD. If date is not mentioned in YYYY-MM-DD, please make a guess but use date in YYYY-MM-DD format")
    place: str = Field(description="Place where transaction took place")

# initialize_app
app = firebase_admin.initialize_app()
# db
db = firestore.Client()
#currency rates
c = CurrencyRates()

@https_fn.on_request(cors=CorsOptions(cors_methods="*", cors_origins="*"))
def on_request_example(req: https_fn.Request):
    try:
        file = req.files.get("image")
        access_token = req.form.get("access_token")
        user = firebase_admin.auth.verify_id_token(access_token)
        print("user ", user["uid"])
        if (not file):
            return {
                "error": "Please send file"
            }
        
        if (not user):
            return {
                "error": "User details can't be fetched"
            }
        
        dest_file_path = file.filename
        file.save(dest_file_path)
        gemini_res = call_gemini_vision(dest_file_path)
        if Path(dest_file_path).exists():
            os.remove(dest_file_path)

        print(gemini_res)

        if "error" in gemini_res and gemini_res["error"]:
            return gemini_res
        
        cost = ""
        if "cost" in gemini_res:
            cost_in_bill = gemini_res["cost"].strip()
            if cost_in_bill[0] == "$" or cost_in_bill[0] == "₹":
                currency = cost_in_bill[0]
                cost_amount_str = cost_in_bill.split(currency)[1].strip()
                if isfloat(cost_amount_str) and currency == "$":
                    cost = round(c.convert("USD", "INR", float(cost_amount_str)), 2)
            elif isfloat(cost_in_bill):
                cost = round(float(cost_in_bill), 2)

        
        # save expense in firestore
        document = {
            **gemini_res,
            "amount": cost,
            "uid": user["uid"],
            "location": gemini_res["place"],
            "created_at": datetime.now()
        }
        db.collection("expenses").add(document)
        return document
    except Exception as e:
        print("error", e)
        if Path(dest_file_path).exists():
            os.remove(dest_file_path)
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
                "text": "I am giving an image. First check if image is of a bill or not. For non-bill images, please send error message in json response saying invalid image uploaded. If image is of a bill please send all items with name and theirs price in json response" + format_instructions,
            },
            {"type": "image_url", "image_url": file_path},
        ]
    )
    return chain.invoke([message1])


def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False