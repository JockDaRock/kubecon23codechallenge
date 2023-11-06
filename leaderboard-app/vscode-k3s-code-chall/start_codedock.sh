#!/bin/bash

nohup dockerd &> /tmp/dockerd.out &
# nohup k3s server --docker &> /tmp/k3s.out &
cd /tmp/apps/devnet-coding-challenge
nohup npm run start --host 0.0.0.0 &> /tmp/codechall.out &
cd /tmp/apps/coding-challenge-api
nohup python3 apiserver.py &> /tmp/api.out &
code-server --bind-addr=0.0.0.0:8080