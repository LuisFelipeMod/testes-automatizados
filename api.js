import { once } from "node:events";
import { createServer } from "node:http";
import JWT from 'jsonwebtoken'

const DEFAULT_USER = {
  user: 'luismodesto',
  password: '1234'
}

const JWT_KEY = 'abc123'

async function loginRoute(request, response){
  const {user, password} = JSON.parse(await once(request, 'data'))
  if (user !== DEFAULT_USER.user || password !== DEFAULT_USER.password){
    response.writeHead(401)
    response.end(JSON.stringify({ error: 'user invalid!' }))
    return;
  }
  const token = JWT.sign({ user, message:'hellooo' }, JWT_KEY)
  response.end(JSON.stringify({ token }))
}

async function handler(request, response) {

  if (request.url === '/login' && request.method === 'POST'){
    return loginRoute(request, response)
  }
  response.end("Hello World!");
};

const app = createServer(handler).listen(3000, () =>
  console.log("listening at 3000")
);

export { app };
