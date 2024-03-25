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
    },
    motivoRechazo: {
      type: "string"
    }
  },

  exits: {

  },

  fn: async function (inputs) {

    var dataToSave = {}, 
        user = await User.findOne({
          id: this.req.session.userId
        }),
        emailInfo = {};

    if ( inputs.action == 'rechazado' ) {

      dataToSave.rechazada = true;
      dataToSave.motivoRechazo = inputs.motivoRechazo;
      emailInfo.subject = 'Comisión rechazada';
      emailInfo.message = 'Una comisón tuya ha sido rechazada por el ' + user.rolComisiones;

    } else {

      switch (user.rolComisiones) {
        case 'Jefe Dpto':

          dataToSave.indexBandeja = 1;
          
          break;
        case 'Gerente':

          dataToSave.indexBandeja = 2;
            
          break;

        case 'Director':

          dataToSave.indexBandeja = 3;
            
          break;

      }

      emailInfo.subject = 'Comisión aprobada';
      emailInfo.message = 'Una comisón tuya ha sido aprobada por el ' + user.rolComisiones;

    }

    // Save to the db

    var comision = await Comision.updateOne({id: inputs.idComision })
    .set( dataToSave );

    var ownerComision = await User.findOne({ id: comision.owner });

    await sails.helpers.sendSmptEmail.with({ 
      emailAddress: ownerComision.emailAddress,
      subject: emailInfo.subject,
      message: emailInfo.message
    });

    return comision;

  }



};

