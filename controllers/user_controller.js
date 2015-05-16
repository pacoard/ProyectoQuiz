//Controlador para los usuarios
var users = { admin: {id: 1, username: "admin", password: "1234"},
			  paco: {id: 2, username: "paco", password: "5678"}
			};

//Autenticación: vemos si el usuario está registrado.
//Si no lo estaba o hay algún otro error, se ejecuta callback(error)
exports.autenticar = function(login,password,callback) {
	if (users[login]) {
		if (password === users[login].password)
			callback(null, users[login]);
		else 
			callback(new Error('Password erróneo.'));
	}
	else callback(new Error('No existe el usuario.'));
};