FROM node:onbuild

ENV PORT 8080
ENV NODE_ENV production
ENV WEBSERVICE_URL https://a11y-dashboard-webservice.internal.domain.dev.atlassian.io
EXPOSE 8080
