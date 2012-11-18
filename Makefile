default: lint test

lint: linthtml lintnginx lintphp
	@echo ""

linthtml:
	@echo -n "."
	@tidy -quiet -errors -utf8 -xml index.html

	@for formular in formulare/*.html; do \
		echo -n "."; \
		fgrep -v 'text/micro-template' $$formular | tidy -quiet -errors -utf8 -xml; \
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

PULL = git pull; git reset --hard origin/master
PUSH = git push

deploy: lint stage
	@ssh -p59922 nati@executori.org 'cd /var/www/executori.org; ${PULL}; build/start.sh'

stage: lint test
	@${PUSH}; ssh -p59922 nati@preprod.executori.org 'cd /var/www/preprod.executori.org; ${PULL}; build/start.sh'

what:
	@rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
