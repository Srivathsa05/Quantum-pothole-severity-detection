# Reset PostgreSQL Password Guide

## Method 1: Using pgAdmin4 (Easiest)

### Step 1: Connect to PostgreSQL with Existing Password
1. Open pgAdmin4
2. Try to connect with your old password
3. If you can't connect, proceed to Method 2

### Step 2: Reset Password via pgAdmin
1. If you can connect to pgAdmin4:
   - Expand the server in the left panel
   - Right-click on `Login/Group Roles`
   - Select `Create > Login/Group Role`
   - Name: `postgres`
   - Password: Set your new password
   - Privileges: Check `Can login`
   - Click `Save`

## Method 2: Using Command Line (If pgAdmin doesn't work)

### Step 1: Stop PostgreSQL Service
1. Open **Services** (press `Win + R`, type `services.msc`)
2. Find `postgresql-x64-xx` (where xx is version number)
3. Right-click and select **Stop**

### Step 2: Edit pg_hba.conf to Allow Password Reset
1. Navigate to PostgreSQL data directory:
   - Usually: `C:\Program Files\PostgreSQL\{version}\data`
2. Open `pg_hba.conf` in a text editor (Notepad)
3. Find the line that starts with:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
4. Change it to:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
5. Save the file

### Step 3: Start PostgreSQL Service
1. Go back to **Services**
2. Find `postgresql-x64-xx`
3. Right-click and select **Start**

### Step 4: Reset Password
1. Open **Command Prompt** as Administrator
2. Navigate to PostgreSQL bin directory:
   ```cmd
   cd "C:\Program Files\PostgreSQL\{version}\bin"
   ```
   Replace `{version}` with your PostgreSQL version (e.g., 14, 15, 16)

3. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```

4. Reset the password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password_here';
   ```

5. Exit:
   ```sql
   \q
   ```

### Step 5: Restore pg_hba.conf
1. Go back to `pg_hba.conf`
2. Change the line back to:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
3. Save the file

### Step 6: Restart PostgreSQL Service
1. Go to **Services**
2. Find `postgresql-x64-xx`
3. Right-click and select **Restart**

## Method 3: Using Windows Authentication (If Available)

### Step 1: Connect with Windows User
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory:
   ```cmd
   cd "C:\Program Files\PostgreSQL\{version}\bin"
   ```

3. Try to connect with your Windows username:
   ```cmd
   psql -U postgres
   ```

4. If it asks for password, try your Windows password

5. If successful, reset the postgres password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password_here';
   \q
   ```

## Method 4: Reinstall PostgreSQL (Last Resort)

If none of the above methods work, you can reinstall PostgreSQL:

1. **Backup your data** (if you have any important data):
   ```cmd
   pg_dumpall -U postgres > backup.sql
   ```

2. **Uninstall PostgreSQL**:
   - Go to Control Panel > Programs and Features
   - Find PostgreSQL and uninstall

3. **Reinstall PostgreSQL**:
   - Download from https://www.postgresql.org/download/
   - Run the installer
   - Set a new password during installation

4. **Restore your data** (if you backed it up):
   ```cmd
   psql -U postgres < backup.sql
   ```

## Verify New Password

After resetting, verify your new password works:

1. Open pgAdmin4
2. Try to connect with the new password
3. Or use command line:
   ```cmd
   psql -U postgres -h localhost
   ```
   Enter your new password when prompted

## Update Your .env File

After successfully resetting your password, update your `.env` file:

```bash
DATABASE_URL=postgresql+psycopg://postgres:your_new_password_here@localhost:5432/pothole_detection
```

## Common Issues

### "Connection refused" error
- Make sure PostgreSQL service is running
- Check that port 5432 is not blocked by firewall

### "Password authentication failed" error
- Double-check you're using the correct new password
- Make sure you restarted PostgreSQL after changing pg_hba.conf

### Can't find pg_hba.conf file
- Common locations:
  - `C:\Program Files\PostgreSQL\{version}\data\pg_hba.conf`
  - `C:\PostgreSQL\{version}\data\pg_hba.conf`
- Search for `pg_hba.conf` in your Program Files folder

## Tips for Remembering Your Password

1. Use a password manager (LastPass, 1Password, etc.)
2. Write it down in a secure location
3. Use a memorable but strong password
4. Consider using the same password across development environments

## Need Help?

If you're still having trouble:
- Check PostgreSQL logs: `C:\Program Files\PostgreSQL\{version}\data\log\`
- Search for specific error messages online
- Consider posting on Stack Overflow with your error details
