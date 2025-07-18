# User Journey

This document outlines the user journeys for the different roles in the Fuel Station Management application.

## Table of Contents

- [Superadmin User Journey](#superadmin-user-journey)
- [Owner/Manager User Journey](#ownermanager-user-journey)
- [Attendant User Journey](#attendant-user-journey)

## Superadmin User Journey

1.  **Login:** The superadmin navigates to `/login` and enters their credentials.
2.  **Redirection to Superadmin Dashboard:** Upon successful login, they are redirected to the superadmin overview page at `/superadmin/overview`.
3.  **Platform Overview:** The superadmin can view a high-level overview of the platform, including:
    *   Total number of tenants
    *   Total number of admin users
    *   Total number of subscription plans
    *   Recent tenant registrations
    *   Distribution of tenants by plan
4.  **Tenant Management:** The superadmin can navigate to the "Tenant Management" page (`/superadmin/tenants`) to:
    *   View a list of all tenants.
    *   Create new tenants by providing tenant details and owner information.
    *   View the details of a specific tenant (`/superadmin/tenants/:tenantId`).
    *   Update the status of a tenant (active, suspended, cancelled).
    *   Delete a tenant.
5.  **User Management:** The superadmin can navigate to the "Users" page (`/superadmin/users`) to:
    *   View a list of all superadmin users.
    *   Create new superadmin users.
    *   Update the information of existing superadmin users.
    *   Reset the passwords of superadmin users.
    *   Delete superadmin users.
6.  **Plan Management:** The superadmin can navigate to the "Plan Management" page (`/superadmin/plans`) to:
    *   View a list of all subscription plans.
    *   Create new subscription plans.
    *   Update the details of existing subscription plans.
    *   Delete subscription plans.
7.  **Analytics:** The superadmin can navigate to the "Analytics" page (`/superadmin/analytics`) to view platform-wide analytics.
8.  **Settings:** The superadmin can navigate to the "Settings" page (`/superadmin/settings`) to manage system-wide settings.

---

## Owner/Manager User Journey

1.  **Login:** The owner or manager navigates to `/login` and enters their credentials.
2.  **Redirection to Dashboard:** Upon successful login, they are redirected to the main dashboard at `/dashboard`.
3.  **Business Overview:** The owner/manager can view an overview of their business, including:
    *   Total revenue
    *   Total volume of fuel sold
    *   Number of active stations
    *   Charts for payment methods, fuel breakdown, and sales trends.
4.  **Station Management:** The owner/manager can navigate to the "Stations" page (`/dashboard/stations`) to:
    *   View a list of their fuel stations.
    *   Create new stations.
    *   View the details of a specific station (`/dashboard/stations/:stationId`).
    *   Update the information of existing stations.
    *   Delete stations.
5.  **Pump and Nozzle Management:** From a station's detail page, they can manage the pumps and nozzles:
    *   View a list of pumps at the station (`/dashboard/stations/:stationId/pumps`).
    *   Create, update, and delete pumps.
    *   View a list of nozzles on a pump (`/dashboard/pumps/:pumpId/nozzles`).
    *   Create, update, and delete nozzles.
6.  **Readings:** The owner/manager can navigate to the "Readings" page (`/dashboard/readings`) to:
    *   View a history of all fuel readings.
    *   Record new readings.
7.  **Fuel Prices:** They can navigate to the "Fuel Prices" page (`/dashboard/fuel-prices`) to set and update fuel prices for their stations.
8.  **User Management:** The owner/manager can navigate to the "Users" page (`/dashboard/users`) to:
    *   View a list of users within their tenant.
    *   Create new users (owners, managers, or attendants).
    *   Update the information of existing users.
    *   Reset the passwords of users.
    *   Delete users.
9.  **Reports:** They can navigate to the "Reports" page (`/dashboard/reports`) to generate and download reports.
10. **Analytics:** They can navigate to the "Analytics" page (`/dashboard/analytics`) to view performance metrics for their stations.
11. **Settings:** They can navigate to the "Settings" page (`/dashboard/settings`) to manage their account settings.

---

## Attendant User Journey

1.  **Login:** The attendant navigates to `/login` and enters their credentials.
2.  **Redirection to Attendant Dashboard:** Upon successful login, they are redirected to the attendant dashboard at `/attendant/dashboard`.
3.  **Dashboard Overview:** The attendant sees a simplified dashboard with relevant information and quick actions.
4.  **Record Readings:** The attendant can navigate to the "Readings" page (`/attendant/readings`) to record fuel readings from the nozzles at their assigned station.
5.  **Cash Reports:** They can navigate to the "Cash Reports" page (`/attendant/cash-reports`) to create and submit cash reports for their shifts.
6.  **Alerts:** They can navigate to the "Alerts" page (`/attendant/alerts`) to view system alerts.
7.  **Inventory:** They can navigate to the "Inventory" page (`/attendant/inventory`) to view the fuel inventory levels at their station.
