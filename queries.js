var promise = require('bluebird');

var options = {
	// Initialization options
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

var config = {
	"USER"	: "angelo",
	"PASS"	: "password",
	"HOST"	: "postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com",
	"PORT"	: "5432",
	"DATABASE"	: "postgresql1"
};

var connectionString = 'postgres://'+config.USER+':'+
	config.PASS+'@'+
	config.HOST+':'+
	config.PORT+'/'+
	config.DATABASE;

//var db = pgp("postgres://angelo:password@postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com:5432/postgresql1");
//var connectionString = "postgres://angelo:password@postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com:5432/postgresql1";
var db = pgp(connectionString);
// add query functions

function getAllPuppies(req, res, next) {
	db.any('select * from pups')
		.then(function (data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved All puppies'
				});
		})
		.catch(function (err) {
			return next(err);
		});
}

function getSinglePuppy(req, res, next) {
	var pupID = parseInt(req.params.id);
	db.one('select * from pups where id = $1', pupID)
		.then(function (data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved ONE puppy'
				});
		})
		.catch(function (err){
			return next(err);
		});
}

function createPuppy(req, res, next) {
	req.body.age = parseInt(req.body.age);
	db.none('insert into pups(name, breed, age, sex)' +
			'values(${name}, ${breed}, ${age}, ${sex})',
			req.body)
			.then(function(){
				res.status(200)
				.json({
					status: 'success',
					message: 'Inserted one puppy'
				});
			})
			.catch(function(err) {
				return next(err);
			});
}

function updatePuppy(req, res, next){
	db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id = $5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
    req.body.sex, parseInt(req.params.id)])
    .then(function () {
    	res.status(200)
    	.json({
    		status: 'success',
    		message: 'Updated puppy'
    	});
    })
    .catch(function (err){
    	return next(err);
    });
}

function removePuppy(req, res, next){
	var pupID = parseInt(req.params.id);
	db.result('delete from pups where id = $1, pupID')
		.then(function (result){
			/*jshint ignore:start*/
			res.status(200).
			json({
				status: 'success',
				message: 'Removed ${result.rowCount} puppy'
			});
		})
		.catch(function (){
			return next(err);
		});
}

module.exports = {
	getAllPuppies: getAllPuppies,
	getSinglePuppy: getSinglePuppy,
	createPuppy: createPuppy,
	updatePuppy: updatePuppy,
	removePuppy: removePuppy
};