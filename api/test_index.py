from http import HTTPStatus
from fastapi.testclient import TestClient
from unittest import mock, TestCase
from requests import exceptions as request_exceptions
import index
import json

client = TestClient(index.app)


class Test(TestCase):
    def test_search_no_query(self):
        response = client.post("/api/search", json={
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.BAD_REQUEST

    def test_search_no_startindex(self):
        response = client.post("/api/search", json={
            "query": "foo"
        })
        assert response.status_code == HTTPStatus.BAD_REQUEST

    def test_search_bad_startindex(self):
        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": "bar"
        })
        assert response.status_code == HTTPStatus.BAD_REQUEST

    @mock.patch('requests.get')
    def test_search_timeout(self, mock_get):
        mock_get.side_effect = request_exceptions.Timeout
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.GATEWAY_TIMEOUT
        mock_response.text = 'Gateway Timeout'
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.GATEWAY_TIMEOUT

    @mock.patch('requests.get')
    def test_search_connection_error(self, mock_get):
        mock_get.side_effect = request_exceptions.RequestException
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.INTERNAL_SERVER_ERROR
        mock_response.text = 'Internal Server Error'
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    @mock.patch('requests.get')
    def test_search_success(self, mock_get):
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.OK
        mock_response.json.return_value = {'items': [
            {'volumeInfo': {
                'title': 'title',
                'imageLinks': {
                    'thumbnail': 'thumbnail'
                },
                'authors': ['Jerry West', 'Magic Johnson'],
                'description': 'description'
            }}
        ]}
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.OK
        assert response.json() == json.dumps([{
            "title": "title",
            "thumbnail": "thumbnail",
            "authors": ["Jerry West", "Magic Johnson"],
            "description": "description"
        }])

    @mock.patch('requests.get')
    def test_search_success_no_description(self, mock_get):
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.OK
        mock_response.json.return_value = {'items': [
            {'volumeInfo': {
                'title': 'title',
                'imageLinks': {
                    'thumbnail': 'thumbnail'
                },
                'authors': ['Jerry West', 'Magic Johnson'],
                'description': ''
            }}
        ]}
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.OK
        assert response.json() == json.dumps([{
            "title": "title",
            "thumbnail": "thumbnail",
            "authors": ["Jerry West", "Magic Johnson"],
            "description": ""
        }])

    @mock.patch('requests.get')
    def test_search_success_no_authors(self, mock_get):
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.OK
        mock_response.json.return_value = {'items': [
            {'volumeInfo': {
                'title': 'title',
                'imageLinks': {
                    'thumbnail': 'thumbnail'
                },
                'description': ''
            }}
        ]}
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.OK
        assert response.json() == json.dumps([{
            "title": "title",
            "thumbnail": "thumbnail",
            "authors": [],
            "description": ""
        }])

    @mock.patch('requests.get')
    def test_search_success_no_thumbnail(self, mock_get):
        mock_response = mock.Mock()
        mock_response.status_code = HTTPStatus.OK
        mock_response.json.return_value = {'items': [
            {'volumeInfo': {
                'title': 'title',
                'imageLinks': {},
                'authors': ['Jerry West', 'Magic Johnson'],
                'description': 'description'
            }}
        ]}
        mock_get.return_value = mock_response

        response = client.post("/api/search", json={
            "query": "foo",
            "startIndex": 0
        })
        assert response.status_code == HTTPStatus.OK
        assert response.json() == json.dumps([{
            "title": "title",
            "thumbnail": "no-cover.png",
            "authors": ['Jerry West', 'Magic Johnson'],
            "description": "description"
        }])
