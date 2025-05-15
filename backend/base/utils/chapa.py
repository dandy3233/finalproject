import os
from decouple import config
import requests

CHAPA_API_KEY = config("CHAPA_API_KEY")  # Loaded from .env
CHAPA_BASE_URL = "https://api.chapa.co/v1/transaction/initialize"

def initialize_payment(email, amount, first_name, last_name, tx_ref, return_url):
    # print("CHAPA_API_KEY:", CHAPA_API_KEY)  # Add this line
    headers = {
        "Authorization": f"Bearer {CHAPA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "amount": str(amount),
        "currency": "ETB",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "tx_ref": tx_ref,
        "callback_url": return_url,
        "return_url": return_url,
        "customization[title]": "Dandy Store",
    }

    response = requests.post(CHAPA_BASE_URL, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Chapa Init Failed: {response.text}")
