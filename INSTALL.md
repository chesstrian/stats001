```sh
## You need a web server.


# For this you need curl and php installed.
sudo curl -s http://getcomposer.org/installer | php

# For this you need git installed
sudo ./composer.phar install

sudo chown www-data:\ -R web/includes/
```
Finally go to http://localhost/stats001/web/
