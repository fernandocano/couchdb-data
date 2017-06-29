#
# Custom makefile for couchdb-data
#

cmsviews = cms/views/*.js

createdb:
	curl -X PUT http://slouchAdmin:shablagoo@127.0.1:5984/cms
	touch createdb

designdoc: createdb $(cmsviews)
	cp cms/design/ddoc.json designdoc;
	for x in $^ ; do \
		if [ "$${x##*.}x" != "jsx" ] ; then \
			continue ; \
		fi; \
		filename=$$(basename $${x} .js); \
		ismapfun=false; \
		isreducefun=false; \
		if [ "$${filename##*.}x" == "mapx" ] ; then \
			ismapfun=true; \
		elif [ "$${filename##*.}x" == "reducex" ] ; then \
			isreducefun=true; \
		fi; \
		vname=$${filename%.*}; \
		vtype=$${filename##*.}; \
		vfun="$$(tr -d "[:cntrl:]" < $$x)"; \
		jq ".views.$$vname.$$vtype|=\"$$vfun\"|." < designdoc > ddoc.json; \
		cp ddoc.json designdoc; \
	done;
	rm -f ddoc.json;

clean-local:
	curl -X DELETE http://slouchAdmin:shablagoo@127.0.0.1:5984/cms
	rm -f designdoc createdb


if DEBUG
CONF_ENV = dev
all-local: designdoc

else
CONF_ENV = prod
all-local: designdoc
endif

#.PHONY:
