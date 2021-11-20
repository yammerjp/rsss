type RequestHandler = (request: Request) => Promise<Response>;

class Router {
  private getHandlers: {[key: string]: RequestHandler};

  constructor() {
    this.getHandlers = {};
  }

  get(relativePath: string, handler: RequestHandler) {
    this.getHandlers[relativePath] = handler;
  }
  handle(request: Request):Response|Promise<Response> {
    const path = `/${request.url.split('/').slice(3).join('/')}`
    console.log(`request: ${path}`)

    if (request.method === 'GET') {
      if (!this.getHandlers[path]) {
        return new Response('Not Found', { status: 404})
      }
      try {
        return this.getHandlers[path](request)
      } catch(e) {
        console.error(e)
        return new Response(e.toString(), {status: 500})
      }
    }

    return new Response('Method Not Allowed', { status: 405})
  }
}


export { Router };
export type { RequestHandler };
