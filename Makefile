# Set the source directory
srcdir = lib/

files = ${srcdir}backbone.js ${srcdir}backbone-localstorage.js ${srcdir}jquery-1.5.js ${srcdir}underscore-1.1.6.js ${srcdir}app.js

all: memo-dev.js memo.js

# Combine all of the files into spark-dev.js
memo-dev.js: ${files}
	cat > $@ $^

# Compress memo-dev.js into memo.js
memo.js: memo-dev.js
	java -jar compiler.jar --js $^ --js_output_file $@
