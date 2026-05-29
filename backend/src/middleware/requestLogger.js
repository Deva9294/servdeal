// Request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} | ${req.method} ${req.path} | Status: ${res.statusCode} | ${duration}ms`
    );
  });
  
  next();
};

export default requestLogger;
