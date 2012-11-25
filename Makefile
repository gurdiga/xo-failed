.SILENT:

default: lint test

lint: lint-html lint-nginx lint-php formulare
	echo ""

lint-html:
	echo -n "."
	tidy -quiet -errors -utf8 -xml index.html

lint-nginx:
	echo -n "."
	sudo /usr/sbin/nginx -t -q

lint-php:
	for script in bin/*; do \
		echo -n "."; \
		php -l $$script > /tmp/php-l.log || (cat /tmp/php-l.log && false); \
	done

.PHONY: formulare
formulare:
	formulare/build.sh

test: lint
	build/teste/integrare/start.sh

push:
	git push

pull:
	git fetch
	git checkout

build: pull
	build/start.sh

deploy: stage
	echo '---- Deploying production ----'
	ssh -p59922 nati@executori.org 'cd /var/www/executori.org && make build'

stage: lint test push
	echo '---- Deploying stage ----'
	ssh -p59922 nati@preprod.executori.org 'cd /var/www/preprod.executori.org && make build'

what:
	rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
