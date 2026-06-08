export function captureRawBody(req, _res, buffer) {
  if (buffer && buffer.length) {
    req.rawBody = buffer.toString('utf8');
  }
}
