from http import HTTPStatus
import json
import os

from custom_exceptions import MissingEnvironmentVariable

from fastapi import FastAPI, Request, HTTPException
import requests

app = FastAPI()

if 'API_KEY' not in os.environ:
    raise MissingEnvironmentVariable('API_KEY')

api_key = os.environ['API_KEY']


@app.post("/api/search")
async def search(request: Request):
    body = await request.json()
    if 'query' not in body:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail='"query" is required in request body')
    if 'startIndex' not in body or not isinstance(body['startIndex'], int):
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail='"startIndex" is required in request body')
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

    # TODO: log errors to logging service
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=HTTPStatus.GATEWAY_TIMEOUT, detail='Request timed out')
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail='An error occurred')
    except Exception as e:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail='An unknown error occurred')
