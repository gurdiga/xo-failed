.PHONY: formulare
formulare:
	for formular in formulare/*.părţi; do \
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
