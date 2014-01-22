bus_server
==========

Bus application with EMDEC website parser

The approach is pretty simple, here we just simulate the google api classes and eval the javascript.

The server updates its database every 2 hours, the request to check if it is up to date have to be make this way:

127.0.0.1:8000/?file=line_1.json&hash=MD5HASHOFYOURFILE

To get the file count, just do this get request:

127.0.0.1:8000/?count
