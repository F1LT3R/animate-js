build:
	@mkdir -p target
	@uglifyjs src/animate.js -o target/animate.js
	@uglifyjs src/animate.js -o target/animate.min.js -m
	@gzip -c target/animate.min.js > target/animate.min.gz.js