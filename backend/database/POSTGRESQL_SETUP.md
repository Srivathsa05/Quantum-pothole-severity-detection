# PostgreSQL Setup Guide with pgAdmin4

## Prerequisites

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - For Windows: Run the installer and follow the prompts
   - Note the password you set for the `postgres` user

2. **Install pgAdmin4**
   - Download from: https://www.pgadmin.org/download/
   - Install pgAdmin4 during PostgreSQL installation or separately
   - pgAdmin4 is included with PostgreSQL on Windows

## Step-by-Step Setup

### Step 1: Start PostgreSQL Service

1. Open **Services** (press `Win + R`, type `services.msc`)
2. Find `postgresql-x64-xx` (where xx is version number)
3. Right-click and select **Start** if not running
4. Set startup type to **Automatic**

### Step 2: Connect to PostgreSQL using pgAdmin4

1. Open **pgAdmin4** from your desktop or Start menu
2. Click **Add New Server** (or the + icon in the top left)
3. Fill in the connection details:

   **General Tab:**
   - Name: `pothole-detection-db`

   **Connection Tab:**
   - Host: `localhost`
   - Port: `5432` (default)
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `[your postgres password]`
   - Save password: Yes

4. Click **Save**
5. The server should appear in the left panel with a green checkmark

### Step 3: Create the Database

1. Expand the server in the left panel
2. Right-click on **Databases**
3. Select **Create > Database**
4. Fill in:
   - Database name: `pothole_detection`
   - Owner: `postgres`
5. Click **Save**

### Step 4: Execute the Schema

1. Expand the `pothole_detection` database
2. Click on **Tools** in the top menu
3. Select **Query Tool**
4. Open the schema file:
   - Click **Open File** (folder icon)
   - Navigate to: `d:\pothole-detection\backend\database\schema.sql`
   - Click **Open**
5. Click the **Execute** button (play icon) or press `F5`
6. You should see "Success" messages in the Messages tab

### Step 5: Verify the Setup

1. In the left panel, expand `pothole_detection > Schemas > public > Tables`
2. You should see these tables:
   - `detection_history`
   - `severity_mix_history`
   - `municipal_road_segments`
   - `maintenance_schedules`
3. Expand `Views` to see:
   - `daily_severity_mix`
   - `weekly_pothole_density`
   - `maintenance_priority_summary`

### Step 6: Test the Database

1. Open Query Tool again
2. Run this test query:

```sql
SELECT * FROM municipal_road_segments LIMIT 5;
```

3. You should see sample road data

## Connection String for Backend

Update your backend connection string in `.env` or settings:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pothole_detection
```

Or use individual parameters:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pothole_detection
DB_USER=postgres
DB_PASSWORD=your_password
```

## Troubleshooting

### Connection Failed
- Ensure PostgreSQL service is running
- Check firewall settings (port 5432)
- Verify username and password
- Try `127.0.0.1` instead of `localhost`

### Permission Denied
- Grant permissions to your user:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE pothole_detection TO postgres;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
  ```

### Schema Execution Failed
- Check for syntax errors in the schema file
- Execute one table at a time to isolate issues
- Check PostgreSQL version compatibility (schema uses modern features)

## Advanced: Create a Dedicated User (Optional)

For better security, create a dedicated user:

```sql
-- In Query Tool
CREATE USER pothole_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE pothole_detection TO pothole_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pothole_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pothole_user;
```

Then use this user in your connection string:

```
postgresql://pothole_user:secure_password_here@localhost:5432/pthole_detection
```

## Backup and Restore

### Backup Database
```bash
pg_dump -U postgres -h localhost pothole_detection > backup.sql
```

### Restore Database
```bash
psql -U postgres -h localhost pothole_detection < backup.sql
```

Or use pgAdmin4:
1. Right-click on database
2. Select **Backup/Restore**
3. Follow the prompts

## Next Steps

1. Update backend to use PostgreSQL
2. Add database models to your backend code
3. Implement API endpoints for database operations
4. Add frontend features for analytics and reporting
