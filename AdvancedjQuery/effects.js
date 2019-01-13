
$("button").on("click", function() {
  // $("div").fadeToggle(500, function() {
  //   // console.log("Fade Completed!");
  //   // $(this).remove();
  // });
  // $("div").slideDown();
  $("div").slideToggle(1000, function() {
    console.log("slide is done");
  });
})
