echo "installing mysql-server"
sudo apt-get install mysql-server
mysql_secure_installation

echo "test to see if mysql-server is running"
systemctl status mysql.service

echo "start mysql-server if it isn't running"
sudo systemctl start mysql