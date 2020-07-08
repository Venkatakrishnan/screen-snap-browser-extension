// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
		$accName = $("header p:contains('Account Structure')" ).parent().siblings().text();
		$funding = $("header p:contains('Funding')" ).parent().siblings().text();
		$viewType = $("header button div:contains('View')" ).find('div p').text();
		$dateRange = $("header button div:contains('Date Range')" ).find('div > div > div > div').find('p').text();
		$prior = $("header button div:contains('Prior')" ).find('div > div').eq(2).find('div').eq(2).text();
		$current = $("header button div:contains('Current')" ).find('div:last').text();
		
		var obj = {'acc': $accName, 'funding': $funding, 'viewType': $viewType, 'dateRange': $dateRange, 'prior': $prior, 'current': $current};
		
		
		console.log(obj);
		
		chrome.runtime.sendMessage({"message": "open_new_tab", "params": obj});
    }
  }
);