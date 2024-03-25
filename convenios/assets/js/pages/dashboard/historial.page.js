parasails.registerPage('historial', {
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

    }

  }
});
