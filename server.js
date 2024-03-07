const { createServer } = require('http');
const { v4: uuid } = require('uuid');
const { returnRes, errorHandler } = require('./utils');

const todos = [];

const serverHandler = (req, res) => {
  const { url, method } = req;
  let body = '';
  req.on('data', (chunk) => (body += chunk.toString()));
  // Get all todos
  if (url === '/todos' && method === 'GET') {
    returnRes(res, todos);
  }
  // Get a single todo
  else if (url.startsWith('/todos/') && method === 'GET') {
    const id = url.split('/').pop();
    const todo = todos.find((todo) => todo.id === id);
    todo ? returnRes(res, todo) : errorHandler(res, 404, 'Todo Not Found');
  }
  // Create a new todo
  else if (url === '/todos' && method === 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (!title) return errorHandler(res, 400, 'Title is required');
        todos.push({ id: uuid(), title });
        returnRes(res, todos);
      } catch (error) {
        errorHandler(res, 400, 'Invalid JSON');
      }
    });
  }
  // Update a todo
  else if (url.startsWith('/todos/') && method === 'PATCH') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (!title) return errorHandler(res, 400, 'Title is required');
        const id = url.split('/').pop();
        const index = todos.findIndex((todo) => todo.id === id);
        if (index === -1) return errorHandler(res, 404, 'Todo Not Found');
        todos[index].title = title;
        returnRes(res, todos);
      } catch (error) {
        errorHandler(res, 400, 'Invalid JSON');
      }
    });
  }
  // Delete all todos
  else if (url === '/todos' && method === 'DELETE') {
    todos.length = 0;
    returnRes(res, todos);
  }
  // Delete a single todo
  else if (url.startsWith('/todos/') && method === 'DELETE') {
    const id = url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return errorHandler(res, 404, 'Todo Not Found');
    todos.splice(index, 1);
    returnRes(res, todos);
  }
  // Handle CORS
  else if (method === 'OPTIONS') {
    returnRes(res);
  } else {
    errorHandler(res, 404, 'Route not Found');
  }
};

const server = createServer((req, res) => serverHandler(req, res));

server.listen(process.env.PORT || 3005).addListener('listening', () => {
  console.log(`Server is listening on port ${process.env.PORT || 3005}`);
});
