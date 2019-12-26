using Employee.Models.DBModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Infrastructure.DependencyResolution;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.SqlClient;
using System.Linq;

namespace Employee.Services
{
    public class MyConfig : DbConfiguration
    {
        public MyConfig()
        {
            SetDatabaseInitializer<DBEntities>(null);
            //SetManifestTokenResolver(new MyManifestTokenResolver());
            AddDependencyResolver(new SingletonDependencyResolver<IManifestTokenResolver>(new MyManifestTokenResolver()));
        }

        public class MyManifestTokenResolver : IManifestTokenResolver
        {
            private readonly IManifestTokenResolver _defaultResolver = new DefaultManifestTokenResolver();

            private string sqlSerVersion;
            public string SqlSerVersion
            {
                get
                {
                    if (string.IsNullOrEmpty(sqlSerVersion))
                    {
                        sqlSerVersion = ConfigurationManager.AppSettings["SqlSerVersion"] != null ? ConfigurationManager.AppSettings["SqlSerVersion"].ToString() : "2012";
                    }
                    return sqlSerVersion;
                }
                set
                {
                    sqlSerVersion = value;
                }
            }

            public string ResolveManifestToken(DbConnection connection)
            {
                var sqlConn = connection as SqlConnection;
                //if (sqlConn != null && sqlConn.DataSource == @".\SQLEXPRESS")
                string strReturn;
                if (sqlConn != null)
                {
                    strReturn = SqlSerVersion;

                }
                else
                {
                    strReturn = _defaultResolver.ResolveManifestToken(connection);
                    SqlSerVersion = strReturn;
                }
                return strReturn;
            }
        }
    }

    [DbConfigurationType(typeof(MyConfig))]
    public sealed class DBEntities : DbContext
    {
        public DBEntities(string connectionString) : base(connectionString)
        {
            Database.SetInitializer<DBEntities>(null);
            Database.Connection.ConnectionString = connectionString;
            Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }

        public DBEntities()
        {
            Database.SetInitializer<DBEntities>(null);
            Database.Connection.ConnectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<EmployeeDetails>().ToTable("EmployeeDetails", "dbo").HasKey(c => new { c.EmpId });
            modelBuilder.Entity<EmployeeDetails>().Property(t => t.EmpId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
        }

        #region DbSet List

        public DbSet<EmployeeDetails> EmployeeDetails { get; set; }

        #endregion

        public override int SaveChanges()
        {
            #region All CAPS for all text fields
            EntityState[] entityState = { EntityState.Added, EntityState.Modified };
            var list = ChangeTracker.Entries().Where(x => entityState.Contains(x.State)).ToList();

            foreach (var lstItem in list)
            {
                var stringPropertyList = lstItem.Entity.GetType().GetProperties().Where(c => c.PropertyType == typeof(string)).ToList();
                foreach (var strProperty in stringPropertyList)
                {
                    if (lstItem.Entity.GetType() == typeof(EmployeeDetails))
                    {
                        var propertyValue = lstItem.Entity.GetType().GetProperty(strProperty.Name).GetValue(lstItem.Entity, null);
                        if (propertyValue != null && !string.IsNullOrEmpty(propertyValue.ToString()))
                        {
                            lstItem.Entity.GetType().GetProperty(strProperty.Name).SetValue(lstItem.Entity, propertyValue.ToString().Trim());
                        }
                    }                    
                    else
                    {
                        var propertyValue = lstItem.Entity.GetType().GetProperty(strProperty.Name).GetValue(lstItem.Entity, null);
                        if (propertyValue != null && !string.IsNullOrEmpty(propertyValue.ToString()))
                        {
                            lstItem.Entity.GetType().GetProperty(strProperty.Name).SetValue(lstItem.Entity, propertyValue.ToString().ToUpper().Trim());
                        }
                    }
                }
            }
            #endregion

            return base.SaveChanges();
        }
    }
}
