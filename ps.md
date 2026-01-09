# SophiAI Project Mandate

## 🚨 URGENT: DATA INTEGRITY & SOURCE PROTOCOL
**MANDATORY CHECK**: You MUST always read and verify this file and `matrix_models.md` before changing the code source in any way. 

### THE MATRIX RESTRAINT
The list of reasoning matrices (philosophical personas) is the core DNA of SophiAI. This list MUST remain consistent.
- **NEVER** remove or reset the `Persona` enum in `types.ts`.
- **NEVER** remove or reset the `PERSONA_CONFIGS` in `constants.tsx`.
- **SYNCHRONIZATION**: Any addition to the app's matrices must be mirrored in `matrix_models.md`.
- **STABILIZATION**: The full library of 100+ models from `matrix_models.md` has been synced into the active codebase.

### THE LAYOUT RESTRAINT
- **NEVER** change the layout structure, grid definitions, sidebar width, or core component positioning unless specifically requested.
- **CONSISTENCY**: Ensure all new features fit within the established cyber-philosophy aesthetic without disrupting the existing navigation flow.

## 🛠️ OPTIMIZATION LOG (FAILURE TRACKING)
- **FAILED [2024-05-24] - Attempt 1 (State Decoupling)**: Attempted to split UI state from Archive state. **Result**: Total freeze persists on mobile. The cause was identified as synchronous processing of the massive ~4MB DNA strings within the React render cycle and `useState` initializers.
- **FAILED [2024-05-24] - Attempt 2 (Memoization)**: Memoizing the Sidebar did not prevent the main thread block during `JSON.stringify` cycles of the monolithic state.
- **NEW STRATEGY [ACTIVE]**: **Delta-Patch Architecture**. The React state no longer contains static DNA. It only stores user "patches." Heavy data is kept in static constants and merged only at the service level (API call). Initialization is moved to an asynchronous `useEffect` to prevent UI lock.

## PERSISTENT FORGE REPOSITORIES
1. **Persona Forge (`/persona_forge/`)**: Contains hardcoded philosophical DNA (e.g., TJump axioms).
2. **Identity Forge (`/user_identity_forge/`)**: Stores the permanent `USER_PROMPT` behavioral directives.
3. **Log Forge (`/user_log_forge/`)**: Houses permanent historical context and `USER_LOG` summaries.
4. **Model Registry (`matrix_models.md`)**: The central index of all reasoning matrices.

## RE-INSTALLATION PROCEDURE
Whenever `utils/storage.ts` is modified, ensure the following imports are maintained:
- `import { TJUMP_DATA } from '../persona_forge/tjump';`
- `import { TJUMP_MIND_DATA } from '../persona_forge/TJump_mind';`
- `import { USER_IDENTITY_DATA } from '../user_identity_forge/identity';`
- `import { USER_LOG_DATA } from '../user_log_forge/logs';`
