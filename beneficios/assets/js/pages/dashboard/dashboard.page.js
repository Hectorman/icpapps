parasails.registerPage('dashboard', {
   //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
   //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
   //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
   data: {
     
 
    
 
   },
 
   //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
   //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
   //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
   beforeMount: function() {
     // Attach raw data exposed by the server.
     _.extend(this, SAILS_LOCALS);
     document.body.classList.add('beforeMount');
 
   },
   mounted: async function() {
      document.body.classList.add('mounted');
      console.log( this );

      var vueObj = this;

      function getPercent( val ) {

         return ( ( ( ( val / ( vueObj.series[0] + vueObj.series[1] + vueObj.series[2] ) ) * 100 ) / 100 ) * 70 ) || 0;

      }

      this.makeChart( '.stream-chart', [ 
         getPercent( this.series[0] ),
         getPercent( this.series[1] ),
         getPercent( this.series[2] )
      ]);

      this.makeChart( '.one-chart', [ getPercent( this.series[0] ), 70 - getPercent( this.series[0] ) ]);

      this.makeChart( '.two-chart', [ getPercent( this.series[1] ), 70 - getPercent( this.series[1] ) ]);

      this.makeChart( '.three-chart', [ getPercent( this.series[2] ), 70 - getPercent( this.series[2] ) ]);

   },
 
   //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
   //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
   //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
   methods: {
 
      makeChart: function( selector, values ) {

         console.log(values);

         var chart = new Chartist.Pie( selector, {
            series: values,
            }, {
              donut: true,
              donutWidth: 10,
              startAngle: 235,
              total: 100,
              showLabel: false
            });
      
         chart.on('draw', function(data) {
          if(data.type === 'slice') {
            // Get the total path length in order to use for dash array animation
            var pathLength = data.element._node.getTotalLength();
      
            // Set a dasharray that matches the path length as prerequisite to animate dashoffset
            data.element.attr({
              'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
            });
      
            // Create animation definition while also assigning an ID to the animation for later sync usage
            var animationDefinition = {
              'stroke-dashoffset': {
                id: 'anim' + data.index,
                dur: 2000,
                from: -pathLength + 'px',
                to:  '0px',
                easing: Chartist.Svg.Easing.easeOutQuart,
                // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                fill: 'freeze'
              }
            };
      
            // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
            // if(data.index !== 0) {
            //   animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
            // }
      
            // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
            data.element.attr({
              'stroke-dashoffset': -pathLength + 'px'
            });
      
            // We can't use guided mode as the animations need to rely on setting begin manually
            // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
            data.element.animate(animationDefinition, false);
          }
        });
      
        return chart;
      
      }
 
   }
 });
 