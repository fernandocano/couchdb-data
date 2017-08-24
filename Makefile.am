#
# Custom makefile for couchdb-data
#

cmsviews = cms/views/*.js
cmsdocs := $(patsubst %.json,%.o,$(wildcard cms/docs/*.json))
resource := http://slouchAdmin:shablagoo@127.0.0.1:5984
jsonHdr := Content-Type: application/json

createdb:
	$(CURL) -X PUT $(resource)/cms && touch $@

designdoc: createdb $(cmsviews)
	cp cms/design/ddoc.json designdoc;
	for x in $^ ; do \
		if [ "$${x##*.}x" != "jsx" ] ; then \
			continue ; \
		fi; \
		filename=$$(basename $${x} .js); \
		vname=$${filename%.*}; \
		vtype=$${filename##*.}; \
		vfun="$$(tr -d "[:cntrl:]" < $$x)"; \
		$(JQ) ".views.$$vname.$$vtype|=\"$$vfun\"|." < designdoc > ddoc.json; \
		cp ddoc.json designdoc; \
	done;
	rm -f ddoc.json;
	$(CURL) -X PUT -H "$(jsonHdr)" -d @designdoc $(resource)/cms/_design/ddoc;

cms/docs/%.o: cms/docs/%.json designdoc
	docid=$$($(JQ) -j '._id' $<); \
	if [[ "$$($(CURL) -s -w %{http_code} -X GET $(resource)/cms/$${docid})" =~ "404" ]] ; then \
		$(CURL) -X POST -H "$(jsonHdr)" -d @$< $(resource)/cms && touch $@; \
	else \
		docver=$$($(CURL) -s --head $(resource)/cms/$${docid} | grep ETag | cut -d\" -f2); \
		$(JQ) --arg rev $${docver} '. + {_rev: $$rev}' $< |  $(CURL) -X PUT -H "$(jsonHdr)" -d @- $(resource)/cms/$${docid} && touch $@; \
	fi

cmsbuild: $(cmsdocs)
	touch $@

clean-local:
	$(CURL) -X DELETE $(resource)/cms
	rm -f designdoc createdb cmsbuild


if DEBUG
CONF_ENV = dev
all-local: cmsbuild

else
CONF_ENV = prod
all-local: cmsbuild
endif

#.PHONY:
