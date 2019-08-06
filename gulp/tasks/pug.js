const { src, dest } = require("gulp");
const pug = require("gulp-pug");

function pugTask() {
  return src("./src/pug/*.pug")
    .pipe(
      pug({
        pretty: "  "
      })
    )
    .pipe(dest("build"));
}

exports.pugTask = pugTask;
