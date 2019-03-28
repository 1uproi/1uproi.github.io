$(function() {

    $.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,LTC&tsyms=USD,EUR,GBP", function(data) {

        /* Bitcoing USD */
        var spanMktcap = $('<span/>')
            .attr('class', index + "mktcapUSD")
            .html(value['USD']['MKTCAP'] + ' USD');

        var $newDiv = $("<div/>") // creates a div element
            .attr("class", index) // adds the id
            .addClass("bitcoin-list") // add a class
            .append(spanPrice)
            .append(spanMktcap)



        $(".bitcoin-pricing").append($newDiv);
    });

});