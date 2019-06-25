#!/bin/zsh

source ../../venv/bin/activate

<<<<<<< HEAD
stunnel stunnel/dev_https.conf &
HTTPS=1 python3 ./manage.py runserver 0.0.0.0:8001
=======
#stunnel stunnel/dev_https.conf &
#HTTPS=1 python3 ./manage.py runserver 0.0.0.0:8001
python3 ./manage.py runserver 0.0.0.0:8000
>>>>>>> hsson_task
