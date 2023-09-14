# Google Books Search

This project displays Google Books search results in a list on a web ui. It is using FastApi and NextJS.

## How It Works

The Python/FastAPI server is mapped into to Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](./next.config.js) to map any request to `/api/:path*` to the FastAPI API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `127.0.0.1:8000` port, which is where the FastAPI server is running.

## Deploy
GitHub actions will run when master branch is updated. Actions are defined [here](./.github/workflows/main.yml).

## Getting Started

First, install the dependencies:

```bash
npm install
```

[Set an API_KEY]("https://developers.google.com/books/docs/v1/using#APIKey") for use with google books:

```bash
export API_KEY="<your google api key>"
```

Test (requires API_KEY to be set):
```bash
npm test
```

Lint
```bash
npm run lint
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The FastApi server will be running on [http://127.0.0.1:8000](http://127.0.0.1:8000) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).
