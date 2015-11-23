APIService.$inject = ["$http"];

export default APIService;

function APIService($http) {
  return {
    generateUrl(obj) {
      return $http.post("/api/generate", {
        content: obj.content,
        hoursToLive: obj.hoursToLive,
        numberOfUses: obj.numberOfUses,
        from: obj.from
      });
    },
    getPass(id, key) {
      return $http.get("/api/getgub/" + id + "/" + key);
    }
  };
}
