bus_server
==========

Bus application with EMDEC website parser

The approach is pretty simple, here we just simulate the google api classes and eval the javascript.

The server updates its database every 2 hours, the request to check if it is up to date have to be make this way:

127.0.0.1:8000/?file=line_1.json&hash=MD5HASHOFYOURFILE

To get the file count, just do this get request:

127.0.0.1:8000/?count


TODO List : - : - : - : - :
*Create a base version number.
*When updating the server DB, see if there is a diff between the old json folder
and the new json folder with node-directory-diff. If:
	- there was a diff, save the file names in a json, the new count and the new version at update.json. Delete the old folder and rename the new one.
	- there wasn`t a diff, delete the new_json folder and set the update.json to nil.

*Implement server handle with database version query, returning the json differences. Then the app have to deal with it and make others requests.

**** IF there isn`t enough time do to all of these jobs, just stick with the original plan.

