var app = angular.module("app");
app.factory("chatSvc", ['$http', function ($http) {

    var notification = {
        success: "success",
        error: "error",
        wait: "wait",
        warning: "warning",
        note: "note"
    };

    var position = { "positionClass": "toast-bottom-right" };
    var service = {
        success: success,
        error: error,
        registerUser: registerUser,
        warning: warning,
        info: info
    };
    return service;

    function success(msg) {
        toastr.success(msg, '', position);
    }

    function error(msg) {
        toastr.error(msg, '', position);
    }

    function warning(msg) {
        toastr.warning(msg, '', position);
    }
    function info(msg) {
        toastr.info(msg, '', position);
    }

    function registerUser(username) {

        return $http.post('http://localhost:28643/api/msg/registerUser', { username: username });
    }

    //toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
    //toaster.pop('error', "title", '<ul><li>Render html</li></ul>', null, 'trustedHtml');
}]);
