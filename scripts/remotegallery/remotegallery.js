/***
 * @copyright 2017 Digital Devils BV
 * @author    Digital Devils BV <info@digitaldevils.nl>
 * @package   Remote Gallery
 * @link      https://www.digitaldevils.nl/
 * @version   1.0
***/

var remoteGallery = (function(){
	// Define variables
	var input         = new URL(window.location).searchParams;
	var folder        = '';
	var prefix        = '';
	var postfix       = '';
	var start         = '';
	var end           = '';
	var leading_zeros = '';

	// Set input
	$('#photo').val(input.get('photo')   != null ? input.get('photo')  : '');
	$('#amount').val(input.get('amount') != null ? input.get('amount') : '10');



/*** Private functions ***/
	var _getInput = function(){
		// Check photo URL
		if($('#photo').val() != ''){
			// Parse photo url
			var parser     = new URL($('#photo').val());
			var path_parts = parser.pathname.split('/')
			
			var filename   = path_parts.pop();
			var file_parts = filename.split('.')

			// Get input
			folder        = parser.origin + path_parts.join('/')+'/';
			start         = filename.match(/.*(?:\D|^)(\d+)/)[1];
			end           = parseInt(start) + parseInt($('#amount').val()) - 1;
			prefix        = filename.substr(0, filename.indexOf(start));
			postfix       = filename.substr(filename.indexOf(start) + start.length);
			leading_zeros = '';
		}
	};

	var _getLeadingZeroes = function(){
		// Get leading zeroes
		for(var i = 0; i < start.length; i++){
			if(start.charAt(i) == '0'){
				leading_zeros += '0';
			
			}else{
				break;
			}
		}

		// Remove leading zeroes from start
		start = start.substr(leading_zeros.length);	
	};

	// Reset gallery
	var _resetGallery = function(gallery){
		// Empty gallery
		$(gallery).empty();
	};



/*** Public functions ***/
	// Build gallery
	var buildGallery = function(options){
		// Get input
		_getInput();
		_getLeadingZeroes();

		if(start != ''){
			// Reset gallery
			_resetGallery(options.gallery);

			// Loop through images
			for(var i = start; i <= end; i++){
				if(i == 10 || i == 100 || i == 1000){
					leading_zeros = leading_zeros.substr(1);
				}

				// Add leading zeroes
				number = leading_zeros.substr(0, i) + i;

				// Check if image exists
				image        = new Image();
				image.onload = function(){
					// Add to gallery
					$(options.gallery).append('\
						<div class="columns">\
							<a href="'+this.src+'" class="thumbnail">\
								<img src="'+this.src+'">\
							</a>\
						</div>\
					');

					// Completed loading
					options.complete();
				};

				image.onerror = function(){
					// Add to errors
					$(options.errors + ' ul').append('\
						<li>'+this.src+' not found</li>\
					');

					// Show errors
					$(options.errors).removeClass('hide');

					// Completed loading
					options.complete();
				};

				// Load image
				image.src    = folder + prefix + number + postfix;
			}
		}
	};

	// Output
	return {
		'buildGallery': buildGallery
	};

})();