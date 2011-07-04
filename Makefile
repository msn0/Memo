# Set the source directory
distdir = dist/
jsdir = lib/

files = ${jsdir}jquery-1.5.js \
	${jsdir}underscore-1.1.6.js \
	${jsdir}backbone.js \
	${jsdir}backbone-localstorage.js \
	${jsdir}app.js

all: memo-dev.js memo.js

# Combine all of the files into memo-dev.js
memo-dev.js: ${files}
	cat > $@ $^

# Compress memo-dev.js into memo.js
memo.js: memo-dev.js
	java -jar lib/compiler.jar --js $^ --js_output_file $@
	cp $@ $^ ${distdir}
	rm $@ $^
