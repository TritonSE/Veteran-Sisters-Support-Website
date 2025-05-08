import { APIResult, get, post, handleAPIError } from "./requests";

export type ReportRequest = {
  reporterId: string;
  reporteeId: string;
  situation: string[];
  proofOfLifeDate: string | null;
  proofOfLifeTime: string;
  explanation: string;
};

export type Report = {
  _id: string;
  reporterId: string;
  reporteeId: string;
  situation: string[];
  proofOfLifeDate: string | null;
  proofOfLifeTime: string;
  explanation: string;
  datePosted: string;
  statusResolved: boolean;
};

export async function createReport(report: ReportRequest): Promise<APIResult<Report>> {
  try {
    const response = await post("/report", report);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as Report;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getReportsByReporter(reporterId: string): Promise<APIResult<Report[]>> {
  try {
    const response = await get(`/report?reporterId=${reporterId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as Report[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getReportsAgainst(reporteeId: string): Promise<APIResult<Report[]>> {
  try {
    const response = await get(`/report?reporteeId=${reporteeId}`);
    if (!response.ok) {
      return handleAPIError(response);
    }
    const data = (await response.json()) as Report[];
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
