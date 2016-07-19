'use strict'



/*
* search input animation
 */
$(".mat-input").focus(function(){
    $(this).parent().addClass("is-active is-completed")
})

$(".mat-input").focusout(function(){
    if($(this).val() === "")
        $(this).parent().removeClass("is-completed")
    $(this).parent().removeClass("is-active")
})

$(document).ready( function () {
    $("nav").sticky({topSpacing:0})
});







/*
* search input/button events for getting wiki data and autofill
 */
var listUL = $('.autolist')
$("#searchInput").keyup( function (event) {
    // if key is 'enter' then trigger search click event
    if (event.keyCode == 13) {
        listUL.css('display', 'none')
        $("#searchButton").click()
    } else {

        // else get autofill suggestions
        var inputVal = $("#searchInput").val()

        if (inputVal.length > 0) {

            listUL.css('display', 'block')

            $.getJSON('https://en.wikipedia.org/w/api.php?action=query&list=prefixsearch&format=json&pssearch=' + inputVal + '&pslimit=4&callback=?', function (data) {

                    // reset autofill list and create list from each autofill result
                    listUL.html('')
                    $.each(data.query.prefixsearch, function (key, prefix) {
                        listUL.append('<li>' + prefix.title + '</li>')
                    })

                    // on click of a list item get wiki data
                    $(".autolist li").click( function () {
                        callWiki($(this).text())
                        // reset searchn input value and hide autofill list
                        $("#searchInput").val('')
                        listUL.css('display', 'none')
                    })
            })
        } else {
            listUL.css('display', 'none')
            listUL.html('')
        }
    }
})




/*
* if autofill list exists then be able to use keyboard to select item
 */
function autofillKeyboard () {
    var listItems = listUL.children('li')
    var numberOfItems = listItems.length

    if (numberOfItems > 0) {
        $("window").keyup( function (event) {
            // add active class to list item
            // if enter button pressed on active item then call wiki
        })
    }
}






/*
* if search button clicked then get input data and get wiki results
 */
$("#searchButton").click( function (event) {
    // get input value and clear it
    var inputVal = $("#searchInput").val()
    $("#searchInput").val('')

    // if input is not blank call wiki api
    if (inputVal.length > 0) {
        callWiki (inputVal)
    }
})


/*
* Wiki API call
 */
function callWiki (inputVal) {

    // get section tag and clear previous items
    var section = $('section')
    section.html('')

    // get data from wiki
    $.getJSON('https://en.wikipedia.org//w/api.php?action=query&prop=extracts|info&format=json&exsentences=1&exlimit=10&exintro=&explaintext=&inprop=url&generator=search&redirects=&gsrsearch=' + inputVal + '&gsrlimit=10&callback=?', function (data) {

        // for each search result create a card and append to section
        $.each(data.query.pages, function (key, page) {
            var wikiTemplate = '<div class="card z-depth-1"><div class="card-header"><a href="' 
            + page.fullurl 
            + '" target="_blank"><h4>' 
            + page.title 
            + '</h4></a></div><div class="card-body"><p>'
            + page.extract
            + '</p></div></div>'

            section.append(wikiTemplate)

        })

        // append to force height of section
        section.append('<div class="clear"></div>')

        // unfocus input
        $('.mat-input').blur()


        // even out height of cards if in md responsive
        if($(document).width() > 992)
            evenHeights()
        
    })
}

/*
* on resize of window check serach result card heights
 */
$( window ).resize(function() {
    evenHeights()
})


/*
* evens out height of cards on same row
 */
function evenHeights () {
    // get all even indexed cards
    var $evenCards = $('.card:even')

    // for each even card, check height and compare to next sibiling
    $evenCards.each( function () {

        // save element and its next sibiling
        var _this = $(this)
        var oddCard = _this.next()

        // if next sibiling is taller then set even card to 
        // that height else set sibiling to even card height
        if ( oddCard.height() > _this.height() ) {
            _this.height( oddCard.height() )
        } else {
            oddCard.height( _this.height() )
        }

    })
}
