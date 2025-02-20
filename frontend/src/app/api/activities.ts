import { APIResult, get, handleAPIError, post } from "./requests";

export type ActivityObject = {
  firstName: string;
  lastName: string;
  role: string;
  documentName: string;
  // action: string;
};

// Get unread activities
export const getUnreadActivities = async (): Promise<APIResult<string[]>> => {
  try {
    const response = await get("/api/activities");
    if (response.ok) {
      const activities = (await response.json()) as ActivityObject[];

      // Map activities into a formatted string array
      const data = activities.map((activity) => {
        return `${activity.firstName} ${activity.lastName} (${activity.role}) uploaded a new document named "${activity.documentName}"`;
      });

      return { success: true, data };
    } else {
      // Handle response errors if the API call is not successful
      const errorMessage = `Error: ${response.statusText}`;
      return { success: false, error: errorMessage };
    }
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

// Mark activity as read
export const markActivityRead = async (activityId: string) => {
  try {
    await post(`/api/activities/${activityId}`, { activityId });
    return { success: true };
  } catch (error) {
    return handleAPIError(error);
  }
};
