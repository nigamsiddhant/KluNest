// This file helps configure the debugger properly
if (__DEV__) {
  // Set the correct debugger host
  if (global.location) {
    global.location.hostname = 'localhost';
    global.location.port = '8081';
  }
  
  // Enable network inspection
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
  global.FormData = global.originalFormData || global.FormData;
  
  if (window.__FETCH_SUPPORT__) {
    window.__FETCH_SUPPORT__.blob = false;
  }
  
  console.log('Debugger setup complete');
}