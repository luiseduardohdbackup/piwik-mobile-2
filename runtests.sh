export PATH=/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/MacGPG2/bin

titanium build -p mobileweb
phantomjs --web-security=no --local-to-remote-url-access=yes testrunner.js