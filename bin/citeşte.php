<?

$file = '..' . $_SERVER['REQUEST_URI'] . '.gz';

header('Content-Length: ' . filesize($file));
readfile($file);
