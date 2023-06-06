// Trigger the renderer.js

var dis = document.getElementById("not_url_display");
document.getElementById("CV1").addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true },
        (tabs) => {
            if (tabs[0].url == "https://erp.iitkgp.ac.in/IIT_ERP3/showmenu.htm") {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id, allFrames: false },
                    //world:"ISOLATED",
                    files: ['scripts/renderer.js'],
                });
            }
            else dis.innerText = "Navigate to ERP CV making form and then click Build CV1";
        }
    );
});