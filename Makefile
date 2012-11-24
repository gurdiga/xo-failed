default: lint test

lint: lint-html lint-nginx lint-php formulare
	@echo ""

lint-html:
	@echo -n "."
	@tidy -quiet -errors -utf8 -xml index.html

lint-nginx:
	@echo -n "."
	@sudo /usr/sbin/nginx -t -q

lint-php:
	@for script in bin/*; do \
		echo -n "."; \
		php -l $$script > /tmp/php-l.log || (cat /tmp/php-l.log && false); \
	done

test: lint
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

.PHONY: formulare
formulare:
	@for formular in formulare/*.părţi; do \
		for parte in $$formular/*.html; do \
			tidy -quiet -errors -utf8 -xml < $$parte; \
			RETVAL=$$?; \
			if [ $$RETVAL -ne 0 ]; then echo "$$parte\n"; exit $$RETVAL; fi; \
		done; \
		\
		DESTINATIE=`echo $$formular | sed 's/.părţi/.html/'`; \
		\
		php $$formular/conţinut.html > $$DESTINATIE; \
		RETVAL=$$?; \
		if [ $$RETVAL -ne 0 ]; then echo "$$formular\n"; exit $$RETVAL; fi; \
		\
		tidy -quiet -errors -utf8 -xml < $$DESTINATIE && echo -n "."; \
		RETVAL=$$?; \
		if [ $$RETVAL -ne 0 ]; then echo "$$formular\n"; exit $$RETVAL; fi; \
	done
