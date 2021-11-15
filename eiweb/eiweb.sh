#!/bin/bash

SERVICE='eiweb-0.2.4-SNAPSHOT.jar'
LOG='./logs/EIWeb.log'

if [ $# -lt 1 ];
then
  echo "Not Enough Argument"
  echo "Usage : ./eiweb.sh start|stop|restart|log|alive"
  exit 0
fi

function server_start() {
    exit_code=0

    if pgrep -f "$SERVICE" > /dev/null; then
        exit_code=$(($exit_code + 1))
    fi

    if (( $exit_code > 0 )); then
        echo "Server $SERVICE Stop First"
        return
    fi

    echo "start $SERVICE"
    nohup java -jar -Dspring.profiles.active=local $SERVICE > /dev/null 2>&1 &
    sleep .2
}

function server_stop() {
    if pgrep -f "$SERVICE" > /dev/null; then
        echo "stop $SERVICE"
        pkill -ef "$SERVICE" > /dev/null
    fi
}

function server_log() {
    tail -F $LOG
}

function server_alive() {
    if pgrep -f "$SERVICE" > /dev/null; then
        echo "$SERVICE Alive"
    fi
}

if [ $1 == "start" ]; then
    server_start
elif [ $1 == "stop" ]; then
    server_stop
elif [ $1 == 'restart' ]; then
    server_stop
    sleep .5
    server_start $SERVICE1
elif [ $1 == 'log' ]; then
    server_log
elif [ $1 == 'alive' ]; then
    server_alive
else
    echo "unknown command [$1]"
fi
