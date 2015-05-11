var restify = require('restify');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/test', ['employees']);
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Get All employees
server.get("/employees", function (req, res, next) {
    db.employees.find(function (err, employees) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(employees));
    });
    return next();
});

//Get Employees By Name
server.get('/employees/:name', function (req, res, next) {
    db.employees.findOne({
        name: req.params.name
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

//Save Employees    
server.post('/employees', function (req, res, next) {
    var employee = req.params;
    db.employees.save(employee,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

server.put('/employees/:name', function (req, res, next) {
    // get the existing product
    db.employees.findOne({
        name: req.params.name
    }, function (err, data) {
        // merge req.params/product with the server/product

        var updProd = {}; // updated products 
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
            updProd[n] = data[n];
        }
        for (var n in req.params) {
            updProd[n] = req.params[n];
        }
        db.employees.update({
            id: req.params.id
        }, updProd, {
            multi: false
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    });
    return next();
});

server.del('/employees/:id', function (req, res, next) {
    db.employees.remove({
        name : req.params.name
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(true));
    });
    return next();
});

// Starting server 
server.listen(9998, function () {
    console.log("Server started @ 9998");
});

module.exports = server;


//http://localhost:9998/employees
//http://localhost:9998/employees/Sulekha%20Singh