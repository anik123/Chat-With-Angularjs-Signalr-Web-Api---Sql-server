using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace ChatApi
{
    public abstract class DataBaseContext<TContext> where TContext : ObjectContext, new()
    {

        protected DataBaseContext()
        {

        }

        private TContext _DataContext;

        public virtual TContext DataContext
        {


            get
            {

                return _DataContext ?? (_DataContext = new TContext());

                // return _DataContext ?? (_DataContext = new TContext());
            }
        }
    }
}