FROM node:18-alpine
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY .env /home/app/

COPY AccountService/build/ /home/app/AccountService/build/
COPY AccountService/package.json /home/app/AccountService/
COPY AccountService/package-lock.json /home/app/AccountService/

COPY CategoryService/build/ /home/app/CategoryService/build/
COPY CategoryService/package.json /home/app/CategoryService/
COPY CategoryService/package-lock.json /home/app/CategoryService/

COPY ProductService/build/ /home/app/ProductService/build/
COPY ProductService/package.json /home/app/ProductService/
COPY ProductService/package-lock.json /home/app/ProductService/

COPY MessageService/build/ /home/app/MessageService/build/
COPY MessageService/package.json /home/app/MessageService/
COPY MessageService/package-lock.json /home/app/MessageService/

COPY WebApp/.next/ /home/app/WebApp/.next/
COPY WebApp/package.json /home/app/WebApp/
COPY WebApp/package-lock.json /home/app/WebApp/
COPY WebApp/next-i18next.config.js/ /home/app/WebApp/
COPY WebApp/next.config.js/ /home/app/WebApp/
COPY WebApp/public/ /home/app/WebApp/public/

COPY AdminApp/.next/ /home/app/AdminApp/.next/
COPY AdminApp/package.json /home/app/AdminApp/
COPY AdminApp/package-lock.json /home/app/AdminApp/
COPY AdminApp/next.config.js/ /home/app/AdminApp/
COPY AdminApp/public/ /home/app/AdminApp/public/

COPY ModerationApp/.next/ /home/app/ModerationApp/.next/
COPY ModerationApp/package.json /home/app/ModerationApp/
COPY ModerationApp/package-lock.json /home/app/ModerationApp/
COPY ModerationApp/next.config.js/ /home/app/ModerationApp/
COPY ModerationApp/public/ /home/app/ModerationApp/public/

RUN npm run cis

CMD npm run start