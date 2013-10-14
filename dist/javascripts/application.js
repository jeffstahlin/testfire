
steroids.view.navigationBar.show("TestFire");

function showQuiz(title) {
  var webView = new steroids.views.WebView("quiz.html?quiz=" + title);
  steroids.layers.push(webView);
}