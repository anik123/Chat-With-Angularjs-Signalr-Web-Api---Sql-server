using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ChatApi
{
    public class User
    {
        [Key]
        public string UserID { get; set; }
        public string UserName { set; get; }
        public string Password { set; get; }
    }
}