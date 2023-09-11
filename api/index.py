import json
import os
from pprint import pprint

from python.custom_exceptions import MissingEnvironmentVariable

from fastapi import FastAPI, Form
import requests

app = FastAPI()

if 'API_KEY' not in os.environ:
    print('api_key')
    raise MissingEnvironmentVariable('API_KEY')

api_key = os.environ['API_KEY']


@app.post("/api/search")
def search(query: str = Form(...)):
    pprint(query)
    params = {
        'key': api_key,
        'q': query,
        'startIndex': 10,
        'maxResults': 1
    }
    resp = requests.get('https://www.googleapis.com/books/v1/volumes', params=params)
    books = resp.json()['items']
    pprint(books[0])
    items = [{
        'title': book['volumeInfo']['title'],
        'thumbnail': book['volumeInfo']['imageLinks']['thumbnail']
      } for book in books]

    return json.dumps(items)
