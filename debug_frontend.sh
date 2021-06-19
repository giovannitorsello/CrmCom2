cd ./CrmCom2_Frontend
quasar dev --debug &
sleep 30
google-chrome --remote-debugging-port=9222 --  http://10.10.10.60:8888
