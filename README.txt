Requirements:
Node.js - npm
express (npm install express)
mongodb (npm install mongodb)
Fastapi (npm install fastapi)
uvicorn (pip install uvicorn)
pydantic(pip install pydantic)
docx (pip install python-docx)
cors  (npm install cors)
nodemon (npm install -g nodemon)

In case the instalation didnt work in python code, use this command
python -m pip install fastapi pydantic python-docx uvicorn

Usage:
Change the uri to the correct mongodb Atlas database link
Change DBCluster name
Change CollectionDatabase name

Run command:
	nodemon Mongo
	python -m uvicorn generar_contrato:app --reload
Access:
	http://localhost:3000

To see data:
	http://localhost:3000/data


