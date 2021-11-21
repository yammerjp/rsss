type RequestHandler = (request: Request) => Promise<Response>;

class Router {
  private getHandlers: {[key: string]: RequestHandler} = {};

  private commonHeaders: {[key: string]: string} = {};
  registerCommonHeader(key: string, value: string) {
    this.commonHeaders[key] = value;
  }
  private appendCommonHeaders(response: Response): void {
    Object.keys(this.commonHeaders).forEach((key: string) => {
      const value = this.commonHeaders[key];
      response.headers.append(key, value)
    })
  }

  get(relativePath: string, handler: RequestHandler) {
    this.getHandlers[relativePath] = handler;
  }
  callRegisteredHandler(request: Request): Response|Promise<Response> {
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

  async handle(request: Request):Promise<Response> {
    const response = await this.callRegisteredHandler(request)
    this.appendCommonHeaders(response)
    return response;
  }
}

export { Router };
export type { RequestHandler };
