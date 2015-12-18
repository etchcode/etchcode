## SSL through letsencrypt.org
First download letsencrypt with `git clone https://github.com/letsencrypt/letsencrypt` (as of 17-12-2015 this only works on Linux).
`cd letsencrypt` to go to the letsencrypt directory and run `./letsencrypt-auto certonly --manual` to generate the certificate. The challenge body goes in `letsencrypt_key.txt`
and the challenge file name goes into app.yaml (replace the existing path).

After answering a few more questions you will be given a few files.

The public key file is just `fullchain.pem` and the private key file is privkey.pem and must be decrypted using `sudo openssl rsa -inform pem -in privkey.pem -outform pem | less` 
(the last bit pipes it to less which will display it.)

Copypaste the public and private key files into a new certificate at https://console.cloud.google.com/appengine/settings/certificates?project=etchcode&moduleId=default. Save, and
test if it works using https://www.ssllabs.com/ssltest/index.html. We should get a "B" grade.

The certificate must be re-generated regularly. It must be generated next at **2016-03-17** (update this date if you regenerate the key).