module.exports = {

  friendlyName: 'Update Comision',
  description: 'Actualiza la info de la comision.',
  inputs: {
    idComision: {
      type: 'number',
      required: true
    },
    action: {
      type: 'string',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs) {

    var dataToSave = {}, 
        user = await User.findOne({
          id: this.req.session.userId
        });

    if ( user.isGerente ) dataToSave.aprobadoGerente = inputs.action;
    if ( user.isDirector ) dataToSave.aprobadoDirector = inputs.action;

    // Save to the db
    var comision = await Comision.updateOne({id: inputs.idComision })
    .set( dataToSave );

    return comision;

  }

};

