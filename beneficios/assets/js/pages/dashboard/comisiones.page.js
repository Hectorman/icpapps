parasails.registerPage('comisiones', {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {

    syncing: false,

    listaGerencias: [
      { valor: 'GEI' },
      { valor: 'GDL' },
      { valor: 'GST' },
      { valor: 'GLI' },
      { valor: 'DCI' }
    ],

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝

  beforeMount: function() {

    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');

  },

  mounted: async function() {

    document.body.classList.add('mounted');

    $('.filter-gerencia').val( this.gerencia );
    var self = this;
    console.log( this );

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

  methods: {


    filterTipo: function(e) {

      var $this = $(e.target),
          $comisionesWrapper = $('.comisiones-list');

      if ( $this.val() == 'internacional' ) {

        $comisionesWrapper.find('.nacional').hide();
        $comisionesWrapper.children().not('.nacional').show();

      } else if ( $this.val() == 'nacional' ) {

        $comisionesWrapper.find('.nacional').show();
        $comisionesWrapper.children().not('.nacional').hide();

      } else {

        $comisionesWrapper.children().show();

      }

    },

    filterGerencia: function(e) {

      var $this = $(e.target);

      if ( $this.val() !== this.gerencia ) {

        window.location = '/comisiones/' + $this.val().toLowerCase();

      }

    },

    updateComision: async function(e) {

      var $this = $(e.target);

      if ( e.target.tagName !== 'BUTTON' ) $this = $this.parent();

      $('body').addClass('syncing');

      var idComision = $this.attr('data-id');
      var result = await Cloud['updateComision'].with({

        action: $this.attr('data-action'),
        idComision: idComision * 1

      }).tolerate((err)=>{

        if ( err ) {

          alert('Ocurrió un error, inténtalo de nuevo más tarde');
          $('body').removeClass('syncing');

        }

      });

      if ( result ) {

        this.comisiones.splice(this.getComisionIndexByID( idComision ), 1);
        $('body').removeClass('syncing');
        this.$forceUpdate();
        console.log( this.comisiones );

      }

    },

    getComisionIndexByID: function( id ) {

      for( var i = 0; i < this.comisiones.length; i++ ) {

        if ( this.comisiones[i].id == id ) {

          return i;

        }

      }

    }

  }

});

