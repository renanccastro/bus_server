bus_server
==========

Bus application with EMDEC website parser

The approach is pretty simple, here we just simulate the google api classes and eval the javascript.

The server updates its database every 2 hours, the request to check if it your file is up to date have to be make this way:

``
127.0.0.1:8000/?file=line_1.json&hash=MD5HASHOFYOURFILE
``<br\>
<br\>
To get the file count, just do this get request:<br\>
``
127.0.0.1:8000/?count
``<br\>

Now, if you want to update your local database:<br\>

``
    127.0.0.1:8000/update?version=YOURVERSIONHERE
``

and it will return the json with the necessary info to update.<br\>
 and then:<br\>
 ``
    127.0.0.1:8000/get_json?file=DIFF-FILES-ONE-PER-ONE
    ``
<br\>
More info, read the WIKI.

