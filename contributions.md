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

## Contributions Week 1 - [23.03.2026] to [29.03.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@Fanelock](https://github.com/Fanelock)**      | 23.3.26  | [Commit 5196fd1](https://github.com/sjfess/sopra-fs26-group-31-server/commit/5196fd1770a28072f90e5d8b483c455bea6db12e) | Implemented external api call to get data for card generation ([task #42](https://github.com/sjfess/sopra-fs26-group-31-server/issues/42)) | The contribution is relevant due to the fact that it fullfills the external api call & lets us create the cards needed for the game |
|                    | 26.3.26  | [Commit 947e1f7](https://github.com/sjfess/sopra-fs26-group-31-server/commit/947e1f797e9cdd83a0757b15f44951323592756f), [Commit 302e98a](https://github.com/sjfess/sopra-fs26-group-31-server/commit/302e98ab48345183c009917f92dbab31597474d1) | Implemented timeline structure ([task #25](https://github.com/sjfess/sopra-fs26-group-31-server/issues/25)), placement ruling ([task #26](https://github.com/sjfess/sopra-fs26-group-31-server/issues/26)) and the placement API-part from task [#27](https://github.com/sjfess/sopra-fs26-group-31-server/issues/27) | The contribution is relevant since the timeline structure, placement rules and placement API are required to implement the frontend-UI and timeline-updates |
| **[@sjfess](https://github.com/sjfess)** | 25.03.26   | [Commit e39090b](https://github.com/sjfess/sopra-fs26-group-31-client/pull/7/changes/e39090bbbc92f0dea86925e8b7a793a55ef82aca) | Added the mockup style to landing and login page aswell as globals.css and page.module.css | This contribution is relevant due to the fact that we need to maintain a certain style throughout the whole web app. I implemented the styles according to the mockups. Styling the web app gives the users a better feeling and makes the web app more clear |
|                    | 25.03.26   | [Commit 7f7955a](https://github.com/sjfess/sopra-fs26-group-31-server/commit/7f7955ab62e28489e46c1215ea8337219ad28563) | Implemented lobby size check before starting game | Before a host can create the game session we need to check if the lobby size is accepted by our rules. With this implemented we hinder users to start invalid game sessions. |
|                    | 26.03.26   | [Commit 20d64d4](https://github.com/sjfess/sopra-fs26-group-31-client/pull/7/changes/20d64d4a4ea514adcad3265b76bb7edd9c9bf725) | Implemented the UI design of Create Game and Join Game | The contribution is relevant due to the fact that if a user wants to create or join a game they need to be able to see an UI where they can do this. |
| **[@marcokingo](https://github.com/marcokingo)** | 26.03.26 | [Commit 3650e1f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/3650e1f) | Implemented create/join/leave lobby APIs ([task #22](https://github.com/sjfess/sopra-fs26-group-31-server/issues/22)) | The contribution is relevant because players need to be able to create and join lobbies before a game can start. These APIs provide the core backend endpoints for lobby management and real-time updates. |
|                    | 28.03.26   | [Commit a4c80cb](https://github.com/sjfess/sopra-fs26-group-31-client/commit/a4c80cb) | Built results screen with player rankings, medal display, and rematch/main menu navigation ([task #2](https://github.com/sjfess/sopra-fs26-group-31-client/issues/2)) | The contribution is relevant because after a game ends players need to see the final rankings and have options to rematch or return to the main menu, completing the core game flow. |
| **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-27 | [1c25662](https://github.com/sjfess/sopra-fs26-group-31-server/commit/1c25662) | Implemented backend support for live player scores in Timeline Mode using „GamePlayer“, including join/leave lobby logic, turn handling, current drawn card validation, and score updates. Refers to #31. | This contribution is relevant because it adds the core backend logic for tracking per-game player scores and turns during gameplay and enables live score retrieval for multiplayer sessions.
| **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-24 | [b37cc3f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/b37cc3ffe497446ac98b248a18f261f1fac2caee)) | Implemented and integrated the backend foundation for persistent users, including updates to the `User` entity, repository, service, controller flow, DTO mapping, and related tests. | This contribution is relevant because it establishes persistent user management as a core backend building block for authentication, profiles, and long-term player statistics. |
 | **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-27 | [b3c8cfa](https://github.com/sjfess/sopra-fs26-group-31-server/commit/b3c8cfa83276a8cd7f5c1e50887eb85f11b7d081) | Adapted and integrated the GameSession backend model based on shared implementation work, using `Game` and `GamePlayer` with lobby code handling, player-to-session assignment, join/leave lobby logic, turn order, and session-specific player state. This task was completed in collaboration with @Fanelock with an approximate 50:50 split. | This contribution is relevant because it provides the backend structure for multiplayer game sessions and cleanly separates per-session player state from global user data. |
| **[@milchazor](https://github.com/milchazor)**| 29.3.26| [Commits 21b07a2, 4b1aac8,b10e1c7,637961d](https://github.com/sjfess/sopra-fs26-group-31-client/pull/11) | Login / Register / User page working  | Base Features needed for Project to function |
| **[@milchazor](https://github.com/milchazor)**| 29.3.26| [Commit 7c8255f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/7c8255fbcd13c6a28d75416605e6aa76d9bb2bb2) | Handling of login/register from back end side | Base function needed for project |

---

## Contributions Week 2 - [30.03.2026] to [05.04.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@AlexWimmer1](https://github.com/AlexWimmer1)** | 2026-03-30  | [7354064](https://github.com/sjfess/sopra-fs26-group-31-server/commit/735406425e49a4cf4142f0d7199fdb842999bb30)| Implemented final result aggregation for completed games, including total points, wins, and correct/incorrect placement statistics, and added backend/controller tests for finalization. Task #39 | This completes the backend logic for end-of-game result persistence and makes lifetime player statistics update automatically after each finished game. |
|                    | 2026-04-04   | [8046a80](https://github.com/sjfess/sopra-fs26-group-31-server/commit/8046a808bccc86947df8d830b76ed680fbc63b20) | Implemented time- and streak-based scoring for Timeline Mode by extending GamePlayer with streak tracking, updating GameService to award points based on remaining time and consecutive correct placements, resetting streaks on wrong moves and turn timeout, and adding/adapting backend tests. Task #29| This completes the core backend logic for dynamic scoring in Timeline Mode and fulfills the user story requirement that points decrease over time and bonus points are awarded for consecutive correct answers.|
| **[@Fanelock](https://github.com/Fanelock)** | 01.04.2026   | [6018338](https://github.com/sjfess/sopra-fs26-group-31-server/commit/60183386eb64057869f2cad12b4b6ed0cacffaea), [d90e360](https://github.com/sjfess/sopra-fs26-group-31-server/commit/d90e36098c3ef21a4bc77bd96a2a8f876faa3b94) | Implemented Turn Timeout detection, backend for broadcasting turn timeout to clientside as well as tests for said functions | The contribution is relevant to ensure smooth game flow so that when a players turn is over, the next players turn is started even if the first player didnt play a card |
|                    | 05.04.2026   | [f72cf42](https://github.com/sjfess/sopra-fs26-group-31-server/commit/f72cf424367732fccf3bf3f7cd77c431377ad008), [c0f8c5f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/c0f8c5f21835ce52714f38bc7233471b2aa364dc) | Implemented Persistent data storage so that user data gets saved even when server gets shut down or a new deployment is made. Game instances are deleted after conclusion to avoid database bloating | Contribution is relevant as to make sure that user data gets saved so that users keep their account as well as their score for the overall global leaderboard |
| **[@marcokingo](https://github.com/marcokingo)** | 05.04.26 | [Commit 5212349](https://github.com/sjfess/sopra-fs26-group-31-server/commit/521234993abc2c35d6cc3a42c054dc609b2c9f23) | Added placement API test for timeline card placement ([task #27](https://github.com/sjfess/sopra-fs26-group-31-server/issues/27)) | Ensures the placement API endpoint behaves correctly, covering validation logic that is critical for the core gameplay mechanic of placing cards on the timeline. |
|                    | 03.04.26 | [Commit 9a467ba](https://github.com/sjfess/sopra-fs26-group-31-client/commit/9a467ba550e5b292367836ebf8bae9dc80055f94), [Commit f34a9a7](https://github.com/sjfess/sopra-fs26-group-31-client/commit/f34a9a743678bd947e116ee43473806a68a7356e) | Built timeline UI with placement interaction and game logic ([task #3](https://github.com/sjfess/sopra-fs26-group-31-client/issues/3)) | The timeline UI is the central interface players use during the game. This contribution implements both the visual component and the frontend logic for card placement, completing the client-side gameplay experience. |
| ****[@sjfess](https://github.com/sjfess)**** | 03.04.26   | [Commit 13b3144](https://github.com/sjfess/sopra-fs26-group-31-client/commit/13b31443e6a6fd7a2f3af0d572c5b3c2effa367d) | Implemented the Game Lobby UI and Game Lobby logic| A user needs to be able to create a game and join a game and further the host of the game lobby needs to be able to adjust the settings of the game lobby itself. |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 3 - [06.04.2026] to [12.04.2026]


| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@AlexWimmer1](https://github.com/AlexWimmer1)**  | 2026-04-08   | [cc55da4](https://github.com/sjfess/sopra-fs26-group-31-server/commit/cc55da417de87cfa24ae2c2bb3868b59fbd2116f) [bbebaab](https://github.com/sjfess/sopra-fs26-group-31-server/commit/bbebaab563f1c903566bab78917fa2e33aede945)| Implemented timeline end-of-game logic based on players finishing their hand, added cards-in-hand tracking to GamePlayer, updated GameService to finalize games when the required number of players have placed all cards or the deck is exhausted, and adapted related service tests. Closes #37| This establishes a practical and finite win condition for Timeline mode, ensures games end reliably before the full deck is exhausted, and aligns backend logic with the intended M3 gameplay flow. |
|                    | 2026-04-11  | [3ebf4b1](https://github.com/sjfess/sopra-fs26-group-31-server/commit/3ebf4b1be590dcb4cc288664a61c69818b57e055) | Implemented rematch functionality by creating a new game from a finished game, preserving the same players, host, era, difficulty, and game mode. Added backend support across service, controller, entity, repository, and DTO layers, and extended tests to verify rematch creation and behavior. Closes #64 | This enables players to immediately start a new round after a finished match without rebuilding the lobby manually, improves replayability, and keeps rematch handling clean and robust by creating a fresh game instance instead of resetting old game state. |
| **[@sjfess](https://github.com/sjfess)** | 2026-04-8   | [Commit d07e739](https://github.com/sjfess/sopra-fs26-group-31-client/commit/d07e739cb7826cf6f3b938be8ec835f5ea5b1a34) | Implemented the friends system UI and also adjusted the GameLobby page and Profile page | As a user i want to be able to add friends and create a gamelobby and invite my friends. Also users are able to see which friends are online or offline and who they can invite.|
|                    | 2026-04-09   | [Commit 928f11f](https://github.com/sjfess/sopra-fs26-group-31-server/commit/928f11fbac8d14f7ec2a6f8ce8e59112dfc365ed) | Implemented the friendsystem logic | To have a working friendssystem the backend needs to carry the logical components to work with the frontend |
| **[@marcokingo](https://github.com/marcokingo)** | 2026-04-11 | [Commit 3853b5d](https://github.com/sjfess/sopra-fs26-group-31-client/commit/3853b5d75927be81fcacfe2d245db68e9a3ca728) | Skip player turn when timer elapses ([issue #8](https://github.com/sjfess/sopra-fs26-group-31-client/issues/8)) | This contribution is relevant because when a player's timer runs out their turn needs to be automatically skipped to keep the game flow going in multiplayer Timeline Mode. |
|                    | 2026-04-11 | [Commit 3853b5d](https://github.com/sjfess/sopra-fs26-group-31-client/commit/3853b5d75927be81fcacfe2d245db68e9a3ca728) | Broadcast timeout and turn change to clients ([issue #6](https://github.com/sjfess/sopra-fs26-group-31-client/issues/6)) | This contribution is relevant because all connected clients need to be notified when a turn times out and changes so the UI stays in sync across all players. |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---
## Contributions Week 4 - [13.04.2026] to [19.04.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@AlexWimmer1](https://github.com/AlexWimmer1)**  | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 5 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
