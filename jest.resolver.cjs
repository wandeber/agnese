module.exports = (request, options) => {
  try {
    return options.defaultResolver(request, options);
  }
  catch (error) {
    if (request.startsWith("./") && request.endsWith(".js")) {
      const tsRequest = `${request.slice(0, -3)}.ts`;
      try {
        return options.defaultResolver(tsRequest, options);
      }
      catch {
        // Ignore and rethrow original error below.
      }
    }
    throw error;
  }
};

