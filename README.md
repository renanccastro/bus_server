bus_server
==========

Bus application with EMDEC website parser

The approach is pretty simple, here we just simulate the google api classes and eval the javascript.

The server updates its database every 2 hours, the request to check if it is up to date have to be make this way:

127.0.0.1:8080/?file=line_1.json&hash=MD5HASHOFYOURFILE
