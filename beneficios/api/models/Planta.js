/**

 * Planta.js

 *

 * A user who can log in to this application.

 */

 module.exports = {

  datastore: 'usersdb',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    registro: {
      type: 'string',
      required: true,
      unique: true
    },

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'mary.sue@example.com'
    },

    fullName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name.',
      maxLength: 120,
      example: 'Mary Sue van der McHenst'
    },

    gerencia: {
      type: 'string'
    },

    departamento: {
      type: 'string'
    },
    
    owner: {
      model: 'user',
      unique: true
    },

    rolComisiones: {
      type: 'string',
      defaultsTo: 'profesional'
    },

    rolBeneficios: {
      type: 'string',
      defaultsTo: 'profesional'
    },

    rolDemostraciones: {
      type: 'string',
      defaultsTo: 'profesional'
    },

    rolConvenios: {
      type: 'string',
      defaultsTo: 'profesional'
    },

    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },

    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // n/a

  },

};

