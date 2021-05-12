const gulp = require('gulp');
const bump = require('gulp-bump');
const replace = require('gulp-replace');
const fs = require('fs');

gulp.task('dist:clean', function (done) {
    const packageJson = JSON.parse(fs.readFileSync('./dist/package.json').toString());
    delete packageJson.devDependencies;
    delete packageJson.scripts;

    // todo #hack to remove : tslib
    delete packageJson.dependencies.tslib;
    fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));

    // todo #hack to remove : pouchdb-adapter-cordova-sqlite
    delete packageJson.dependencies['pouchdb-adapter-cordova-sqlite'];
    fs.writeFileSync('./bower.json', JSON.stringify(packageJson, null, 2));

    fs.writeFileSync('./dist/RELEASE.md', fs.readFileSync('./RELEASE.md').toString());

    done();
});

function bumpPackage() {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
}

function bumpVersion() {

    // Get bumped version
    const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

    // Set to Bower and version.ts
    const bowerJson = JSON.parse(fs.readFileSync('./bower.json').toString());
    bowerJson.version = packageJson.version;
    fs.writeFileSync('./bower.json', JSON.stringify(bowerJson, null, 2));
    return gulp
        .src('src/version/index.ts')
        .pipe(replace(/'[0-9].+'/g, "'" + packageJson.version + "'"))
        .pipe(gulp.dest('src/version/'));
}

const bumpTask = gulp.series(bumpPackage, bumpVersion);

gulp.task('bump:package', bumpPackage);

gulp.task('bump', bumpTask);
