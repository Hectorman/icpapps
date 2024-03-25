/**
 * Comision.js
 *
 * Modelo de Comisión.
 */

module.exports = {
  datastore: 'comisionesdb',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    ciudad: {
      type: 'string'
    },

    pais: {
      type: 'string'
    },

    departamento: {
      type: 'string'
    },

    entidad: {
      type: 'string'
    },

    fechaFinal: {
      type: 'number',
      required: true
    },

    fechaInicial: {
      type: 'number',
      required: true
    },

    gerencia: {
      type: 'string'
    },

    impactoComision: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    nombres: {
      type: 'string'
    },

    objeto: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    tipoComision: {
      type: 'string'
    },

    tipoDestino: {
      type: 'string'
    },

    ponencia: {
      type: 'boolean',
      defaultsTo: false
    },

    numeroFicha: {
      type: 'string'
    },

    ciudadOrigen: {
      type: 'string'
    },

    observaciones: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    cecografo: {
      type: 'string',
      defaultsTo: 'ceco'
    },

    grafo: {
      type: 'string'
    },

    urgente: {
      type: 'boolean',
      defaultsTo: false
    },

    indexBandeja: {
      type: 'number',
      defaultsTo: 0
    },

    rechazada: {
      type: 'boolean',
      defaultsTo: false
    },

    motivoRechazo: {
      type: 'string',
      columnType: 'varchar(2000)'
    },

    owner: {
      model: 'user'
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
