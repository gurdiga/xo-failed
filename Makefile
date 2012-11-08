default: lint

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

deploy: lint stage
	@./build/deploy.sh prod

stage: lint
	@./build/deploy.sh preprod

what:
	@rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
