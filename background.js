let timestamp = Date.now();

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
		
		chrome.tabs.captureVisibleTab((screenshotUrl) => {
		
			const viewTabUrl = chrome.extension.getURL('screenshot.html?flush=' + timestamp)
			let targetId = null;
			chrome.tabs.onUpdated.addListener(function listener(tabId,     changedProps) {
			if (tabId != targetId || changedProps.status != "complete")
				return;
			
			chrome.tabs.onUpdated.removeListener(listener);
			
			const views = chrome.extension.getViews();
			  for (let i = 0; i < views.length; i++) {
				let view = views[i];
				if (view.location.href == viewTabUrl) {
				  view.setScreenshotUrl(screenshotUrl);
				  view.setTabValue(request.params);
				  break;
				}
			  }
			});
			
			chrome.tabs.create({url: viewTabUrl}, (tab) => {
				targetId = tab.id;
			});
	    });
    }
  }
);
