#!/bin/bash

nohup dockerd &> /tmp/dockerd.out &
# nohup k3s server --docker &> /tmp/k3s.out &
# cd /tmp/apps/devnet-coding-challenge
# nohup npm run start --host 0.0.0.0 &> /tmp/codechall.out &
cd /devnet/panoptica/socketio-server
nohup node server.js &> /tmp/socketio.out &
cd /devnet/panoptica/leaderboard-api
nohup node leaderboardapi.js &> /tmp/leader.out &
nohup nginx &> /tmp/nginx.out &
# nginx
code-server --bind-addr=0.0.0.0:8080