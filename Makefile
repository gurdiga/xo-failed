default: tidy

tidy:
	@echo " - index.html"
	@tidy -quiet -errors -utf8 -xml index.html

	@for formular in formulare/*.html; do \
		echo " - $$formular"; \
		fgrep -v 'text/micro-template' $$formular | tidy -quiet -errors -utf8 -xml; \
	done

deploy:
	@./build/deploy.sh prod

preprod:
	@./build/deploy.sh preprod

ce:
	@rgrep --color --line-number --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
