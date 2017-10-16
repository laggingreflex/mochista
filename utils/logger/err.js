const levels = require('./levels');

export default function modErr(logger) {
  logger._err = logger.err;
  logger.err = (...errs) => {
    const errObjects = [];
    let _logger = ::logger._err;
    errs = errs.map((err, i) => {
      if (err && err.message) {
        errObjects.push(err);
        return err.message;
      } else if (i == errs.length - 1 && Object.keys(levels).includes(err)) {
        _logger = ::logger[err];
        return '__remove__';
      } else {
        return err;
      }
    }).filter(v => v !== '__remove__');

    logger._err(...errs);
    _logger(...errObjects);
  }
}
