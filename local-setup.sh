#!/bin/sh

SCRIPT=$(readlink -f "$0" || greadlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

ln -sf "$SCRIPTPATH" /var/qt/sportbook

# set hosts
setHost()
{
  sudo sed -ie "\|^127.0.0.1 $1\$|d" /etc/hosts
  echo "127.0.0.1 $1" | sudo tee -a /etc/hosts
}
setHost sportbook.quicktext.local

# install sportbook
klocal apply -f /var/qt/sportbook/k8s/local

echo
echo "Waiting for deployment to be available"
klocal wait deployment/sportbook --for condition=available --timeout=3h
echo "Deployment is now available"
echo
echo "✅ Sportbook is running at: https://sportbook.quicktext.local"
