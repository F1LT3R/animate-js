build:
	@mkdir -p target
	@rm target/animate.js
	@rm target/animate.min.js
	@rm target/animate.min.gz.js
	@uglifyjs src/animate.js -o target/animate.js
	@uglifyjs src/animate.js -o target/animate.min.js -m
	@gzip -c target/animate.min.js > target/animate.min.gz.js