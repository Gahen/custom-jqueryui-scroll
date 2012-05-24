/* jquery.batangascroll
-- version 1.0
-- copyright 2011-12 Batanga Inc.
-- licensed under GPL
--
-- http://batanga.com/
-- https://github.com/Gahen/custom-jqueryui-scroll
--
 */

(function($) {
	"use strict";
	$.widget( "btg.scroll", {

		// These options will be used as defaults
		options: { 
		  clear: null
		}
	 
		// Use the _setOption method to respond to changes to options
		, _setOption: function( key, value ) {
		  switch( key ) {
			case "clear":
			  // handle changes to clear option
			  break;
		  }
	 
		  // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
		  $.Widget.prototype._setOption.apply( this, arguments );
		  // In jQuery UI 1.9 and above, you use the _super method instead
		  this._super( "_setOption", key, value );
		}

		// Set up the widget
		, _create: function() {
			var self = this;

			//scrollpane parts
			var scrollPane = self.element;
			var scrollContent = self.element;

			// Inserto el slider
			var scroll = $('<div class="scroll-bar-wrap ui-widget-content ui-corner-bottom"><div class="scroll-bar"></div></div>');
			scroll.appendTo(scrollPane);

			scroll.css({
				position: "absolute"
				, "z-index": "100"
				, top: 0
			})

			//build slider
			var scrollbar = scrollPane.find( ".scroll-bar" ).slider({
				slide: function( event, ui ) {
					if ( scrollContent.width() > scrollPane.width() ) {
						scrollContent.css( "margin-left", Math.round(
							ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
						) + "px" );
					} else {
						scrollContent.css( "margin-left", 0 );
					}
				}
			});
			
			//append icon to handle
			var handleHelper = scrollbar.find( ".ui-slider-handle" )
			.mousedown(function() {
				scrollbar.width( handleHelper.width() );
			})
			.mouseup(function() {
				scrollbar.width( "100%" );
			})
			.append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
			.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
			
			//change overflow to hidden now that slider handles the scrolling
			scrollPane.css( "overflow", "hidden" );
			
			//size scrollbar and handle proportionally to scroll distance
			function sizeScrollbar() {
				var remainder = scrollContent.width() - scrollPane.width();
				var proportion = remainder / scrollContent.width();
				var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
				scrollbar.find( ".ui-slider-handle" ).css({
					width: handleSize,
					"margin-left": -handleSize / 2
				});
				handleHelper.width( "" ).width( scrollbar.width() - handleSize );
			}
			
			//reset slider value based on scroll content position
			function resetValue() {
				var remainder = scrollPane.width() - scrollContent.width();
				var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
					parseInt( scrollContent.css( "margin-left" ) );
				var percentage = Math.round( leftVal / remainder * 100 );
				scrollbar.slider( "value", percentage );
			}
			
			//if the slider is 100% and window gets larger, reveal content
			function reflowContent() {
					var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
					var gap = scrollPane.width() - showing;
					if ( gap > 0 ) {
						scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
					}
			}
			
			//change handle position on window resize
			$( window ).resize(function() {
				resetValue();
				sizeScrollbar();
				reflowContent();
			});
			//init scrollbar size
			setTimeout( sizeScrollbar, 10 );//safari wants a timeout

		}
	 
		// Use the destroy method to clean up any modifications your widget has made to the DOM
		, destroy: function() {
		  // In jQuery UI 1.8, you must invoke the destroy method from the base widget
		  $.Widget.prototype.destroy.call( this );
		  // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
		}
	});
})(jQuery);

