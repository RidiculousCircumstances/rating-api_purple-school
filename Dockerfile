FROM node:16-alpine
WORKDIR /container
ADD package.json package.json
RUN npm install --force
ADD . .
RUN npm run build
RUN npm prune --force --production
CMD ["node", "./dist/main.js"]