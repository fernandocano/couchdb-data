#
# Custom makefile for couchdb-data
#

cmsviews = cms/views/*.js
blogviews = blog/views/*.js
actionviews = action/views/*.js
cmsdocs := $(patsubst %.json,%.o,$(wildcard cms/docs/*.json))
blogdocs := $(patsubst %.json,%.o,$(wildcard blog/docs/*.json))
resource := http://slouchAdmin:shablagoo@127.0.0.1:5984
jsonHdr := Content-Type: application/json

createdb: createcmsdb createblogdb createactiondb
	touch $@

createcmsdb:
	$(CURL) -X PUT $(resource)/cms

createblogdb:
	$(CURL) -X PUT $(resource)/blog

createactiondb:
	$(CURL) -X PUT $(resource)/action

define loadddoc =
	cp ddoc.json $(1)designdoc
	for x in $^ ; do \
		[[ "$${x##*.}x" != "jsx" ]] && continue; \
		filename=$$(basename $${x} .js); \
		vname=$${filename%.*}; \
		vtype=$${filename##*.}; \
		vfun="$$(tr -d "[:cntrl:]" < $$x)"; \
		$(JQ) ".views.$$vname.$$vtype|=\"$$vfun\"|." < $(1)designdoc > ddoc_tmp; \
		mv ddoc_tmp $(1)designdoc; \
	done
	$(CURL) -X PUT -H "$(jsonHdr)" -d @$(1)designdoc $(resource)/$(1)/_design/ddoc
endef

define loaddoc =
	docid=$$($(JQ) -j '._id' $<); \
	if [[ "$$($(CURL) -s -w %{http_code} -X GET $(resource)/$(1)/$${docid})" =~ "404" ]] ; then \
		$(CURL) -X POST -H "$(jsonHdr)" -d @$< $(resource)/$(1) && touch $@; \
	else \
		docver=$$($(CURL) -s --head $(resource)/$(1)/$${docid} | grep ETag | cut -d\" -f2); \
		$(JQ) --arg rev $${docver} '. + {_rev: $$rev}' $< |  $(CURL) -X PUT -H "$(jsonHdr)" -d @- $(resource)/$(1)/$${docid} && touch $@; \
	fi
endef

cmsdesigndoc: createdb $(cmsviews)
	$(call loadddoc,cms)

blogdesigndoc: createdb $(blogviews)
	$(call loadddoc,blog)

actiondesigndoc: createdb $(actionviews)
	$(call loadddoc,action)

cms/docs/%.o: cms/docs/%.json cmsdesigndoc
	$(call loaddoc,cms)

blog/docs/%.o: blog/docs/%.json blogdesigndoc
	$(call loaddoc,blog)

cmsbuild: $(cmsdocs) $(blogdocs) actiondesigndoc
	touch $@

clean-local:
	$(CURL) -X DELETE $(resource)/cms
	$(CURL) -X DELETE $(resource)/blog
	rm -f *designdoc createdb cmsbuild cms/docs/*.o blog/docs/*.o


if DEBUG
CONF_ENV = dev
all-local: cmsbuild

else
CONF_ENV = prod
all-local: cmsbuild
endif

.PHONY: createcmsdb createblogdb createactiondb
