module.exports = {


  friendlyName: 'Bienvenido',

  description: 'Página de bienvenida del director',

  exits: {

    success: {

      viewTemplatePath: 'pages/dashboard/bienvenido',
      description: 'Muestra la página de inicio para directores.'

    },

    redirect: {

      responseType: 'redirect',
      description: 'User is not admin'

    },

  },


  fn: async function () {

    var params = {},
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro'),
        userList = await Planta.find().populate('owner');

    if ( !user.isSuperAdmin ) throw {redirect:'/mis-comisiones'};

    if ( user.isGerente ) params.aprobadoGerente = 'pendiente';

    if ( user.isDirector ) {

      params.aprobadoGerente = 'aprobado';
      params.aprobadoDirector = 'pendiente';

    }

    var comisiones = await Comision.find(params);

    return {

      comisionesPendientes: comisiones,
      populatedUser: user,
      userList: userList

    };

  }

};

