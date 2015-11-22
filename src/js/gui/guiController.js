GuiController.$inject = ["APIService"];

export default GuiController;

function GuiController(APIService) {
  let vm = this;

  vm.loadingUrl = false;
  vm.generateUrl = generateUrl;
  vm.setStatusMessage = setStatusMessage;

  function generateUrl(content, numberOfUses, hoursToLive, from) {
    if (!content || content.length === 0) {
      setStatusMessage("Password required", "danger");
    } else {
      const toSend = {
        content: content,
        numberOfUses: numberOfUses || 1,
        hoursToLive: hoursToLive || 24,
        from: from
      };
      vm.loadingUrl = true;
      vm.generatedUrl = "";
      APIService.generateUrl(toSend)
        .then(
          (res) => {
            if(res.status === 200) {
              vm.generatedUrl = res.data;
            } else {
              setStatusMessage("HTTP Status: " + res.status, "danger");
            }
            vm.loadingUrl = false;
          }, (res) => {
            setStatusMessage("HTTP Status: " + res.status, "danger");
            vm.loadingUrl = false;
          }
        ).catch((ex) => {
          setStatusMessage(ex, "danger");
          vm.loadingUrl = false;
        });
    }
  }

  function setStatusMessage(message, bsClass) {
    if (typeof message === "undefined") {
      vm.showStatusMessage = false;
    } else {
      vm.statusMessage = message;
      if (typeof bsClass !== "undefined") {
        vm.statusClass = bsClass;
      }
      vm.showStatusMessage = true;
    }
  }
}
