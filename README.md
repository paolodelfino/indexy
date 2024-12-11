https://github.com/minio/minio?tab=readme-ov-file
https://www.postgresql.org/download/windows/

To generate certificate for minio use `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certificates/private.key -out ./certificates/public.crt -config san.cnf`

On error `GET https://192.168.1.6:9000/image/2d88969c04a375025d5688d774b70113418d531b260d7fcfe1b7b60bc0a2549f net::ERR_CERT_AUTHORITY_INVALID`, open `https://192.168.1.6:9000` and trust it (using browser of course)

I think this 192.168.1.6 in `san.cnf` should be equal to MINIO_ENDPOINT

Env vars
```
POSTGRES_URL_NO_SSL
POSTGRES_DATA_PATH

MINIO_ENDPOINT
MINIO_PORT
MINIO_ADDRESS
MINIO_CONSOLE_ADDRESS
MINIO_DB_PATH
MINIO_ROOT_USER
MINIO_ROOT_PASSWORD
MINIO_ACCESS_KEY
MINIO_SECRET

WEB_PORT
# WEB_PROXY_PORT
```
