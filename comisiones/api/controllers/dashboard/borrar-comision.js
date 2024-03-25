module.exports = {

  friendlyName: 'Borrar Comisión',

  description: 'Borra la comisión',

  inputs: {

    id: {
      type: 'number'
    }

  },

  exits: {

    success: {
      description: 'Comisión borrada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    sails.log( inputs.id );

    var deletedComision = await Comision.destroy({ id: inputs.id }).fetch();

    return exits.success(deletedComision);

  }

};

