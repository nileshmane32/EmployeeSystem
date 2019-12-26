USE [EmployeeSystem]
GO

/****** Object:  Table [dbo].[EmployeeDetails]    Script Date: 12/27/2019 12:42:15 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[EmployeeDetails](
	[EmpId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](500) NULL,
	[Age] [int] NULL,
	[MaritalStatus] [bit] NULL,
	[Salary] [decimal](18, 0) NULL,
	[Location] [nvarchar](100) NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_EmployeeDetails] PRIMARY KEY CLUSTERED 
(
	[EmpId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


