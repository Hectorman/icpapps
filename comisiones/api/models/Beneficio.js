/**
 * Comision.js
 *
 * Modelo de Comisión.
 */

 module.exports = {
   datastore: 'beneficiosdb',
   attributes: {
 
     //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
     //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
     //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
 
    titulo: {
       type: 'string'
    },
 
    estado: {
       type: 'string'
    },
 
    asignadoA: {
       type: 'number'
    },
 
    objetivoGeneral: {
       type: 'string',
       columnType: 'longtext'
    },
 
    objetivosEspecificos: {
       type: 'string',
       columnType: 'longtext'
    },
 
    tipologia: {
       type: 'string',
       columnType: 'longtext'
    },
 
    investigacion: {
       type: 'string',
       columnType: 'longtext'
    },
 
    innovacion: {
       type: 'string',
       columnType: 'longtext'
    },
 
    desarrollo: {
       type: 'string',
       columnType: 'longtext'
    },
 
    lider: {
       type: 'string',
       columnType: 'longtext'
    },
 
    valorVigencias: {
       type: 'string',
       columnType: 'longtext'
    },
 
    archivoUno: {
       type: 'string',
       columnType: 'longtext'
    },
 
    filenameUno: {
       type: 'string'
    },
 
    fechaUno: {
       type: 'string'
    },
 
    archivoDos: {
       type: 'string',
       columnType: 'longtext'
    },
 
    filenameDos: {
       type: 'string'
    },
 
    fechaDos: {
       type: 'string'
    },
 
    aprobadoGerencia: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoComite: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoFinalAutoridad: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoFinalGerente: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoFinalDirector: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoFinalComite: {
       type: 'boolean',
       defaultsTo: false
    },
 
    aprobadoFinal: {
       type: 'boolean',
       defaultsTo: false
    },
 
    observaciones: {
       type: 'string',
       columnType: 'longtext'
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
 