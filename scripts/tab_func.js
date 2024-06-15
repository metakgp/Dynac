// Trigger the renderer.js
//"tabs",
//"webNavigation"
const dis = document.getElementById("not_url_display");

const script = document.createElement('script');
script.src = "scripts/webextension-polyfill.js";
document.head.appendChild(script);

document.getElementById("CV1").addEventListener("click", () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    if (tabs[0].url == "https://erp.iitkgp.ac.in/IIT_ERP3/showmenu.htm") {
      browser.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: false },
        //world:"ISOLATED",
        files: ["scripts/renderer.js"],
      });
    } else dis.innerText = "Navigate to ERP CV making form and then click Build CV1";
  });
});
