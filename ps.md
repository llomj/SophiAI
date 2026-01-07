# SophiAI Project Mandate

## URGENT: DATA INTEGRITY WARNING
**EVERY TIME THE CODE SOURCE IS UPDATED, YOU MUST VERIFY THE CONTENTS OF THE FORGE DIRECTORIES.** 
If any code changes reset the application state, the data **MUST** be re-synchronized from these source-of-truth files.

## PERSISTENT FORGE REPOSITORIES
1. **Persona Forge (`/persona_forge/`)**: Contains hardcoded philosophical DNA (e.g., TJump axioms).
2. **Identity Forge (`/user_identity_forge/`)**: Stores the permanent `USER_PROMPT` behavioral directives.
3. **Log Forge (`/user_log_forge/`)**: Houses permanent historical context and `USER_LOG` summaries.

## RE-INSTALLATION PROCEDURE
Whenever `utils/storage.ts` is modified, ensure the following imports are maintained:
- `import { TJUMP_DATA } from '../persona_forge/tjump';`
- `import { USER_IDENTITY_DATA } from '../user_identity_forge/identity';`
- `import { USER_LOG_DATA } from '../user_log_forge/logs';`

These variables **must** be used in `loadSophiData` to prevent a total "knowledge wipe" if `localStorage` is cleared or the environment resets.

## DIRECTORY STRUCTURE
- `persona_forge/`: AI personality knowledge.
- `user_identity_forge/`: Static user persona definitions.
- `user_log_forge/`: Persistent memory/historical logs.
- `services/`: API communication layers.
- `utils/`: State management and storage logic.
- `components/`: UI modules.
