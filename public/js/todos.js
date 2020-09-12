$("ul").on("click","li",function(){
    $(this).toggleClass("complete");
});

$("ul").on("click","span",function(){
    $(this).parent().fadeOut(500,function(){
        $(this).remove();           
    });
    event.stopPropagation();  
});

$("input[type='text']").on("keypress",function(event){
    console.log("Keypress");
    if(event.which === 13){
        var inputText=$(this).val();
        $(this).val("");
        $("ul").append("<li><span class='Trash'><i class='fa fa-trash'></i></span>" +inputText+ "</li>");
    };
});


$(".Plus").click(function(){
    console.log("Click");
    $("input[type='text']").fadeToggle();
})



