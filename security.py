import bcrypt

def hash_pin(pin):
    return bcrypt.hashpw(pin.encode(), bcrypt.gensalt())

def check_pin(pin, hashed):
    return bcrypt.checkpw(pin.encode(), hashed.encode())

# psql -U postgres -f setup.sql to setup db
# pip install psycopg2-binary bcrypt to install dependies