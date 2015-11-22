RouteConfig.$inject = ["$routeProvider"];

export default RouteConfig;

function RouteConfig($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "gui.template.html",
      controller: "GuiController",
      controllerAs: "vm",
      bindToController: true
    })
    .when("/readme", {
      templateUrl: "readme.template.html"
    })
    .when("/changelog", {
      templateUrl: "changelog.template.html"
    })
    .otherwise({
      redirectTo: "/"
    })
  ;
}
