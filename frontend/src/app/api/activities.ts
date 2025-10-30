import { APIResult, get, handleAPIError, post } from "./requests";

export type ActivityObject = {
  _id: string;
  uploader: { firstName: string; lastName: string; role: string };
  type: ActivityType;
  title: string;
  description: string;
  documentName: string;
  programName: string[];
  isRead: boolean;
  createdAt: Date;
  relativeTime: string;
};

export enum ActivityType {
  DOCUMENT = "document",
  COMMENT = "comment",
  ASSIGNMENT = "assignment",
  REPORT = "report",
  REQUEST = "request",
  ANNOUNCEMENT = "announcement",
  SIGNUP = "signup",
}

type CreateAnnouncementRequest = {
  uploader: string;
  title: string;
  description: string;
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
    const response = await get(`/activities/unread/${userId}`);
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

export const getActivities = async (userId: string): Promise<APIResult<ActivityObject[]>> => {
  try {
    const response = await get(`/activities/${userId}`);
    if (response.ok) {
      const activities = (await response.json()) as ActivityObject[];
      activities.forEach((activity: ActivityObject) => {
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

export const getAnnouncements = async (userId: string): Promise<APIResult<ActivityObject[]>> => {
  try {
    const response = await get(`/activities/announcements/${userId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const announcements = (await response.json()) as ActivityObject[];
    announcements.forEach((activity: ActivityObject) => {
      activity.createdAt = new Date(activity.createdAt);
    });
    return { success: true, data: announcements };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const createAnnouncement = async (
  announcementInfo: CreateAnnouncementRequest,
): Promise<APIResult<ActivityObject>> => {
  try {
    const response = await post(`/activities/announcement`, announcementInfo);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const activity = (await response.json()) as ActivityObject;
    return { success: true, data: activity };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
