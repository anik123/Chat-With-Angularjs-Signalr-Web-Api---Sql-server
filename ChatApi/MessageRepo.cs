using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace ChatApi
{
    public class MessageRepo
    {
        private Avatar img = new Avatar();

        public int registerUser(string username, string password, string connectionID)
        {
            try
            {
                using (var entities = new SignalREntities())
                {
                    var check = entities.users.Where(o => o.UserID.Equals(username));
                    if (!check.Any())
                    {
                        var user = new User();
                        user.UserID = username;
                        user.UserName = username;
                        user.Password = password;
                        entities.users.AddObject(new EMUser().modelToEntity(user));

                        entities.SaveChanges();
                    }
                    var rand = new Random();
                    var index = rand.Next(0, img.Image.Count - 1);

                    var activity = new UserActivity();
                    activity.UserID = username;
                    activity.ConnectionID = connectionID;
                    activity.Status = "Online";
                    activity.Avater = img.Image[index];

                    entities.useractivities.AddObject(new EMUserActivity().modelToEntity(activity));
                    entities.SaveChanges();
                    var useractivities = entities.useractivities.ToList();
                    chatHub.notifyOnlineUser(useractivities.Select(o => new EMUserActivity().entityToModel(o)).ToList());
                }
                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public void addMessage(string username, string message)
        {
            try
            {
                using (var entities = new SignalREntities())
                {
                    var msg = new Message();
                    msg.Msg = message;
                    msg.UserID = username;
                    entities.messages.AddObject(new EMMessage().modelToEntity(msg));
                    entities.SaveChanges();
                    var avatar = entities.useractivities.First(o => o.UserID == username);
                    chatHub.notifyClient(username, message, avatar.Avater);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}