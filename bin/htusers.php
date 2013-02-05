<?

if (isset($_SERVER['SHELL'])) {
  define('HTUSERS', realpath(dirname(dirname(__FILE__))) .'/.htusers');
  require_once './bin/htusers-cli.php';
} else {
  define('HTUSERS', "{$_SERVER['DOCUMENT_ROOT']}/.htusers");
}


# --------------------------------------------------

function register_user($login, $password) {
	$hash = encrypt_passsword($password);

	if (file_exists(HTUSERS)) {
		delete_user($login);
		$old_content = file_get_contents(HTUSERS);
	} else {
		$old_content = '';
	}

	file_put_contents(HTUSERS, "$old_content$login:$hash\n");
}

# --------------------------------------------------

function delete_user($login) {
	$htusers = file_get_contents(HTUSERS);

	if (!user_registered($login, $htusers)) return;

	$htusers = preg_replace("/\n$login:.*$/m", '', $htusers);
	file_put_contents(HTUSERS, $htusers);
}

# --------------------------------------------------

function change_password($login, $new_password) {
	$htusers = file_get_contents(HTUSERS);

	if (!user_registered($login, $htusers)) return;

	$old_record = "/\n$login:.*$/m";
	$new_record = "\n$login:" . encrypt_passsword($new_password);
	$htusers = preg_replace($old_record, $new_record, $htusers);

	file_put_contents(HTUSERS, $htusers);
}

# --------------------------------------------------

function encrypt_passsword($password) {
	return crypt($password, base64_encode($password));
}

# --------------------------------------------------

function registered_users() {
	$records = file(HTUSERS);
	$logins = array();

	foreach ($records as $record) {
		if (!trim($record)) continue;

		list($login, $hash) = explode(':', $record);
		$logins[] = $login;
	}

	return $logins;
}

# --------------------------------------------------

function user_registered($login, $htusers=null) {
	if ($htusers == null) $htusers = file_get_contents(HTUSERS);

	return !(strpos($htusers, "\n$login:") === false);
}
