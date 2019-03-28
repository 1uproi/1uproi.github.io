var dailyRoi369ContractAddress = "TTiUK6Ke9YgHNdGGXuX4XstGaQCeawBJjH"; //1
var dailyRoi369Contract;
var url_string = window.location.href;
var url = new URL(url_string);
var dailyRoi369Url = "http://localhost:8080";
var daily369Chart;
var initChartStatus = false;
var initVanityStatus= false;
var randomLuckNumberInterface;
var loadPlayerLastBetInterface;
var currentPlayerBetRoundId = 0;
window.addEventListener("load", function() {
	loadTronWeb();
	makeEvent();
});	
async function loadTronWeb(){
    if (typeof(window.tronWeb) === 'undefined') {
        setTimeout(loadTronWeb, 1000);
    } else {
        dailyRoi369Contract = await tronWeb.contract().at(dailyRoi369ContractAddress);
        // setVanityLink();
        setTimeout(function(){
            startLoop();
            initChart();
            initCookie();
        },1000);
    }
}
function makeEvent() {
	makeEventDailyRoi369Invest();
	makeEventDailyRoi369WithdrawInvestments();
	makeEventDailyRoi369BuyVanity();
	makeEventDailyRoi369Reinvest();
	makeEventDailyRoi369Withdraw();
	makeEventDailyRoi369BuyCard();
	makeEventDailyRoi369ChangeBetValue();
	makeEventDailyRoi369ChangeBetAmount();
	makeEventDailyRoi369Bet();
	// makeEventCopyRefUrl();
	// makeEventCopyVanityUrl();
}
function initCookie() {
  setDaily369node(url.searchParams.get("daily369node"));
  if (window.location.hash.substr(1) && window.location.hash.substr(1) != '') {
    setDaily369nodeVanity();
  }
}
function startLoop(){
    refreshData();
    setTimeout(startLoop, 3000);
}
function refreshData(){
  initDailyRoi369Data();
}
// ---------------------------------------------------------------------------
// MARKET EVENT
// ---------------------------------------------------------------------------
function makeEventCopyRefUrl() {
	new ClipboardJS('#copy-ref-button');
	$('#copy-ref-button').click(function(e) {
		e.preventDefault();
		setTimeout(function(){
			$('#copy-ref-button').popover('hide')
        },1500);
	});
}
function makeEventCopyVanityUrl() {
	new ClipboardJS('#copy-vanity-button');
	$('#copy-vanity-button').click(function(e) {
		e.preventDefault();
		setTimeout(function(){
			$('#copy-vanity-button').popover('hide')
        },1500);
	});
}	
function makeEventDailyRoi369Invest() {
	$('.btn-investment').click(function(e) {
		e.preventDefault();
		var trx = convertTrxToSun($(".wrap-investments").find('input[type=number][name=investments]').val());
		var ref = getCookie('daily369node').split(';')[0];
		if(tronWeb.isAddress(ref) === false) {
			ref = "TRC1hwc1JaBL9kGp6wFYYCXUF4FVinpqbV";
		}
		if(ref === "TVVD7oMYWXZT3skPyQmyMf8USwvYETLFaV") {
			ref = "TRC1hwc1JaBL9kGp6wFYYCXUF4FVinpqbV";
		}
		dailyRoi369Contract.buy(ref).send({callValue: trx}).then(result => {
			$(".wrap-investments").find('input[type=number][name=investments]').val(0);
		}).catch((err) => {
			console.log(err);
		});
    });
}
function makeEventDailyRoi369WithdrawInvestments() {
	$('.btn-withdraw-investments').click(function(e) {
		e.preventDefault();
		var investments = convertTrxToSun($('.wrap-investments').find('input[type=number][name=player_investments]').val());
		dailyRoi369Contract.withdrawInvestment(investments).send();
    });
}
function makeEventDailyRoi369BuyVanity() {
	$('.btn-buy-vanity').click(function(e) {
		e.preventDefault();
		$('.vanity-err').html('');
		var vanity = $('.wrap-vanity').find('input[type=text][name=vanity]').val();
		var name_regex = /^[a-zA-Z0-9_\-]+$/;
        var match = vanity.match(name_regex);
        if (match == null) {
        	return $('.vanity-err').html('The vanity contains special characters!');
        } 
        if (vanity.length > 32) {
        	return $('.vanity-err').html('The vanity max 32 characters!');
        }
		dailyRoi369Contract.checkVanityExisted(vanity).call().then(status => {
			if (status) {
				return $('.vanity-err').html('vanity existed');
			}
			dailyRoi369Contract.buyVanity(vanity).send({ callValue: convertTrxToSun(100) });
		}).catch(error);
		
    });
}
function makeEventDailyRoi369Reinvest() {
	$('.btn-reinvest').click(function(e) {
		e.preventDefault();
		dailyRoi369Contract.reinvest().send();
    });
}
function makeEventDailyRoi369Withdraw() {
	$('.btn-withdraw').click(function(e) {
		e.preventDefault();
		dailyRoi369Contract.withdraw().send();
    });
}
function makeEventDailyRoi369BuyCard() {
	
	$('.btn-buy-card').click(function(e) {
		e.preventDefault();
		var cardId = parseInt($(this).attr("data-card-id"));
		var price  = convertTrxToSun($(this).attr("data-price"));
		dailyRoi369Contract.buyCard(cardId).send({ callValue: price });
    });
}
function makeEventDailyRoi369ChangeBetValue() {
	$('#bet-value').on('input', function () {
	    // $(this).trigger('change');
	    var betValue = $(this).val(); 
	    var winnerChange = betValue - 1;
	    var payoutPercent = parseFloat(0.98 / (winnerChange / 100)).toFixed(2);
	    var betAmount = $('input[type=number][name=bet_amount]').val();
	    var payoutAmount = 0;
	    if (betAmount || betAmount != '') {
	    	payoutAmount = parseFloat(betAmount * payoutPercent).toFixed(2);
	    }
		$('.bet-prediction').html(betValue);
		$('.bet-winner-change').html(winnerChange + '%');
		$('.bet-payout-percent').html(payoutPercent + 'x');
		$('.bet-payout').val(payoutAmount);
	});
}
function makeEventDailyRoi369ChangeBetAmount() {

	$('input[type=number][name=bet_amount]').on('input', function () {
		// e.preventDefault();
		var betValue = $('#bet-value').val(); 
	    var winnerChange = betValue - 1;
	    var payoutPercent = parseFloat(0.98 / (winnerChange / 100)).toFixed(2);
	    var betAmount = $(this).val();
	    var payoutAmount = 0;
	    if (betAmount || betAmount != '') {
	    	payoutAmount = parseFloat(betAmount * payoutPercent).toFixed(2);
	    }
	    $('.bet-payout').val(payoutAmount);
    });
}
function makeEventDailyRoi369Bet() {
	$('.btn-bet').click(function(e) {
		e.preventDefault();
		$('.bet-error').html('');
		var prediction = parseInt($('.bet-prediction').html());
		var betAmount  = convertTrxToSun($('input[type=number][name=bet_amount]').val());
		checkBetAmount();
		function checkBetAmount() {
			dailyRoi369Contract.getMaxBetValue(prediction).call().then(result => {
				var maxBetAmount = parseInt(result);
				if (maxBetAmount < betAmount) {
					return $('.bet-error').html('you can bet max: ' + sunToDisplay(maxBetAmount) + ' TRX');
				}		
				loadPlayerCurrentBetRoundId();
			}).catch(error);
		}
		function loadPlayerCurrentBetRoundId() {
			dailyRoi369Contract.players(getAccount()).call().then(result => {
				currentPlayerBetRoundId = parseInt(result.betRoundId);
				betNow();
			}).catch(error);
		}
		function betNow() {	
			dailyRoi369Contract.bet(prediction).send({ callValue: betAmount }).then(result => {
				randomLuckNumber();
				loadBetResult();
			}).catch(error);
		}

    });	
    function loadBetResult() {
    	loadPlayerLastBetInterface = setInterval(() => {
    		dailyRoi369Contract.players(getAccount()).call().then(result => {
				var betRoundId = parseInt(result.betRoundId);
				if (betRoundId > currentPlayerBetRoundId) {
					dailyRoi369Contract.getPlayerLastBetInfo().call().then(result => {
						var luckNumber = parseInt(result._luckNumber);
						var reward = sunToDisplay(result._reward);
						var isWin  = result._isWin;
						clearInterval(loadPlayerLastBetInterface);
						clearInterval(randomLuckNumberInterface);
						setTimeout(() => {
							initLuckNumber(luckNumber);
						}, 300);
						setTimeout(() => {
							if (isWin == true) { 
								alert('you win this bet and your reward : ' + reward + ' Trx');
							}
						}, 500);
					}).catch(error);
				} 
			}).catch(error);
    	}, 1000);
    }
    function randomLuckNumber() {
    	randomLuckNumberInterface = setInterval(() => {
    		initLuckNumber(randomNumber());
    	}, 100);
    }
    function initLuckNumber(luckNumber) {
    	$('.bet-luck-number').html(luckNumber);
    }

}
// ---------------------------------------------------------------------------
// INIT DATA
// ---------------------------------------------------------------------------
function initDailyRoi369Data() {
	setDailyRoi369MultiCards();
	setDailyRoi369PlayerDetail();
	setDailyRoi369ContractDetail();
}
function setDailyRoi369MultiCards() {
	for (var idx = 0; idx < 3; idx++) {
		setCardDetail(idx);
	}
	function setCardDetail(cardId) {
		dailyRoi369Contract
			.getCardDetail(cardId)
			.call()
			.then(result => initInterface(result, cardId))
			.catch(error);
	}
	function initInterface(result, cardId) {
		var owner   = convertHexToAddress(result._owner);
		var price   = sunToDisplay(parseInt(result._price));
		var _profit = parseInt(result._profit);
		var selector= $('.wrap-card-' + cardId);
		selector.find('.current-owner').html(owner); 
		selector.find('.price-card').html(price + ''); 
		selector.find('.btn-buy-card').attr('data-price', price); 
	}
}
function setDailyRoi369PlayerDetail() {
	getPlayerDetail();
	function getPlayerDetail() {
		dailyRoi369Contract
			.getPlayerDetail()
			.call()
			.then(initInterface)
			.catch(error);
	}
	function initInterface(result) {
	    var vanity       = result._vanity;
	    var vanityStatus = result._vanityStatus;
	    var investment   = sunToDisplay(parseInt(result._investment));
	    var dividents    = sunToDisplay(parseInt(result._dividents));
	    var referral     = sunToDisplay(parseInt(result._referral));
	    var dividentsCanWithdraw = sunToDisplay(parseInt(result._dividentsCanWithdraw));
	    var totalWithdraws       = sunToDisplay(parseInt(result._totalWithdraws));
	    var profitPercentage     = result._profitPercentage;
	    // init 
	    initInvestment();
	    initInvestedCapital();
	    initReward();
	    initVanity();
	    initReferralLink();
	    function initInvestment() {
	    	var investmentSelector = $('.wrap-investments');
	    	investmentSelector.find('input[type=number][name=player_investments]').val(investment);
	    }
	    function initInvestedCapital() {
	    	$('.your-invested-capital').html(investment);
	    }
	    function initReward() {
	      	var rewardSelector = $('.wrap-reward');
		    rewardSelector.find('.your-total-withdraws').html(totalWithdraws);
		    rewardSelector.find('.your-referrals').html(referral);
		    rewardSelector.find('.your-dividents').html(dividents);
		    rewardSelector.find('.your-dividents-can-withdraw').html(dividentsCanWithdraw);
	    }
	    function initVanity() {
	    	var vanitySelector = $('.wrap-vanity');
	    	if (vanityStatus == true && initVanityStatus == false) {
	    		initVanityStatus = true;
	    		vanitySelector.find('input[type=text][name=vanity]').val(vanity);	
	    	}
	    }
	    function initReferralLink() {
	    	var vanityUrl   = dailyRoi369Url + '#' + encodeURI(vanity);
	    	var referralUrl = dailyRoi369Url + '?daily369node=' + getAccount();
	    	$('.your-referral-link').html(vanityUrl);
	    	$('.your-vanity-link').html(referralUrl);
	    }
	}
}
function setDailyRoi369ContractDetail() {
	getContractDetail();
	function getContractDetail() {
		dailyRoi369Contract
			.getContractDetail()
			.call()
			.then(initInterface)
			.catch(error);
	}
	function initInterface(result) {
		var contractDetail = {
			"balance" : sunToDisplay(parseInt(result._balance)),
		    "totalIn" : sunToDisplay(parseInt(result._totalIn)),
		    "totalOut": sunToDisplay(parseInt(result._totalOut)),
		    "totalTransactions": parseInt(result._totalTransactions),
		    "numberDayDeploy": parseInt(result._numberDayDeploy) 
		}; 
		if (daily369Chart) {
			initDailyRoi369Chart(contractDetail.numberDayDeploy); 
		}
		var selector = $('.wrap-daily-369-contract');
		selector.find('.balance').html(contractDetail.balance); 
		selector.find('.total-deposits').html(contractDetail.totalIn); 
		selector.find('.total-out').html(contractDetail.totalOut); 
		selector.find('.total-transactions').html(contractDetail.totalTransactions);
	}	
}
function initDailyRoi369Chart(numberDayDeploy) {
	if (initChartStatus == true) return false;
	var today = numberDayDeploy + 1;//
	var startDay = 1;
	// var listDailyInfo = [];
	var labels = [];
	var listTotalIn  = [];
	var listTotalOut = [];
	var listPlayers  = [];
	if (today > 20) startDay = today - 20;
	getData(startDay, today, listTotalIn, listTotalOut, listPlayers, labels, function(err, data) {
		if (err) return false;
		var lineIn = {
				label: '# Deposit',
			    data: data.listTotalIn,
	        	// backgroundColor: "#ffff",    
			   	borderColor: 'rgb(59, 89, 152)',
			    borderWidth: 1
		};
		var lineOut = {
			label: '# Withdrawn',
			data: data.listTotalOut,
			// backgroundColor: "#ffff",    
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1
		};
		daily369Chart.data.labels = data.labels;
		daily369Chart.data.datasets = [ lineIn, lineOut ];
    	daily369Chart.update();
    	initChartStatus = true;
	});
	function getData(startDay, today, listTotalIn, listTotalOut, listPlayers, labels, callback) {
		dailyRoi369Contract.listDailyInfo(startDay).call().then(result => {
			listTotalIn.push(sunToDisplay(parseInt(result.totalIn)));
			listTotalOut.push(sunToDisplay(parseInt(result.totalOut)));
			listPlayers.push(result.totalPlayer);
			labels.push(moment().subtract(today - startDay, 'days').format('DD/MM/YYYY'));
			if (startDay < today) {
				startDay = startDay + 1;
				return getData(startDay, today, listTotalIn, listTotalOut, listPlayers, labels, callback);
			} 
			return callback(null, { "listTotalIn": listTotalIn, "listTotalOut": listTotalOut, "listPlayers": listPlayers, "labels": labels });
		}).catch(e => {
			return callback(e, null);
		})
	};
}
function initChart() {
	setChart();	
	function setChart() {
		var config = getConfig();
		var chartSelector = document.getElementById('daily-369-chart');
		if (!chartSelector) return false;
		ctx = chartSelector.getContext('2d');
		daily369Chart = new Chart(ctx, config);
	}
	function getConfig() {
		var lineIn = {
			label: '# in',
		    data: [],
        	// backgroundColor: "#ffff",    
		   	borderColor: 'rgb(59, 89, 152)',
		    borderWidth: 1
		};
		var lineOut = {
			label: '# out',
		    data: [],
		    // backgroundColor: "#ffff",    
		   	borderColor: 'rgba(255, 99, 132, 1)',
		    borderWidth: 1
		};
		var data = [ lineIn, lineOut ];
		return {
			type: 'line',
		    data: {
		        labels: [],
		        datasets: data
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero: true
		                }
		            }]
		        }
		    }
		}
	}
}
// ---------------------------------------------------------------------------
// CONVERT
// ---------------------------------------------------------------------------
function sunToDisplay(trxprice, _toFixed = 0){
    return formatTrxValue(convertSunToTrx(trxprice), _toFixed)
}
function formatTrxValue(trxstr, _toFixed = 0){
    return parseFloat(parseFloat(trxstr).toFixed(_toFixed));
}
function convertSunToTrx(value) {
	return tronWeb.fromSun(value);
}
function convertTrxToSun(value) {
	return tronWeb.toSun(value);
}
function convertHexToAddress(hex) {
	return tronWeb.address.fromHex(hex);
}
function randomNumber() {
	return Math.floor(Math.random() * 100) + 1;
}
function getAccount () { 
    if (typeof(window.tronWeb) === 'undefined') return "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
    return tronWeb.defaultAddress['base58']; 
}
// ---------------------------------------------------------------------------
// COOKIE
// ---------------------------------------------------------------------------

function setDaily369nodeVanity() {
	var vanity = decodeURI(window.location.hash.substr(1)); 
    getAddressByVanity();
    function getAddressByVanity() {
      	dailyRoi369Contract
			.getAddressByVanity(vanity)
			.call()
			.then(handle)
			.catch(error);		
    }
    function handle(result) {
    	var refAddress = convertHexToAddress(result);
    	var theCookie = "daily369node=" + refAddress;
        // Run the support check
		if (!supportsLocalStorage()) {
			// No HTML5 localStorage Support
			document.cookie=theCookie;
		} else {
			// HTML5 localStorage Support JSON.stringify(user));
			localStorage.setItem('daily369node', refAddress);
		}
    }
}
function setDaily369node(ref) {
    var theCookie = "daily369node=" + ref;

    if (url.searchParams.get("daily369node") !== null) {
        // Run the support check
        if (!supportsLocalStorage()) {
          // No HTML5 localStorage Support
          document.cookie=theCookie;
        } else {
          // HTML5 localStorage Support JSON.stringify(user));
          localStorage.setItem('daily369node', ref);
        }
    }
 } 
function supportsLocalStorage() {
    return typeof(Storage)!== 'undefined';
}
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);

  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return "";
  }
  else
  {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }

  return decodeURI(dc.substring(begin + prefix.length, end));
}
//handle error
function error(e) {
	console.log(e);
}
