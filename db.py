import psycopg2

def get_connection():
    # print("CONNECTING TO:", "dpg-d7jid8aqqhas73d24fag.singapore-postgres.render.com")
    return psycopg2.connect(
        host="dpg-d7jid8aqqhas73d24fag-a.singapore-postgres.render.com",
        database="atm_db_vkl6",
        port="5432",
        user="atm_user",
        password="A3dWnK64jlrxYBXIcKYXB5cIJwSObp0Q",
        sslmode="require"
    )