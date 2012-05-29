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
	$.widget( "btg.scroller", {

		// These options will be used as defaults
		options: { 
			clear: null
			, orientation: "horizontal"
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
			var horiz = self.options.orientation == "horizontal";
			var dimension = horiz ? "width" : "height";
			var scrollProp = horiz ? "scrollLeft" : "scrollTop";
			var orientation = self.options.orientation;
			if (
				(horiz && self.element[dimension]() >= self.element.prop("scrollWidth"))
				|| (!horiz && self.element[dimension]() >= self.element.prop("scrollHeight"))
				) {
				console.log(horiz, self.element.outerHeight(), self.element.prop("scrollHeight"), self.element);
				return false;
			}

			//scrollpane parts
			var scrollPane = self.element;
			var scrollContent = self.element;

			// Inserto el slider
			var scroll = self.scroll = $('<div class="scroll-bar-wrap ui-widget-content ui-corner-bottom"></div>');

			scroll.appendTo(scrollPane);

			scroll.css({
				position: "absolute"
				, "z-index": "100"
				, bottom: -20
				, right: -20
				, width: horiz ? scrollPane.width() : '20'
				, height: !horiz ? scrollPane.height() : '20'
				, overflow: "visible"
			})

			self.created = true;
			self.refresh();

			if (horiz) {
				self.element.css({
					marginBottom: parseInt(self.element.css("marginBottom")) + 20
				});
			} else {
				self.element.css({
					marginRight: parseInt(self.element.css("marginRight")) + 20
				});
			}

			//append icon to handle
			var handleHelper = scroll.find( ".ui-slider-handle" )
			.append( "<span class='ui-icon ui-icon-grip-dotted-"+orientation+"'></span>" )
			.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();

			//change overflow to hidden now that slider handles the scrolling
			scrollPane.css( "overflow", "hidden" );

			//init scrollbar size
			setTimeout( this.resize, 10 );//safari wants a timeout

			//change handle position on window resize
			$( window ).on("resize", self.resize);

			self.element.on("mousewheel", function(event, delta, deltaX, deltaY) {
				console.log(scroll.slider("value"), delta, horiz);
				// En el horizontal voy de 0 a 100, en el otro de 100 a 0
				if (horiz && delta == -1 && scroll.slider("value") < 100 ||
					delta == 1 && scroll.slider("value") > 0) {
					scroll.slider("value", scroll.slider("value") - 5*delta );
				} else if (!horiz && delta == -1 && scroll.slider("value") > 0 ||
							delta == 1 && scroll.slider("value") < 100) {
					self.scroll.slider("value", scroll.slider("value") + 5*delta );
				} else {
					self._trigger("scrollend", event);
				}
				return false;
			});
		}

		, move: function( event, ui ) {
			var self = this;
			var horiz = self.options.orientation == "horizontal";
			var scrollProp = horiz ? "scrollLeft" : "scrollTop";
			var el = self.element;
			var dim = horiz ? el.prop("scrollWidth") - el.width() : el.prop("scrollHeight")  - el.height() ;
			var value = horiz ? (dim*ui.value/100) : (dim*(100-ui.value)/100);

			el[scrollProp](value);

			if (horiz) {
				self.scroll.css({
					left: value
				});
			} else {
				self.scroll.css({
					bottom: -value
				});
			}
		}

		, refresh: function() {
			var self = this;
			//build slider
			if (self.created) {
				self.scroll.slider("destroy");
				self.scroll.slider({
					orientation: self.options.orientation
					, value: self.options.orientation == "horizontal" ? 0 : 100
					, change: function(event, ui) {
						self.move(event, ui);
					}
					, slide: function(event, ui) {
						self.move(event, ui);
					}
				});
			} else {
				self._create();
			}
			
		}
		
		, resize: function() {
			//size scrollbar and handle proportionally to scroll distance
			function sizeScrollbar() {
			}
			
			//reset slider value based on scroll content position
			function resetValue() {
			}
			
			//if the slider is 100% and window gets larger, reveal content
			function reflowContent() {
			}
		}
	 
		// Use the destroy method to clean up any modifications your widget has made to the DOM
		, destroy: function() {
			// In jQuery UI 1.8, you must invoke the destroy method from the base widget
			$.Widget.prototype.destroy.call( this );
			this.scroll.slider("destroy");
			this.scroll.remove();
			$( window ).off("resize", this.resize, this);
			this.element.off("mousewheel", this._mousewheel);
			// In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method

		}

		

		// events bound via _bind are removed automatically
		// revert other modifications here
		, _destroy: function() {
			console.log("_destroy");
		},
	});
})(jQuery);

