FROM node:lts-alpine
ARG SERVICE_NAME="baseapi"
ARG UID=10000
ARG GID=10000
ENV PORT="3001"
COPY . /opt/service
RUN addgroup -g ${GID} -S ${SERVICE_NAME} && \
    adduser -S -D -H -h /opt/service -s /bin/false -u ${UID} -G ${SERVICE_NAME} ${SERVICE_NAME} && \
    cd /opt/service && \
    npm install --production && \
    chown -R -h ${SERVICE_NAME}:${SERVICE_NAME} /opt/service
WORKDIR /opt/service
USER $SERVICE_NAME
EXPOSE $PORT
CMD npm start