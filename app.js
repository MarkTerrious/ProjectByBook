const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks =  require('nunjucks');
const dotenv = require('dotenv');

// ----------------------- 환경 설정 ------------------------
// config 폴더 안 config.js를 통해 환경 설정을 한다.
dotenv.config();
const pageRouter = require('./routes/page');
const {sequelize} = require('./models');

// Server Obj 생성
const app = express();
app.set('port', process.env.PORT || 8000);

// Nunjucks 셋팅
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({force : false})
.then(() => {
  console.log("데이터 베이스 연결 성공");
})
.catch((err) => {
  console.log(err);
});

// ------------------------- 환경 설정 끝 ---------------------
// ------------------------- 미들 웨어 ------------------------

// 로그 
app.use(morgan('dev'));
// 정적 파일 폴더 경로
app.use(express.static(path.join(__dirname, 'public')));
// 데이터 통신 방식을 json 형식으로 통일.
app.use(express.json());
app.use(express.urlencoded( { extended : false } ));
// 사용자 인증.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave : false,     // 똑같은 요청 => 업데이트 안함.(false)
  saveUninitiallized : false, // 세션 내용 존재 x 처음 부터 세션 생성 할지 선택
  secret : process.env.COOKIE_SECRET, // 쿠키 서명.
  cookie: {
    httpOnly : true,  // cookie browser에서 읽기 불가능.
    secure : false,   // https , http2
  }
}));
// 라우터
app.use('/', pageRouter);
// 사용자 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// -------------------------- 미들 웨어 끝 ----------------------------

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 서버 가동!');
})