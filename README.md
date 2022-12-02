# comp3005project
COMP3005 - F22 -Final Project
by: Sean Matute | 101189868

To run program you must have the following installed on your computer:
1. Node Package Manager
2. PostgresSQL

To run the program:
1. Download the entire respository to your local computer
  Can run from your terminal:
    git clone https://github.com/seanmatute/comp3005project
2. Open a terminal to the folder and run: npm install
3. In server.js (on line 436) change db = pgp('postgres://USERNAME:PASSWORD@localhost:5432/DB_NAME'); to your Postgres username, password and db name
4. Initialize the database using the ddl.sql (and optional: the init.sql) in your own postgres PGAdmin.
5. Start the server by running < node server.js > or < npm start > in the terminal
6. Access the web application through http://localhost:3000/ 
7. Register as a user to test the user interface.
8. Or login as/register a new user with username: "admin" to have admin/owner access. 

If init.sql is ran it comes with 2 default users:
  1. test: with password test
  2. admin: with password admin
