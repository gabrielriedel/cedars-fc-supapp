import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load the service account credentials JSON file
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "base64").toString("utf8")
);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Set up Supabase client
const supabaseUrl: string = 'https://cagzieozbyrkqprhhiue.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZ3ppZW96Ynlya3FwcmhoaXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzAxMTAzNiwiZXhwIjoyMDMyNTg3MDM2fQ.3URRRd-5B8MrtCdau8ZsTMU9KEnoleQd3M7sSSHNtr4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Replace with your actual sheet ID
const spreadsheetId: string = '1i81qH6W7d6ewG9Tklu7D8UBqxT9oMIwRn0B4uSNXNPk';

type Activity = {
  id: number;
  activity_name: string;
  location: string;
  capacity: number;
};

type Roster = {
  guest_id: string;
  day: string;
  hour: number;
  activity_id: number;
  activity_name: string;
  first_name: string;
  last_name: string;
  location: string;
  attire: string;
  family_code: string;
  grade: string;
};

async function getTuesdayActivitiesAndRosters(): Promise<{ activities: Activity[], rosters: Roster[] }> {
  const { data: activitiesData, error: activitiesError } = await supabase
    .from('activities')
    .select('*');
  
  if (activitiesError) {
    console.error('Error fetching activities from Supabase:', activitiesError);
    throw activitiesError;
  }

  const { data: rostersData, error: rostersError } = await supabase
    .from('rosters')
    .select('*')
    .eq('day', 'Thursday');

  if (rostersError) {
    console.error('Error fetching rosters from Supabase:', rostersError);
    throw rostersError;
  }

  return { activities: activitiesData, rosters: rostersData };
}

function formatDataForGoogleSheets(activities: Activity[], rosters: Roster[]): { [hour: number]: any[][] } {
  const formattedData: { [hour: number]: any[][] } = {
    1: [],
    2: [],
    3: [],
    4: [],
  };

  const activitiesMap = activities.reduce((acc, activity) => {
    acc[activity.id] = activity;
    return acc;
  }, {} as { [id: number]: Activity });

  // Group data by hour and then by activity
  for (let hour = 1; hour <= 4; hour++) {
    const hourData: any[][] = [];

    // Filter rosters for the current hour
    const hourRosters = rosters.filter(r => r.hour === hour);

    // Group rosters by activity_id
    const rostersByActivity = hourRosters.reduce((acc, roster) => {
      const activityId = roster.activity_id;
      if (!acc[activityId]) {
        acc[activityId] = [];
      }
      acc[activityId].push(roster);
      return acc;
    }, {} as { [activity_id: number]: Roster[] });

    // Format data for each activity
    Object.keys(rostersByActivity).forEach(activityIdString => {
      const activityId = parseInt(activityIdString, 10);
      const activity = activitiesMap[activityId];
      const participants = rostersByActivity[activityId];

      // Add activity header
      hourData.push([`${activity.activity_name} @ ${activity.location} - (${activity.capacity})`]);

      // Add participants
      participants.forEach((participant, index) => {
        hourData.push([`${index + 1}) ${participant.first_name} ${participant.last_name} - ${participant.grade}`]);
      });

      // Add an empty row after each activity for spacing
      hourData.push([]);
    });

    formattedData[hour] = hourData;
  }

  return formattedData;
}

async function writeToGoogleSheet(authClient: any, formattedData: { [hour: number]: any[][] }): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const requests: any[] = [];

  // Create or clear sheets for each hour
  for (let hour = 1; hour <= 4; hour++) {
    const sheetTitle = `Thursday ${hour}st period`;
    const sheetId = await ensureSheetExists(authClient, sheetTitle);

    const values = formattedData[hour];
    const resource = {
      values,
    };

    const range = `${sheetTitle}!A1`;

    requests.push({
      updateCells: {
        range: {
          sheetId: sheetId, // Use the correct integer sheet ID
          startRowIndex: 0,
          startColumnIndex: 0,
        },
        rows: values.map(value => ({
          values: value.map(cell => ({
            userEnteredValue: { stringValue: cell },
          })),
        })),
        fields: '*',
      },
    });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests,
    },
  });
}

async function ensureSheetExists(authClient: any, sheetTitle: string): Promise<number> {
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  let sheet = response.data.sheets?.find(sheet => sheet.properties?.title === sheetTitle);

  if (!sheet) {
    const addSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetTitle,
            },
          },
        }],
      },
    });

    const newSheet = addSheetResponse.data.replies?.[0]?.addSheet?.properties;
    if (newSheet && newSheet.sheetId !== null && newSheet.sheetId !== undefined) {
      return newSheet.sheetId;
    } else {
      throw new Error(`Failed to create sheet: ${sheetTitle}`);
    }
  } else {
    const sheetId = sheet.properties?.sheetId;
    if (sheetId === null || sheetId === undefined) {
      throw new Error(`Sheet ID is null or undefined for sheet: ${sheetTitle}`);
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: sheetId,
                title: sheetTitle,
              },
              fields: 'title',
            },
          },
          {
            deleteRange: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1000,
                startColumnIndex: 0,
                endColumnIndex: 26,
              },
              shiftDimension: 'ROWS',
            },
          },
        ],
      },
    });

    return sheetId;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authClient = await auth.getClient();
    const { activities, rosters } = await getTuesdayActivitiesAndRosters();
    console.log('Fetched Activities:', activities);
    console.log('Fetched Rosters:', rosters);

    const formattedData = formatDataForGoogleSheets(activities, rosters);
    console.log('Formatted Data:', formattedData);

    await writeToGoogleSheet(authClient, formattedData);
    return NextResponse.json({ message: 'Data written to Google Sheet successfully.' });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error writing to Google Sheet:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
