using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace ChatApi
{
    public class chatHub : Hub
    {
        public static async Task notifyClient(string userid, string message, string avatar)
        {
            var conn = new string[] { "democonn" };
            var context = GlobalHost.ConnectionManager.GetHubContext<chatHub>();
            IClientProxy proxy = context.Clients.All;
            await proxy.Invoke("notifyClient", userid, message, avatar);

        }

        public static async Task notifyOnlineUser(List<UserActivity> activity)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<chatHub>();
            IClientProxy proxy = context.Clients.All;
            await proxy.Invoke("notifyOnlineUser", activity);
        }

        public static async Task notifyUserStatus(string connectionID, string status)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<chatHub>();
            IClientProxy proxy = context.Clients.All;
            await proxy.Invoke("notifyUserStatus", connectionID, status);
        }

        public void updateStatus(string connectionID, string status)
        {
            try
            {
                using (var entities = new SignalREntities())
                {
                    var active = entities.useractivities.Where(o => o.ConnectionID == connectionID.Trim());
                    if (active.Any())
                    {
                        var entity = active.First();
                        entity.Status = status;
                        entities.SaveChanges();
                    }
                }
                chatHub.notifyUserStatus(connectionID, status);

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public override Task OnConnected()
        {

            using (var entities = new SignalREntities())
            {
                var useractivities = entities.useractivities.ToList();
                chatHub.notifyOnlineUser(useractivities.Select(o => new EMUserActivity().entityToModel(o)).ToList());
            }
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            try
            {
                var connection = GetClientId();
                using (var entities = new SignalREntities())
                {
                    var exists = entities.useractivities.Where(o => o.ConnectionID.Equals(connection.Trim()));
                    if (exists.Any())
                    {
                        entities.useractivities.DeleteObject(exists.First());
                        if (entities.SaveChanges() > 0)
                        {

                            var useractivities = entities.useractivities.ToList();
                            chatHub.notifyOnlineUser(useractivities.Select(o => new EMUserActivity().entityToModel(o)).ToList());
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

            return base.OnDisconnected(stopCalled);
        }

        private string GetClientId()
        {
            string clientId = "";
            if (Context.QueryString["clientId"] != null)
            {
                // clientId passed from application 
                clientId = this.Context.QueryString["clientId"];
            }

            if (string.IsNullOrEmpty(clientId.Trim()))
            {
                clientId = Context.ConnectionId;
            }

            return clientId;
        }
    }
}