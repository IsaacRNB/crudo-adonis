'use strict'

const Contact = use('App/Models/Contact');
const User = use('App/Models/User');
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ContactController {

  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all()

      const validaToken = await auth.attempt(email, password)

      return validaToken
    } catch (err) {
      return response.status(500).send({ error: `Error: ${err.message}` })
    }

  }

  async register({ request }) {

    const { email, password, username } = await request.all()

    const user = await User.create({
      username,
      email,
      password
    })

    return this.login(...arguments)
  }

  async index({ request, response, view }) {
    let contacts = await Contact.query().with('user').fetch()
    return response.json(contacts)
  }

  async create({ request, response, view }) {
    try {

      const validacion = await validaAll(request.all(), {
        user
      })
      const data = request.only(["username", "email", "password"])

      const user = await User.create(data)

      return user

    } catch (err) {

      return response.status(500).send({ error: `Error: ${err.message}` })

    }

  }


  async store({ request, response, auth }) {
    try {

      const validacion  = await validateAll(request.all(),{
        name: 'required|min:5|unique:contacts',
        email: 'required|email|unique:contacts',
        title: 'required|min:5|unique:contacts',
        tel: 'required|min:10|unique:contacts',
      })

      if(validacion.fails()){
        return response.status(401).send({message: validacion.messages()})
      }

      const name = request.input('name')
      const email = request.input('email')
      const title = request.input('title')
      const tel = request.input('tel')

      const contact = new Contact()
      contact.name = name
      contact.email = email
      contact.title = title
      contact.tel = tel

      await contact.save()
      return response.json(contact)

    } catch (err) {
      return response.status(500).send({error: `Error: ${err.message}`})
    }

  }

  async update({ params, request, response }) {

    const name = request.input('name')
    const email = request.input('email')
    const title = request.input('title')
    const tel = request.input('tel')

    let contact = await Contact.find(params.id)

    contact.name = name
    contact.email = email
    contact.title = title
    contact.tel = tel
    await contact.save()
    return response.json(contact)
  }


  async destroy({ params, request, response }) {
    const contact = await Contact.find(params.id)
    await contact.delete()
    return `Contacto con id ${contact.id}, borrado`
  }
}

module.exports = ContactController
