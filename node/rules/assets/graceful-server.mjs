import {createServer} from 'node:http';
import closeWithGrace from 'close-with-grace';

/**
 * Example of a graceful HTTP server using close-with-grace.
 * Demonstrates proper shutdown handling without connection tracking.
 */

let isShuttingDown = false;

function createHandler() {
  /**
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   */
  return (req, res) => {
    // During shutdown, disable keep-alive to drain connections
    if (isShuttingDown) {
      res.setHeader('Connection', 'close');
    }

    // Health check endpoint
    if (req.url === '/health') {
      if (isShuttingDown) {
        res.writeHead(503, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'shutting_down'}));

        return;
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: 'healthy'}));

      return;
    }

    // Default response
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Hello, World!'}));
  };
}

/** @param {import('node:http').Server} server */
function closeServer(server) {
  return new Promise((resolve, reject) => {
    // Close idle connections immediately
    server.closeIdleConnections();

    server.close((err) => {
      if (err && err.message !== 'Server is not running') {
        reject(err);

        return;
      }
      resolve();
    });

    // Force close all connections after timeout
    setTimeout(() => {
      server.closeAllConnections();
    }, 5000);
  });
}

export async function main() {
  const server = createServer(createHandler());

  server.listen(3000, '0.0.0.0', () => {
    console.log('Server listening on http://0.0.0.0:3000');
  });

  closeWithGrace({delay: 10000}, async({signal, err}) => {
    if (err) {
      console.error('Error triggered shutdown:', err);
    }

    console.log(`${signal} received, starting graceful shutdown...`);
    isShuttingDown = true;

    await closeServer(server);
    console.log('Server closed successfully');
  });
}

// Run if executed directly
const isMain = process.argv[1]?.endsWith('graceful-server.mjs') ?? false;

if (isMain) {
  main().catch(console.error);
}
