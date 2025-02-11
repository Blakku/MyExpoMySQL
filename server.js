const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); 
  },
});
const upload = multer({storage:storage});


const app = express();
const port = 3000;

// load environment variables from a .env file for (development)
require('dotenv').config();


// use cors to enable Cross Origin Resource Service
app.use(cors());

// Enable JSON parsing for request body
app.use(express.json());




// Get the secret key from environment variables or use a default
const secretKey = process.env.JWT_SECRET || 'Digit$35559';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expoapp',
});

db.connect();

app.use(bodyParser.json());

//Register user
app.post('/users/api/register', async (req, res) => {
    const { username, password,email, full_name, source_id, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    db.query('INSERT INTO users (username, password, email, full_name, source_id, role_id) VALUES (?, ?, ?, ?, ?, ?)', 
    [username, hashedPassword,email, full_name, source_id, role_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error registering user',results);
      } else {
        res.send(results);
      }
    });
  });

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Use a SELECT SQL statement to retrieve all columns from the "users" table
  db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error) {
      console.error('MySQL2 query error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    // Check if user exists and compare the hashed password
    if (results.length > 0 && (await bcrypt.compare(password, results[0].password))) {
      // Create a JWT token
      const token = jwt.sign({ id: results[0].id, username: results[0].username }, secretKey, { expiresIn: '1h' });
      const userResult = results[0] ;
      // Send success response with token
      res.json({ success: true, token, userResult });
    } else {
      // If user is not found or password is incorrect, send failure response
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});
  
// Search user by username route using db.query
app.get('/search-username/:username', (req, res) => {
  const { username } = req.params;

  // Use a SELECT SQL statement to search for a user by username
  db.promise().query('SELECT * FROM users WHERE username = ?', [username])
    .then(([results]) => {
      if (results.length > 0) {
        // User found
        const userResult = results[0];
        res.json({ success: true, userResult });
      } else {
        // User not found
        res.json({ success: false, message: 'User not found' });
      }
    })
    .catch(error => {
      console.error('MySQL query error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
});


// Protected route - example
app.get('/api/protected', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // Use a promise to verify the JWT token
    const decoded = await verifyTokenPromise(token, secretKey);

    // If the token is valid, you can perform actions for the authenticated user
    res.send(`Hello, ${decoded.username}! This is a protected route.`);
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
});

// Function to verify JWT token using a promise
const verifyTokenPromise = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};


// Define CRUD routes here

//crud for users table

app.post('/users/api/create', (req, res) => {
    const { username, password, email, full_name, source_id, role_id } = req.body;
    db.query('INSERT INTO users (username,password, email,full_name,source_id,role_id) VALUES (?, ?, ?, ?, ?, ?)', [username, password,email,full_name,source_id,role_id], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get('/users/api/read', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.put('/users/api/update/:id', (req, res) => {
    const { username, password, email, full_name, source_id, role_id } = req.body;
    const userId = req.params.id;
    db.query('UPDATE users SET username = ?, password = ?, email = ?, full_name = ?, source_id = ?, role_id = ? WHERE id = ?', [username, password, email, full_name, source_id, role_id, userId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.delete('/users/api/delete/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

  app.get('/users/api/user/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        res.send(results[0]);
      } else {
        res.status(404).send('User not found');
      }
    });
  });

 // Endpoint to check if a username exists (GET request)
app.get('/check-username/:username', (req, res) => {
  const { username } = req.params;

  // Query the database to check if the username exists
  const sql = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const usernameExists = result[0].count > 0;
      res.json({ exists: usernameExists });
    }
  });
});

// Endpoint to check if an email exists (GET request)
app.get('/check-email/:email', (req, res) => {
  const { email } = req.params;

  // Query the database to check if the email exists
  const sql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const emailExists = result[0].count > 0;
      res.json({ exists: emailExists });
    }
  });
});
  


  //crud for roles table

app.post('/roles/api/create', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO roles (name) VALUES (?)', [name], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get('/roles/api/read', (req, res) => {
    db.query('SELECT * FROM roles', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.put('/roles/api/update/:id', (req, res) => {
    const { name } = req.body;
    const roleId = req.params.id;
    db.query('UPDATE roles SET name = ? WHERE id = ?', [name, roleId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
      // Read a specific roles by ID
app.get('/roles/api/id/:id', (req, res) => {
  const roleId = req.params.id;
  const sql = 'SELECT * FROM roles WHERE id = ?';
  db.query(sql, [roleId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(results[0]);
  });
});


  app.delete('/roles/api/delete/:id', (req, res) => {
    const roleId = req.params.id;
    db.query('DELETE FROM roles WHERE id = ?', [roleId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

  //crud for sources table

app.post('/sources/api/create', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO sources (name) VALUES (?)', [name], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get('/sources/api/read', (req, res) => {
    db.query('SELECT * FROM sources', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.put('/sources/api/update/:id', (req, res) => {
    const { name } = req.body;
    const sourceId = req.params.id;
    db.query('UPDATE users SET name = ? WHERE id = ?', [name, sourceId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.delete('/sources/api/delete/:id', (req, res) => {
    const sourceId = req.params.id;
    db.query('DELETE FROM sources WHERE id = ?', [sourceId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });


  //crud for countries table
  //create countries
  app.post('/countries/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const name = req.body.name;
    const sortname = req.body.sortname;
    const phonecode = req.body.phonecode;
  
    const sql = 'INSERT INTO countries (sortname,name,phonecode,flag) VALUES (?, ?, ?, ?)';
    const values = [sortname,name, phonecode, file.filename]; 
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      res.status(200).json({ message: 'File uploaded successfully' });
    });
  });
  
  app.get('/countries/api/read', (req, res) => {
    db.query('SELECT * FROM countries ORDER BY name', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
 // Update Country
app.put('/countries/api/update/:id', upload.single('file'), (req, res) => {
  const countryId = req.params.id;
  const file = req.file;
  const sortname = req.body.sortname;
  const name = req.body.name;
  const phonecode = req.body.phonecode;


  // Fetch the old country data to get the filename
  const selectSql = 'SELECT * FROM countries WHERE id=?';
  db.query(selectSql, [countryId], (selectErr, selectResult) => {
    if (selectErr) {
      console.error(selectErr);
      return res.status(500).send('Internal Server Error');
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const oldFilename = selectResult[0].flag;
    const deletePath = path.join(__dirname, 'uploads', oldFilename);
   if(fs.existsSync(deletePath)){
    // Delete the old image file
    fs.unlink(deletePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        return res.status(500).send('Internal Server Error');
      }

      // Update the database with the new country data
      const updateSql = 'UPDATE countries SET sortname=?, name=?, phonecode=?, flag=? WHERE id=?';
      const values = [sortname, name, phonecode, file.filename, countryId];

      db.query(updateSql, values, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).send('Internal Server Error');
        }

        res.status(200).json({ message: 'Country updated successfully'});
      });
    });
  }
  else {
 // Update the database with the new country data
 const updateSql = 'UPDATE countries SET sortname=?, name=?, phonecode=?, flag=? WHERE id=?';   
 const values = [sortname, name, phonecode, file.filename, countryId]; 

 db.query(updateSql, values, (updateErr, updateResult) => {
   if (updateErr) {
     console.error(updateErr);
     return res.status(500).send('Internal Server Error');
   }

   res.status(200).json({ message: 'Country updated successfully'});
 });
  }
  });
});


  // Read a specific countries by ID
app.get('/countries/api/id/:id', (req, res) => {
  const countryId = req.params.id;
  const sql = 'SELECT * FROM countries WHERE id = ?';
  db.query(sql, [countryId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(results[0]);
  });
});
  
  app.delete('/countries/api/delete/:id', (req, res) => {
    const countryId = req.params.id;
  
    // Fetch the file path from the database
    db.query('SELECT flag FROM countries WHERE id = ?', [countryId], (selectErr, selectResults) => {
      if (selectErr) {
        console.error(selectErr);
        return res.status(500).send('Internal Server Error');
      }
  
      if (selectResults.length === 0) {
        return res.status(404).json({ message: 'Country not found' });
      }
  
      const filePath = path.join(__dirname, 'uploads', selectResults[0].flag);
  
      // Delete the file from the uploads directory
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(unlinkErr);
          return res.status(500).send('Internal Server Error');
        }
  
        // Delete the record from the database
        const sql = 'DELETE FROM countries WHERE id=?';
        const values = [countryId];
  
        db.query(sql, values, (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).send('Internal Server Error');
          }
  
          res.json({ message: 'Flag deleted successfully' });
        });
      });
    });
  });

    //crud for states table

app.post('/states/api/create', (req, res) => {
    const { name, country_id } = req.body;
    db.query('INSERT INTO states (name, country_id) VALUES (?, ?)', [name, country_id], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get('/states/api/read', (req, res) => {
    db.query('SELECT * FROM states ORDER BY name', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.put('/states/api/update/:id', (req, res) => {
    const { name, country_id } = req.body;
    const stateId = req.params.id;
    db.query('UPDATE states SET name = ?, country_id = ? WHERE id = ?', [name, country_id, stateId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

    // Read a specific states by ID
app.get('/states/api/id/:id', (req, res) => {
  const stateId = req.params.id;
  const sql = 'SELECT * FROM states WHERE id = ?';
  db.query(sql, [stateId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(results[0]);
  });
});
  
  app.delete('/states/api/delete/:id', (req, res) => {
    const stateId = req.params.id;
    db.query('DELETE FROM states WHERE id = ?', [stateId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

    //crud for cities table

app.post('/cities/api/create', (req, res) => {
    const { name, state_id } = req.body;
    db.query('INSERT INTO cities (name, state_id) VALUES (?, ?)', [name, state_id], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get('/cities/api/read', (req, res) => {
    db.query('SELECT * FROM cities', (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.put('/cities/api/update/:id', (req, res) => {
    const { name, state_id } = req.body;
    const cityId = req.params.id;
    db.query('UPDATE cities SET name = ?, state_id = ? WHERE id = ?', [name, state_id, cityId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });

  // Read a specific cities by ID
app.get('/cities/api/id/:id', (req, res) => {
  const cityId = req.params.id;
  const sql = 'SELECT * FROM cities WHERE id = ?';
  db.query(sql, [cityId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(results[0]);
  });
});
  
  app.delete('/cities/api/delete/:id', (req, res) => {
    const cityId = req.params.id;
    db.query('DELETE FROM cities WHERE id = ?', [cityId], (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
// Create (Upload) Picture
app.post('/pictures/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const { originalname, mimetype, size } = file;
  const user_id = req.body.user_id;

  const sql = 'INSERT INTO pictures (filename, originalname, mimetype, size, user_id, url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
  const values = [file.filename, originalname, mimetype, size, user_id, `http://192.168.236.194:19001/uploads/${file.filename}`]; 

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    const pictureUrl = `http://192.168.236.194:19001/uploads/${file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully', url: pictureUrl });
  });
});

// Read (Retrieve) Pictures
app.get('/pictures/api/read', (req, res) => {
  db.query('SELECT * FROM pictures', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

// Read a specific picture by ID
app.get('/pictures/api/id/:id', (req, res) => {
  const pictureId = req.params.id;
  const sql = 'SELECT * FROM pictures WHERE id = ?';
  db.query(sql, [pictureId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    res.json(results[0]);
  });
});

// Update Picture
app.put('/pictures/api/update/:id', upload.single('file'), (req, res) => {
  const pictureId = req.params.id;
  const file = req.file;
  const { originalname, mimetype, size } = file;
  const user_id = req.body.user_id;

  // Fetch the old picture data to get the filename
  const selectSql = 'SELECT filename FROM pictures WHERE id=?';
  db.query(selectSql, [pictureId], (selectErr, selectResult) => {
    if (selectErr) {
      console.error(selectErr);
      return res.status(500).send('Internal Server Error');
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }

    const oldFilename = selectResult[0].filename;

    // Delete the old image file
    const deletePath = path.join(__dirname, 'uploads', oldFilename);
    fs.unlink(deletePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        return res.status(500).send('Internal Server Error');
      }

      // Update the database with the new picture data
      const updateSql = 'UPDATE pictures SET filename=?, originalname=?, mimetype=?, size=?, user_id=?, url=?, updated_at=NOW() WHERE id=?';
      const values = [file.filename, originalname, mimetype, size, user_id, `http://192.168.236.194:19001/uploads/${file.filename}`, pictureId];

      db.query(updateSql, values, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).send('Internal Server Error');
        }

        const pictureUrl = `http://192.168.236.194:19001/uploads/${file.filename}`;
        res.status(200).json({ message: 'Picture updated successfully', url: pictureUrl });
      });
    });
  });
});


// Delete Picture
app.delete('/pictures/api/delete/:id', (req, res) => {
  const pictureId = req.params.id;

  // Fetch the file path from the database
  db.query('SELECT filename FROM pictures WHERE id = ?', [pictureId], (selectErr, selectResults) => {
    if (selectErr) {
      console.error(selectErr);
      return res.status(500).send('Internal Server Error');
    }

    if (selectResults.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }

    const filePath = path.join(__dirname, 'uploads', selectResults[0].filename);
    if(fs.existsSync(filePath)){

    // Delete the file from the uploads directory
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(unlinkErr);
        return res.status(500).send('Internal Server Error');
      }

      // Delete the record from the database
      const sql = 'DELETE FROM pictures WHERE id=?';
      const values = [pictureId];

      db.query(sql, values, (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error(deleteErr);
          return res.status(500).send('Internal Server Error');
        }

        res.json({ message: 'Picture deleted successfully' });
      });
    });
  }
  else {
      // Delete the record from the database
      const sql = 'DELETE FROM pictures WHERE id=?';
      const values = [pictureId];

      db.query(sql, values, (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error(deleteErr);
          return res.status(500).send('Internal Server Error');
        }

        res.json({ message: 'Id deleted successfully' });
      });
  }
  });
});


// Delete Multiple Pictures
app.post('/pictures/api/delete-multiple', (req, res) => {
  const pictureIds = req.body.pictureIds;

  // Fetch the file paths from the database
  const selectSql = 'SELECT filename FROM pictures WHERE id IN (?)';
  db.query(selectSql, [pictureIds], (selectErr, selectResults) => {
    if (selectErr) {
      console.error(selectErr);
      return res.status(500).send('Internal Server Error');
    }

    if (selectResults.length === 0) {
      return res.status(404).json({ message: 'Pictures not found' });
    }

    const filePaths = selectResults.map(result => path.join(__dirname, 'uploads', result.filename));

    // Delete the files from the uploads directory
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete the records from the database
    const deleteSql = 'DELETE FROM pictures WHERE id IN (?)';
    db.query(deleteSql, [pictureIds], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error(deleteErr);
        return res.status(500).send('Internal Server Error');
      }

      res.json({ message: 'Pictures deleted successfully' });
    });
  });
});



 //crud for addresses table

 app.post('/addresses/api/create', (req, res) => {
  const { country_id,state_id,city_id,address,phonecode,phone,user_id } = req.body;
  db.query('INSERT INTO addresses (country_id,state_id,city_id,address,phonecode,phone,user_id) VALUES (?, ?,?,?,?,?,?)', [country_id,state_id,city_id,address,phonecode,phone,user_id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/addresses/api/read', (req, res) => {
  db.query('SELECT * FROM addresses ', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/addresses/api/update/:id', (req, res) => {
  const { country_id,state_id,city_id,address,phonecode,phone,user_id } = req.body;
  const addressId = req.params.id;
  db.query('UPDATE addresses SET country_id = ?, state_id = ?, city_id = ?, address = ?, phonecode = ?, phone = ?,user_id = ? WHERE id = ?', [country_id,state_id,city_id,address,phonecode,phone,user_id, addressId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

  // Read a specific addresses by ID
app.get('/addresses/api/id/:id', (req, res) => {
const addressId = req.params.id;
const sql = 'SELECT * FROM addresses WHERE id = ?';
db.query(sql, [addressId], (err, results) => {
  if (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  } else if (results.length === 0) {
    return res.status(404).json({ message: 'State not found' });
  }
  res.json(results[0]);
});
});

app.delete('/addresses/api/delete/:id', (req, res) => {
  const addressId = req.params.id;
  db.query('DELETE FROM addresses WHERE id = ?', [addressId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// ...


  // ...
  