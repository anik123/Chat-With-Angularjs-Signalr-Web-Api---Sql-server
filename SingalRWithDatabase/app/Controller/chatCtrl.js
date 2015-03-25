var app = angular.module("app");


//Example with manual proxy
app.controller("chatCtrl", [
    "$scope", "chatSvc", "$http", "$timeout", function ($scope, chatSvc, $http, $timeout) {

        $scope.button = {
            login: "Login",
            send: "Send",
            inactive: true
        };
        $scope.user = {
            username: '',
            message: '',
            button: $scope.button.login,
            isActive: false,
            avatar: '',
            status: ''
        };
        $scope.status = [
        {
            type: "Invisible",
            style: "fa fa-map-marker"
        }, {
            type: "Online",
            style: "fa fa-comments-o"
        },
        {
            type: "Busy",
            style: "fa fa-lock"
        },
        {
            type: "Logout",
            style: "fa fa-circle-o-notch"
        }
        ];
        $scope.EmoticonsList = [
        {
            pattern: ":ki:",
            image: "ki.gif"
        },
            {
                pattern: ":shy:",
                image: "shy.gif"
            },
            {
                pattern: ":no:",
                image: "no.gif"
            },
            {
                pattern: ":yes:",
                image: "yes.gif"
            },
            {
                pattern: ":tuki:",
                image: "tuki.gif"
            },
            {
                pattern: ":baby:",
                image: "baby.gif"
            },
            {
                pattern: ":alien:",
                image: "alien.gif"
            },
            {
                pattern: ":monstar:",
                image: "monstar.gif"
            }
            ,
            {
                pattern: ":angry:",
                image: "angry.gif"
            },
            {
                pattern: ":rofl:",
                image: "rofl.gif"
            },
            {
                pattern: ":cry:",
                image: "cry.gif"
            },
            {
                pattern: ":suicide:",
                image: "suicide.gif"
            },
            {
                pattern: ":disapoint:",
                image: "disapoint.gif"
            },
            {
                pattern: ":scared:",
                image: "scared.gif"
            },
            {
                pattern: ":hit:",
                image: "hit.gif"
            }, {
                pattern: ":old:",
                image: "old.gif"
            },
            {
                pattern: ":bd:",
                image: "bd.gif"
            }
        ];
        $scope.emoticons = {
            ':ki:': 'ki.gif',
            ':shy:': 'shy.gif',
            ':no:': 'no.gif',
            ':yes:': 'yes.gif',
            ':tuki:': 'tuki.gif',
            ':baby:': 'baby.gif',
            ':alien:': 'alien.gif',
            ':monstar:': 'monstar.gif',
            ':angry:': 'angry.gif',
            ':rofl:': 'rofl.gif',
            ':cry:': 'cry.gif',
            ':suicide:': 'suicide.gif',
            ':disapoint:': 'disapoint.gif',
            ':scared:': 'scared.gif',
            ':hit:': 'hit.gif',
            ':old:': 'old.gif',
            ':bd:': 'bd.gif'
        };


        $scope.messageList = [];
        $scope.userList = [];

        $scope.manageMessage = manageMessage;
        $scope.updateMsg = updateMsg;
        $scope.addSmilie = addSmilie;


        /*
            Manual Proxy Try Start
        */
        var connection = $.hubConnection("http://localhost:30220");
        var hub = connection.createHubProxy("chatHub");
        //hub.logging = true;
        hub.on("notifyOnlineUser", notifyOnlineUser);
        hub.on("notifyClient", notifyClient);
        hub.on("notifyUserStatus", notifyUserStatus);
        hub.on("connectionSlow", function () {
            chatSvc.warning("Your network connection is poor!");
        });
        hub.on("reconnecting", function () {
            chatSvc.info("Connection reconting");
        });

        connection.start().done(function () {
            $scope.button.inactive = false;
        });
        connection.logging = true;



        /*
           Manual Proxy Try End
        */

        // Auto Proxy Start
        //$.connection.hub.url = "http://localhost:30220/signalr/hubs/";
        //var chat = $.connection.chatHub;

        //chat.client.notifyClient = notifyClient;
        //chat.client.notifyOnlineUser = notifyOnlineUser;
        //chat.client.notifyUserStatus = notifyUserStatus;

        //$.connection.hub.logging = true;
        //$.connection.hub.start().done(function () {
        //    $scope.button.inactive = false;
        //});
        //$.connection.hub.connectionSlow(function () {
        //    chatSvc.warning("Your network connection is poor!");
        //});
        //$.connection.hub.reconnecting(function () {
        //    chatSvc.info("Connection reconting");
        //});
        // conversion Process
        // convert all connection.id to $.connection.hub.id
        // add <script src="http://localhost:30220/signalr/hubs/"></script> in chat.html
        //
        // Auto Proxy End


        function notifyClient(name, msg, avatar) {
            var message = new messageEntity({ username: name, message: replaceEmoticons(msg), avatar: avatar });
            $scope.messageList.push(message);
            //console.log($scope.messageList);
            //$scope.user.message = "";
            $scope.$apply();
        }

        function notifyOnlineUser(users) {

            $scope.userList = filterUser(users);
            $scope.$apply();
            //console.log(userList);
        }

        function filterUser(users) {
            users.forEach(function (user) {
                if (user.ConnectionID.trim() == connection.id.trim()) {
                    user.UserID = user.UserID + " [You]";
                    $scope.user.avatar.length <= 0 ? $scope.user.avatar = user.Avater : void 0;
                }
            });
            //console.log($scope.user);
            //users = Enumerable.From(users).Where(function (x) { return x.Status != "Invisible"; }).ToArray();
            return users;
        }

        function messageEntity(val) {
            var dflt = val;
            this.username = dflt.username;
            this.message = dflt.message;
            this.avatar = dflt.avatar;
        }

        function manageMessage() {
            try {
                var msg = angular.copy($scope.user.message);
                $scope.user.message = "";
                CONTROL.setFocus("focusMe");
                $scope.user.isActive ? registerMsg($scope.user.username, msg) : $scope.user.username.length > 0 ? registerUser($scope.user.username) : chatSvc.error("Please provide a username");
            } catch (e) {
                chatSvc.error(e);
            }
        }
        function registerUser(username) {
            var req = {
                method: 'GET',
                url: 'http://localhost:30220/api/msg/registerUser?username=' + username + "&connectionID=" + connection.id,
            }
            $http(req)
                .success(function () {
                    $scope.user.isActive = true;

                    $scope.user.button = $scope.button.send;
                    $scope.user.status = "Online";
                    //$scope.$apply();
                })
                .error(function (e) {
                    chatSvc.error(e);
                });
        }
        function registerMsg(username, msg) {
            var req = {
                method: 'GET',
                url: 'http://localhost:30220/api/msg/sendMessage?userid=' + username + '&msg=' + msg
            };
            $http(req).success(function () {

            }).error(function (e) {
                chatSvc.error(e);
            });
        }

        function updateMsg(status) {

            $timeout(function () {
                $scope.user.status = status.type.trim();
            }, 0);
            status.type === "Logout" ? logOut() : hub.invoke("updateStatus", connection.id, status.type);
        }
        function logOut() {
            $scope.user.username = '';
            $scope.user.message = '';
            $scope.user.avatar = '';
            $scope.user.button = $scope.button.login;
            $scope.user.isActive = false;
            //$scope.$apply();
            $scope.messageList = [];
            chatSvc.success("Successfully Logout");
            connection.stop();
            $scope.button.inactive = true;

            connection.start().done(function () {
                $scope.button.inactive = false;
            });
        }

        function notifyUserStatus(connectionID, status) {
            $scope.userList.some(function (user) {
                if (user.ConnectionID.trim() === connectionID.trim()) {
                    user.Status = status;
                    return true;
                }
            });
            // $scope.userList = Enumerable.From($scope.userList).Where(function (x) { return x.Status != "Invisible"; }).ToArray();
            $scope.$apply();
        }


        $scope.insertEmoticon = function (selected) {
            $scope.message.text = $scope.message.text + " " + selected + " ";
        }


        function replaceEmoticons(text) {
            var patterns = [];
            //var metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;
            var metachars = /:[a-zA-Z]*:/g;
            // build a regex pattern for each defined property
            for (var i in $scope.emoticons) {
                if ($scope.emoticons.hasOwnProperty(i)) { // escape metacharacters
                    patterns.push('(' + i.replace(metachars, "\\$&") + ')');
                }
            }

            // build the regular expression and replace
            return text.replace(new RegExp(patterns.join('|'), 'g'), function (match) {
                return typeof $scope.emoticons[match] != 'undefined' ?
                  '<img src="img/smilies/' + $scope.emoticons[match] + '"/>' :
                  match;
            });
        }

        function addSmilie(smileEntity) {
            $scope.user.message = $scope.user.message.length > 0 ? $scope.user.message + " " + smileEntity.pattern + " " : smileEntity.pattern + " ";
        }

    }
]);

