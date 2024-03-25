parasails.registerPage('gracias', {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {

    bandejaAprobacion: [
      'Jefe Dpto',
      'Gerente',
      'Director'
    ],

    popComision: {}

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝

  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');
    document.body.classList.add('nueva-comision-wrapper');
  },

  mounted: async function() {

    moment.locale('es');

    document.body.classList.add('mounted');
    console.log( this.comisiones );

    var self = this;

    $('.open-comision').on('click', function(e){

      var $this = $(this),
          comisionID = $this.data('id'),
          comisionObj = self.getComisionById( comisionID );

      self.popComision = comisionObj;

      console.log( self.popComision );

      $.magnificPopup.open({
        items: {
          src: '#comision-popup',
          type: 'inline'
        }
      });

      e.preventDefault();

    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

  methods: {

    getComisionById: function( id ) {

      for( var i = 0; i < this.comisiones.length; i++ ) {

        if ( this.comisiones[i].id == id ) {

          return this.comisiones[i];

        }

      }

    },

    getComisionIndexById: function( id ) {

      for( var i = 0; i < this.comisiones.length; i++ ) {

        if ( this.comisiones[i].id == id ) {

          return i;

        }

      }

    },

    prettyDate( timestamp ) {

      moment.locale('es');

      return moment( timestamp ).format('MMMM Do YYYY')

    },

    confirmarEliminarComision: function(e) {

      e.preventDefault();

      var idComision = $(e.target).data('id');

      var self = this;

      Swal.fire({
        title: 'Eliminar comisión',
        text: "¿Está seguro que quiere eliminar esta comisión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar comisión!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          self.eliminarComision( idComision );

        }
      });

    },

    eliminarComision: async function( idComision ) {

      var result = await Cloud['borrarComision'].with( {id: idComision} ).tolerate((err)=>{
          
        if ( err ) {
          
          alert('Ocurrió un error, inténtalo de nuevo más tarde');

          this.$forceUpdate();

        }

      });

      if ( result ) {

        this.comisiones.splice(this.getComisionIndexById( idComision ), 1);

        this.$forceUpdate();

        Swal.fire(
          'Comisión eliminada!',
          'Comisión eliminada exitósamente.',
          'success'
        )

      };

    }

  }

});

