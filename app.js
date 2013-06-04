var express = require('express');
var app = express();

app.configure(function(){
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});
app.get('/account/authenticated', function(req,res){
	if (req.session.loggedIn) {
		res.send(200);
	} else {
		res.send(401);
	}
});

app.post('/register', function(req, res){
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if (null == email || null == password) {
		res.send(400);
		return;
	}

	Account.regiester(email, password, firstName, lastName);
	res.send(200);
});

app.post('/login', function(req, res){
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if (
		null == email || 
		email.length < 1 || 
		null == password ||
		password.length < 1
	) {
		res.send(400);
		return;
	}

	
});

app.post('/forgotpassword', function(req,res){
	var hostname = req.headers.host;
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	var email = req.param('email', null);
	if (null == email || email.length < 1) {
		res.send(400);
		return;
	}

	Account.forgotPassword(email, resetPasswordUrl, function(success){
		if (success) {
			res.send(200);
		} else {
			res.send(404);
		}
	});
});

app.get('/resetPassword', function(req, res){
	var accountId = req.param('account', null);
	res.render('resetPassword.jade', {locals: {accountId: accountId}});
});

app.post('/resetPassword', function(req, res){
	var accountId = req.param('accountId', null);
	var password = req.param('password', null);
	if (null != accountId && null != password) {
		Account.changePassword(accountId, password);
	}
	res.render('resetPasswordSuccess.jade');
});

app.get('/', function(req,res){
	res.render("index.jade", {layout:false});
});

app.listen(8080);