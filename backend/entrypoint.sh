#!/bin/sh

# # Wait for the database to be ready
# if [ "$DATABASE" = "postgres" ]
# then
#     echo "Waiting for postgres..."

#     while ! nc -z $SQL_HOST $SQL_PORT; do
#       sleep 0.1
#     done

#     echo "PostgreSQL started"
# fi
# echo "Making migrations..."
# /py/bin/python manage.py makemigrations

# # Run migrations and collect static files
# echo "Running migrations..."
# /py/bin/python manage.py migrate

# # Collect static files if needed
# # echo "Collecting static files..."
# # /py/bin/python manage.py collectstatic --noinput

# # Start Nginx in the background
# # echo "Starting Nginx..."
# # nginx &

# # Start the backend server (Daphne or Gunicorn)
# echo "Running daphne"
# /py/bin/daphne -b 0.0.0.0 -p 8000 backend.asgi:application

# # Alternatively, if using Gunicorn, you can replace the above line with:
# # /py/bin/gunicorn your_project.wsgi:application --bind 0.0.0.0:8000


#!/bin/sh

# Wait for the database
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."
    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done
    echo "PostgreSQL started"
fi

# Run migrations (only for backend and first-run services)
if [ "$SERVICE_TYPE" = "backend" ] || [ "$SERVICE_TYPE" = "celery" ]; then
    echo "Making migrations..."
    /py/bin/python manage.py makemigrations

    echo "Running migrations..."
    /py/bin/python manage.py migrate
fi

# Start the appropriate service based on SERVICE_TYPE
case "$SERVICE_TYPE" in
    "backend")
        echo "Starting Daphne server..."
        exec /py/bin/daphne --bind 0.0.0.0 --port 8000 backend.asgi:application
        ;;
    "celery")
        echo "Starting Celery worker..."
        exec celery -A backend worker --loglevel=info
        ;;
    "celery-beat")
        echo "Starting Celery beat..."
        exec celery -A backend beat --loglevel=info
        ;;
    *)
        echo "Unknown service type: $SERVICE_TYPE"
        exit 1
        ;;
esac