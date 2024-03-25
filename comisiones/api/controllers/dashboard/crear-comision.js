module.exports = {

  friendlyName: 'Crear Comisión',

  description: 'Crea una nueva comisión',

  inputs: {

    id: {
      type: 'number'
    },

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
      type: 'string',
      required: true
    },

    fechaInicial: {
      type: 'string',
      required: true
    },

    gerencia: {
      type: 'string'
    },

    impactoComision: {
      type: 'string'
    },

    nombres: {
      type: 'string'
    },

    objeto: {
      type: 'string'
    },

    tipoComision: {
      type: 'string'
    },

    tipoDestino: {
      type: 'string'
    },

    observaciones: {
      type: 'string'
    },

    grafo: {
      type: 'string'
    },

    urgente: {
      type: 'boolean'
    },

    ponencia: {
      type: 'boolean'
    },

    numeroFicha: {
      type: 'string'
    },

    ciudadOrigen: {
      type: 'string'
    }

  },

  exits: {

    success: {
      description: 'Comisión creada / actualizada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    sails.log( inputs.fechaFinal );

    var data = {
      owner: this.req.session.userId,
      ciudad: inputs.ciudad,
      pais: inputs.pais,
      departamento: inputs.departamento,
      entidad: inputs.entidad,
      fechaFinal: Date.parse( inputs.fechaFinal.replace(new RegExp('/', 'g'), ',') ),
      fechaInicial: Date.parse( inputs.fechaInicial.replace(new RegExp('/', 'g'), ',') ),
      gerencia: inputs.gerencia,
      impactoComision: inputs.impactoComision,
      nombres: inputs.nombres,
      objeto: inputs.objeto,
      tipoComision: inputs.tipoComision,
      tipoDestino: inputs.tipoDestino,
      observaciones: inputs.observaciones,
      grafo: inputs.grafo,
      urgente: inputs.urgente,
      ponencia: inputs.ponencia,
      numeroFicha: inputs.numeroFicha,
      ciudadOrigen: inputs.ciudadOrigen
    };

    if ( inputs.id ) {

      var newComision = await Comision.updateOne({id: inputs.id })
      .set( data );

    } else {

      var newComision = await Comision.create( data ).fetch();

    }

    return exits.success(newComision.id);

  }

};

