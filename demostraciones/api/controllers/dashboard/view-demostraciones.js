module.exports = {


  friendlyName: 'Demostraciones',


  description: 'Lista de demostraciones',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/demostraciones',
      description: 'Muestra la lista de demostraciones.'
    },

  },


  fn: async function () {

    var params = {},
        userId = this.req.session.userId,
        loggedUser = await User.findOne({
            id: userId
        });

    if ( !loggedUser.isSuperAdmin ) params.lider = userId;

    var demos = await Demo.find( params ).populate('actividades');

    if ( !loggedUser.isSuperAdmin && !demos.length ) {

      //throw {redirect: '/nueva-demostracion'};
      return this.res.redirect('/nueva-demostracion');

    }

    for ( var i = 0; i < demos.length; i++ ) {

      var totals = await sails.helpers.getDemoStats( demos[i] );

      demos[i].avanceRealTotal = totals.avanceRealTotal;
      demos[i].riesgo = totals.riesgo;
      demos[i].cumplimientoTotal = totals.cumplimientoTotal;
      demos[i].colorClass = totals.colorClass;

    }

    return {
      demos: demos,
      stream: this.req.param('stream')
    };

  }


};
