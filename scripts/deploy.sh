ssh $SCHEDULE_USER@$SCHEDULE_HOST "cd ~/schedule/node && git pull && npm install && exit"
