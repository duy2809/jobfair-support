# Jobfair support Setup project

## Viblo Docker for PHP Development
- Clone repo from: [docker-php-development](https://github.com/sun-asterisk-research/docker-php-development)
- Using in Jobfair support
```
Folder project
+ |- docker-php-development
+ |- jobfair-support
```

In your terminal window, open the hosts file using your favorite text editor:

```sudo nano /etc/hosts```

```127.0.0.1 jobfair.local api.jobfair.local traefik.jobfair.local```


## Services
```plain
mariadb
redis
php
web
```

## Env
- Run project with .env in docker-php-development
```
#-------------------------------------------------------------------------------
# Code paths
#-------------------------------------------------------------------------------

PATH_PHP=../jobfair-support/api
PATH_WEB=../jobfair-support/web

#-------------------------------------------------------------------------------
# Data paths
#-------------------------------------------------------------------------------

PATH_DATA=./data
PATH_LOGS=./logs

#-------------------------------------------------------------------------------
# Traefik domain and ports
# DOMAIN, PORT defines public domain for your PHP application
# DOMAIN_WEB defines public domain for your Node.js application
# DOMAIN_SECONDARY is the domain used for other services e.g traefik, mailhog, phpmyadmin .etc
#-------------------------------------------------------------------------------

DOMAIN=api.jobfair.local
DOMAIN_WEB=jobfair.local
PORT=8000

DOMAIN_SECONDARY=jobfair.local

#-------------------------------------------------------------------------------
# Databases
# DB_DATABASE, DB_USERNAME and DB_PASSWORD are mandatory
# You can leave the others empty for default values
#-------------------------------------------------------------------------------

DB_DATABASE=jobfair
DB_USERNAME=jobfair
DB_PASSWORD=secret

#-------------------------------------------------------------------------------
# Other things
#-------------------------------------------------------------------------------

ELASTICSEARCH_VERSION=7.3.2

MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=miniostorage
MINIO_REGION_NAME=us-east-1

PGADMIN_DEFAULT_EMAIL=admin@domain.com
PGADMIN_DEFAULT_PASSWORD=secret

MEMORY_LIMIT_PHP_FPM=1G
MEMORY_LIMIT_BEANSTALKD=200m
MEMORY_LIMIT_ELASTICSEARCH=512m
MEMORY_LIMIT_MAILHOG=200m
MEMORY_LIMIT_MYSQL=1G
MEMORY_LIMIT_POSTGRES=1G
MEMORY_LIMIT_REDIS=200m

NGINX_DOCUMENT_ROOT=/php/public
NGINX_CONFIG_TEMPLATE=./config/nginx/default.conf

# LARAVEL_ECHO_SERVER_REDIS_KEY_PREFIX=

COMPOSE_PROJECT_NAME=jobfair
HOSTS_FILE=/etc/hosts
```

## Run container
- API:
```
cd docker-php-development
./project sh php
/php # composer install
/php # php artisan key:generate
/php # php artisan migrate
```

- Web:
```
cd docker-php-development
./project sh web
/web # yarn
/web # yarn dev
```

## Folder api: jobfair-support/api
copy .env.example to .env
```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:Od/M6XLZCbBcsAn5wjPWRr8YKUdpijE7OD5zgykn96A=
APP_DEBUG=true
APP_URL=http://api.jobfair.local:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=jobfair
DB_USERNAME=root
DB_PASSWORD=root

BROADCAST_DRIVER=redis
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

```

## Folder web: jobfair-support/web
Copy .env.example to .env
```
#-------------------------------------------------------------------------------
# Application info
#-------------------------------------------------------------------------------

APP_ENV=local
APP_KEY=base64:Od/M6XLZCbBcsAn5wjPWRr8YKUdpijE7OD5zgykn96A=

#-------------------------------------------------------------------------------
# URLs: app url, image url...
#-------------------------------------------------------------------------------

APP_URL=http://jobfair.local:8000
IMAGE_URL=http://images-jobfair.local:8000

SERVER_API_URL=http://jobfair-api/api
BROWSER_API_URL=http://api.jobfair.local:8000/api

REDIS_HOST=redis

#-------------------------------------------------------------------------------
# Sentry
#-------------------------------------------------------------------------------

SENTRY_DSN=
MIX_GA_ID=
```
