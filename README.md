
---

# **WEB APP NOVARA**

A project designed to manage and visualize data related to **Persons**, **Documents**, **Collections**, and **Institutions**. This application provides CRUD (Create, Read, Update, Delete) functionality via a set of PHP APIs, with a client-side application built using HTML, JavaScript, and CSS.

---

## **Project Structure**

```
WEAPPNOVARA
│
├── apis/                          # Backend APIs for CRUD operations
│   ├── create-collection.php      # API to create a new collection
│   ├── create-document.php        # API to create a new document
│   ├── create-institution.php     # API to create a new institution
│   ├── create-person.php          # API to create a new person
│   ├── delete-collection.php      # API to delete a collection
│   ├── delete-document.php        # API to delete a document
│   ├── delete-institution.php     # API to delete an institution
│   ├── delete-person.php          # API to delete a person
│   ├── get-collections.php        # API to fetch all collections
│   ├── get-documents.php          # API to fetch all documents
│   ├── get-institutions.php       # API to fetch all institutions
│   ├── get-persons.php            # API to fetch all persons
│   ├── get-stopovers.php          # API to fetch stopovers
│   ├── update-collection.php      # API to update a collection
│   ├── update-document.php        # API to update a document
│   ├── update-institution.php     # API to update an institution
│   ├── update-person.php          # API to update a person
│   ├── db.php                     # Database connection configuration
│   └── ...                        # Other helper APIs
│
├── csv/                           # CSV files for initial data loading
│   ├── collections.csv            # Sample collection data
│   ├── documents.csv              # Sample document data
│   ├── institutions.csv           # Sample institution data
│   ├── persons.csv                # Sample person data
│   └── stopovers.csv              # Sample stopovers data
│
├── images/                        # Images for project resources
│   ├── documentinfo.jpeg
│   ├── institutioninfo.jpeg
│   ├── personinfo.jpg
│   ├── personinfo2.jpg
│   └── ...                        # Other relevant images
│
├── sql_dump_files/                # SQL dump files for database
│   ├── collections.sql            # Collections table schema
│   ├── documents.sql              # Documents table schema
│   ├── institutions.sql           # Institutions table schema
│   ├── persons.sql                # Persons table schema
│   ├── stopovers.sql              # Stopovers table schema
│   └── ...                        # Any other related SQL files
│
├── index.html                     # Main HTML file for the web application
├── scripts.js                     # Main JavaScript file for interactivity
├── styles.css                     # Main CSS file for styling
└── README.md                      # Documentation file (this file)
```

---

## **Setup Instructions**

### **1. Configure the Base URL**
In the `scripts.js` file, ensure the `BASE_URL` matches your local or server environment. Modify the `BASE_URL` variable as follows:

```javascript
const BASE_URL = "http://localhost:8081/wepAppNovara/"; // (host)-(port)-(project name)
```

### **2. Configure the Database Connection**
In the `db.php` file, set the database credentials to match your environment. Example configuration:

#### For Cloud Database:
```php
$host = 'xx.xx.xx.xx';
$dbname = 'dbname';
$username = 'username';
$password = 'password';
```

#### For Localhost:
```php
$host = 'localhost';
$dbname = 'dbname';
$username = 'root';
$password = '';
```

Ensure you import the required SQL files from the `sql_dump_files/` directory into your database.

### **3. Start the Project**
- Place the project in your server's root directory (e.g., `htdocs` for XAMPP or WAMP).
- Start the server (Apache + MySQL).
- Navigate to the `index.html` in your browser using the base URL defined earlier.

---

## **APIs Overview**

### **CRUD Operations**
All APIs accept JSON-formatted requests for Create, Update, and Delete operations. For example:

#### **Create API Example**
**Endpoint:** `http://localhost:8081/wepAppNovara/apis/create-person.php`  
**Method:** `POST`  
**Request Body (JSON):**
```json
{
    "LAST_NAME": "Smith",
    "FIRST_NAME": "John",
    "GENDER": "Male",
    "LIFE_DATA": "1970 - Present",
    "BIRTH_COUNTRY": "USA",
    "TITLE": "Dr.",
    "OCCUPATION": "Scientist"
}
```

---

### **Fetching Data**
Each `GET` API provides specific data. Example:

#### **Get All Collections**
**Endpoint:** `http://localhost:8081/wepAppNovara/apis/get-collections.php`  
**Method:** `GET`  
**Response Example (JSON):**
```json
[
    {
        "COMMON_NAME": "Tropical Bird",
        "Scientific_Name": "Psittacus erithacus",
        "Collection_Date": "2023-01-01",
        "MAIN_PLACES": "Amazon Rainforest",
        ...
    }
]
```

---

## **Frontend Features**

1. **Interactive Map Integration:**
   - Displays institutions, documents, collections, and persons on a map using markers.
   - Uses `Leaflet.js` for dynamic map rendering.
   - Popups provide quick access to detailed information.

2. **Dynamic Data Table:**
   - Displays filtered data using pagination.
   - Supports live filtering based on criteria like gender, ID, and occupation.

3. **Global Loading Spinner:**
   - Displays a spinner when fetching data from the server.

4. **CRUD Modals:**
   - Modals for creating and updating rows with dynamic form generation.

---

## **Important Notes**
1. **Database Credentials:**  
   Ensure to update the credentials in the `db.php` file based on your local or cloud database configuration.

2. **Base URL:**  
   Update the `BASE_URL` variable in `scripts.js` to match your development or production environment.

3. **Dependencies:**  
   - Ensure PHP is installed and running on your server.
   - MySQL or MariaDB should be installed for database management.
   - Import the SQL dump files provided in the `sql_dump_files/` directory.

---

## **Credits**
This project was created as a comprehensive solution for managing and visualizing entity-based data using a combination of:
- PHP for backend API development.
- HTML, CSS, and JavaScript for frontend integration.
- MySQL/MariaDB for data storage.

---

