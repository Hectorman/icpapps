module.exports = {

  friendlyName: 'Crear Beneficio',

  description: 'Crea un nuevo beneficio',

  inputs: {

    titulo: {
      type: 'string'
    }

  },
  exits: {

    success: {
      description: 'Beneficio creado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

      this.req.file('file').upload({
        // don't allow the total upload size to exceed ~100MB
        maxBytes: 100000000,
        // set the directory
        dirname: '../../assets/images'
      },function (err, uploadedFile) {
        // if error negotiate
        if (err) return this.res.negotiate(err);
        // logging the filename
        console.log(uploadedFile.filename);
        // send ok response
        return 'wat';
      });
    
  }

};

