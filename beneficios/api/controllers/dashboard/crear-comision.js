module.exports = {

  friendlyName: 'Crear Comisión',

  description: 'Crea una nueva comisión',

  inputs: {

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
      description: 'Comisión creada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    var newComision = await Comision.create({
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
        urgente: inputs.urgente,
        ponencia: inputs.ponencia,
        numeroFicha: inputs.numeroFicha,
        ciudadOrigen: inputs.ciudadOrigen
     }).fetch();

     return exits.success(newComision.id);

  }

};

