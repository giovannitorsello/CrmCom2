######################
# Become a Certificate Authority
######################

# Generate private key
openssl genrsa -des3 -out wifinetcomDevCA.key 2048
# Generate root certificate
openssl req -x509 -new -nodes -key wifinetcomDevCA.key -sha256 -days 3650 -out wifinetcomDevCA.pem

######################
# Create CA-signed certs
######################

NAME=crmcom2.wifinetcom.net
# Use your own domain name
# Generate a private key
openssl genrsa -out $NAME.key 2048
# Create a certificate-signing request
openssl req -new -key $NAME.key -out $NAME.csr
# Create a config file for the extensions
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = crmcom2.wifinetcom.net
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA wifinetcomDevCA.pem -CAkey wifinetcomDevCA.key -CAcreateserial -out $NAME.crt -days 825 -sha256 -extfile $NAME.ext
