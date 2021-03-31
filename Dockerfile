FROM node:12 AS vue
WORKDIR /app
RUN npm install -g @vue/cli
COPY client/package*.json client/
RUN cd client && npm install
COPY client client
RUN cd client && npm run build

FROM node:12-alpine
WORKDIR /app
COPY server/package*.json server/
RUN cd server && npm install
COPY --from=vue /app/client/dist client/dist
COPY server server
VOLUME /app/server/data
EXPOSE 3000
CMD cd server && npm run start