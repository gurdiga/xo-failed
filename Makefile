.SILENT:

default: test

lint: lint-bash lint-html lint-nginx lint-php formulare

lint-html:
	echo "HTML lint."
	tidy -quiet -errors -utf8 -xml index.html

lint-nginx:
	echo "nginx lint."
	sudo /usr/sbin/nginx -t -q

lint-php:
	build/lint-php.sh

lint-bash:
	build/lint-bash.sh

.PHONY: formulare
formulare:
	echo -n "Compilez formulare încheieri"
	formulare-încheieri/build.sh
	echo ""

test: lint
	build/teste/server/start.sh

push:
	git push

pull:
	git fetch --force --depth 50
	git checkout master
	git reset --hard origin/master
	git gc

.PHONY: build
build: lint-bash lint-html lint-php formulare
	build/start.sh

deploy: push
	ssh -p59922 nati@executori.org 'bash -s' < ./build/stage.sh

rollback:
	echo TODO
	false

stage: lint test push
	echo '---- Deploying stage ----'
	ssh -p59922 nati@stage.executori.org 'cd /var/www/stage.executori.org && make pull && make build'
	#ssh -p59922 nati@executori.org 'bash -s' NGINX < ./build/stage.sh

what:
	rgrep --color --line-number --exclude=qunit-1*.js --exclude=csslint.js TODO js css bin build formulare-încheieri/*.părţi || true
