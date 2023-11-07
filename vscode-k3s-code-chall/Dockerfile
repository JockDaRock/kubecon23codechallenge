# Use an official Node runtime as a parent image for the build process
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY devnet-coding-challenge/package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the client application files into the container at /usr/src/app
COPY devnet-coding-challenge/ .

# Build the app
RUN npm run build

FROM codercom/code-server

# For Now I am switching the USER back to root to make running docker in docker easier
USER root

# Install Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Copy the built app to the Nginx serve folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy the Nginx configuration file into the container
COPY default.conf /etc/nginx/sites-enabled/default

# Forward request logs to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Installing Ubuntu Dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git

# Install code language dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# # Node.js install
# RUN curl -fsSL https://deb.nodesource.com/setup_16.20.0 | bash - \
#     && apt-get install -y nodejs
# # Update npm to the latest version
# # Install npm separately if it's not included with Node.js
# RUN apt-get install -y npm

# Docker engine install
RUN apt update && apt install -y \
    apt-transport-https \
    gnupg \
    ca-certificates \
    curl \
    wget \
    software-properties-common \
    && install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg && echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update && apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# The rest of your Dockerfile remains unchanged...

# Coping start script
COPY start_codedock.sh /usr/local/bin/start_codedock.sh

# Copy vscode settings
COPY settings.json /root/.local/share/code-server/User/settings.json
COPY coder.json /root/.local/share/code-server/coder.json
COPY config.yaml /root/.config/code-server/config.yaml

RUN chmod +x /usr/local/bin/start_codedock.sh

# RUN mkdir /tmp/apps && mkdir /tmp/apps/coding-challenge-api && mkdir /tmp/apps/devnet-coding-challenge
# WORKDIR /tmp/apps/devnet-coding-challenge
# COPY devnet-coding-challenge .
# WORKDIR /tmp/apps/coding-challenge-api
# COPY coding-challenge-api .
# WORKDIR /root

RUN mkdir /devnet /devnet/panoptica
WORKDIR /devnet/panoptica
COPY coding-challenge-api/occurences_req.py /tmp/
RUN touch occurences_req.py
COPY coding-challenge-api/panop_escher.py .
COPY coding-challenge-api/.env .
COPY coding-challenge-api/apiserver.py /tmp/apiserver.py

# Expose port 80 to the host machine
EXPOSE 80


ENTRYPOINT ["/usr/bin/dumb-init", "start_codedock.sh"]

