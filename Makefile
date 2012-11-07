default: lint

lint: linthtml lintnginx lintphp

linthtml:
	@echo " - index.html"
	@tidy -quiet -errors -utf8 -xml index.html

	@for formular in formulare/*.html; do \
		echo " - $$formular"; \
		fgrep -v 'text/micro-template' $$formular | tidy -quiet -errors -utf8 -xml; \
	done

lintnginx:
	@# TODO lintnginx

lintphp:
	@# TODO lintphp

deploy: lint stage
	@./build/deploy.sh prod

stage: lint
	@./build/deploy.sh preprod

what:
	@rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
