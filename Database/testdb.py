import mysql.connector
try:
    connection = mysql.connector.connect(
        host='localhost',
        port=3307, 
        user='root',
        password='',
        database='library_management_db'
    )

    if connection.is_connected():
        print("Kết nối thành công tới Database!")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Books")
        rows = cursor.fetchall()
        print(f"Số lượng sách hiện có: {len(rows)}")
        for row in rows:
            print(row)

except mysql.connector.Error as err:
    print(f"Lỗi rồi fen ơi: {err}")

finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()