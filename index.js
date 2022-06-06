const App = require('./src/app.js');
const app = new App(Math.floor(Math.random() * 900) + 3000);
app.run();

module.exports = app