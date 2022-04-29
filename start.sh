#!/bin/bash

# https://www.linode.com/docs/guides/start-service-at-boot/
# File: /lib/systemd/system/bot.service 
# [Unit]
# Description=Skyclient-bot
# 
# [Service]
# Type=simple
# ExecStart=/usr/local/bin/yarn start
# WorkingDirectory=/home/nacrt/skyclient/Skyclient-bot
# 
# [Install]
# WantedBy=multi-user.target

sudo systemctl stop bot;sudo systemctl start bot;sudo systemctl enable bot
