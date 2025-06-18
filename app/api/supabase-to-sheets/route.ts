import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "base64").toString("utf8")
);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Set up Supabase client
const supabaseUrl = 'https://cagzieozbyrkqprhhiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZ3ppZW96Ynlya3FwcmhoaXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzAxMTAzNiwiZXhwIjoyMDMyNTg3MDM2fQ.3URRRd-5B8MrtCdau8ZsTMU9KEnoleQd3M7sSSHNtr4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Replace with your actual sheet ID
const spreadsheetId = '1i81qH6W7d6ewG9Tklu7D8UBqxT9oMIwRn0B4uSNXNPk';

type Roster = {
  guest_id: string;
  day: string;
  hour: string;
  activity_name: string;
  first_name: string;
  last_name: string;
  location: string;
  attire: string;
  family_code: string;
};

async function getTuesdayRosters(): Promise<Roster[]> {
    const { data, error } = await supabase
      .from('rosters')
      .select('*')
      .eq('day', 'Thursday')
      .order('family_code', { ascending: true }) // Order by family_code
  
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }
    console.log('Data fetched from Supabase:', data);
    return data;
  }

function formatDataForGoogleSheets(data: Roster[]): any[][] {
  const formattedData: any[][] = [];
  
  // Group data by guest_id
  const guests = data.reduce((acc, roster) => {
    if (!acc[roster.guest_id]) {
      acc[roster.guest_id] = [];
    }
    acc[roster.guest_id].push(roster);
    return acc;
  }, {} as { [guest_id: string]: Roster[] });
  
  // Format data for each guest
  Object.keys(guests).forEach(guest_id => {
    const guestData = guests[guest_id];
    const { first_name, last_name } = guestData[0];

    // Add guest name header
    formattedData.push([`${first_name} ${last_name}`]);
    // Add column names
    formattedData.push(['Activity Time', 'Activity Name', 'Location', 'Attire']);
    
    // Add activities
    const sortedActivities = guestData.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    sortedActivities.forEach(activity => {
      formattedData.push([
        `Thursday ${activity.hour} period`,
        activity.activity_name,
        activity.location,
        activity.attire
      ]);
    });
    
    // Add an empty row after each guest's schedule for spacing
    formattedData.push([]);
  });
  
  console.log('Formatted Data:', formattedData); // Log the final formatted data
  return formattedData;
}

async function writeToGoogleSheet(authClient: any, data: Roster[]): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const values = formatDataForGoogleSheets(data);
  const resource = {
    values,
  };

  const sheetTitle = 'Thursday2 Activities';
  await ensureSheetExists(authClient, sheetTitle);

  const range = `${sheetTitle}!A1`; // Start writing from the first cell

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: resource,
  });
}

async function ensureSheetExists(authClient: any, sheetTitle: string): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = response.data.sheets?.find(sheet => sheet.properties?.title === sheetTitle);

  if (!sheet) {
    await sheets.spreadsheets.batchUpdate({
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
  }
}

export async function POST(req: NextRequest) {
  try {
    const authClient = await auth.getClient();
    const rosters = await getTuesdayRosters();
    console.log(rosters); // Log the fetched data
    await writeToGoogleSheet(authClient, rosters);
    return NextResponse.json({ message: 'Data written to Google Sheet successfully.' });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error writing to Google Sheet:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
