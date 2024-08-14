import { auth } from "@/auth";
import prisma from "@/db";
import { endOfToday, startOfToday } from "date-fns";

export async function getMyMemberWorkLoads() {
  const session = await auth();
  try {
    return await prisma.user.findUnique({
      where: { id: session?.user.sub },
      select: {
        group: {
          select: {
            members: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
                project: {
                  where: { status: "REQUEST" || "STANDBY" || "LIVE" },
                  select: { difficulty: true },
                },
                tasks: {
                  where: { task: { isComplete: false } },
                  select: {
                    inputRate: true,
                    task: {
                      select: {
                        taskReport: {
                          where: {
                            date: { gte: startOfToday(), lte: endOfToday() },
                          },
                        },
                      },
                    },
                  },
                },
                _count: { select: { managementGroups: true } },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
