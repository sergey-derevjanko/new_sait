var geocoder;
var map;

(function($){

	$(function() {  
		$('input[class^="calc-"], select[class="select_s8"]').styler();  
	});
	
	$.setupTimer = function(data){
		dateObj = new Date(data.year, (data.month - 1), data.date).toDateString();
		console.log(dateObj);
		$('#atlantic-timer').html(dateObj);
		$('#atlantic-timer').countDown({
			always_show_days: false,
			label_dd: 'Дни',
			label_hh: 'Часы',
			label_mm: 'Минуты',
			label_ss: 'Секунды',
			separator_days: '',
			with_separators: false
		});
	};
	
	$.initializeMap = function(){
		var geocoder = new google.maps.Geocoder();
		
		var mapCenter = new google.maps.LatLng(50.429601,30.3989035);
		
        var mapOptions = {
            center: mapCenter,
            zoom: 16,
			disableDefaultUI:true					
        };
		

		var image = '/images/logo-map.png';
		
        map = new google.maps.Map(document.getElementById("atlantic-map"),
            mapOptions);
		var address = 'ул. Семьи Сосниных, 3';

		/*var address = document.getElementById('geocode-address').value;
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			  map.setCenter(results[0].geometry.location);
			  var marker = new google.maps.Marker({
				  map: map,
				  position: results[0].geometry.location
			  });
			  $.initializeMap();
			} else {
			  alert('Geocode was not successful for the following reason: ' + status);
			}
		});*/	
		
		var marker = new google.maps.Marker({
			map: map,
			position: mapCenter,
			icon: image,
			draggable: false,
			visible: true
        });

    };
	
})(jQuery);

jQuery(document).ready(function(){
	$.initializeMap();
	
	$('input[id^="phone"]').mask("+38(999)999-99-99",{placeholder:"x"});
	
	jQuery.validator.setDefaults({
            debug: true
            ,success: "valid"
			,errorElement: 'span'
			,errorClass: 'validate-error'
			,focusInvalid: false
			,highlight: function (element){
				$(element).closest('.form-group').addClass('has-error');
			}
			,unhighlight: function (element){
				$(element).closest('.form-group').removeClass('has-error');
			}
    });
		
	jQuery.validator.addMethod("phone_number", function(value, element) {
            return this.optional(element) ||
                value.match(/^[0-9\+\(\)-]+$/);
    }, '<i class="fa fa-times"></i>');
	
	jQuery.validator.addMethod("email_s8", function(value, element) {
            return this.optional(element) ||
                value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    }, '<i class="fa fa-times"></i>');

		
	$('form.validate').each(function(){
		var $_this = $(this);
		
		$_this.validate({
			rules: {
				'phone' : {
					required: true,
					phone_number: true,
                    rangelength: [10, 17]
				},
				'email' : {
					required: true,
                    email_s8: true
				},
				'name' : {
                    required: true,
                    minlength: 2
                }
			},
			messages: {
                "phone": '<i class="fa fa-times"></i>',
				"email": '<i class="fa fa-times"></i>',
				"name": '<i class="fa fa-times"></i>'
            },
			submitHandler: function(form) {
                // do other things for a valid form
               
			   $.ajax({
                    type: "POST",
                    url: "/assets/order.php",
                    data:  $_this.formSerialize(),
                    timeout: 2000,
                    success: function() {
						$_this.resetForm();
					},
                    error: function() {alert('failed');}
                });
				
				return false;
            }
		});
		
	});
	
	$('#go-calc').on('click', function(){
		var square = $('#calc-select').val();
		var type = $('input[name="place"]:checked').val();
		
		$.ajax({
            type: "POST",
            url: "/assets/calc.php",
            data: {square: square, type: type},
            timeout: 1000,
            success: function(data) {
				$('#calc-result').val(data);
			},
            error: function() {
				alert('failed');
			}
        });
		
		return false;
	});
});

$(window).load(function(){
	$(".block-title").each(function(indx){
		var $_this = $(this);
		var title_h = $_this.children('.title.title-cell').outerWidth();
		var stripe_width = Math.floor(($_this.width() - (title_h + 1))/2);
		$_this.children('.lstripe.title-cell, .rstripe.title-cell').css({
			width: stripe_width+'px',
		});
	});
});