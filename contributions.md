# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@Fanelock](https://github.com/Fanelock)**      | 23.3.26  | [Commit 5196fd1](https://github.com/sjfess/sopra-fs26-group-31-server/commit/5196fd1770a28072f90e5d8b483c455bea6db12e) | Implemented external api call to get data for card generation ([task #42](https://github.com/sjfess/sopra-fs26-group-31-server/issues/42)) | The contribution is relevant due to the fact that it fullfills the external api call & lets us create the cards needed for the game |
|                    | 26.3.26  | [Commit 947e1f7](https://github.com/sjfess/sopra-fs26-group-31-server/commit/947e1f797e9cdd83a0757b15f44951323592756f), [Commit 302e98a](https://github.com/sjfess/sopra-fs26-group-31-server/commit/302e98ab48345183c009917f92dbab31597474d1) | Implemented timeline structure ([task #25](https://github.com/sjfess/sopra-fs26-group-31-server/issues/25)), placement ruling ([task #26](https://github.com/sjfess/sopra-fs26-group-31-server/issues/26)) and the placement API-part from task [#27](https://github.com/sjfess/sopra-fs26-group-31-server/issues/27) | The contribution is relevant since the timeline structure, placement rules and placement API are required to implement the frontend-UI and timeline-updates |
| **[@sjfess](https://github.com/sjfess)** | 25.03.26   | [Commit e39090b](https://github.com/sjfess/sopra-fs26-group-31-client/pull/7/changes/e39090bbbc92f0dea86925e8b7a793a55ef82aca) | Added the mockup style to landing and login page aswell as globals.css and page.module.css
| This contribution is relevant due to the fact that we need to maintain a certain style throughout the whole web app. I implemented the styles according to the mockups. Styling the web app gives the users a better feeling and makes the web app more clear |
|                    | 25.03.26   | [Commit 7f7955a](https://github.com/sjfess/sopra-fs26-group-31-server/commit/7f7955ab62e28489e46c1215ea8337219ad28563) | Implemented lobby size check before starting game | Before a host can create the game session we need to check if the lobby size is accepted by our rules. With this implemented we hinder users to start invalid game sessions. |
|                    | 26.03.26   | [Commit 20d64d4](https://github.com/sjfess/sopra-fs26-group-31-client/pull/7/changes/20d64d4a4ea514adcad3265b76bb7edd9c9bf725) | Implemented the UI design of Create Game and Join Game | The contribution is relevant due to the fact that if a user wants to create or join a game they need to be able to see an UI where they can do this. |
| **[@marcokingo](https://github.com/marcokingo)** | 26.03.26 | [Commit 3650e1f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/3650e1f) | Implemented create/join/leave lobby APIs ([task #22](https://github.com/sjfess/sopra-fs26-group-31-server/issues/22)) | The contribution is relevant because players need to be able to create and join lobbies before a game can start. These APIs provide the core backend endpoints for lobby management and real-time updates. |
|                    | 28.03.26   | [Commit a4c80cb](https://github.com/sjfess/sopra-fs26-group-31-client/commit/a4c80cb) | Built results screen with player rankings, medal display, and rematch/main menu navigation ([task #2](https://github.com/sjfess/sopra-fs26-group-31-client/issues/2)) | The contribution is relevant because after a game ends players need to see the final rankings and have options to rematch or return to the main menu, completing the core game flow. |
| **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-27 | [1c25662](https://github.com/sjfess/sopra-fs26-group-31-server/commit/1c25662) | Implemented backend support for live player scores in Timeline Mode using „GamePlayer“, including join/leave lobby logic, turn handling, current drawn card validation, and score updates. Refers to #31. | This contribution is relevant because it adds the core backend logic for tracking per-game player scores and turns during gameplay and enables live score retrieval for multiplayer sessions. |
 | **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-24 | [b37cc3f](Updated User + created FriendRequest Entity) | Implemented and integrated the backend foundation for persistent users, including updates to the `User` entity, repository, service, controller flow, DTO mapping, and related tests. | This contribution is relevant because it establishes persistent user management as a core backend building block for authentication, profiles, and long-term player statistics. |
 |  | 2026-03-27 | [b3c8cfa](https://github.com/sjfess/sopra-fs26-group-31-server/commit/b3c8cfa83276a8cd7f5c1e50887eb85f11b7d081) | Adapted and integrated the GameSession backend model based on shared implementation work, using `Game` and `GamePlayer` with lobby code handling, player-to-session assignment, join/leave lobby logic, turn order, and session-specific player state. This task was completed in collaboration with @Fanelock with an approximate 50:50 split. | This contribution is relevant because it provides the backend structure for multiplayer game sessions and cleanly separates per-session player state from global user data. |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 2 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 3 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 4 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 5 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
