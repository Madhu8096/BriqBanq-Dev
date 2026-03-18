import bcrypt

password = "AdminPassword123!"
password_bytes = password.encode('utf-8')

print(f"Bcrypt test for: {password}")
hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
print(f"Hashed: {hashed}")

match = bcrypt.checkpw(password_bytes, hashed)
print(f"Match: {match}")
