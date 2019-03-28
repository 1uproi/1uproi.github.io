$(function() {

    $.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD,EUR,ETH,JPY,CHF,LTC,AUD", function(data) {
        $.each(data['RAW'], function(index, value) {
            /* Bitcoing USD */
            var inputPrice = $('<div/>')
                .attr('class', index + "price-container")
                .html('<input type="text" value="1"><div class="BitcoinType">Bitcoin</div>');
            var Currencyarrows = $('<div/>')
                .attr('class', "calcs-arrows");

            var inputMktcap = $('<input/>')
                .attr('class', index + "priceUSD")
                .attr('value', value['USD']['PRICE']);

            var Currencysymbol = $('<div/>')
                .attr('class', index + "type")
                .html('US Dollar');
            var $newDiv = $("<div/>") // creates a div element
                .attr("class", index) // adds the id
                .addClass("bitcoin-calc") // add a class
                .append(inputPrice)
                .append(Currencyarrows)
                .append(inputMktcap)
                .append(Currencysymbol)
            $(".bitcoin-calculator-vertical").append($newDiv);
        });
    });

});