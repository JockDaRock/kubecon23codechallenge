FROM codercom/code-server

# For Now I am switching the USER back to root to make running docker in docker easier
USER root

# Installing Ubuntu Dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git

# Install code language dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Node.js install
RUN curl -fsSL https://deb.nodesource.com/setup_16.20.0 | bash - \
    && apt-get install -y nodejs
# Update npm to the latest version
# Install npm separately if it's not included with Node.js
RUN apt-get install -y npm

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

RUN mkdir /devnet/panoptica
WORKDIR /devnet/panoptica
COPY coding-challenge-api/occurences_req.py /tmp/
RUN touch occurences_req.py
COPY panop_escher.py .
EXPOSE 8080 5000 3000


ENTRYPOINT ["/usr/bin/dumb-init", "start_codedock.sh"]

