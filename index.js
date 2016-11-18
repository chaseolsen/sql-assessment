var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:HXYMFF5M@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;

    app.set('db', db);

    db.user_create_seed(function(err, res){
      // console.log(err);
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(err, res){
      // console.log(err);
      console.log("Vehicle Table Init");
    });

});

//GET all users
app.get('/api/users', function(req, res, next){
  db.getUsers(function(err, users){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.json(users);
  });
});

//GET all vehicles
app.get('/api/vehicles', function(req, res, next){
  db.getVehicles(function(err, vehicles){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.json(vehicles);
  });
});

//Create user
app.post('/api/users', function(req, res, next){
  var body = req.body;
  db.createUser([body.username, body.lastname, body.email],
  function(err, user){
    if (err){
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

//Create vehicle
app.post('/api/vehicles', function(req, res, next){
  var body = req.body;
  db.createVehicle([body.make, body.model, body.year, body.ownerId],
  function(err, vehicle){
    if(err){
      res.status(500).send(err);
    } else {
      res.json(vehicle);
    }
  });
});

//GET number of total vehicles
app.get('/api/user/:userId/vehiclecount', function(req, res, next){
  db.vehicleCount(function(err, count){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.json(count);
  });
});

//GET vehicles owned by userid
app.get('/api/user/:userId/vehicle', function(req, res, next){
  db.vehiclesOwnedBy(function(err, vehicles){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.json(vehicles);
  });
});

//GET vehicles owned by email
app.get('/api/vehicle/?email=UserEmail', function(req, res, next){
  db.vehiclesOwnedBy(function(err, email){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.json(email);
  });
});

//GET vehicles by firstname containing letter
app.get('/api/vehicle/?userFirstStart=letters', function(req, res, next){
  db.firstname_like(function(err, name){
    if(err){
      res.status(500).send(err);
      return;
    }
    res.json(name);
  });
});

//GET vehicles newer than year 2000
app.get('/api/newervehiclesbyyear', function(req, res, next){
  db.cars_newer_2000(function(err, cars){
    if(err){
      res.status(500).send(err);
      return;
    }
    res.json(cars);
  });
});

//POST change ownership of vehicle
app.post('/api/vehicle/:vehicleId/user/:userId', function(req, res, next){
  db.update_user([req.params.id], function(err, newUser){
    if(err){
      res.status(500).send(err);
      return;
    }
    res.json(newUser);
  });
});

//DELETE ownership of vehicle
app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res, next){
  var body = req.body;
  db.update_ownership([req.params.id], function(err, newId){
    if(err){
      res.status(500).send(err);
      return;
    }
    res.json(newId);
  });
});

//DELETE vehicle
app.delete('/api/vehicle/:vehicleId', function(req, res, next){
  db.delete_car([req.params.id], function(err, deleteCar){
    if(err){
      res.status(500).send(err);
      return;
    }
    res.json(deleteCar);
  });
});


app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});

module.exports = app;
