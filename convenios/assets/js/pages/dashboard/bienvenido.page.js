parasails.registerPage('bienvenido', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    
    listaGerencias: [
      { valor: 'GEI' },
      { valor: 'GDL' },
      { valor: 'GST' },
      { valor: 'GLI' },
      { valor: 'DCI' },
      { valor: 'ICP' }
    ],

    comisionesHistorial: [],

    comisionesNuevas: [],

    virtualSlug: '',

    listRendered: false

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');

    if ( this.me.isGerente ) {

      this.listaGerencias = [{ valor: this.populatedUser.registro[0].gerencia }];

    }
  
  },
  mounted: async function() {
    document.body.classList.add('mounted');

    var self = this,
        $body = $('body');

    this.updateTotals();

    $body.on('mouseenter', '.totals > a', function(){

      $(this).addClass('active').siblings('.active').removeClass('active');

    });

    $body.on('click', '.totals > a', function(e){

      e.preventDefault();

      self.virtualNav( e );

    });

    $body.on('click', function(e){

      var $target = $(e.target);

      if ( $target.hasClass('.more-info') || $target.parents('.more-info').length ) return;

      if ( $target.hasClass('trigger-more-info') ) return;

      $('.open-more-text').removeClass('open-more-text');

    });

  },

  //  ╦  ╦╦╦═╗╔╦╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ╚╗╔╝║╠╦╝ ║ ║ ║╠═╣║    ╠═╝╠═╣║ ╦║╣ ╚═╗
  //   ╚╝ ╩╩╚═ ╩ ╚═╝╩ ╩╩═╝  ╩  ╩ ╩╚═╝╚═╝╚═╝
  // Configure deep-linking (aka client-side routing)
  virtualPagesRegExp: /^\/bienvenido\/?([^\/]+)?\/?/,
  afterNavigate: async function(virtualPageSlug){

    var $oldActiveVPage = $('.virtual-page.active'),
        cloudError = false,
        $body = $('body'),
        vueObj = this;

    this.setActiveNav( virtualPageSlug );

    vueObj.virtualSlug = virtualPageSlug;

    $('.list-item').removeClass('show filtered');

    setTimeout(function(){ 

      $('.list-item').css('display', '');

      $oldActiveVPage.hide().removeClass('active');

    }, 300);
    
    if ( virtualPageSlug == 'aprobadas' || virtualPageSlug == 'rechazadas' || virtualPageSlug == 'pendientes' ) {

      var $activeVPage = $('#historial-page');

      setTimeout(function(){ 

        $activeVPage.show().addClass('active'); 
  
      }, 300);
    
      var result = await Cloud['getHistorial'].with({
        param: virtualPageSlug
      }).tolerate((err)=>{
          
        console.log( err );

        cloudError = true;
      
      });

      if ( result ) {

        setTimeout(function(){
          vueObj.comisionesHistorial = result;
        }, 300);

      }

    } else if ( virtualPageSlug == 'usuarios' ) {

      var $activeVPage = $('#usuarios-page');
    
      setTimeout(function(){ 

        $activeVPage.show().addClass('active'); 
  
      }, 300);
    
    } else if ( this.indexOfGerencia( virtualPageSlug ) ) {

      var $activeVPage = $('#comisiones-page');

      setTimeout(function(){ 

        $activeVPage.show().addClass('active'); 
  
      }, 300);

      $activeVPage.find('.filter-gerencia').val( virtualPageSlug );
    
      var result = await Cloud['getComisiones'].with({
        param: virtualPageSlug
      }).tolerate((err)=>{
          
        console.log( err );

        cloudError = true;
      
      });

      if ( result ) {

        setTimeout(function(){
          vueObj.comisionesNuevas = result;
        }, 300);

      }
    
    } else {

      var $activeVPage = $('#bienvenido-page');

      setTimeout(function(){ 

        $activeVPage.show().addClass('active'); 
  
      }, 300);

    }

    this.resetFilters( $activeVPage );

    if ( !cloudError ) {

      setTimeout(function(){ 

        if ( window.location.hash ) {

          $activeVPage.find('.comision').hide().addClass('filtered');
          $activeVPage.find( '.' + ( window.location.hash.replace('#', '') ) ).show().removeClass('filtered');

        }

        vueObj.showListItems( $activeVPage.find('.list-item') );

        vueObj.listRendered = true;

      }, 400);

    }

    setTimeout(function(){

      $body.removeClass('syncing');

    }, 600);

  },

  //99842

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    updateTotals: function() {

      var self = this;

      $('.gerencia').each(function(){

        var $this = $(this),
            urgente = 0,
            extra = 0,
            atiempo = 0,
            nombreGerencia = self.listaGerencias[ $this.index() ].valor,
            $totals = $this.find('.totals').html('');
  
        for( var i = 0; i < self.comisionesPendientes.length; i++ ) {
  
          var comisionObj = self.comisionesPendientes[i];
  
          if ( comisionObj.gerencia == nombreGerencia ) {
  
            if ( comisionObj.urgente ) {
  
              urgente++;
  
            } else {
  
              var diasCreado = comisionObj.createdAt / ( 1000 * 60 * 60 * 24 ),
                  diasInicio = comisionObj.fechaInicial / ( 1000 * 60 * 60 * 24 );
  
              if ( diasInicio - diasCreado < 8 ) {
  
                extra++;
  
              } else {
  
                atiempo++;
  
              }
  
            }
  
          }
  
        }
  
        if ( urgente ) {
  
          $totals.append( '<a href="/bienvenido/'+ nombreGerencia.toLowerCase() +'/#urgente" class="urgente">'+ urgente +' <span>Urgente</span></a>' );
  
        }
  
        if ( extra ) {
  
          $totals.append( '<a href="/bienvenido/'+ nombreGerencia.toLowerCase() +'/#extemporanea" class="extra">'+ extra +' <span>Extemporánea</span></a>' );
  
        }
  
        if ( atiempo ) {
  
          $totals.append( '<a href="/bienvenido/'+ nombreGerencia.toLowerCase() +'/#atiempo" class="atiempo">'+ atiempo +' <span>A tiempo</span></a>' );
  
        }
  
        if ( $totals.children() ) {
  
          $totals.children().first().addClass('active');
  
        }
  
      });
    },

    resetFilters: function( $activeVPage ) {

      var $filterTipo = $activeVPage.find('.filter-tipo');

      if ( $filterTipo.length ) {

        $filterTipo.val('false');

      }

      var $filterTipoSolicitud = $activeVPage.find('.filter-tipo-solicitud');

      if ( $filterTipoSolicitud.length ) {

        if ( window.location.hash ) {
          $filterTipoSolicitud.val(window.location.hash.replace('#', ''));
        }else {
          $filterTipoSolicitud.val('todos');
        }

          

      }

    },

    showListItems: function( $items ){

      var validItems = 0,
          self = this;

      $items.each(function(){

        var $item = $(this);

        if ( !$item.hasClass('filtered') ) { 

          validItems ++;

          self.showListItem( $item, validItems < 6 ? validItems * 100 : 600 );

        } 

      });

    },

    showListItem: function( $item, delay ){

      setTimeout(function(){

        $item.addClass('show');

      }, delay);

    },

    indexOfGerencia: function( slug ) {

      for( var i = 0; i < this.listaGerencias.length; i++ ) {

        if ( slug.toUpperCase() == this.listaGerencias[i].valor ) return true;

      }

      return;

    },

    virtualNav: function(e) {

      e.preventDefault();

      var $this = $(e.target),
          $body = $('body');

      if ( $body.hasClass('syncing') ) return;

      if ( e.target.tagName != 'A' ) $this = $this.parents('a');

      if ( $this.parents('li.active').length ) return;

      $body.addClass('syncing');

      this.goto( $this.attr('href') );

    },

    filterTipo: function(e) {

      var $this = $(e.target),
          $vPage = $this.parents('.virtual-page'),
          $comisionesWrapper = $vPage.find('.comisiones-list'),
          vueObj = this;

      $vPage.find('.list-item.show').removeClass('show filtered').css('display', '');

      setTimeout(function(){

        if ( $this.val() == 'internacional' ) {

          $comisionesWrapper.find('.nacional').hide().addClass('filtered');
          $comisionesWrapper.children().not('.nacional').show().removeClass('filtered');
  
        } else if ( $this.val() == 'nacional' ) {
  
          $comisionesWrapper.find('.nacional').show().removeClass('filtered');
          $comisionesWrapper.children().not('.nacional').hide().addClass('filtered');
  
        } else {
  
          $comisionesWrapper.children().show().removeClass('filtered');
  
        }

        vueObj.showListItems( $vPage.find('.list-item') );
      }, 300); 

      var $filterTipoSolicitud = $vPage.find('.filter-tipo-solicitud');

      if ( $filterTipoSolicitud.length ) {

        $filterTipoSolicitud.val('todos');

      }

    },

    filterTipoSolicitud: function(e) {

      var $this = $(e.target),
          $vPage = $this.parents('.virtual-page'),
          $comisionesWrapper = $vPage.find('.comisiones-list'),
          vueObj = this;

      $vPage.find('.list-item.show').removeClass('show filtered').css('display', '');

      setTimeout(function(){

        
        if ( $this.val() == 'todos' ) {

          $comisionesWrapper.find( '.comision' ).show().removeClass('filtered');
          

        } else {

          $comisionesWrapper.find('.comision').hide().addClass('filtered');
          $comisionesWrapper.find( '.' + $this.val() ).show().removeClass('filtered');

        }

        vueObj.showListItems( $vPage.find('.list-item') );
      }, 300); 

      var $filterTipo = $vPage.find('.filter-tipo');

      if ( $filterTipo.length ) {

        $filterTipo.val('false');

      }

    },

    filterGerencia: function(e){

      if ( $('body').hasClass('syncing') ) return;

      $('body').addClass('syncing');

      var $this = $(e.target);

      this.goto('/bienvenido/' + $this.val() );

    },

    filterGerenciaUsuarios: function(e) {

      var $this = $(e.target),
          $vPage = $this.parents('.virtual-page'),
          $listWrapper = $vPage.find('.users-list'),
          vueObj = this;

      $vPage.find('.list-item.show').removeClass('show filtered').css('display', '');

      setTimeout(function(){

        
        if ( $this.val() == 'todos' ) {

          $listWrapper.find( '.comision' ).show().removeClass('filtered');
          

        } else {

          $listWrapper.find('.comision').hide().addClass('filtered');
          $listWrapper.find( '.' + $this.val() ).show().removeClass('filtered');

        }

        vueObj.showListItems( $vPage.find('.list-item') );
      }, 300); 

      var $filterNombre = $vPage.find('.filter-name');

      if ( $filterNombre.length ) {

        $filterNombre.val('');

      }

    },

    filterByName: function(e) {
      // Declare variables
      var $this = $(e.target), 
          $vPage = $this.parents('.virtual-page'),
          filter, $name, i, txtValue;

      filter = $this.val().toUpperCase();

      var $items = $vPage.find('.list-item.show');
    
      // Loop through all list items, and hide those who don't match the search query
      $items.each(function(){

        var $currentItem = $(this);

        $name = $currentItem.find('.nombre-usuario');
        txtValue = $name.text();
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          $currentItem.show();
        } else {
          $currentItem.hide();
        }

      });
    },

    setActiveNav: function( virtualPageSlug ) {

      var $li = false;

      if ( virtualPageSlug == '' ) 
        var $li = $('nav li.home-btt');

      if ( virtualPageSlug == 'pendientes' ) 
        var $li = $('nav li.li-pendientes');

      if ( virtualPageSlug == 'aprobadas' ) 
        var $li = $('nav li.li-aprobadas');
        
      if ( virtualPageSlug == 'rechazadas' ) 
      var $li = $('nav li.li-rechazadas');

      if ( virtualPageSlug == 'usuarios' ) 
      var $li = $('nav li.li-usuarios');

      var $activeBtt = $('.active-btt');

      if ( $li ) {

        console.log( $li.offset().top );

        $activeBtt.fadeIn().css('top', ( $li.offset().top ) + 'px' );

        $li.addClass('active').siblings().removeClass('active');

      } else {

        $activeBtt.fadeOut();

        $('nav li.active').removeClass('active');

      }

    },

    updateUser: async function(e) {

      var $this = $(e.target),
          $listItem = $this.parents('.list-item'),
          tagName = e.target.tagName;

      if ( tagName == 'INPUT' ) {

        if ( $this.is(':checked') ) {

          $this.parents('.check-inside').siblings('.check-inside').find('input[type="checkbox"]').prop( "checked", false );

        }

      }

      var idUser = $listItem.attr('data-id'),
          gerencia = $listItem.find('.user-gerencia').val(),
          isGerente = $listItem.find('input[name="gerente-check"]').is(':checked'),
          isDirector = $listItem.find('input[name="director-check"]').is(':checked'),
          data = {
            id: idUser,
            gerencia: gerencia,
            isGerente: isGerente,
            isDirector: isDirector
          };

      var result = await Cloud['updateUsuario'].with( data ).tolerate((err)=>{
          
        if ( err ) {
          
          alert('Ocurrió un error, inténtalo de nuevo más tarde');

          this.$forceUpdate();

        }

      });

      if ( result ) {

        // for (var i = 0; i < listaGerencias.length; i++) {
          
        //   $listItem.removeClass( listaGerencias[i].valor );

        // }

        // $listItem.addClass( gerencia.toLowerCase() );

        console.log( result );

        var userFrontRecord = this.userList[ $listItem.data('index') ];

        userFrontRecord.gerencia = gerencia;
        userFrontRecord.isGerente = isGerente;
        userFrontRecord.isDirector = isDirector;

        if ( userFrontRecord.owner ) {

          userFrontRecord.owner.isGerente = isGerente;
          userFrontRecord.owner.isDirector = isDirector;

        }

        this.$forceUpdate();

      }

    },

    updateComision: async function(e) {

      var $this = $(e.target);

      if ( e.target.tagName !== 'BUTTON' ) $this = $this.parent(),

      $comision = $this.parents('.comision');

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

        this.comisionesNuevas.splice(this.getComisionIndexByID( idComision ), 1);

        this.comisionesPendientes.splice(this.getComisionPendienteIndexByID( idComision ), 1);

        this.updateTotals();
        
        $('body').removeClass('syncing');

        this.$forceUpdate();

        setTimeout(function(){
          $('.list-item').addClass('show');
        }, 50);  

      }

    },

    moreInfo: function(e) {

      var $target = $(e.target);

      $target.parents('.comision').toggleClass('open-more-text')
      .siblings('.open-more-text').removeClass('open-more-text');

    },

    comisionLeave: function(e) {

      var $target = $(e.target);

      $target.removeClass('open-more-text');

    },

    getComisionIndexByID: function( id ) {

      for( var i = 0; i < this.comisionesNuevas.length; i++ ) {

        if ( this.comisionesNuevas[i].id == id ) {

          return i;

        }

      }

    },

    getComisionPendienteIndexByID: function( id ) {

      for( var i = 0; i < this.comisionesPendientes.length; i++ ) {

        if ( this.comisionesPendientes[i].id == id ) {

          return i;

        }

      }

    }

  }
});
