export default function logger(req, _res, next) {
  req.requestTime = new Date();
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}
