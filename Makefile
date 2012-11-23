default: lint test

lint: linthtml lintnginx lintphp
	@echo ""

linthtml:
	@echo -n "."
	@tidy -quiet -errors -utf8 -xml index.html

	@for formular in formulare/*.html; do \
		echo -n "."; \
		fgrep -v 'text/micro-template' $$formular | tidy -quiet -errors -utf8 -xml || echo "$$formular\n"; \
	done

lintnginx:
	@echo -n "."
	@sudo /usr/sbin/nginx -t -q

lintphp:
	@for script in bin/*; do \
		echo -n "."; \
		php -l $$script > /tmp/php-l.log || (cat /tmp/php-l.log && false); \
	done

test:
	@build/teste/integrare/start.sh

push:
	git push

pull:
	git pull

build: pull
	@build/start.sh

deploy: stage
	@echo '---- Deploying production ----'
	@ssh -p59922 nati@executori.org 'cd /var/www/executori.org && make build'

stage: lint test push
	@echo '---- Deploying stage ----'
	@ssh -p59922 nati@preprod.executori.org 'cd /var/www/preprod.executori.org && make build'

what:
	@rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
