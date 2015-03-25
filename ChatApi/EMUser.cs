using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;

namespace ChatApi
{
    public class EMUser
    {
        public user modelToEntity(User user)
        {
            var userData = new user();
            userData.UserID = user.UserID;
            userData.UserName = user.UserName;
            userData.Password = user.Password;
            return userData;
        }
    }
}