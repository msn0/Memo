# Set the source directory
distdir = dist/
jsdir = lib/
git=`which git`

files = ${jsdir}jquery-1.5.js \
	${jsdir}underscore-1.1.6.js \
	${jsdir}backbone.js \
	${jsdir}backbone-localstorage.js \
	${jsdir}app.js

all: memo-dev.js memo.js w3c-validator

# Combine all of the files into memo-dev.js
memo-dev.js: ${files}
	cat > $@ $^

# Compress memo-dev.js into memo.js
memo.js: memo-dev.js
	-java -jar lib/compiler.jar --js $^ --js_output_file $@
	-cp $@ $^ ${distdir}
	-rm $@ $^

# Validate
w3c-validator: index.html
	@@echo "Validating started ..."
	-@@if [ ! -d w3c-validator ]; then \
		git clone https://github.com/srackham/w3c-validator.git; \
	fi
	-@@python w3c-validator/w3c-validator.py index.html
	@@echo "Validated"
