    window.onbeforeprint = function(){
                console.log("printing");
            }
            $(document).ready(function(){
                    
                    lastWrite = +new Date / 1000 | 0;
                    lastRead = +new Date / 1000 | 0;
                    
                var saveInterval = setInterval(function(){
                    console.log("writing cards...");
                    if(prevHTML != $("#cards").html())
                    {
                        var cards = {};
                        $('.card').each(function(){
                            if(this.id)
                            {
                                cards[this.id] = $(".content", this).html() + "|||" + $("select option:selected", this).val();
                            }
                        });
                        $.post("includes/save-cards.php", {"cards": cards}, function(){
                            lastWrite = +new Date / 1000 | 0;
                        });
                    }
                    $.post("includes/get-cards-write-time.php", {}, function(resp){
                        $("#cards-idle-elapsed").html(resp.timeString);
                        
                        //if another write has occured that did not originate here, alert the user
                        if(resp.timeStamp > lastWrite + 10)
                        {
                            $("#cards-idle-elapsed").addClass("outdated");
                        }
                        else {
                            $("#cards-idle-elapsed").removeClass("outdated");
                        }
                    })
                    prevHTML = $("#cards").html();
                }, 2000);
                
                function modifyBackspace(e){
                    if(e.keyCode == 8)
                    {
                        $(this).focus();
                        return false;
                    }
                
                    if($(this).html() == "")
                    {
                        $(this).html("<span>");
                    }
                }
                
                function contentFocus(e)
                {
                    if($(this).html().trim() == "")
                    {
                        $(this).html("<span>");
                    
                        var range = document.createRange();
                        var sel = window.getSelection();
                        range.setStart(this, 0);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
                
                function removeCard(e)
                {
                    var x = e.pageX - $(this).offset().left
                    var y = e.pageY - $(this).offset().top
                    
                    //check if the user clicked on the X in upper right hand corner
                    if(x > $(this).width() - 30 && y < 30)
                    {
                        $(this).remove();    
                    }
                }
                
                function insertBreak(e)
                {
                    if(ctrlKey && altKey && e.keyCode == 66)
                    {
                        ctrlKey = false;
                        altKey = false;
                        
                        var cardHTML = $(this).html();
                        cardHTML = cardHTML.replace("-or-", "<span class='break print'></span>");
                        console.log(cardHTML);
                        $(this).html(cardHTML);
                        
                    }
                
                }
                
                ctrlKey = false;
                altKey = false;
                function detectControlKeys(e)
                {
                    ctrlKey |= (e.keyCode == 17);
                    altKey |= (e.keyCode == 18);
                }
                
                
                function releaseControlKeys(e)
                {
                    ctrlKey ^= (e.keyCode == 17);
                    altKey ^= (e.keyCode == 18);
                }
                
                function removeExtraSpans(e)
                {
                    //console.log($(this).html());
                    var content = "";
                    $(this).contents().each(function(){
                        content += getPrintContent(this);
                    });
                    $(this).html(content);
                }
                
                function getPrintContent(elem)
                {
                    var content = "";
                    if(!$(elem).hasClass("print")) 
                    {
                        if($(this).children().length > 0)
                        {
                            $(elem).contents().each(function(){
                                
                                content += getPrintContent(this);
                            });
                        }
                        else {
                            content += $(elem).text();
                        }
                    }
                    else {
                        if($(elem).contents().length > 0)
                        {
                            $(elem).children().each(function(){
                                content += getPrintContent(this);
                            });
                        }
                        else {
                            content += $(elem).prop("outerHTML");
                        }
                        
                    }
                    //console.log(content);
                    return content;
                }
                
                $("#new-card").click(function(){
                    id = parseInt($(".card:last").attr("id")) + 1;
                    //$("<div class='card print' id='" + id + "' contenteditable='true' >").insertBefore(this);
                    $(" <div id='" + id + "' class='card print'><div contenteditable='true' class='content print'></div></div>").insertBefore(this);
                    activateCards();
                });
                
                cardsPerPage = 9;
                cardsPerRow = 3;
                $("#duplex-toggle").click(function(){
                    if($(this).is(":checked"))
                    {
                        cardIndex = 0;
                        rowIndex = 0;
                        var cardBuffer = [];
                        
                        for(r = 0; r < cardsPerPage/cardsPerRow; r++)
                        {
                            cardBuffer[r] = [];
                        }
                        
                        $(".card").each(function(){
                            cardBuffer[Math.floor((cardIndex % cardsPerPage) / cardsPerRow)][cardIndex % cardsPerRow] = $(".content", this).attr("data-category");
                            
                            if(++cardIndex % cardsPerPage == 0) {
                                console.log(JSON.stringify(cardBuffer));
                                var frag = document.createDocumentFragment();
                                var cardBack = document.createElement("div")
                                    cardBack.className = "card-back print";
                                    
                                for(var c = 0; c < cardsPerPage; c++)
                                {
                                    var cardBack = cardBack.cloneNode(true);
                                    $(cardBack).attr("data-category",cardBuffer[Math.floor(c / cardsPerRow)][cardsPerRow - c % cardsPerRow - 1]);
                                    bgImage = "url('./IGME220/images/cardBack_" + cardBacks[cardBuffer[Math.floor(c / cardsPerRow)][cardsPerRow - c % cardsPerRow - 1]] + ".png')";
                                    console.log(bgImage);
                                    $(cardBack).css("background-image",bgImage);
                                    frag.appendChild(cardBack);
                                }
                                
                                $(frag).insertAfter(this);
                            }
                            
                            
                        });
                    }
                    else {
                        $(".card-back").remove();
                    }
                });
                
                cardBacks = {
                    "Rock":"ROCK",
                    "Pop":"POP",
                    "Rap/Hip-hop":"RAPHIPHOP",
                    "Country":"COUNTRY",
                    "Dance":"DANCE",
                    "Metal":"METAL",
                    "Miscellaneous": "MISC",
                    "Career": "CAREER"
                }
                
                function activateCards()
                {
                    $(".card .content").keyup(modifyBackspace);
                    $(".card .content").keyup(releaseControlKeys);
                    $(".card .content").keydown(insertBreak);
                    $(".card .content").keydown(detectControlKeys);
                    $(".card .content").focus(contentFocus);
                    $(".card .content").blur(removeExtraSpans);
                    $(".card").click(removeCard);
                    
                    $(".card").each(function(){
                        if($("select.category", this).length == 0) {
                            console.log("test");
                            categories = ["Rock","Pop","Rap/Hip-hop","Country","Dance","Metal","Miscellaneous","Career"];
                            backs = ["ROCK","RAPHIPHOP","COUNTRY","DANCE","METAL","MISC","CAREER"];
                            colors = ["#CC0600","#FF4C98","#007F2E","#FF6C00","#0058FF","#52267F","#333333","#000"];
                            
                            var select = $("<select>").addClass("category").addClass("print");
                            
                            for(o in categories)
                            {
                                $(select).append(
                                    $("<option>")
                                        .attr("value",o)
                                        .attr("data-color",colors[o])
                                        .html(categories[o]));
                            }
                            $(select).change(function(){
                                prevHTML += " ";
                                $("~.content", this)
                                    .attr("data-category", $("option:selected",this).html())
                                    .css("color", $("option:selected", this).attr("data-color"))
                                $(this).ccs("background", $("option:selected", this).attr("data-color"));
                                
                            });
                            $(select).val($(this).attr("data-category"));
                            $(select).css("background",  colors[$(select).val()]);
                            
                            $(".content", this).attr("data-category", $("option:selected", select).html())
                            $(".content", this).css("color", colors[$(select).val()]);
                            
                            var header = $("<header>").append(select);
                            $(this).prepend(select);
                        }
                    });
                    prevHTML = $("#cards").html();
                }
                
                activateCards();
                
                prevHTML = $("#cards").html();
            });