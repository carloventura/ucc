// filepath: /workspaces/ucc/app/api/converter/middleware.js
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: ['http://localhost:3000', 'https://bookish-couscous-6w6957p5pw6347w7-3000.app.github.dev'], // Specify the allowed origins here
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };