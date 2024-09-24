# Business Logic

The purpose of this README is to record and track business logic. What does it do? Who uses it? Why is it important?

> [!NOTE]
> Copy and paste the accordion below to use as a template for documenting new business logic.

<details>
<summary>Business logic template</summary>

### Overview

### Detailed Explanation

### Examples

## Implementation

This is implemented on all event pages. The file that handles the time zone localization is date.ts

## Contact/Owner

Contact the Design Team for decisions on how timezones should appear.

</details>

---

<details>
<summary>Node-Event Timezones</summary>

### Overview

08/2024 [Slack Thread](https://dsva.slack.com/archives/C01SR56755H/p1723476807939299)
For event articles, it was decided to keep time localization on Next rather than mimic production in which the articles were set in the timezone that the article was created in.

### Detailed Explanation

- What it does
  - Time localization refers to the process of adapting the time displayed in an application to the correct time zone of the user.
- Why it's necessary
  - This is important in applications that are used across different time zones to ensure that all users see times and dates that are relevant to their location.
- How it interacts with other components or steps
  - This is referenced in all events.

### Examples

- Given a user wants to know about when an event is being held.
- When the user opens an event article about the event on www.va.gov/`<facility name>`/events
- Then on the event article, the `when` section should show the user the date and time, updated to the user's time localization, of when the event is being held.
<img width="707" alt="Screenshot 2024-09-23 at 2 30 35 PM" src="https://github.com/user-attachments/assets/8d8c8ad7-e7b4-4b3f-a02a-70aa1d965490">

## Implementation

The timezone calculations can be found in the [date.ts](src/lib/utils/date.ts) file line 219 `deriveFormattedTimestamp`.

## Contact/Owner

Design Team and Sitewide

</details>

<details>
<summary>Node-Event Registered Events</summary>

### Overview

Next has a condition that detects whether an event has passed. If the event has passed then the register link becomes red text saying "This event already happened."

### Detailed Explanation

- What it does
  - It prevents users from getting access to the register link for a past event.
- Why it's necessary
  - This prevents users from being redirected to a site with an expired registration event. It enhances the user experience by ensuring users only interact with current and relevant events.
- How it interacts with other components or steps
  - This is referenced in all events.

### Examples

- Given a user wants to register for an event.
- When the user opens the event article and the event has passed,
- Then the text "This event already happened" should be placed where the registration link would have been.
<img width="840" alt="Screenshot 2024-09-24 at 11 43 42 AM" src="https://github.com/user-attachments/assets/44c148b8-1856-455e-808c-fd7037f21942">

## Implementation

The business logic can be found in the [event index.ts](src/templates/layouts/event/index.tsx) file line 224.

## Contact/Owner

As of now this is an AP implementation.

</details>
