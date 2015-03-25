using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatApi
{
    public class EMUserActivity
    {
        public useractivity modelToEntity(UserActivity uactivity)
        {
            var activity = new useractivity();
            activity.UserID = uactivity.UserID;
            activity.ConnectionID = uactivity.ConnectionID;
            activity.Status = uactivity.Status;
            activity.Avater = uactivity.Avater;
            // msgData.MessageID = msg.MessageID;
            return activity;
        }

        public UserActivity entityToModel(useractivity activity)
        {
            var uactivity = new UserActivity();
            uactivity.OnlineID = activity.OnlineID;
            uactivity.UserID = activity.UserID;
            uactivity.ConnectionID = activity.ConnectionID;
            uactivity.Status = activity.Status;
            uactivity.Avater = activity.Avater;
            return uactivity;
        }
    }
}