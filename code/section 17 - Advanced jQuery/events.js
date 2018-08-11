

$("button").click(function() {
  var text = $(this).text();
  console.log("You clicked " + text);
  $(this).css("background", "pink");
});

$("input").keypress(function(event) {
  if (event.which === 13) {
    console.log('enter pressed');
  };
});


$("h1").on("click", function() {
  $(this).css("color", "purple");
});

// $("input").on("keypress", function() {
//   console.log("key pressed");
// });

// $("button").on("mouseenter", function() {
//   $(this).css("font-weight", "bold");
// });

// $("button").on("mouseleave", function() {
//   $(this).css("font-weight", "normal");
// });

