//引进gulp
var gulp = require("gulp"),
	connect = require("gulp-connect"),
	//本地服务器编译响应
	respond = require("gulp-respond");

gulp.task("connect",function  () {
	connect.server({
		port:8888,
		livereload:true,
		middleware:function  () {
			return [function  (req,res,next) {
				//console.log(req.url)
				next();
			},function  (req,res) {
				var path = req.url.split("?").shift();      //shift剪切第一位返回第一位
				path = path == "/" ? "/index.html" : path;  //如果请求数据时空"/"证明打开默认页

				var url = "src" + path;

				gulp.src(url)						//用完整的url给bower去完成,然后响应在服务器
					.pipe(respond(res))
			}]
		}
	})
})
gulp.task("loadHtml",function  () {
	gulp.src("src/")
		.pipe(connect.reload());
})
var arr = [
	"src/*.html",
	"src/*.css",
	"src/*.js",
	"src/*.sass",
	"src/*.json",

	"src/*/*.html",
	"src/*/*.css",
	"src/*/*.js",
	"src/*/*.sass",
	"src/*/*.json",
	
	"src/*/*/*.html",
	"src/*/*/*.css",
	"src/*/*/*.js",
	"src/*/*/*.sass",
	"src/*/*/*.json"
];
gulp.task("watch",function  () {
	gulp.watch(arr,["loadHtml"]);
})
gulp.task("default",["watch","connect"]);

