/**
 * Demo.js
 *
 * Demotración.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre: {
      type: 'string',
      required: true,
      maxLength: 200
    },

    nombreLider: {
      type: 'string',
      maxLength: 200
    },

    nombreJefe: {
      type: 'string',
      maxLength: 200
    },

    departamento: {
      type: 'string'
    },

    gerencia: {
      type: 'string'
    },

    integrantes: {
      collection: 'integrante',
      via: 'lider'
    },

    areaImplementacion: {
      type: 'string'
    },

    modeloDesarrollo: {
      type: 'string'
    },

    nombreAliado: {
      type: 'string'
    },

    modeloMadurez: {
      type: 'number'
    },

    lider: {
      model: 'user'
    },

    actividades: {
      collection: 'actividad',
      via: 'owner'
    }

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
