import sqlite3

def setup_database():
    # Step 1: Connect to the SQLite database. 
    # If the file 'hospitals.db' does not exist, it will be created automatically in the same directory.
    conn = sqlite3.connect('hospitals.db')
    
    # Step 2: Create a cursor object to execute SQL commands
    cursor = conn.cursor()
    
    # Step 3: Create the 'hospitals' table with the required columns:
    # - id: INTEGER PRIMARY KEY
    # - name: TEXT
    # - specialization: TEXT
    # - city: TEXT
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hospitals (
            id INTEGER PRIMARY KEY,
            name TEXT,
            specialization TEXT,
            city TEXT
        )
    ''')
    
    # Step 4: Clear any existing data in the table to avoid duplicate entries if the script is run multiple times
    cursor.execute('DELETE FROM hospitals')
    
    # Step 5: Define the sample data to insert
    # Each tuple contains: (name, specialization, city)
    sample_hospitals = [
        ('Apollo Hospital', 'Cardiologist', 'Hyderabad'),
        ('Yashoda Hospital', 'Cardiologist', 'Hyderabad'),
        ('KIMS Hospital', 'General Physician', 'Hyderabad'),
        ('Care Hospital', 'Neurologist', 'Hyderabad'),
        ('AIG Hospital', 'Dermatologist', 'Hyderabad')
    ]
    
    # Step 6: Insert the sample records into the 'hospitals' table
    # We use parameterized queries (using '?') to prevent SQL injection and ensure correct data formatting
    cursor.executemany('''
        INSERT INTO hospitals (name, specialization, city)
        VALUES (?, ?, ?)
    ''', sample_hospitals)
    
    # Step 7: Commit the transaction to save the changes permanently to the database
    conn.commit()
    
    # Step 8: Verify and print the inserted data to confirm success
    cursor.execute('SELECT * FROM hospitals')
    rows = cursor.fetchall()
    
    print("SQL table creation code:")
    print("""
    CREATE TABLE IF NOT EXISTS hospitals (
        id INTEGER PRIMARY KEY,
        name TEXT,
        specialization TEXT,
        city TEXT
    )
    """)
    print("\nSample records inserted successfully:")
    for row in rows:
        print(f"ID: {row[0]} | Name: {row[1]} | Specialization: {row[2]} | City: {row[3]}")
        
    # Step 9: Close the cursor and connection to free up resources
    cursor.close()
    conn.close()

if __name__ == '__main__':
    setup_database()
