# Troubleshooting Guide - Nozzles Display

If you're experiencing issues with nozzles not displaying properly, here are some steps to resolve the problem:

## Common Issues

### 1. Blank Nozzles Page

If you navigate to the nozzles page and see a blank page or no nozzles listed:

1. **Check the URL**: Make sure the URL includes both `pumpId` and `stationId` parameters
   - Correct format: `/dashboard/nozzles?pumpId=123&stationId=456`

2. **Refresh the page**: Sometimes a simple refresh can resolve display issues

3. **Try the direct approach**:
   - Go to Stations page
   - Select a station
   - Go to Pumps page
   - Click "View Nozzles" on a pump card

### 2. "No Nozzles Found" Message

If you see a message saying "No nozzles found":

1. **Create a nozzle**: Click the "Add Nozzle" or "Add First Nozzle" button
2. **Check pump status**: Make sure the pump is set to "active" status
3. **Verify pump exists**: Make sure the pump ID in the URL is valid

### 3. After Creating a Nozzle

If you create a nozzle and encounter issues:

1. **Go back to pumps**: Navigate back to the pumps page
2. **View nozzles again**: Click "View Nozzles" on the pump card
3. **Check for errors**: Look for any error messages in the console or UI

## Setup Flow Reminder

Remember to follow the proper setup flow:

1. Create Stations
2. Create Pumps for each Station
3. Create Nozzles for each Pump
4. Set Fuel Prices

## Technical Notes

The nozzles API response format can vary. If you're a developer troubleshooting this issue:

1. Check the browser console for API response data
2. Verify that the response format matches what the frontend expects
3. Look for the debug panel at the bottom of the page (in development mode)
4. Try the direct API call button to see the raw response

If issues persist, please contact support with screenshots of the debug panel.