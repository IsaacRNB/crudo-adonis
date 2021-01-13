'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


class Contact {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    
    if(request.header('name') == 'ISAAC' || request.header('name') == 'isaac')
    {
        await next()
    }
    else
    {
      response.send('No eres isaac, no puedes ver informacion')
    }
    
  }
}

module.exports = Contact
