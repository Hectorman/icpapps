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

    var params = {
        rechazada: false
    },
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro'),
        userList = await Planta.find().populate('owner');

    if ( !user.rolComisiones == 'profesional' ) throw {redirect:'/mis-comisiones'};

    if ( user.rolComisiones == 'Jefe Dpto' ) { 
      params.indexBandeja = 0,
      params.departamento = user.departamento;
    };
    if ( user.rolComisiones == 'Gerente' ) params.indexBandeja = 1;
    if ( user.rolComisiones == 'Director' ) params.indexBandeja = 2;

    var comisiones = await Comision.find(params);

    var comisionesAprobadas = await Comision.find({
      indexBandeja: 3
    }).sort('createdAt ASC');

    return {

      comisionesPendientes: comisiones,
      populatedUser: user,
      userList: userList,
      comisionesAprobadas: comisionesAprobadas

    };

  }

};

