import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, userType } = req.query;
    let whereClause = {};

    if (userId && userType) {
      if (userType === 'tenant') {
        whereClause = {
          tenantCognitoId: String(userId),
        };
      } else if (userType === 'manager') {
        whereClause = {
          property: {
            managerCognitoId: String(userId),
          },
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
        tenant: true,
      },
    });

    const calculateNextPaymentDate = (startDate: Date): Date => {
      const today = new Date();
      const nextPaymentDate = new Date(startDate);
      while (nextPaymentDate < today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    };

    const formattedApplications = applications.map(async (app) => {
      const lease = await prisma.lease.findFirst({
        where: {
          tenant: {
            cognitoId: app.tenantCognitoId,
          },
          propertyId: app.propertyId,
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      return {
        ...app,
        property: {
          ...app.property,
          address: app.property.location.address,
        },
        manager: app.property.manager,
        lease: lease
          ? {
              ...lease,
              nextPaymentDate: calculateNextPaymentDate(lease.startDate),
            }
          : null,
      };
    });

    res.json(formattedApplications);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving applications: ${error.message}` });
  }
};
