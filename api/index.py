import json
import os
from pprint import pprint
from collections import defaultdict

from python.custom_exceptions import MissingEnvironmentVariable

from fastapi import FastAPI, Request
import requests

app = FastAPI()

if 'API_KEY' not in os.environ:
    print('api_key')
    raise MissingEnvironmentVariable('API_KEY')

api_key = os.environ['API_KEY']

@app.post("/api/search")
async def search(request: Request):
    body = await request.json()
    print(request)
    params = {
        'key': api_key,
        'q': body['query'],
        'startIndex': body['startIndex'],
        'maxResults': 10
    }
    resp = requests.get('https://www.googleapis.com/books/v1/volumes', params=params)
    books = resp.json()['items']
    pprint(books[0])
    items = [{
        'title': book['volumeInfo'].get('title', ''),
        'thumbnail': book['volumeInfo'].get('imageLinks').get('thumbnail', ''),
        'authors': book['volumeInfo'].get('authors', []),
        'description': book['volumeInfo'].get('description', '')
      } for book in books]

    return json.dumps(items)
