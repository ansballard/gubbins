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
    .otherwise({
      redirectTo: "/"
    })
  ;
}
