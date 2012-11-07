<?

$file = '..' . $_SERVER['REQUEST_URI'] . '.gz';

header('Content-Length: ' . filesize($file));
header('Content-Encoding: gzip');
readfile($file);
