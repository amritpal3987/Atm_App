import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="atm_db",
        port="5500",
        user="postgres",
        password="amrit" 
    )