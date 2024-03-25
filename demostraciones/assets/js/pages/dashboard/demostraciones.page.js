parasails.registerPage('demostraciones', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    
    filterInstance: false,

    virtualStream: this.stream

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

    console.log( this );

    var self = this;

    console.log( $('.demo-list > div') );

    if ( this.me.isSuperAdmin ) {

      $('.demo-list > div').each(function(){

        var $this = $(this),
            newId = 'demo-' + $this.index() + 1,
            demoObj = self.demos[ $this.index() ],
            groupsArray = [];

        $this.attr('id', newId);

        if ( demoObj.avanceRealTotal == 100 ) groupsArray.push('completadas');

        if ( demoObj.avanceRealTotal && demoObj.avanceRealTotal < 100 ) groupsArray.push('proceso');

        if ( demoObj.areaImplementacion ) groupsArray.push( demoObj.areaImplementacion.toLowerCase() );

        if ( demoObj.riesgo ) groupsArray.push('riesgo');

        $this.attr('data-groups', JSON.stringify( groupsArray ) );

        if ( demoObj.colorClass ) $this.addClass( demoObj.colorClass );

        makeChart( '#' + newId + ' .ct-chart', demoObj.avanceRealTotal );

      }); 

      var Shuffle = window.Shuffle;
      var element = document.querySelector('.demo-list');
      var sizer = element.querySelector('.demo-list > div');

      this.filterInstance = new Shuffle(element, {
        itemSelector: '.demo-list > div',
        sizer: sizer,
        speed: 500,
        filterMode: Shuffle.FilterMode.ALL
      });

      this.filterInstance.filter( this.stream );

    }

    console.log('shuffle');

    if ( !this.me.isSuperAdmin ) {
    
      $('.mis-demos-btt').text('Nueva Demostración')
      .attr('href', '/nueva-demostracion').prepend('<i class="icon-plus"></i>');

    }

  },

  virtualPagesRegExp: /^\/demostraciones\/?([^\/]+)?\/?/,
  afterNavigate: async function(virtualPageSlug){

    if ( virtualPageSlug ) {

      this.virtualStream = virtualPageSlug;

      this.navFilter( virtualPageSlug );

      this.setActiveNav( virtualPageSlug );

    }

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    setActiveNav: function( stream ) {

      var $button = $('.side-header nav li a[data-filter="'+ stream + '"]'),
          $activeBtt = $('.active-btt'),
          $li = $button.parent('li'),
          correction = $(window).width() > 1400 ? 160 : 165; 

      $activeBtt.css('top', $li.offset().top + 'px' );

      $li.addClass('active').siblings().removeClass('active');

    },

    navFilter: function( virtualPageSlug ){

      if ( this.filterInstance ) {

        if ( virtualPageSlug == 'mid' || virtualPageSlug == 'down' || virtualPageSlug == 'up'  ) {

          this.filterInstance.filter( virtualPageSlug );
    
        }

      }

    },

    navFilterClick: function(e) {

      e.preventDefault();

      var $button = $(e.target),
          $li = $button.parent('li');

      if ( $li.hasClass('active') ) return;

      this.setActiveFilter( 0 );

      this.goto('/demostraciones/' + $button.data('filter') );

    },

    filterClick: function(e){

      e.preventDefault();

      var $button = $(e.target);

      this.setActiveFilter( $button.index() );

      if ( $button.data('filter') ) {

        this.filterInstance.filter( [$button.data('filter'), this.virtualStream] );

      } else {

        this.filterInstance.filter( this.virtualStream );

      }

    },

    setActiveFilter: function( index ) {

      var $button = $('.filter-nav > div').eq( index ),
          $parent = $button.parent(),
          $after = $parent.children('.after'),
          parentOffset = $parent.offset().left,
          offset = $button.offset().left;

      $button.addClass('active').siblings('.active').removeClass('active');

      if ( $button.index() > 0 ) {

        $after.css('width', '80px');

      } else {

        $after.css('width', '');

      }

      if ( $button.index() == 3 ) {

        $after.css('background', '#de4848');

      } else {

        $after.css('background', '');

      }

      $after.css('left', ( offset - parentOffset ) + 'px');

    }

  }
});
