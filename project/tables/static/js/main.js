var calcChartData = function(data){
    var new_data = data[0].concat(data[1]);
    var chart_data = new_data.concat(data[2]);

    for (i = 0; i < chart_data.length; i++) { 
        rent = ((chart_data[i]["rent_median"])/10)
        chart_data[i]["rent_median"] = rent
    };
    // console.log(chart_data);
    return chart_data;
};

var buildResultChart = function(jsonData){
        var chart = c3.generate({
          data: {
              json: jsonData,
              keys: {
                  value: ['rent_median', 'rooms_median', 'age_median', 'commute_score'],
              },
              type: 'bar',
              types: {
                  rooms_median: 'line',
                  age_median: 'line',
                  commute_score: 'line',
              }
          },
          axis: {
            x: {
              type: 'category',
              categories: ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5', 'Result 6', 'Result 7', 'Result 8', 'Result 9'],
            },
            y: {
                  label: 'Rent (in tens)'
              },
          }
      });
    // return chart;
};

$(document).ready(function(){
console.log("Hi there!")
var chart_data;
var count = 0;

// goes to top of page on reload
$( window ).unload(function() {
  window.scrollTo(0, 0);
    console.log("again")
});

  $('.button-collapse').sideNav({
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
    $('.parallax').parallax();
    $('.slider').slider();
    var __cache = {};


///// Register /////
    $('#nav').on('click', "#register", function(event){
      event.preventDefault();
        var template = $('#register-template').html();
        var renderM = Mustache.render(template, {});
        $('#answer_div').html(renderM);
        window.scrollTo(0, 0);
    });

    $('#answer_div').on('submit', '#register_form',function(event){
    event.preventDefault();

    var query_string = $(this).serialize() // returns all the data in your form
    $.ajax({
        method: "POST",
        url: "register",
        data: query_string,
    }).done(function(data, status){
    // console.log(data.Message)

    if (data.success){
      ////// if they registered then display the Login ////////
            var template = $('#login-template').html();
            var renderM = Mustache.render(template, {});
            $('#answer_div').html(renderM);
            window.scrollTo(0, 0);
            // $('#answer_div').append(data.Message);
            }
      else {
        // console.log (data.errors)
        var template = $('#register-template').html();
        var renderM = Mustache.render(template, data.errors);
        $('#answer_div').html(renderM);
        window.scrollTo(0, 0);
      }

        });
    });


/////// Login /////
    $('#nav').on('click', "#login", function(event){
      event.preventDefault();
        var template = $('#login-template').html();
        var renderM = Mustache.render(template, {'id_username':'account_circle','id_password':'verified_user'});
        $('#answer_div').html(renderM);
        window.scrollTo(0, 0);
    });

    $('#answer_div').on('submit', '#login_form',function(event){
      event.preventDefault();
      console.log("clicked login")

      var query_string = $(this).serialize() //returns all the data in your form
      // console.log(query_string)

      $.ajax({
          method: "POST",
          url: "login",
          data: query_string,
      }).done(function(data, status){
        
          if (data.success){
          ////// if they login correctly ////////
            console.log("HERE")
            document.location.href="/";
            window.scrollTo(0, 0);
          } 
          else{
            // crazy code to select for the error formating
            var template = $('#login-template').html();
            var errorNames = Object.keys(data.errors).reduce(function(previousValue, currentValue, currentIndex, array){
              return (previousValue ? previousValue + ',':'') + 'input[name="'+currentValue+'"]'
            }, '');
            var renderM = Mustache.render(template, $.extend(data.errors,{'id_username':'account_circle','id_password':'verified_user'}));
            $('#answer_div').html(renderM);


            var inputs = $('#login_form').find(errorNames);
            inputs.addClass('invalid');
            $.each(inputs, function(idx, el){
              $($(el).next()).css("white-space", "nowrap");
              $($(el).next()).css("overflow", "hidden;");
            });

            // prints errors that are not missing fields to the end of the form
            $('.tall .container').append(data.errors["__all__"][0]);
            $('.tall .container').css("color", "red");

            window.scrollTo(0, 0);
          }

      });
    });

///// Logout /////
    $('#nav').on('click', "#logout", function(event){
    event.preventDefault();

    // var query_string = $(this).serialize() // returns all the data in your form

    $.ajax({
        method: "POST",
        url: "logout",
        // data: query_string,
    }).done(function(data, status){

    // $('#answer_div').html(" <h2> Goodbye, See you soon!</h2>");
    document.location.href="/";
    window.scrollTo(0, 0);

    });
});


///// Form /////
    $('.form_button').on('click', function(event){
    	event.preventDefault();
        var template = $('#form_template').html();
        var renderM = Mustache.render(template);
        $('#answer_div').html(renderM);
        if ($('.school').length){
          check_college();
        }
        if ($('.gender').length){
          check_gender();
        }
        if ($('.age').length){
          check_age();
        }  
        window.scrollTo(0, 0);
    });

    $('#answer_div').on('submit', '#search_form',function(event){
    event.preventDefault();

    var query_string = $(this).serialize() //returns all the data in your form
    console.log(query_string)

    $.ajax({
        method: "POST",
        url: "search",
        data: query_string,
    }).done(function(data, status){

    if (data.success){
      console.log(data)
      __cache['results'] = data.results;
      var results = data.results[0];

        ////// if submit form correctly ////////
        $('#ja_search').attr("class","hide");

          // append the header to the page, once
          var template = $('#results-header-template').html();
          var renderM = Mustache.render(template);
          $('#answer_div').append(renderM);

          var template = $('#results-template').html();
          var renderM = Mustache.render(template, {'result_set': results, 'next':0});
          // just append the new results to the page
          $('#answer_div').append(renderM);
          window.scrollTo(0, 0);
          }

        });
    });


///// Edit Form Button /////
    $('#answer_div').on('click', '#edit_button',function(event){
      event.preventDefault();
        // show the previous search form
        $('#ja_search').attr("class","show");
        // get rid of previous results
        $('.ja_results').remove();
        window.scrollTo(0, 0);
    });


///// More Results Button /////
    $('#answer_div').on('click', '#more_results_button',function(event){
      event.preventDefault();  
      var next = parseInt($(this).val()) + 1;
      if (next >= __cache.results.length) return false;

      var results = __cache.results[next];
      // this hides all the buttons already on the page but the bottons will still be on the bottom becuase the last set of buttons has not loaded yet
          $('.buttons').attr("class","hide");
          $('#chart_card').remove();
          
          var template = $('#results-template').html();
          var renderM = Mustache.render(template, {'result_set': results, 'next': next});
          // just append the new results to the page
          $('#answer_div').append(renderM);
    });


///// Form - Education toggle/////
    $("#answer_div").on('click', 'input[id="CHECKBOX"]',function(event){
        var $is_checked = $(this).is(':checked')

        if ($is_checked === true) {
          // display current_edu_level
          $("#highest_edu_level").css("display", "none");
          $("#current_edu_level").css("display", "block");
        } else {
          // display highest_edu_level
          $("#highest_edu_level").css("display", "block");
          $("#current_edu_level").css("display", "none");
        };
    });


///// Form - Price Range Adjuster/////
    $("#answer_div").on('click', 'input[id="purchase"]',function(event){
        var $is_checked = $(this).is(':checked')

        // purchase //
        if ($is_checked === true) {
          $(price_range_title).html("Price Range (in thousands)")
          $("#price_range").attr("min","250");
          $("#price_range").attr("max","2000");
        };
    });

    $("#answer_div").on('click', 'input[id="rent"]',function(event){
        var $is_checked = $(this).is(':checked')

        // rent //
        if ($is_checked === true) {
          $(price_range_title).html("Price Range")
          $("#price_range").attr("min","500");
          $("#price_range").attr("max","2000");
        };
    });


///// Chart /////
    $("#answer_div").on('click', '#chart_button',function(event){
    event.preventDefault();
    $("#chart_card").css("display", "block");

    if (count<1) {
        var data = __cache["results"];
        chart_data = calcChartData (data);
        count ++;
    }
    buildResultChart(chart_data)
    });



});




