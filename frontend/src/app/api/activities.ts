import { APIResult, get, handleAPIError, post } from "./requests";

export type ActivityObject = {
  _id: string;
  uploader: { firstName: string; lastName: string; role: string };
  type: "document" | "comment" | "assignment" | "report" | "request" | "announcement" | "signup";
  title: string;
  description: string;
  documentName: string;
  programName: string[];
  isRead: boolean;
  createdAt: Date;
  relativeTime: string;
};

// Set the relative time (Today OR # days ago OR Dec 12) based on timestamp
const setRelativeTime = (timestamp: string | Date): string => {
  const activityDate = new Date(timestamp);
  const today = new Date();

  // Remove time to only compare days
  const activityDay = new Date(activityDate.setHours(0, 0, 0, 0));
  const todayDay = new Date(today.setHours(0, 0, 0, 0));

  // Calculate difference in days and round down
  const timeDiff = todayDay.getTime() - activityDay.getTime();
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1 day ago";
  if (daysAgo < 7) {
    return `${String(daysAgo)} days ago`;
  } else {
    // If 7 or more days ago, date is formatted "Dec 12"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(activityDate);
  }
};

// Get unread activities
export const getUnreadActivities = async (
  userId: string,
): Promise<APIResult<{ recentUnread: ActivityObject[]; totalUnread: number }>> => {
  try {
    const response = await get(`/activities/${userId}`);
    if (response.ok) {
      const activities = (await response.json()) as {
        recentUnread: ActivityObject[];
        totalUnread: number;
      };

      // Set relative time for each activity
      activities.recentUnread.forEach((activity: ActivityObject) => {
        activity.relativeTime = setRelativeTime(activity.createdAt);
      });

      return { success: true, data: activities };
    } else {
      // Handle response errors if the API call is not successful
      const errorMessage = `Error: ${response.statusText}`;
      return { success: false, error: errorMessage };
    }
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
