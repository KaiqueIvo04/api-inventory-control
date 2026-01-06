FROM node:22-alpine

# Copy app source
COPY . .

WORKDIR /app

# Install app dependencies
RUN npm i

# Build app
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]