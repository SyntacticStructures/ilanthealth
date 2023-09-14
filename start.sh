python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd api
uvicorn index:app --host 0.0.0.0 --port 8000 &

cd ..
source "${HOME}/.bash_profile"
nvm use 20
npm start &
