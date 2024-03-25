/**
 * Actividad.js
 *
 * Integrante del equipo de la demostración.
 */

 module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre: {
      type: 'string',
      required: true
    },

    orden: {
      type: 'number',
      required: true
    },

    sistemaPrueba: {
      type: 'string',
      maxLength: 120             
    },

    aplica: {
      type: 'boolean',
      defaultsTo: true
    },

    descripcion: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    fechaInicial: {
      type: 'number'
    },

    fechaFinal: {
      type: 'number'
    },

    avanceReal: {
      type: 'number',
      defaultsTo: 0
    },

    observaciones: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    ayudaPaLoQueViene: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    ponerseAlDia: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    experimentos: {
      collection: 'experimento',
      via: 'owner'
    },

    avances: {
      collection: 'avance',
      via: 'owner'
    },

    owner: {
      model: 'demo',
    },

    notasAvance: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    riesgosyAlertas: {
      type: 'string',
      columnType: 'varchar(2000)'
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
