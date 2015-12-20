# CONTRIBUTING
## Setting up your computer
I'm assuming that you're on a mac/linux computer. If not, you will need to look up how to do all these steps yourself. Sorry.

First, install the Google App Engine [Python SDK](https://cloud.google.com/appengine/downloads). Then, install [Node.js](http://nodejs.org). After installing node, use node to globally install Grunt and Bower. (open a terminal, type `sudo npm install -g grunt` press enter, and repeat for `sudo npm install -g bower`). Grunt is a task runner that we use to automate combinations of actions such as building all the files
and deploying to Google App Engine. Bower is a package manager for javascript, css, and other web stuff.

Next, use npm and bower to install the packages required. The folders `node_modules/` and `bower_components/` aren't synced through git, so you will need to install them all yourself. The package names are all specified in `bower.json` and `package.json`. `bower install` will install all the packages in `bower.json`, and `npm install` will install all the packages in `package.json`.

You will the `etchcode`, `etchcodeusercontent` and `scratchblock` repositories in the etchcode organization, and they all must have the same parent structure and keep their names the same as the repository names. My computer is set up like this:
	- etch/
		- etchcode/
		- etchcodeusercontent/
		- scratchblock/

## Important commands
The command `grunt watch` in the etchcode repository will listen for changes to the project files and execute the commands that need to be executed when there are changes. If you made changes without starting `grunt watch`, you can enter `grunt development` to run all the commands on all of the files. `grunt production` will execute all the commands that need to be run to set up the production version of etchcode at etchcode.org in the `build/` directory and then upload the `build/` directory to google app engine.

Use `bower install --save {insert package name}` to install a new package (such as angularjs or normalize.css). `bower search {keyword}` will search for packages. After installing new packages, run `grunt wiredep` to add the installed packages to the `index.html` file. Whenever possible use bower instead of just downloading the css/js, as it makes updating easier.

## The development server
`grunt local_server` will automatically run all the servers that need to be run. etchcode.org is served at `localhost:9090`, with the google app engine dev console for it at `localhost:9091`. etchcodeusercontent.appspot.com is run at `localhost:9000`, with it's dev server at `localhost:9001`. Run the dev servers through grunt and not the Google App Engine GUI to make sure that everything is in the right place. Those ports are hardcoded in the application and need to stay the same.

## SSL through letsencrypt.org
Daniel has a digitalocean ubuntu server with letsencrypt set up (the mac version is very buggy).

First download letsencrypt with `git clone https://github.com/letsencrypt/letsencrypt` (as of 17-12-2015 this only works on Linux).
`cd letsencrypt` to go to the letsencrypt directory and run `./letsencrypt-auto certonly --manual` to generate the certificate. The challenge body goes in `letsencrypt_key.txt`
and the challenge file name goes into app.yaml (replace the existing path).

After answering a few more questions you will be given a few files.

The public key file is just `fullchain.pem` and the private key file is privkey.pem and must be decrypted using `sudo openssl rsa -inform pem -in privkey.pem -outform pem | less`
(the last bit pipes it to less which will display it.)

Copypaste the public and private key files into a new certificate at https://console.cloud.google.com/appengine/settings/certificates?project=etchcode&moduleId=default. Save, and
test if it works using https://www.ssllabs.com/ssltest/index.html. We should get a "B" grade.

The certificate must be re-generated regularly. It must be generated next at **2016-03-17** (update this date if you regenerate the key).
