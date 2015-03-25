using System;
using System.Collections.Generic;
using System.Data.Common.EntitySql;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace ChatApi
{
    public class msgController : ApiController
    {
        MessageRepo msgRepo = new MessageRepo();

        [HttpGet]
        public void registerUser(string username, string connectionID)
        {
            msgRepo.registerUser(username, "", connectionID);
        }

        [HttpGet]
        public void sendMessage(string userid, string msg)
        {
            msgRepo.addMessage(userid, msg);
        }
    }
}