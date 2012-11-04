default: tidy

tidy:
	@tidy -quiet -errors -utf8 -xml index.html
	@echo OK

deploy:
	@./build/deploy.sh prod

preprod:
	@./build/deploy.sh preprod

ce:
	@rgrep --exclude=qunit-1.10.0.js --exclude=csslint.js TODO js css bin build
