from http import HTTPStatus
import json
import os

from python.custom_exceptions import MissingEnvironmentVariable

from fastapi import FastAPI, Request
import requests

app = FastAPI()

if 'API_KEY' not in os.environ:
    raise MissingEnvironmentVariable('API_KEY')

api_key = os.environ['API_KEY']


@app.post("/api/search")
async def search(request: Request):
    body = await request.json()
    params = {
        'key': api_key,
        'q': body['query'],
        'startIndex': body['startIndex'],
        'maxResults': 10
    }
    try:
        resp = requests.get('https://www.googleapis.com/books/v1/volumes', params=params)
        resp.raise_for_status()
        books = resp.json().get('items', [])
        items = [{
            'title': book.get('volumeInfo', {}).get('title', ''),
            'thumbnail': book.get('volumeInfo', {}).get('imageLinks', {}).get('thumbnail', ''),
            'authors': book.get('volumeInfo', {}).get('authors', []),
            'description': book.get('volumeInfo', {}).get('description', '')
        } for book in books]

        return json.dumps(items)
    except requests.exceptions.Timeout as e:
        return {'error': f'Request timed out: {e}'}, HTTPStatus.GATEWAY_TIMEOUT
    except requests.exceptions.ConnectionError as e:
        return {'error': f'Connection error occurred: {e}'}, HTTPStatus.INTERNAL_SERVER_ERROR
    except requests.exceptions.HTTPError as e:
        return {'error': f'HTTP error occurred: {e}'}, HTTPStatus.INTERNAL_SERVER_ERROR
    except requests.exceptions.RequestException as e:
        return {'error': f'An error occurred: {e}'}, HTTPStatus.INTERNAL_SERVER_ERROR
