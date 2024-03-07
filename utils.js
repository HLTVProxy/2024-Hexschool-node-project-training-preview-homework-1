const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

const returnRes = (res, data) => {
  res.writeHead(200, headers);
  data && res.write(JSON.stringify({ status: 'success', data }));
  res.end();
};

const errorHandler = (res, errorCode, message) => {
  res.writeHead(errorCode, headers);
  res.write(JSON.stringify({ status: 'error', message }));
  res.end();
};

module.exports = {
  returnRes,
  errorHandler,
};
