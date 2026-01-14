FROM node:20-alpine

WORKDIR /app/frontend

COPY package.json /app/frontend/package.json

RUN npm install

COPY . /app/frontend

ENV VITE_API_URL=http://backend:8000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
